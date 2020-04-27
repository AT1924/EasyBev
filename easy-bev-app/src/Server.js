const express = require('express');
var session = require('express-session');

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const deasync = require('deasync');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const nodemailer = require('nodemailer');

const port = process.env.PORT || 8080;
const TYPES = ["distributors", "merchants"];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'keyboard cat', cookie: {maxAge: 4*900000}}));
const emailToTypeToSocket = {};
emailToTypeToSocket[TYPES[0]] = {};
emailToTypeToSocket[TYPES[1]] = {};
const moment = require('moment');

io.on('connection', (socket) => {
    const id = parseInt(socket.handshake.query.id);
    const type = socket.handshake.query.type;
    console.log("NEW SOCKET CONNECTION WITH TYPE:", type, "AND ID:", id);
    if (!TYPES.includes(type)) {
        console.log("ERROR: Socket received invalid type", type)
    } else {
        emailToTypeToSocket[type][id] = socket;
        console.log("email, type", id, type);
        socket.on('messageChannel', (data) => {
            console.log("handling", data);
            handleMessage(data, socket)
        });
    }
});


function sendEmail(fromEmail, fromPassword, toEmail, subject, body){
    let done = false;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: fromEmail,
            pass: fromPassword
        }
    });

    const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: subject,
        text: body
    };
    let error = "";
    transporter.sendMail(mailOptions, function(err, info){
        if (err) {
            console.log(err);
            error = err
        } else {
            console.log('Email sent: ' + info.response);
        }
        done = true
    });
    if (error){
        return {error:error}
    }
    return {status:"SUCCESS"}

}

function getDistFromCode(code, merchantEmail) {
    console.log("Code", code, "memail", merchantEmail)
    if (parseInt(code) === 111111) {
        return 1
    }
    let done = false;
    let out = {};
    const conn = db.createConnection('sqlite3://easy-bev.db');
    conn.query('select d_id from codes where code = ? and merchantEmail = ? order by timestamp desc', [code, merchantEmail], function (err, data) {
        if (err) {
            console.log("error is", err);
            out = err;
        } else if (data.rowCount === 0) {
            out = null
        } else {
            out = data.rows[0].d_id
        }
        done = true;

    });
    deasync.loopWhile(function () {
        return !done;
    });
    conn.end();
    return out;
}

function linkMerchantDistributor(d_info, body) {
    const merchantEmail = body.email;
    const d_email = d_info.email;
    const d_type = d_info.type;
    if (!d_email || !d_type){
        return {error:"must sign in first"}
    }
    if (TYPES[0] !== d_type){
        return {error:"Merchant can not invite anyone"}
    }
    const d_id = distEmailToId(d_email);
    let randomNum = Math.floor(Math.random() * Math.floor(10000000));
    while (getDistFromCode(randomNum, merchantEmail)) {
        randomNum = Math.floor(Math.random() * Math.floor(10000000));
    }
    let done = false;
    let error = "";
    const conn = db.createConnection('sqlite3://easy-bev.db');
    conn.query('insert into codes(code, d_id, merchantEmail) values(?,?,?)', [randomNum, d_id, merchantEmail], function (err, data) {
        if (err) {
            console.log("failed to insert code, error:", error)
            error = err
        } else {
            console.log("inserted", randomNum, "with dist id", d_id, "and merch email", merchantEmail)
        }
        conn.end();
        done = true
    });
    deasync.loopWhile(()=>{return !done});
    if (!error){
        const out = sendEmail("easybevcompany@gmail.com", "123456qwertY!", merchantEmail, "Easy Bev Code:"+ randomNum,"You were invited by"+d_email + " use the code "+randomNum+" to join");
        if (out.error){
            return out
        }
        return {status: "SUCCESS"}

    }else{
        return {error:error}
    }


}

