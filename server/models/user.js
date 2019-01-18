/**
 * Created by ChenJun on 2019/1/2
 */

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        name: {
            type: DataTypes.STRING,
            field: "name",
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sex: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        phone: {
            type: DataTypes.BIGINT(11),
            defaultValue: null,
        },
        avatar: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        userSign: {
            type: DataTypes.STRING,
            field: "user_sign",
            defaultValue: null,
        },
        active: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        createTime: {
            type: DataTypes.STRING,
            field: "create_time",
            allowNull: false
        }
    }, {
        underscored: true, //额外字段以下划线来分割
        // createdAt: "created_at",
        // updatedAt: "updated_at",
        timestamps: false, //取消默认生成的createdAt、updatedAt字段
        freezeTableName: false, // Model 对应的表名将与model名是否相同,false为在后面加s，为true则不会，将与model相同
        //classMethods与instanceMethods 注意：V4.x版本已经被移除
        comment: "用户信息类",

    });
    //静态方法
    User.getUserById = function (id) {
        return this.findById(id)
    };
    User.getUsers = function (options) {
        return this.findAll(options);
    };
    User.updateUserById = function (values, id) {
        return this.update(values, {
            where: {
                id: id
            }
        });
    };
    User.deleteById = function (id) {
        return this.destroy({
            where: {
                id: id
            }
        })
    };
    return User;
};
