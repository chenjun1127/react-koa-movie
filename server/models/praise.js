/**
 * Created by ChenJun on 2019/1/3
 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("praise", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        movieId: {
            type: DataTypes.INTEGER,
            field: "movie_id",
            allowNull: false
        },
        createTime:{
            type: DataTypes.STRING,
            field: "create_time",
            allowNull: false
        }
    },{
        underscored: true, //额外字段以下划线来分割
        // createdAt: "created_at",
        // updatedAt: "updated_at",
        timestamps: false, //取消默认生成的createdAt、updatedAt字段
        freezeTableName: false, // Model 对应的表名将与model名是否相同,false为在后面加s，为true则不会，将与model相同
        //classMethods与instanceMethods 注意：V4.x版本已经被移除
        comment: "点赞表",
    })
}