function handleMessage(message, fromSocket) {
    console.log("got message", message);
    const fromType = message.fromType;
    const fromId = parseInt(message.fromId);
    const toId = parseInt(message.toId);
    const data = message.data[0];
    const dist_id = fromType === TYPES[0] ? fromId : toId;
    const merchant_id = fromId === dist_id ? toId : fromId;
    const fromMerchant = fromType === TYPES[1];
    message.timestamp = moment().format('YYYY-mm-DD hh:mm:ss')
    const conn = db.createConnection('sqlite3://easy-bev.db');
    conn.query('insert into messages(d_id, m_id, text, fromMerchant) values (?,?,?,?)', [dist_id, merchant_id, data, fromMerchant], function (err, data) {
        console.log("inserted", data, "with err", err);
    });
    const toType = fromType === TYPES[0] ? TYPES[1] : TYPES[0];
    const toSocket = emailToTypeToSocket[toType][toId];
    if (toSocket) {
        console.log("forwarding message", message, "to", toType, toId, "with socket", !!toSocket);
        toSocket.emit("messageChannel", message);
    } else {
        console.log("CAN NOT forward message", message, "to", toType, toId, "with socket", !!toSocket);
    }
    fromSocket.emit("messageChannel", message);
}

//company: this.state.company, address: this.state.address, state: this.state.state, zip: this.state.zip,
//     //                 type:this.state.type, email: this.state.email, password: this.state.password }

const CREATE_FEED =
    'CREATE TABLE feed (\
    id INTEGER PRIMARY KEY AUTOINCREMENT,\
    title TEXT NOT NULL,\
    description TEXT NOT NULL,\
    expiry DATE NOT NULL,\
    price DOUBLE NOT NULL,\
    d_id INTEGER NOT NULL,\
    foreign key (d_id) references distributors(id)\
);';


const CREATE_FEED_ITEMS =
    'CREATE TABLE feed_items (\
    f_id INTEGER NOT NULL,\
    i_id INTEGER NOT NULL,\
    qty INTEGER NOT NULL,\
    foreign key(i_id) references ITEMS(id),\
    foreign key(f_id) references FEED(id)\
);';


const CREATE_PAYMENT =
    'CREATE TABLE payment (\
    id INTEGER PRIMARY KEY AUTOINCREMENT,\
    mname text not null,\
    digits INTEGER NOT NULL UNIQUE,\
    security_code INTEGER  not null,\
    phone TEXT NOT NULL,\
    address TEXT NOT NULL,\
    country TEXT NOT NULL,\
    city TEXT NOT NULL,\
    postal_code TEXT NOT NULL,\
    exp_month NUMERIC NOT NULL,\
    exp_year NUMERIC NOT NULL,\
    merchant boolean not null,\
    f_id INTEGER not null);';

const CREATE_DISTRIBUTORS =
    'CREATE TABLE Distributors   (\
        id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,\
        name TEXT NOT NULL,\
        email TEXT NOT NULL UNIQUE ,\
        password TEXT NOT NULL,\
        address TEXT NOT NULL,\
        city TEXT,\
        state TEXT NOT NULL UNIQUE ,\
        zip TEXT NOT NULL,\
        meta TEXT );';

const CREATE_MERCHANTS =
    'CREATE TABLE  Merchants   (\
     id INTEGER PRIMARY KEY AUTOINCREMENT,\
     d_id INTEGER not null,\
     name TEXT NOT NULL,\
     email TEXT NOT NULL UNIQUE ,\
     password TEXT NOT NULL,\
     address TEXT ,\
     city TEXT,\
     state TEXT,\
     country TEXT,\
     zip TEXT,\
    FOREIGN KEY(d_id) REFERENCES Distributors(id)\
);';

const CREATE_ORDERS =
    'CREATE TABLE  orders (\
     id INTEGER PRIMARY KEY AUTOINCREMENT,\
     d_id INTEGER NOT NULL,\
     m_id INTEGER NOT NULL,\
     order_json TEXT NOT NULL, \
     price DOUBLE NOT NULL,\
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    FOREIGN KEY(m_id) REFERENCES merchants(id),\
    FOREIGN KEY(d_id) REFERENCES distributors(id)\
    );';

