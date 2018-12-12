/**
 * Created by jone-chen on 2018/1/16
 * @Description 邮件发送
 * 调用方法:sendMail('amor_zhang@qq.com','这是测试邮件', 'Hi Amor,这是一封测试邮件');
 */
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const config = require('./mail.config');

const SmtpTransport = nodemailer.createTransport(smtpTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
}));

const sendMail = async (recipient, subject, html) => {
    return await SmtpTransport.sendMail({
        from: config.email.user,
        to: recipient,
        subject: subject,
        html: html
    })
}

module.exports = sendMail;
