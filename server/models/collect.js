/**
 * Created by ChenJun on 2019/1/21
 */

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
            type: DataTypes.STRING,
            field: "create_time",
            allowNull: false
        }
    },{
        underscored: true,
        timestamps: false,
        comment:'收藏表'
    })
};