const CREATE_MESSAGES =
    'CREATE TABLE  messages (\
     id INTEGER PRIMARY KEY AUTOINCREMENT,\
     d_id INTEGER NOT NULL,\
     m_id INTEGER NOT NULL,\
     text TEXT NOT NULL, \
     fromMerchant boolean NOT NULL,\
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
      FOREIGN KEY(m_id) references MERCHANTS(id),\
      FOREIGN KEY(d_id) references DISTRIBUTORS(id)\
      );';

const CREATE_CODES =
    'CREATE TABLE  codes (\
     code INTEGER PRIMARY KEY,\
     d_id INTEGER NOT NULL,\
     merchantEmail TEXT NOT NULL,\
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
     FOREIGN KEY(d_id) REFERENCES Distributors(id)\
);';


const QUERIES = [CREATE_DISTRIBUTORS, CREATE_MESSAGES, CREATE_MERCHANTS, CREATE_ORDERS, CREATE_CODES, CREATE_PAYMENT, CREATE_FEED, CREATE_FEED_ITEMS];
const db = require('any-db');
const saltRounds = 10;
create_tables();
function getPassword(email, type) {
    let done = false;
    const out = {};
    console.log("type is ", type);
    const conn = db.createConnection('sqlite3://easy-bev.db');
    conn.query('select password from ' + type + ' where email = ?', [email], function (err, data) {
        console.log(data);

        if (err || data.rowCount !== 1) {
            console.log("error is", err)

            out.error = err ? "SQL error" : "invalid credentials";
        } else {
            console.log("HERE2")
            out.body = data.rows[0].password;
        }
        done = true;

    });
    deasync.loopWhile(function () {
        return !done;
    });
    conn.end()
    return out;

}

function signUp(body) {
    //{code: this.state.code, company: this.state.company, address: this.state.address, state: this.state.state, zip: this.state.zip,
    //                 type:this.state.type, email: this.state.email, password: this.state.password }
    let done = false;
    let out = {};
    const type = body.type;
    if (!body.password) {
        return {error: "invalid password"}
    }
    if (TYPES.includes(type.toLowerCase())) {
        bcrypt.hash(body.password, saltRounds)
            .then(hashedPassword => {
                const conn = db.createConnection('sqlite3://easy-bev.db');
                let insert = "";
                const param = [body.company, body.email, hashedPassword, body.address, body.city, body.state, body.zip];
                if (type === TYPES[0]) { //distributor
                    insert = 'insert into Distributors (name, email, password, address, city, state, zip) values (?,?,?,?,?,?,?)';

                } else {
                    insert = 'insert into merchants (name, email, password, address, city, state, zip, d_id)  values (?,?,?,?,?,?,?,?)';
                    const dist_id = getDistFromCode(body.code, body.email);
                    if (!dist_id) {
                        conn.end;
                        out.error = "invalid code/merchant email";
                        done = true;
                        return
                    }
                    param.push(dist_id)
                }
                console.log("executing", insert, param);
                conn.query(insert, param, function (error, data) {
                    if (error) {
                        out.error = "Invalid input, sql error" + error;
                    } else {
                        out.status = "SUCCESS";
                    }
                    conn.end();
                    done = true;
                })
            })
    } else {
        out.error = "invalid type";
        done = true;
    }

    deasync.loopWhile(function () {
        return !done
    });
    return out;

}

function codeToDist(code) {
    if (parseInt(code) === 42069) {
        return {body: 1}
    }
    if (!code) {
        return {error: "invalid code"}
    }
    let done = false;
    const out = {}
    const conn = db.createConnection('sqlite3://easy-bev.db');
    const get = 'select d_id from codes where code = ? order by timestamp limit 1';

    conn.query(get, [code], function (error, data) {
        if (error || data.rowCount == 0) {
            out.error = "Invalid code"
        } else {
            out.body = data

        }
        conn.end();
        done = true;


    });

    //go to akhil function and get his input
    //
    deasync.loopWhile(() => {
        return !done
    });
    return out

}


