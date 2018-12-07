const Koa = require('koa');
const config = require('./config.js');
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
}))

const CONFIG = {
    key: 'koa:sess',   //cookie key (default is koa:sess)
    maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
    overwrite: true,  //是否可以overwrite    (默认default true)
    httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true,   //签名默认true
    rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
    renew: false,  //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));

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