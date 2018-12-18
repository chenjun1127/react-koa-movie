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
/*
    active 0==>未激活，1==>激活
    sex 1==>男，2==>女,3==>保密
 */
const users =
    `create table if not exists users(
     id INT(11) NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     password VARCHAR(100) NOT NULL,
     email VARCHAR(100) NOT NULL,
     avatar VARCHAR(100) DEFAULT NULL,
     create_time VARCHAR(100) NOT NULL,
     active TINYINT DEFAULT 0,
     phone VARCHAR(11) DEFAULT NULL,
     role INT(11) DEFAULT 0,
     userSign VARCHAR(100) DEFAULT NULL,
     sex TINYINT DEFAULT 1,     
     PRIMARY KEY ( id )
    );`

const createTable = function (sql) {
    return query(sql, [])
}

createTable(users);


module.exports=query;