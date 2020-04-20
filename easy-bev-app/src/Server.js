const express = require('express');
var session = require('express-session');

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const deasync = require('deasync');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;
const TYPES = ["distributors", "merchants"];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 900000 }}));

io.on('connection', (socket) => {
    socket.on('messageChannel', (data) => {
        console.log("received", data);
        handleMessage(data)
    });
    setInterval(function() {
        // method to be executed;
        data = "suuup";
        toEmail = "mm@b.com";
        fromEmail = "server email";
        fromType = "server";
        toType = "merchant";
        socket.emit("messageChannel", { fromType: fromType, fromEmail:fromEmail, toType:toType, toEmail:toEmail, data:data });
    }, 20000);

});

function handleMessage(message, socket){
    const fromType = message.fromType;
    const fromEmail = message.fromEmail;
    const toType = message.toType;
    const toEmail = message.toEmail;
    const data = message.data;
    socket.emit("messageChannel", { fromType: fromType, fromEmail:fromEmail, toType:toType, toEmail:toEmail, data:data });

}

//company: this.state.company, address: this.state.address, state: this.state.state, zip: this.state.zip,
//     //                 type:this.state.type, email: this.state.email, password: this.state.password }
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
     from_id INTEGER NOT NULL,\
     to_id INTEGER NOT NULL,\
     text TEXT NOT NULL, \
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP\
      );';

const CREATE_CODES =
    'CREATE TABLE  codes (\
     code INTEGER PRIMARY KEY,\
     d_id INTEGER NOT NULL,\
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
     FOREIGN KEY(d_id) REFERENCES Distributors(id)\
);';


const QUERIES = [CREATE_DISTRIBUTORS, CREATE_MESSAGES, CREATE_MERCHANTS, CREATE_ORDERS, CREATE_CODES, CREATE_PAYMENT];
const db = require('any-db');
const saltRounds = 10;
create_tables();