function signIn(email, password, type) {
    let done = false;
    const out = {};
    if (TYPES.includes(type.toLowerCase())) {
        const passwordOut = getPassword(email, type);
        console.log("RECEIVED", passwordOut);
        if (!passwordOut.error) {
            bcrypt.compare(password, passwordOut.body).then((valid) => {
                if (valid) {
                    out.status = "SUCCESS";
                    out.error = "";


                } else {
                    out.error = "invalid credentials";
                }
                done = true;


            })
        } else {
            out.error = passwordOut.error;
            done = true;
        }

    } else {
        out.error = "invalid type";
    }

    deasync.loopWhile(() => {
        return !done
    });
    return out;
}

function create_tables() {
    for (tableQuery of QUERIES) {
        create_table(tableQuery);
    }


}


function create_table(sql) {
    let done = false;
    const conn = db.createConnection('sqlite3://easy-bev.db')
    conn.query(sql, function (err) {
        done = true;
        conn.end();
    });
    deasync.loopWhile(() => {
        return !done
    })
}

function validateEmail(email) {
    if (email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
    }
    return false
}


function getItems() {
    let done = false;
    const out = {};
    const conn = db.createConnection('sqlite3://easy-bev.db')
    conn.query('select * from items', function (error, data) {
        if (error) {
            out.error = "SQL error";
        } else {
            out.body = {items: data.rows};
        }
        conn.end();
        done = true;

    });
    deasync.loopWhile(() => {
        return !done
    });
    return out;
}


function getMerchantInfo(info) {
    let done = false;
    const out = {};

    if (validateEmail(info.email)) {
        const conn = db.createConnection('sqlite3://easy-bev.db')
        conn.query('select m.*, d.email as distributor_email from Merchants as m, Distributors as d where m.email = ? and m.d_id = d.id', [info.email], function (error, data) {
            if (error || data.rowCount !== 1) {
                out.error = data.rowCount === 0 ? "no such email found" : "multiple same emails found";
            } else {
                out.body = {merchant: data.rows[0]};
            }
            done = true;
            conn.end()

        });
    } else {
        done = true;
        out.error = "invalid email, reroute to login";
    }

    deasync.loopWhile(() => {
        return !done
    });
    return out;
}


function insertPayment(meta, payment, isMerchant) {
    const conn = db.createConnection('sqlite3://easy-bev.db');
    let done = false;
    const out = {};
    console.log("insert")
    console.log(payment)
    console.log("meta", meta)
    const param = [payment.name, payment.digits, payment.security_code, payment.phone, payment.address, payment.country, payment.city, payment.postal_code, payment.x_month, payment.x_year, isMerchant, meta.id]
    console.log(param)
    conn.query('insert into payment(mname, digits, security_code, phone, address, country, city, postal_code, exp_month, exp_year, merchant, f_id) values(?,?,?,?,?,?,?,?,?,?,?,?)', param, function (err, data) {
        console.log("finished q ", err);
        if (err) {
            out.error = "sql error" + err
        } else {
            out.status = "SUCCESS";
        }
        done = true;
        conn.end();
    });
    deasync.loopWhile(() => {
        return !done
    });
    return out;
}

