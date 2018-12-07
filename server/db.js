const db = require('mysql');
const config = require('./config.js');
const pool = db.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE
});

const query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}
const users =
    `create table if not exists users(
     id INT(11) NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     password VARCHAR(100) NOT NULL,
     email VARCHAR(100) NOT NULL,
     avatar VARCHAR(100) DEFAULT NULL,
     create_time VARCHAR(100) NOT NULL,
     active TINYINT DEFAULT 0,
     phone INT(11) DEFAULT 0,
     role INT(11) DEFAULT 0,
     PRIMARY KEY ( id )
    );`

const createTable = function (sql) {
    return query(sql, [])
}

createTable(users);


module.exports=query;