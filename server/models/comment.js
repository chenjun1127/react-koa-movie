/**
 * Created by ChenJun on 2019/1/3
 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("comment", {
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
        rate: {
            type: DataTypes.INTEGER,
            field: "rate",
            allowNull: false
        },
        content: {
            type: DataTypes.STRING(100),
            field: "content",
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            field: "status",
            defaultValue: 0,
        },
        count: {
            type: DataTypes.INTEGER,
            field: "count",
            defaultValue: 0,
        },
        createTime: {
            type: DataTypes.STRING,
            field: "create_time",
            allowNull: false
        }
    }, {
        underscored: true, //额外字段以下划线来分割
        timestamps: false, //取消默认生成的createdAt、updatedAt字段
        freezeTableName: false, // Model 对应的表名将与model名是否相同,false为在后面加s，为true则不会，将与model相同
        comment:'评论表'
    })
}