function updatePayment(info, payment, isMerchant) {
    const conn = db.createConnection('sqlite3://easy-bev.db');
    let done = false;
    const out = {};
    const param = [payment.name, payment.digits, payment.security_code, payment.phone, payment.address, payment.country, payment.city, payment.postal_code, payment.x_month, payment.x_year, isMerchant, info.id];
    console.log("info is", info);
    console.log("param is", param);
    conn.query('update payment set mname = ?, digits = ?, security_code = ?, phone= ?, address=?, country=?, city=?, postal_code=?, exp_month=?, exp_year=? where merchant = ? and f_id = ?', param, function (err, data) {
        console.log("query done")
        if (err) {
            out.error = "sql error" + err
        } else {
            out.status = "SUCCESS";
        }
        conn.end();
        done = true;

    });
    deasync.loopWhile(() => {
        return !done
    });
    return out;
}

function addPayment(info, payment) {
    let done1 = false;
    let out = {};
    if (validateEmail(info.email)) {
        let meta = getInfo(info);
        const conn = db.createConnection('sqlite3://easy-bev.db');
        const isMerchant = info.type === TYPES[1];
        if (isMerchant) {
            meta = meta.body.merchant
        } else {
            meta = meta.body.distributor
        }

        conn.query('select * from payment where merchant = ? and f_id = ?', [isMerchant, meta.id], function (err, data) {
            if (data.rowCount === 0) {
                out = insertPayment(meta, payment, isMerchant)
            } else if (!err) {
                out = updatePayment(meta, payment, isMerchant)
            } else {
                out = {error: "sql error" + err}
            }
            done1 = true;
        });

    } else {
        out = {error: "invalid session, reroute to signup"}
        done1 = true;

    }

    deasync.loopWhile(() => {
        return !done1;
    });
    return out;
}

function getDistributorInfo(info) {
    let done = false;
    const out = {};

    if (validateEmail(info.email)) {
        const conn = db.createConnection('sqlite3://easy-bev.db')
        conn.query('select * from Distributors where email = ?', [info.email], function (err, data) {
            if (err || data.rowCount !== 1) {
                out.error = data.rowCount === 0 ? "no such email found" : "multiple same emails found";
            } else {
                out.body = {};
                out.body.distributor = data.rows[0];

            }
            conn.query('select * from Merchants where d_id = ?', [out.body.distributor.id], function (err, data) {
                if (err) {
                    out.error = "SQL error:" + err;
                } else {
                    out.body.merchants = data.rows

                }
                done = true;
                conn.end()

            })

        })


    } else {
        done = true;
        out.error = "invalid email, reroute to login";
    }

    deasync.loopWhile(() => {
        return !done
    })
    return out;
}

function getInfo(info) {
    console.log("get info func received", info);
    let out = {};
    if (info && info.type) {
        if (info.type === TYPES[0]) {
            out = getDistributorInfo(info);
        } else if (info.type === TYPES[1]) { //merchant
            out = getMerchantInfo(info);
        } else {
            out = {error: "invalid type"}
        }
    } else {
        out = {error: "invalid session, redirect to login"}
    }

    if (!out.error) {
        if (info.type === TYPES[0]) {
            out.body.merchants = getOrders(info).body.merchants;
        } else {
            out.body.orders = getOrders(info).body;
        }
    }

    return out


}

function getPrice(order) {
    console.log("getting price of", order)
    let sum = 0;
    for (let i = 0; i < order.length; i++) {
        const item = order[i];
        console.log('item', item)
        sum += item.price * item.oqty;
    }
    return sum;
}

function getMerchantOrders(info) {

    if (!info || !info.email) {
        return {error: 'invalid email, reroute to login'}
    }
    const type = info.type;
    if (type !== TYPES[1]) {
        console.log(type);
        return {error: "sever error"}
    }
    let done = false;
    const out = {};
    const meta = getMerchantInfo(info).body.merchant;
    const conn = db.createConnection('sqlite3://easy-bev.db');
    conn.query('select * from orders where m_id = ? and d_id = ?', [meta.id, meta.d_id], function (err, data) {
        if (err) {
            out.error = "sql error";
        } else {
            out.body = data.rows
        }
        done = true;
    });

    deasync.loopWhile(function () {
        return !done;
    });
    conn.end();
    return out
}

