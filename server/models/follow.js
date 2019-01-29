/**
 * Created by ChenJun on 2019/1/21
 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("follow", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        followStatus: {
            type: DataTypes.INTEGER,
            field: "follow_status",
            allowNull: false,
            defaultValue: 0
        },
        followUserId: {
            type: DataTypes.INTEGER,
            field: "follow_user_id",
            allowNull: false,
        }
    }, {
        underscored: true,
        timestamps: false,
        comment: '关注表'
    })
};