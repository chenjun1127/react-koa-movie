/**
 * Created by ChenJun on 2018/12/4
 */

const router = require('koa-router')();
const svgCaptcha = require('svg-captcha');
router.get('/captcha', async (ctx) => {
    console.log(Date.now())
    const captcha = svgCaptcha.create({
        size: 4,
        fontSize: 40,
        width: 150,
        height: 32,
    })
    ctx.session.code = captcha.text;
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
})
router.post('/validateCaptcha', async (ctx) => {
    const captcha = ctx.request.body.captcha;
    console.log(captcha,ctx.session.code)
    if (captcha.toLowerCase() === ctx.session.code.toLowerCase()) {
        ctx.body = {
            code: 200,
            desc: 'ok'
        }
    } else {
        ctx.body = {
            code: 401,
            desc: '验证码错误'
        }
    }
})

module.exports = router;