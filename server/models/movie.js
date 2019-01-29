/**
 * Created by ChenJun on 2019/1/22
 */

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
            type: DataTypes.STRING,
            field: "movie_summary",
            allowNull: false
        },
        movieImg: {
            type: DataTypes.STRING,
            field: "movie_img",
            allowNull: false
        },
        createTime: {
            type: DataTypes.STRING,
            field: "create_time",
            allowNull: false
        }
    }, {
        underscored: true,
        timestamps: false,
        comment:'电影表'
    })
};