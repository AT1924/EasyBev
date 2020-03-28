const express = require('express');
var session = require('express-session');

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const deasync = require('deasync');

const port = process.env.PORT || 8080;
const TYPES = ["distributors", "merchants"];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));


//company: this.state.company, address: this.state.address, state: this.state.state, zip: this.state.zip,
//     //                 type:this.state.type, email: this.state.email, password: this.state.password }
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


const QUERIES = [CREATE_DISTRIBUTORS, CREATE_MESSAGES, CREATE_MERCHANTS, CREATE_ORDERS, CREATE_CODES];
const db = require('any-db');
const saltRounds = 10;
create_tables();

function getPassword(email, type){
    let done = false;
    const out = {};
    console.log("type is ", type);
    const conn = db.createConnection('sqlite3://easy-bev.db')
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
                console.log("valid is", valid)
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
        if (err) {
            console.log(sql);
            console.log(err);
        }


    });
    conn.end();
    deasync.loopWhile(()=>{return !done})
}
function validateEmail (email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
    }
    return false
}

function getMerchantInfo(){
    conn.query('select * from Merchants where id = ?', [req.body.id], function (error, data) {
        if (error) {
            console.log('INNER');
            console.log(error);

        } else {
            const clients = data.rows;
            console.log(clients);
            res.send(clients)
        }

        conn.end()

    })
}

function getDistributorInfo(){
    const conn = db.createConnection('sqlite3://easy-bev.db');
    conn.query('select * from Distributors where ')

}

function getInfo(type, email){
    let done = false;
    const out = {};
    if(TYPES.includes(type.toLowerCase())){

            done = true;

    }else{
        return {error:"Invalid type"}
    }
    deasync.loopWhile(()=>{
        return !done;
    });
    return out;

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
            console.log("IN!")
            response.status = "Cookie says already in";
        } else {
            console.log("NOT IN!");
            response  = signUp(req.body);
            if (!response.error){
                console.log("NOT ERROR");
                req.session.valid = true;
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
                    req.session.type = type;
                    req.session.email = email;
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


// michael I NEEd A PROFILE endpoint that gives me information about the user
// for distributors i want a list of their clients as well

app.post('/api/profile', (req,res) => {
    if (req.session.valid){
        const type = req.session.type;
        if (type){
            const response = getInfo(type, req.session.email);
            res.send(response)
        }else{
            res.send({error:"no type was found in user session"})
        }
    }else{
        res.send({error:"user session says they are not signed in"})
    }

});

app.post('/api/get_client', (req, res) => {
    const conn = db.createConnection('sqlite3://easy-bev.db');
    console.log(req.body.id);
    getDistributorInfo()
});

app.listen(port, () => console.log(`Listening on port ${port}`))