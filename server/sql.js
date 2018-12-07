/**
 * Created by ChenJun on 2018/12/5
 */
const query = require('./db');

// 注册用户
const insertUser = value => {
    let _sql = "insert into users(name,password,email,create_time) values(?,?,?,?);";
    return query(_sql, value);
}
// 删除用户
const deleteUser = name => {
    let _sql = `delete from users where name="${name}";`
    return query(_sql)
}
// 更新用户密码
const updateUserPassword = value => {
    let _sql = `update users set password=? where name=?`
    return query(_sql, value)
}
const updateUserActive = (value) => {
    let _sql = `update users set active=? where name=?`
    return query(_sql,value)
}

// 更新用户信息
const updateUser = value => {
    let _sql = "update users set email=?,avatar=?,phone=?,role=? where name=?;"
    return query(_sql, value)
}
// 查找用户
const findUser = name => {
    let _sql = `select * from users where name="${name}";`
    return query(_sql)
}


module.exports = {
    insertUser,
    deleteUser,
    updateUserActive,
    updateUserPassword,
    findUser,
    updateUser
}