const Sequelize = require('sequelize');
const config = require('./config.js');
const sequelize = new Sequelize(config.database.DATABASE, config.database.USERNAME, config.database.PASSWORD, {
    host: config.database.HOST,
    dialect: 'mysql',
    port: config.database.PORT,
    timezone: "+08:00",
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

//测试数据库链接
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

exports.sequelize = sequelize;