/**
 * Created by ChenJun on 2019/1/22
 */
const router = require('koa-router')();
const {sequelize} = require("../db");
const User = sequelize.import("../models/user");
const Comment = sequelize.import("../models/comment");
const Collect = sequelize.import("../models/collect");
const Movie = sequelize.import("../models/movie");
const Follow = sequelize.import("../models/follow");
const Fans = sequelize.import("../models/fans");
// 获取用户信息
router.get('/main/getInfo', async ctx => {
    await User.findById(ctx.request.query.id).then(user => {
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
    const {userId, pageNo, pageSize} = ctx.request.query;
    await Collect.findAll({
        where: {user_id: userId, status: 1},
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
    const {userId, pageNo, pageSize} = ctx.request.query;
    await Comment.findAll({
        where: {user_id: userId},
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
// 关注
router.post('/main/followStatus', async ctx => {
    const {userId, followId, type} = ctx.request.body;
    console.log(ctx.request.body,type)
    await Follow.findOne({where: {user_id: followId, follow_user_id: userId}}).then(async follow => {

        if (!follow) {
            if (type === 1) {
                await Follow.create({user_id: followId, followUserId: userId, followStatus: 1});
                await Fans.create({user_id: userId, fansUserId: followId, followStatus: 1,fansStatus: 0});
                await Follow.findOne({where: {user_id: followId, followUserId: userId}}).then((follow) => {
                    ctx.body = {
                        code: 200,
                        status: follow.followStatus
                    }
                })
            } else if(type===2){
                console.log('111粉丝');
                await Fans.findOne({where: {user_id: followId, fansUserId: userId}}).then(async (fans) => {
                    await Fans.update({fansStatus: fans.fansStatus === 1 ? 0 : 1}, {where: {id:fans.id}});
                });
                await Follow.findOne({where: {user_id: followId, follow_user_id: userId}}).then(async follow => {
                    if(!follow){
                        await Follow.create({user_id: followId, followUserId: userId, followStatus: 1});
                        await Fans.create({user_id: userId, fansUserId: followId, followStatus: 1,fansStatus: 1});
                    }else{
                        await Follow.update({followStatus: follow.followStatus === 1 ? 0 : 1}, {where: {id: follow.id}});
                    }
                    ctx.body = {
                        code: 200,

                    }
                })


            }else {
                ctx.body = {
                    code: 200,
                    status: 0
                }
            }
        } else {
            if (type === 1) {

                await Follow.update({followStatus: follow.followStatus === 1 ? 0 : 1}, {where: {id: follow.id}});
                // console.log(follow.followStatus,{user_id: followId, fansUserId: userId})
                // await Fans.update({status: follow.status === 1 ? 0 : 1}, {where: {user_id: userId, fansUserId: followId}});

                await Fans.update({fansStatus: follow.followStatus === 1 ? 0 : 1}, {where: {user_id: userId, fansUserId: followId}});
            }else if(type===2){
                console.log('222粉丝');
                // await Fans.update({fansStatus: follow.fansStatus === 1 ? 0 : 1}, {where: {user_id: userId, fansUserId: followId}});
            }
            await Follow.findById(follow.id).then((follow) => {
                ctx.body = {
                    code: 200,
                    status: follow.followStatus
                }
            })
        }
    })
});

// 关注
router.get('/main/follow', async ctx => {
    const {userId, pageNo, pageSize} = ctx.request.query;
    await Follow.findAll({
        where: {followUserId: userId},
        include: User,
        offset: parseInt(((pageNo || 1) - 1) * (pageSize || 10)),
        limit: parseInt(pageSize || 10)
    }).then(follow => {
        ctx.body = {
            code: 200,
            data: follow
        }
    })

});
// 粉丝(被多少人关注)
router.get('/main/fans', async ctx => {
    const {userId, pageNo, pageSize} = ctx.request.query;
    await Fans.findAll({
        where: {fansUserId: userId,followStatus:1},
        include: User,
        offset: parseInt(((pageNo || 1) - 1) * (pageSize || 10)),
        limit: parseInt(pageSize || 10)
    }).then(fans => {
        ctx.body = {
            code: 200,
            data: fans
        }
    })
});
// 评论
router.get('/main/comment', async ctx => {
    const {userId} = ctx.request.query;
    await Comment.findAll({
        where: {user_id: userId},
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