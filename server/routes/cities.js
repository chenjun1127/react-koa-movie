/**
 * Created by ChenJun on 2018/12/19
 */
const router = require('koa-router')();
const API = require('../API/config');
const koa2Req = require('koa2-request');
router.get('/cities', async (ctx) => {
    const res = await koa2Req(API.hotCitiesByCinema, {json: true});
    const cities = res.body.p;
    ctx.body = {
        code: 200,
        data: cities
    }
});

module.exports = router;
