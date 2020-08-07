/**
 * Created by ChenJun on 2019/1/21
 */
const dayjs = require('dayjs');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("follow", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        // 是否关注了 1是0否
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }, 
        userId: {
            type: DataTypes.INTEGER,
            field: 'user_id',
            allowNull: false,
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
        underscored: true,
        timestamps: false,
        comment: '关注表'
    })
};