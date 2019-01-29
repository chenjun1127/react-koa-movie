/**
 * Created by ChenJun on 2019/1/2
 */
const {sequelize} = require("../db");
var User = sequelize.import("./user");
var Comment = sequelize.import("./comment");
var Praise = sequelize.import("./praise");
var Collect = sequelize.import("./collect");
var Fans = sequelize.import("./fans");
var Follow = sequelize.import("./follow");
var Movie = sequelize.import("./movie");

//建立模型之间关联关系

Comment.belongsTo(User);
User.hasMany(Comment);

Praise.belongsTo(User);
User.hasMany(Praise);

Praise.belongsTo(Comment);
Comment.hasMany(Praise);

Praise.belongsTo(Movie,{as:'m'});
Movie.hasMany(Praise,{foreignKey:'m_id'});

Comment.belongsTo(Movie,{as:'m'});
Movie.hasMany(Comment,{foreignKey:'m_id'});

Collect.belongsTo(User);
User.hasMany(Collect);

Collect.belongsTo(Movie, {as: 'm'});
Movie.hasMany(Collect, {foreignKey: 'm_id'});
//
Fans.belongsTo(User);
User.hasMany(Fans);
//
Follow.belongsTo(User);
User.hasMany(Follow);
//创建表
sequelize.sync({force: false});