/**
 * Created by ChenJun on 2019/1/22
 */
const router = require('koa-router')();
const { sequelize } = require("../db");
const User = sequelize.import("../models/user");
const Comment = sequelize.import("../models/comment");
const Collect = sequelize.import("../models/collect");
const Movie = sequelize.import("../models/movie");
const Follow = sequelize.import("../models/follow");
const Fans = sequelize.import("../models/fans");
// 获取用户信息
router.get('/main/getInfo', async ctx => {
    await User.getUserById(ctx.request.query.id).then(user => {
        if (user) {
            ctx.body = {
                code: 200,
                data: user.toJSON()
            }
        } else {
            ctx.body = {
                code: 500,
                desc: '未找到用户，请重新登录'
            }
        }
    })
});
// 收藏
router.get('/main/collect', async ctx => {
    const { userId, pageNo, pageSize } = ctx.request.query;
    await Collect.findAll({
        where: { user_id: userId, status: 1 },
        include: [{
            model: Movie,
            as: 'm',
            include: [Collect]
        }, {
            model: User,
            attributes: ['name', 'avatar', 'id']
        }],
        order: [
            ['createTime', 'DESC']
        ],
        offset: parseInt(((pageNo || 1) - 1) * (pageSize || 10)),
        limit: parseInt(pageSize || 10)
    }).then(collects => {
        ctx.body = {
            code: 200,
            data: collects
        }
    })
});
// 评论
router.get('/main/comment', async ctx => {
    const { userId, pageNo, pageSize } = ctx.request.query;
    await Comment.findAll({
        where: { user_id: userId },
        include: [{
            model: Movie,
            as: 'm',
            include: [Comment]
        }, {
            model: User,
            attributes: ['name', 'avatar', 'id']
        }],
        order: [
            ['createTime', 'DESC']
        ],
        offset: parseInt(((pageNo || 1) - 1) * (pageSize || 10)),
        limit: parseInt(pageSize || 10)
    }).then(comments => {
        ctx.body = {
            code: 200,
            data: comments
        }
    })
});
// 查看关注状态
router.get('/main/follow/status', async ctx => {
    const { userId, followId } = ctx.request.query;
    await Follow.findOne({ where: { userId, followed_user_id: followId } }).then(follow => {
        ctx.body = {
            code: 200,
            status: follow ? follow.status : 0,
        }
    })
})
// 关注操作
router.post('/main/follow/operate', async ctx => {
    const { userId, followId, type } = ctx.request.body;
    // console.log(JSON.stringify(ctx.request.body));
    if (type === 1) {
        // 已经关注了，取消关注,不成为某用户的粉丝
        await Follow.destroy({ where: { userId: userId, followed_user_id: followId } })
        await Fans.destroy({ where: { userId: followId, fans_user_id: userId } })
        await Fans.findOne({ where: { userId: userId, fans_user_id: followId } }).then(async fans => {
            if (fans) {
                // 互粉状态下，某用户取消关注了，就不是互粉了
                await Fans.update({ followStatus: 0 }, { where: { id: fans.id } });
            }
        })
        ctx.body = {
            code: 200,
        }

    } else {
        // 0为添加关注
        await Follow.create({ followed_user_id: followId, userId: userId, status: 1 });
        await Fans.create({ userId: followId, fans_user_id: userId, status: 1 });
        await Fans.findOne({ where: { userId: userId, fans_user_id: followId } }).then(async fans => {
            if (fans) {
                // 如果别人关注了我，此时再加关注，即为互相关注（互粉）
                await Fans.update({ followStatus: 1 }, { where: { id: fans.id } });
                await Fans.findOne({ where: { userId: followId, fans_user_id: userId } }).then(async fans => {
                    await Fans.update({ followStatus: 1 }, { where: { id: fans.id } });
                })
            }
        })
        ctx.body = {
            code: 200,
        }
    }
}); 
// 关注列表
router.get('/main/follow/list', async ctx => {
    // id为查找的主键，userId为当前登录用户
    const { id, userId, pageNo, pageSize, currentUserId } = ctx.request.query;
    // console.log(JSON.stringify(ctx.request.query));
    const list = await Follow.findAll({
        where: { userId: id },
        include: [{ model: User, as: 'followedUser', }],
        offset: parseInt(((pageNo || 1) - 1) * (pageSize || 10)),
        limit: parseInt(pageSize || 10),
    })
    // console.log(list);
    // 别人关注的人和当前登录的用户，是什么关系，别人关注的，我也关注了，需要告知前端，表示已关注
    if (list && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
            let result = await Follow.findOne({ where: { userId: userId, followed_user_id: list[i].followed_user_id } });
            // mongose查询出来的是文档对象，不是javascript对象，所以此处要用setDataValue来设置值
            list[i].setDataValue("withUserStatus", result ? 1 : 0);
        }
    }
    ctx.body = {
        code: 200,
        data: list || []
    }
});
// 粉丝列表(被多少人关注)
router.get('/main/fans/list', async ctx => {
    const { id, userId, pageNo, pageSize } = ctx.request.query;
    // console.log(JSON.stringify(ctx.request.query));
    const list = await Fans.findAll({
        where: { userId: id, },
        include: [{
            model: User,
            as: 'fansUser',
        }],
        offset: parseInt(((pageNo || 1) - 1) * (pageSize || 10)),
        limit: parseInt(pageSize || 10)
    })
    if (list && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
            let result = await Follow.findOne({ where: { userId: userId, followed_user_id: list[i].fans_user_id } });
            // mongose查询出来的是文档对象，不是javascript对象，所以此处要用setDataValue来设置值
            list[i].setDataValue("withUserStatus", result ? 1 : 0);
        }
    }
    ctx.body = {
        code: 200,
        data: list || []
    }
});
// 评论
router.get('/main/comment', async ctx => {
    const { userId } = ctx.request.query;
    await Comment.findAll({
        where: { user_id: userId },
        order: [
            ['create_time', 'DESC']
        ]
    }).then(comments => {
        ctx.body = {
            code: 200,
            data: comments
        }
    })
});


module.exports = router;