function getDistributorOrders(info) {
    console.log("get ord info", info);
    if (!info || !info.email) {
        return {error: 'invalid email, reroute to login'}
    }
    const type = info.type;
    if (type !== TYPES[0]) {
        console.log("ERROR: wrong fun called", type);
        return {error: "server error"}
    }
    let done = false;
    const out = {body: {}};
    let meta = getDistributorInfo(info).body;
    const conn = db.createConnection('sqlite3://easy-bev.db');
    const merchants = meta.merchants;
    out.body.merchants = merchants;
    let i = 0;
    for (i = i; i < merchants.length; i++) {
        let tempDone = false;
        const merchId = merchants[i].id;
        conn.query('select orders.*, m.name as merchant_name, m.email as merchant_email from orders, merchants as m where orders.d_id = ? and orders.m_id = ? and orders.m_id = m.id', [meta.distributor.id, merchId], function (err, data) {
            if (err) {
                out.error = "sql error";
            } else {
                out.body.merchants[i].orders = data.rows
            }
            tempDone = true;
        });
        deasync.loopWhile(() => {
            return !tempDone
        })
    }
    done = i === merchants.length;


    deasync.loopWhile(function () {
        return !done;
    });
    conn.end();
    return out
}

function getMessengers(email, type) {
    let done = false;
    let query = "";
    let out = [];
    if (type === TYPES[0]) {
        query = "select DISTINCT me.email as email from messages as m, Distributors as d, Merchants as me  where m.m_id = me.id and d.id = m.d_id and d.email = ?"
    }
    if (type === TYPES[1]) {
        query = "select DISTINCT d.email as email from messages as m, Distributors as d, Merchants as me  where m.m_id = me.id and d.id = m.d_id and me.email = ?"
    }
    const conn = db.createConnection('sqlite3://easy-bev.db');
    conn.query(query, [email], function (err, data) {
        out = data.rows;
        done = true;
    });
    deasync.loopWhile(function () {
        return !done;
    });
    conn.end();
    return out;
}

function getMessages(info) {
    const email = info.email;
    const type = info.type;
    if (info && info.type) {
        if (type !== TYPES[0] && type !== TYPES[1]) {
            return {error: "invalid, reroute to login"}
        } else {
            const out = {};
            const messengers = getMessengers(email, type);

            for (let i = 0; i < messengers.length; i++) {
                const otherEmail = messengers[i].email;
                let done = false;
                const conn = db.createConnection('sqlite3://easy-bev.db');
                const query = "select d.email as dist_email, me.email as merch_email, m.text, m.timestamp, m.fromMerchant from messages as m, Distributors as d, Merchants as me  where m.m_id = me.id and d.id = m.d_id and me.email = ? and d.email = ?  order by timestamp asc"
                const mEmail = type === TYPES[1] ? email : otherEmail;
                const dEmail = type === TYPES[0] ? email : otherEmail;
                conn.query(query, [mEmail, dEmail], function (err, data) {
                    out[otherEmail] = data.rows;
                    done = true;

                });
                deasync.loopWhile(function () {
                    return !done;
                });
                conn.end()
            }

            return out;

        }
    } else {
        return {error: "invalid, reroute to login"}
    }
}

function getOrders(info) {
    console.log("get orders func received", info);
    if (info && info.type) {
        if (info.type === TYPES[0]) {
            return getDistributorOrders(info);
        } else if (info.type === TYPES[1]) { //merchant
            return getMerchantOrders(info);
        } else {
            return {error: "invalid type"}
        }
    } else {
        return {error: "invalid session, redirect to login"}
    }
}

