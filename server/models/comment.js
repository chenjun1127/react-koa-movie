/**
 * Created by ChenJun on 2019/1/3
 */
const dayjs = require('dayjs');
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
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
            type: DataTypes.STRING,
            field: "content",
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER, // 该评论是否被某用户点赞过
            field: "status",
            defaultValue: 0,
        },
        createTime: {
            type: Sequelize.DATE,
            field: "create_time",
            defaultValue: Sequelize.NOW,
            get() {
                return dayjs(this.getDataValue('createTime')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }, {
        underscored: true, //额外字段以下划线来分割
        timestamps: false, //取消默认生成的createdAt、updatedAt字段
        freezeTableName: false, // Model 对应的表名将与model名是否相同,false为在后面加s，为true则不会，将与model相同
        comment: '评论表'
    })
}