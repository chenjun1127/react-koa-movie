const Koa = require('koa');
const config = require('./config.js');
const sessionConfig = require('./session.config');
const koaSession = require('koa-generic-session');
const session = require('koa-session');
const MysqlStore = require('koa-mysql-session');
const koaBody = require('koa-body');
const app = new Koa();
const port = 5000;
app.use(koaBody());


// session存储配置
const sessionMysqlConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
}

const THIRTY_MINTUES = 30 * 60 * 1000;
app.keys = ['USER_SID','some secret hurr'];
app.use(koaSession({
    store: new MysqlStore(sessionMysqlConfig),
    rolling: true,
    cookie: {
        maxage: THIRTY_MINTUES
    }
}));

app.use(session(sessionConfig, app));

const captcha = require('./routers/captcha');
const user = require('./routers/user');

app.context.author = 'Jone-chen';
app.use(captcha.routes());
app.use(user.routes());
// app.use(second.routes());
// app.use(third.routes());

app.listen(port, () => {
    console.log('app running on port: ' + port);
});