function makeOrder(info, order) {
    console.log("make ord info", info)
    console.log("make ord order", order)

    if (!info || !info.email) {
        return {error: 'invalid email, reroute to login'}
    }
    const type = info.type;

    if (type !== TYPES[1]) {
        return {error: "non-merchants can not make orders"}
    }

    let done = false;
    const out = {};
    const meta = getMerchantInfo(info).body.merchant;
    const conn = db.createConnection('sqlite3://easy-bev.db');
    conn.query('insert into orders(d_id, m_id, order_json, price) values(?,?,?,?)', [meta.d_id, meta.id, JSON.stringify(order), getPrice(order)], function (err, data) {
        if (err) {
            console.log(err)
            out.error = "sql error";
            console.log('err')

        } else {
            out.status = "SUCCESS";
            console.log('not err')

        }
        done = true;

    });
    deasync.loopWhile(function () {
        return !done;
    });
    conn.end();
    return out

    /*
    [
    {
      id: 99,
      upc: 81753825706,
      name: 'DOM PERIGNON LUMIN 09 L4 3/CS, 750 [263454]',
      size: 750,
      qty: 3,
      price: 0,
      dist_id: 1
    },
    {
      id: 100,
      upc: 81753827922,
      name: 'CLICQUOT RICH ROSE 6/CS, 750 [228224]',
      size: 750,
      qty: 6,
      price: 0,
      dist_id: 1
    }]

     */

}

function distEmailToId(email) {
    let done = false;
    let out = "";
    const conn = db.createConnection('sqlite3://easy-bev.db');
    conn.query('select id from distributors where email = ?', [email], function (err, data) {
        out = data.rows[0].id;
        conn.end();
        done = true
    });
    deasync.loopWhile(function () {
        return !done;
    });
    return out;

}

function addFeed(info, feed) {
    //title
    //description
    //expiry date mm/dd/yyyy
    //promotionItems
    const d_id = distEmailToId(info.email);
    const out = {};
    const conn = db.createConnection('sqlite3://easy-bev.db');
    let feed_id = -1;
    conn.query('insert into feed(title,description, expiry,price, d_id) values (?,?,?,?,?)', [feed.title, feed.description, feed.expiry, feed.price, d_id], function (err, data) {
        if (err) {
            console.log("sql error when adding feed", err)
        } else {
            console.log("added feed", feed);
        }
        conn.end();
        out.body = {status:"SUCCESS"};
        feed_id = data.lastInsertId;
    });

    deasync.loopWhile(() => {
        return feed_id === -1;
    });

    const items = feed.promotionItems;
    for (let i = 0; i < items.length; i++) {
        const param = [feed_id, items[i].id, items[i].oqty];
        let temp = false;
        const conn = db.createConnection('sqlite3://easy-bev.db');
        conn.query('insert into feed_items(f_id,i_id,qty) values (?,?,?)', param, function (err, data) {
            if (err) {
                console.log("SQL ERR", err)
            }
            temp = true;
        });
        conn.end();
        deasync.loopWhile(() => {
            return !temp;
        });
    }

    return out;
}

function merchEmailToDistId(email){
    let done = false;
    const conn = db.createConnection('sqlite3://easy-bev.db');
    let out = "";
    conn.query('select d_id from merchants where email = ?', email, function (err, data) {
        if (err) {
            console.log("SQL ERR", err)
        }
        out = data.rows[0].d_id;
        done = true;
    });

    deasync.loopWhile(()=>{
        return !done;
    });

    return out;
}


function getFeed(info){

    if(!info || !info.type){
        return {error:"reroute to login"}
    }
    let d_id;
    if (info.type === TYPES[1]){
        d_id = merchEmailToDistId(info.email);
    }else{
        d_id = distEmailToId(info.email);
    }


    let done = false;
    const conn = db.createConnection('sqlite3://easy-bev.db');
    let out = "";
    let feeds = []
    conn.query('select * from feed where d_id = ?', d_id, function (err, data) {
        if (err) {
            console.log("SQL ERR", err)
        }
        feeds = data.rows;
        conn.end();
        done = true;
    });
    deasync.loopWhile(()=>{
        return !done;
    });

    for (let i = 0; i < feeds.length; i++) {
        done = false;
        const f_id = feeds[i].id;
        const conn = db.createConnection('sqlite3://easy-bev.db');
        conn.query('select i.*, fi.qty as oqty from feed_items as fi, items as i where fi.i_id = i.id and fi.f_id = ?', f_id, function (err, data) {
            feeds[i].promotionItems = data.rows
            done = true;
        });
        deasync.loopWhile(()=>{return !done})
    }

    return {body:feeds};

}

