/**
 * Created by ChenJun on 2018/12/19
 */
const router = require('koa-router')();
const API = require('../API/config.js');
const city_sql = require('../sql/city');
const koa2Req = require('koa2-request');
router.get('/cities', async (ctx) => {
    await city_sql.findAllCity().then(async res => {
        if (res.length > 0) {
            ctx.body = {
                code: 200,
                data: res
            }
        } else {
            const res = await koa2Req(API.hotCitiesByCinema, {json: true});
            const cities = res.body.p;
            for (var i = 0; i < cities.length; i++) {
                city_sql.insertCity([cities[i].id, cities[i].n, cities[i].count, cities[i].pinyinFull, cities[i].pinyinShort]).then(async res => {
                })
            }
            ctx.body = {
                code: 200,
                data: cities
            }
        }

    })
})

module.exports = router;
