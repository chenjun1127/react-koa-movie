/**
 * Created by ChenJun on 2019/1/2
 */

const router = require('koa-router')();
const { sequelize } = require("../db");
const Comment = sequelize.import("../models/comment");
const User = sequelize.import("../models/user");
const Praise = sequelize.import("../models/praise");
const dayjs = require('dayjs');
// 评论
router.post('/comment', async(ctx) => {
    const { userId } = ctx.request.body;
    const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    await Comment.create(Object.assign({}, ctx.request.body, { createTime, user_id: userId })).then(() => {
        ctx.body = {
            code: 200
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            desc: err.message
        }
    })
});
// 点赞，一个电影每个用户只能点赞一次
router.get('/comment/praise', async(ctx) => {
    const { commentId, userId, movieId } = ctx.request.query;
    const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    await Praise.findOne({ where: { comment_id: commentId, user_id: userId } }).then(async praise => {
        if (!praise) {
            // console.log("没有找到用户" + userId + '的赞')
            await Praise.create({ movieId, createTime, user_id: userId, comment_id: commentId });
            await Comment.findById(commentId).then(async comment => {
                let count = comment.count;
                count += 1;
                await Comment.update({ status: 1, count }, { where: { id: commentId } }).then(res => {
                    ctx.body = {
                        code: 200
                    }
                })
            })
        } else {
            // console.log("有找到用户" + userId + '的赞')
            await Comment.findById(commentId).then(async comment => {
                let count = comment.count;
                count -= 1;
                await Comment.update({ status: 0, count }, { where: { id: commentId } });
                await Praise.destroy({ where: { comment_id: commentId, user_id: userId } }).then(res => {
                    ctx.body = {
                        code: 200
                    }
                })
            });
        }
    })
});
// 获取所有评论
router.get('/comment/all', async(ctx) => {
    await Comment.findAll({
        where: { movieId: ctx.request.query.movieId },
        include: [{
            model: User,
            attributes: ['name', 'avatar', 'id']
        }, {
            model: Praise
        }],
        order: [
            ['create_time', 'DESC'] // 降序
        ]
    }).then(res => {
        ctx.body = {
            code: 200,
            data: res
        }
    })
})

module.exports = router;