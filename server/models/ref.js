/**
 * Created by ChenJun on 2019/1/2
 */
const {sequelize} = require("../db");
var User = sequelize.import("./user");
var Comment = sequelize.import("./comment");
var Praise = sequelize.import("./praise");

//建立模型之间关联关系

Comment.belongsTo(User);
User.hasMany(Comment);
Praise.belongsTo(User);
User.hasMany(Praise);
Praise.belongsTo(Comment);
Comment.hasMany(Praise);
//创建表
sequelize.sync({force: false});