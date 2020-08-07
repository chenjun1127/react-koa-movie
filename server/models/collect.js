/**
 * Created by ChenJun on 2019/1/21
 */
const dayjs = require('dayjs');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("collect", {
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
        status: {
            type: DataTypes.INTEGER,
            field: "status",
            allowNull: false,
            defaultValue: 0
        },
        createTime: {
            type: Sequelize.DATE,
            field: "create_time",
            defaultValue: Sequelize.NOW,
            get() {
                return dayjs(this.getDataValue('createTime')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            field: "user_id",
            allowNull: false
        }
    }, {
        underscored: true,
        timestamps: false,
        comment: '收藏表'
    })
};