/**
 * Created by ChenJun on 2018/12/4
 */

const router = require('koa-router')();
const svgCaptcha = require('svg-captcha');
router.get('/captcha', async (ctx) => {
    const captcha = svgCaptcha.create({
        size: 4,
        fontSize: 40,
        width: 150,
        height: 32,
    });
    ctx.session.code = captcha.text;
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
});

module.exports = router;