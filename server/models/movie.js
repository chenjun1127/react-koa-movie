/**
 * Created by ChenJun on 2019/1/22
 */
const dayjs = require('dayjs');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("movie", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        movieId: {
            type: DataTypes.INTEGER,
            field: "movie_id",
            allowNull: false,
        },
        movieName: {
            type: DataTypes.STRING,
            field: "movie_name",
            allowNull: false
        },
        movieSummary: {
            type: DataTypes.TEXT,
            field: "movie_summary",
            allowNull: false
        },
        movieImg: {
            type: DataTypes.STRING,
            field: "movie_img",
            allowNull: false
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
        comment:'电影表'
    })
};