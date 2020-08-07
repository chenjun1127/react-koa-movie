/**
 * Created by ChenJun on 2018/12/4
 */
const router = require('koa-router')();
const { validate, enbcrypt } = require('../utils/bcrypt');
const sendMail = require('../utils/sendMail');
const sessionConfig = require('../session.config');
const multer = require('koa-multer'); //加载koa-multer模块
const { sequelize } = require("../db");
const User = sequelize.import("../models/user");
//文件上传
//配置
const storage = multer.diskStorage({
    //文件保存路径
    destination: function(req, file, cb) {
        cb(null, './src/static/uploads/')
    },
    //修改文件名称
    filename: function(req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
//加载配置
const upload = multer({ storage: storage });
// 获取session状态
router.get('/session', async (ctx) => {
    if (ctx.session.user) {
        ctx.body = {
            code: 200,
            data: ctx.session.user,
            expiresDays: ctx.session.expiresDays
        }
    } else {
        ctx.session.user = '';
        ctx.session.expiresDays = 0;
        ctx.body = {
            code: 502,
            desc: '暂无登录状态'
        }
    }
});
// 注册
router.post('/user/signUp', async (ctx) => {
    const { name, password, captcha } = ctx.request.body;
    if (captcha.toLowerCase() === ctx.session.code.toLowerCase()) {
        await User.findOne({ where: { name } }).then(async res => {
            if (res) {
                ctx.body = {
                    code: 501,
                    desc: '用户已存在'
                }
            } else {
                const user = Object.assign({}, ctx.request.body, { password: await enbcrypt(password) });
                delete user.captcha;
                await User.create(user).then(res => {
                    ctx.body = {
                        code: 200,
                        desc: '注册成功，去登录吧',
                        data: res.toJSON()
                    }
                })
            }
        })
    } else {
        ctx.body = {
            code: 401,
            desc: '验证码错误'
        }
    }
});
// 登录
router.post('/user/signIn', async (ctx) => {
    const { name, password, remember } = ctx.request.body;
    await User.findOne({ where: { name } }).then(async res => {
        if (!res) {
            ctx.body = {
                code: 502,
                desc: '用户不存在'
            }
        } else {
            const user = res.toJSON();
            await validate(password, user.password).then(boolean => {
                if (boolean) {
                    ctx.session.user = remember ? user : '';
                    ctx.session.expiresDays = sessionConfig.maxAge / 1000 / 3600 / 24; // 过期的天数
                    ctx.body = {
                        code: 200,
                        desc: '登录成功',
                        data: user,
                        expiresDays: sessionConfig.maxAge / 1000 / 3600 / 24
                    }
                } else {
                    ctx.body = {
                        code: 502,
                        desc: '登录失败，密码可能错误，请重新登录'
                    }
                }
            })
        }
    })
});
// 找回密码
router.post('/user/getBackPassword', async (ctx) => {
    const { name, email, captcha, time, url } = ctx.request.body;
    if (captcha.toLowerCase() === ctx.session.code.toLowerCase()) {
        // 同个账号10分钟之内禁止重复发邮件
        if (ctx.session.sendTime && ctx.session.userName && ctx.session.userName === name && ((time - ctx.session.sendTime) / 1000 / 60) < 10) {
            // console.log(ctx.session.sendTime, (time - ctx.session.sendTime) / 1000 / 60);
            ctx.body = {
                code: 505,
                desc: '此邮箱找回密码确认邮件已发送，如未收到请10分钟后再试'
            }
        } else {
            await User.findOne({ where: { name } }).then(async res => {
                if (!res) {
                    ctx.body = {
                        code: 502,
                        desc: '用户不存在'
                    }
                } else {
                    if (email === res.email) {
                        const href = url + '?type=resetPassword&t=' + Date.now();
                        await sendMail(email, '密码重置', `<h3>${name}您好，您申请了重置密码</h3><p>请在 1 小时内点击此链接以完成重置（如链接无法点击，请复制链接浏览器打开）</p><p>${href}</p>`).then(sendRes => {
                            ctx.session.user = '';
                            ctx.session.sendTime = time;
                            ctx.session.userName = res.name;
                            ctx.session.sendEmailTime = Date.now(); // 邮件发送的时间，用户点邮件链接的时候，判断当前链接有没有过期
                            ctx.body = { code: 200, desc: '发送邮件成功，请重新输入新密码', data: sendRes }
                        }).catch(err => {
                            ctx.body = { code: 504, desc: '发送邮件失败，请联系管理员', msg: err.message }
                        })
                    } else {
                        ctx.body = {
                            code: 503,
                            desc: '邮箱不匹配，请输入注册邮箱'
                        };
                    }
                }
            })
        }
    } else {
        ctx.body = {
            code: 401,
            desc: '验证码错误'
        }
    }
});
// 重置链接是否失效
router.get('/user/resetLink', async (ctx) => {
    if (ctx.session.sendEmailTime && ctx.session.userName) {
        const ms = Date.now() - ctx.session.sendEmailTime;
        const leaveHours = Math.floor(ms / 1000 / 60 / 60);
        if (leaveHours >= 1) {
            ctx.body = {
                code: 505,
                desc: '链接错误或者已经失效'
            }
        } else {
            ctx.body = {
                code: 200,
                desc: '链接有效',
                data: {
                    userName: ctx.session.userName
                }
            }
        }
    } else {
        ctx.body = {
            code: 504,
            desc: '链接错误或者已经失效'
        }
    }
});
// 重置密码
router.post('/user/restPassword', async (ctx) => {
    const { newPassword, name } = ctx.request.body;
    await User.findOne({ where: { name } }).then(async res => {
        if (!res) {
            ctx.body = {
                code: 502,
                desc: '用户不存在'
            }
        } else {
            await User.update({ password: await enbcrypt(newPassword) }, { where: { name } }).then(() => {
                ctx.body = {
                    code: 200,
                    desc: '重置密码成功'
                }
            }).catch(err => {
                ctx.body = {
                    code: 500,
                    desc: err.message
                }
            })
        }
    }).catch(err => {
        console.log(err.message)
    })
});
// 发送激活邮件
router.post('/user/activeEmail', async (ctx) => {
    const { name, email, url } = ctx.request.body;
    const href = url + '?name=' + encodeURIComponent(name) + '&type=activeAccount&t=' + Date.now();
    await sendMail(email, '账号激活', `<h3>${name}您好，</h3><p>请在 24 小时内点击此链接以完成激活（如链接无法点击，请复制链接浏览器打开）</p><p>${href}</p>`).then(sendRes => {
        ctx.session.sendActiveEmailTime = Date.now(); // 邮件发送的时间，用户点邮件链接的时候，判断当前链接有没有过期
        ctx.session.actvieUserName = name;
        ctx.body = { code: 200, desc: '发送邮件成功，请点击链接激活账号', data: sendRes }
    }).catch(err => {
        ctx.body = { code: 504, desc: '发送邮件失败，请联系管理员', msg: err.message }
    })
});
// 激活账号
router.post('/user/activeAccount', async (ctx) => {
    const { name } = ctx.request.body;
    if (ctx.session.sendActiveEmailTime && ctx.session.actvieUserName === name) {
        const ms = Date.now() - ctx.session.sendActiveEmailTime;
        const leaveHours = Math.floor(ms / 1000 / 60 / 60);
        if (leaveHours >= 24) {
            ctx.body = {
                code: 505,
                desc: '链接错误或者已经失效'
            }
        } else {
            await User.findOne({ where: { name } }).then(async res => {
                if (!res) {
                    ctx.body = {
                        code: 502,
                        desc: '用户不存在'
                    }
                } else {
                    await User.update({ active: 1 }, { where: { name } }).then(() => {
                        ctx.body = {
                            code: 200,
                            desc: '账号激活成功',
                        }
                    }).catch(err => {
                        ctx.body = {
                            code: 504,
                            desc: '账号激活失败，请联系管理员',
                            message: err.message
                        }
                    })
                }
            })
        }
    } else {
        ctx.body = {
            code: 504,
            desc: '账号激活失败，请联系管理员'
        }
    }
});
// 登出
router.get('/user/signOut', async (ctx) => {
    ctx.session.user = '';
    // console.log(ctx.session)
    ctx.body = {
        code: 200,
        desc: '注销成功'
    }
});
// 更新个人信息
router.post('/user/updateInfo', upload.single('file'), async (ctx) => {
    let { name, email, userSign, sex, phone, avatar } = ctx.req.body;
    let _avatar;
    if (avatar) {
        _avatar = avatar;
    }
    if (ctx.req.file) {
        _avatar = ctx.req.file.filename;
    }
    if (!ctx.req.file && !avatar) {
        _avatar = null;
    }
    const sign = userSign && userSign !== "undefined" ? userSign : null;
    await User.update({ email, sex, phone, avatar: _avatar, userSign: sign }, { where: { name } });
    // 更新之后，更新session
    await User.findOne({ where: { name } }).then(async res => {
        ctx.session.user = res.toJSON();
        ctx.body = {
            code: 200,
            desc: '保存成功',
        }
    }).catch(err => {
        ctx.body = {
            code: 504,
            desc: '保存失败',
            message: err.message
        }
    })
});
// 根据ID查找用户最新信息
router.get('/user/getInfo', async (ctx) => {
    await User.getUserById(ctx.request.query.id).then(async res => {
        const user = res.toJSON();
        ctx.session.user = user;
        ctx.body = {
            code: 200,
            data: user
        }
    }).catch(err => {
        ctx.body = {
            code: 504,
            desc: '账号激活失败，请联系管理员',
            message: err.message
        }
    })
});

module.exports = router;