const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const CREATE_DISTRIBUTORS =
    'CREATE TABLE Distributors   (\
        id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,\
        name TEXT NOT NULL UNIQUE,\
        password TEXT NOT NULL,\
        meta TEXT );';

const CREATE_MERCHANTS =
    'CREATE TABLE  Merchants   (\
     id INTEGER PRIMARY KEY AUTOINCREMENT,\
     name TEXT NOT NULL UNIQUE,\
     password TEXT NOT NULL,\
     address TEXT NOT NULL,\
     city TEXT NOT NULL,\
     state TEXT NOT NULL,\
     country TEXT NOT NULL,\
     zipcode TEXT NOT NULL\
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

const QUERIES = [CREATE_DISTRIBUTORS, CREATE_MESSAGES, CREATE_MERCHANTS, CREATE_ORDERS];
const db = require('any-db')
const saltRounds = 10;
create_tables();


function create_tables () {
    for(tableQuery of QUERIES){
        create_table(tableQuery);
    }
}

function create_table (sql) {
    const conn = db.createConnection('sqlite3://easy-bev.db')
    conn.query(sql, function (err) {
        if (err) {
            console.log(sql)
            console.log(err)
        }
    });
    conn.end()
}
function ValidateEmail (email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
    }
    return false
}



app.get('/api/hello', (req, res) => {
    res.send({express: 'Hello From Express'})
});

app.post('/api/get_client', (req, res) => {
    conn.query('select * from Clients where user_id = ?', [req.body.id], function (error, data) {
        if (error) {
            console.log('INNER')
            console.log(er)

        } else {
            const clients = data.rows

            res.send(clients)
        }

        conn.end()

    })
});



app.listen(port, () => console.log(`Listening on port ${port}`))