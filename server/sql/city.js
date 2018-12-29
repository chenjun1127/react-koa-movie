/**
 * Created by ChenJun on 2018/12/21
 */
const query = require('../db');

const findAllCity = () => {
    let _sql = `select * from cities`
    return query(_sql)
}
// 注册用户
const insertCity = value => {
    let _sql = "insert into cities(locationId,n,count,pinyinFull,pinyinShort) values(?,?,?,?,?);";
    return query(_sql, value);
}



module.exports = {
    findAllCity,
    insertCity,

}