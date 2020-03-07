
const CREATE_DISTRIBUTORS =
    'CREATE TABLE Distributors if not exists  (\
        id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,\
        name TEXT NOT NULL UNIQUE,\
        password TEXT NOT NULL,\
        meta TEXT );';

const CREATE_MERCHANTS =
    'CREATE TABLE Merchants if not exists  (\
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
    'CREATE TABLE orders if not exists (\
     id INTEGER PRIMARY KEY AUTOINCREMENT,\
     d_id INTEGER NOT NULL,\
     m_id INTEGER NOT NULL,\
     order_json TEXT NOT NULL \
     price DOUBLE NOT NULL\
     timestamp DATE DEFAULT (datetime(\'now\',\'localtime\')),\
     FOREIGN KEY(from_id) REFERENCES artist(artistid)\
    );';

const CREATE_MESSAGES =
    'CREATE TABLE messages if not exists (\
     id INTEGER PRIMARY KEY AUTOINCREMENT,\
     from_id INTEGER NOT NULL,\
     to_id INTEGER NOT NULL,\
     text TEXT NOT NULL \
     timestamp DATE DEFAULT (datetime(\'now\',\'localtime\')),\
    );';