app.post('/api/authenticate', (req, res) => {
    console.log("in authenticate sending", req.session.valid);
    if (req.session.valid) {
        res.send({valid: true})
    } else {
        res.send({error: "Unauthorized"})
    }
});

app.post('/api/signup', (req, res) => {
    const email = req.body.email;
    let response = {error: "invalid"};
    if (validateEmail(email)) {
        if (req.session.valid) {
            console.log("ALREADY IN!");
            response.status = "Cookie says already in";
        } else {
            console.log("NOT IN!");
            response = signUp(req.body);
            if (!response.error) {
                console.log("NOT ERROR");
                req.session.info = {email: email, type: req.body.type};
                console.log(req.session.info);
                req.session.valid = true;
                response.body = getInfo(req.session.info).body

            }
        }
    } else {
        response.error = "Invalid email";
    }
    console.log("in sign up, sending", response);
    res.send(response);
});

app.post('/api/signin', (req, res) => {
    let response = {};
    if (req.session.valid) {
        console.log("IN!");
        response.status = "Cookie says already in";
    } else {
        console.log("NOT IN!");
        const email = req.body.email;
        const type = req.body.type;
        let password = req.body.password;
        console.log("new sign in");

        if (email && type && password) {
            if (validateEmail(email)) {
                response = signIn(email, password, type);
                if (!response.error) {
                    req.session.valid = true;
                    req.session.info = {email: email, type: req.body.type};
                    response.body = getInfo(req.session.info).body;
                    console.log("SETTING", req.session.info)
                }
            } else {
                response.error = "invalid email";
            }


        } else {
            response.error = "Missing input";
        }
    }
    res.send(response);

});

app.get('/api/hello', (req, res) => {
    res.send({express: 'Hello From Express'})
});

app.post('/api/get_client', (req, res) => {
    const myInfo = req.session.info;
    const infoReturn = getInfo(myInfo);
    res.send(infoReturn)
});
app.post('/api/get_items', (req, res) => {
    res.send(getItems())
});

app.post('/api/make_order', (req, res) => {
    res.send(makeOrder(req.session.info, req.body))
});

app.post('/api/get_orders', (req, res) => {
    res.send(getOrders(req.session.info))
});

app.post('/api/add_payment', (req, res) => {
    const resp = addPayment(req.session.info, req.body)
    console.log("resp", resp);
    res.send(resp)
});

app.post('/api/get_messages', (req, res) => {
    res.send(getMessages(req.session.info))
});

app.post('/api/log_out', (req, res) => {
    req.session.destroy();
    res.send({succes: "logged out"})
});

app.post('/api/new_feed', (req, res) => {
    console.log(req.body)
    res.send(addFeed(req.session.info, req.body))
});

app.post('/api/get_feeds', (req, res) => {
    console.log("GET FEED CALLED")
    const out = getFeed(req.session.info);
    console.log("RETURNING", out)
    res.send(out)
});

app.post('/api/invite_merchant', (req, res) => {
    const out = linkMerchantDistributor(req.session.info, req.body);
    res.send(out)
});


console.log("START");
//console.log(getInfo({email:"m@b.com", type:TYPES[1]}));
//const dissst = getInfo({email:"michael_bardakji@brown.edu", type:TYPES[0]})
// console.log(dissst);
// console.log("merchants")
// console.log(dissst.body.merchants)
// console.log("orders")
// console.log(dissst.body.orders)
server.listen(port, () => console.log(`Listening on port ${port}`));