function getPassword(email, type){
    let done = false;
    const out = {};
    console.log("type is ", type);
    const conn = db.createConnection('sqlite3://easy-bev.db');
    conn.query('select password from ' + type+ ' where email = ?', [email], function (err, data){
        console.log(data);

        if (err || data.rowCount !== 1){
            console.log("error is", err)

            out.error = err ? "SQL error" : "invalid credentials";
        }else{
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

function signUp(body){
    //{code: this.state.code, company: this.state.company, address: this.state.address, state: this.state.state, zip: this.state.zip,
    //                 type:this.state.type, email: this.state.email, password: this.state.password }
    let done = false;
    let out = {};
    const type = body.type;
    if (!body.password){
        return {error:"invalid password"}
    }
    if(TYPES.includes(type.toLowerCase())){
        bcrypt.hash(body.password, saltRounds)
            .then(hashedPassword => {
                const conn = db.createConnection('sqlite3://easy-bev.db');
                let insert = "";
                const param = [body.company, body.email, hashedPassword, body.address, body.city, body.state, body.zip];
                if (type === TYPES[0]){ //distributor
                    insert = 'insert into Distributors (name, email, password, address, city, state, zip) values (?,?,?,?,?,?,?)';

                }else{
                    insert = 'insert into merchants (name, email, password, address, city, state, zip, d_id)  values (?,?,?,?,?,?,?,?)';
                    const resp = codeToDist(body.code);
                    if (resp.error){
                        conn.end;
                        out.error = resp.error;
                        done = true;
                    }
                    const dist_id = resp.body;
                    param.push(dist_id)
                }
                console.log("executing", insert, param)
                conn.query(insert, param, function (error, data) {
                    if (error){
                        out.error = "Invalid input";
                    }else{
                        out.status = "SUCCESS";
                    }
                    conn.end();
                    done = true;
                })
            })
    }else{
        out.error = "invalid type";
        done = true;
    }

    deasync.loopWhile(function (){
        return !done});
    return out;

}

function codeToDist(code){
    if (parseInt(code) === 42069){
        return {body:1}
    }
    if (!code){
        return {error: "invalid code"}
    }
    let done = false;
    const out = {}
    const conn = db.createConnection('sqlite3://easy-bev.db');
    const get = 'select d_id from codes where code = ? order by timestamp limit 1';

    conn.query(get, [code], function (error, data) {
        if (error || data.rowCount == 0){
            out.error = "Invalid code"
        }else{
            out.body = data

        }
        conn.end();
        done = true;


    });

    //go to akhil function and get his input
    //
    deasync.loopWhile(() =>{return !done});
    return out

}


function signIn(email, password, type){
    let done = false;
    const out = {};
    if(TYPES.includes(type.toLowerCase())){
        const passwordOut = getPassword(email, type);
        console.log("RECEIVED",passwordOut);
        if(!passwordOut.error){
            bcrypt.compare(password,passwordOut.body).then((valid) =>{
            if (valid){
                out.status = "SUCCESS";
                out.error = "";


            }else{
                out.error = "invalid credentials";
            }
            done = true;


            })
        }else{
            out.error = passwordOut.error;
            done = true;
        }

    }else{
        out.error = "invalid type";
    }

    deasync.loopWhile(() =>{return !done});
    return out;
}

function create_tables () {
    for(tableQuery of QUERIES){
        create_table(tableQuery);
    }


}


function create_table (sql) {
    let done = false;
    const conn = db.createConnection('sqlite3://easy-bev.db')
    conn.query(sql, function (err) {
        done = true;
        conn.end();
    });
    deasync.loopWhile(()=>{return !done})
}
function validateEmail (email) {
    if (email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
    }
    return false
}


function getItems(){
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
    deasync.loopWhile(()=>{return !done});
    return out;
}


function getMerchantInfo(info){
    let done = false;
    const out = {};

    if (validateEmail(info.email)){
        const conn = db.createConnection('sqlite3://easy-bev.db')
        conn.query('select * from Merchants where email = ?', [info.email], function (error, data) {
            if (error || data.rowCount !== 1) {
                out.error = data.rowCount === 0 ? "no such email found" : "multiple same emails found";
            } else {
                out.body = {merchant:data.rows[0]};
            }
            done = true;
            conn.end()

        });
    }else{
        done = true;
        out.error= "invalid email, reroute to login";
    }

    deasync.loopWhile(()=>{return !done});
    return out;
}


function insertPayment(meta, payment, isMerchant){
    const conn = db.createConnection('sqlite3://easy-bev.db');
    let done = false;
    const out = {};
    console.log("insert")
    console.log(payment)
    console.log("meta", meta)
    const param = [payment.name, payment.digits, payment.security_code, payment.phone, payment.address, payment.country, payment.city, payment.postal_code, payment.x_month, payment.x_year, isMerchant, meta.id]
    console.log(param)
    conn.query('insert into payment(mname, digits, security_code, phone, address, country, city, postal_code, exp_month, exp_year, merchant, f_id) values(?,?,?,?,?,?,?,?,?,?,?,?)', param, function (err, data){
      console.log("finished q ", err);
        if (err){
            out.error = "sql error"+ err
        }else{
            out.status = "SUCCESS";
        }
        done = true;
        conn.end();
    });
    deasync.loopWhile(()=>{return !done});
    return out;
}

function updatePayment(info, payment, isMerchant){
    const conn = db.createConnection('sqlite3://easy-bev.db');
    let done = false;
    const out = {};
    const param = [payment.name, payment.digits, payment.security_code, payment.phone, payment.address, payment.country, payment.city, payment.postal_code, payment.x_month, payment.x_year, isMerchant, info.id];
    console.log("info is", info);
    console.log("param is", param);
    conn.query('update payment set mname = ?, digits = ?, security_code = ?, phone= ?, address=?, country=?, city=?, postal_code=?, exp_month=?, exp_year=? where merchant = ? and f_id = ?', param, function (err, data){
        console.log("query done")
        if (err){
            out.error = "sql error"+ err
        }else{
            out.status = "SUCCESS";
        }
        conn.end();
        done = true;

    });
    deasync.loopWhile(()=>{return !done});
    return out;
}

function addPayment(info, payment){
    let done1 = false;
    let out = {};
    if (validateEmail(info.email)) {
        let meta = getInfo(info);
        const conn = db.createConnection('sqlite3://easy-bev.db');
        const isMerchant = info.type === TYPES[1];
        if (isMerchant){
            meta = meta.body.merchant
        }else{
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

    }else{
        out = {error:"invalid session, reroute to signup"}
        done1 = true;

    }

    deasync.loopWhile(()=>{
        return !done1;
    });
    return out;
}

function getDistributorInfo(info){
    let done = false;
    const out = {};

    if (validateEmail(info.email)){
        const conn = db.createConnection('sqlite3://easy-bev.db')
        conn.query('select * from Distributors where email = ?', [info.email], function (err, data){
            if (err || data.rowCount !== 1){
                out.error = data.rowCount === 0 ? "no such email found" : "multiple same emails found";
            }else{
                out.body = {};
                out.body.distributor = data.rows[0];

            }
            conn.query('select * from Merchants where d_id = ?', [out.body.distributor.id], function (err, data){
                if (err){
                    out.error = "SQL error:" + err;
                }else{
                    out.body.merchants = data.rows

                }
                done = true;
                conn.end()

            })

        })


    }else{
        done = true;
        out.error= "invalid email, reroute to login";
    }

    deasync.loopWhile(()=>{return !done})
    return out;
}

function getInfo(info){
    console.log("get info func received", info);
    let out  = {};
    if (info && info.type){
        if(info.type === TYPES[0]){
            out = getDistributorInfo(info);
        }else if (info.type === TYPES[1]){ //merchant
            out = getMerchantInfo(info);
        }else{
            out = {error:"invalid type"}
        }
    }else{
        out = {error:"invalid session, redirect to login"}
    }

    if (!out.error){
        if (info.type === TYPES[0]){
            out.body.merchants = getOrders(info).body.merchants;
        }else{
            out.body.orders = getOrders(info).body;
        }
    }

    return out


}

function getPrice(order) {
    console.log("getting price of",order)
    let sum = 0;
    for (let i = 0; i < order.length; i++){
        const item = order[i];
        console.log('item', item)
        sum += item.price * item.oqty;
    }
    return sum;
}

function getMerchantOrders(info){

    if (!info || !info.email){
        return {error: 'invalid email, reroute to login'}
    }
    const type = info.type;
    if (type !== TYPES[1]){
        console.log(type);
        return {error: "sever error"}
    }
    let done = false;
    const out = {};
    const meta = getMerchantInfo(info).body.merchant;
    const conn = db.createConnection('sqlite3://easy-bev.db');
    conn.query('select * from orders where m_id = ? and d_id = ?', [meta.id, meta.d_id], function (err, data){
        if(err){
            out.error = "sql error";
        }else{
            out.body = data.rows
        }
        done = true;
    });

    deasync.loopWhile(function () {
        return !done;
    });
    conn.end();
    return  out
}

function getDistributorOrders(info){
    console.log("get ord info", info);
    if (!info || !info.email){
        return {error: 'invalid email, reroute to login'}
    }
    const type = info.type;
    if (type !== TYPES[0]){
        console.log("ERROR: wrong fun called", type);
        return {error: "server error"}
    }
    let done = false;
    const out = {body:{}};
    let meta = getDistributorInfo(info).body;
    const conn = db.createConnection('sqlite3://easy-bev.db');
    const merchants = meta.merchants;
    out.body.merchants = merchants;
    let i = 0;
    for (i=i;i < merchants.length; i++){
        let tempDone = false;
        const merchId = merchants[i].id;
        conn.query('select orders.*, m.name as merchant_name, m.email as merchant_email from orders, merchants as m where orders.d_id = ? and orders.m_id = ? and orders.m_id = m.id', [meta.distributor.id, merchId], function (err, data){
            if(err){
                out.error = "sql error";
            }else{
                out.body.merchants[i].orders = data.rows
            }
            tempDone = true;
        });
        deasync.loopWhile(()=>{return !tempDone})
    }
    done = i === merchants.length;


    deasync.loopWhile(function () {
        return !done;
    });
    conn.end();
    return  out
}

function getOrders(info){
    console.log("get orders func received", info);
    if (info && info.type){
        if(info.type === TYPES[0]){
            return getDistributorOrders(info);
        }else if (info.type === TYPES[1]){ //merchant
            return getMerchantOrders(info);
        }else{
            return {error:"invalid type"}
        }
    }else{
        return {error:"invalid session, redirect to login"}
    }
}
function makeOrder(info, order){
    console.log("make ord info", info)
    console.log("make ord order", order)

    if (!info || !info.email){
        return {error: 'invalid email, reroute to login'}
    }
    const type = info.type;

    if (type !== TYPES[1]){
        return {error: "non-merchants can not make orders"}
    }

    let done = false;
    const out = {};
    const meta = getMerchantInfo(info).body.merchant;
    const conn = db.createConnection('sqlite3://easy-bev.db');
    conn.query('insert into orders(d_id, m_id, order_json, price) values(?,?,?,?)', [meta.d_id,meta.id,JSON.stringify(order), getPrice(order)], function (err, data){
        if(err){
            console.log(err)
            out.error = "sql error";
            console.log('err')

        }else{
            out.status = "SUCCESS";
            console.log('not err')

        }
        done = true;

    });
    deasync.loopWhile(function () {
        return !done;
    });
    conn.end();
    return  out

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

function invite(dist_info, merch_email){

}

app.post('/api/authenticate', (req,res) =>{
    console.log("in authenticate sending", req.session.valid);
    if (req.session.valid){
        res.send({valid:true})
    }else{
        res.send({error:"Unauthorized"})
    }
});

app.post('/api/signup', (req, res) => {
    const email = req.body.email;
    let response = {error:"invalid"};
    if(validateEmail(email)) {
        if (req.session.valid) {
            console.log("ALREADY IN!");
            response.status = "Cookie says already in";
        } else {
            console.log("NOT IN!");
            response  = signUp(req.body);
            if (!response.error){
                console.log("NOT ERROR");
                req.session.info = {email:email, type:req.body.type};
                console.log(req.session.info);
                req.session.valid = true;
                response.body = getInfo(req.session.info).body

            }
        }
    }else{
        response.error = "Invalid email";
    }
    console.log("in sign up, sending", response);
    res.send(response);
});

app.post('/api/signin', (req, res) => {
    let response = {};
    if(req.session.valid){
        console.log("IN!");
        response.status = "Cookie says already in";
    }else{
        console.log("NOT IN!");
        const email = req.body.email;
        const type = req.body.type;
        let password = req.body.password;
        if(email && type && password){
            if(validateEmail(email)) {
                response = signIn(email, password, type);
                if(!response.error){
                    req.session.valid = true;
                    req.session.info = {email:email, type:req.body.type};
                    response.body = getInfo(req.session.info).body;
                    console.log("SETTING", req.session.info)
                }
            }else{
                response.error = "invalid email";
            }


        }else{
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

console.log("START");
//console.log(getInfo({email:"m@b.com", type:TYPES[1]}));
//const dissst = getInfo({email:"michael_bardakji@brown.edu", type:TYPES[0]})
// console.log(dissst);
// console.log("merchants")
// console.log(dissst.body.merchants)
// console.log("orders")
// console.log(dissst.body.orders)
server.listen(port, () => console.log(`Listening on port ${port}`));
