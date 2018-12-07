/**
 * Created by ChenJun on 2018/12/6
 */

const hash = {
    'qq.com': 'mail.qq.com',
    'vip.qq.com': 'mail.qq.com',
    'gmail.com': 'mail.google.com',
    'sina.com': 'mail.sina.com.cn',
    '163.com': 'mail.163.com',
    '126.com': 'mail.126.com',
    'yeah.net': 'www.yeah.net/',
    'sohu.com': 'mail.sohu.com/',
    'tom.com': 'mail.tom.com/',
    'sogou.com': 'mail.sogou.com/',
    '139.com': 'mail.10086.cn/',
    'hotmail.com': 'www.hotmail.com',
    'live.com': 'login.live.com/',
    'live.cn': 'login.live.cn/',
    'live.com.cn': 'login.live.com.cn',
    '189.com': 'webmail16.189.cn/webmail/',
    'yahoo.com.cn': 'mail.cn.yahoo.com/',
    'yahoo.cn': 'mail.cn.yahoo.com/',
    'eyou.com': 'www.eyou.com/',
    '21cn.com': 'mail.21cn.com/',
    '188.com': 'www.188.com/',
    'foxmail.coom': 'mail.qq.com/'
}

const goToEmail = (text) => {
    for (let i in hash) {
        if (i === text) {
            return hash[i]
        }
    }
}

export default goToEmail;