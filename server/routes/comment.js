/**
 * Created by ChenJun on 2019/1/2
 */

const router = require('koa-router')();
const { sequelize } = require("../db");
const Comment = sequelize.import("../models/comment");
const User = sequelize.import("../models/user");
const Praise = sequelize.import("../models/praise");
const Movie = sequelize.import("../models/movie");
// 评论
router.post('/comment', async (ctx) => {
    const { userId, movieId } = ctx.request.body;
    await Movie.findOne({ where: { movieId: movieId } }).then(async movie => {
        if (movie) {
            await Comment.create(Object.assign({}, ctx.request.body, { user_id: userId, m_id: movie.id })).then(() => {
                ctx.body = {
                    code: 200
                }
            }).catch(err => {
                ctx.body = {
                    code: 500,
                    desc: err.message
                }
            })
        } else {
            ctx.body = {
                code: 500,
                data: '电影数据获取失败'
            }
        }
    });
});
// 点赞，一个电影每个用户只能点赞一次
router.get('/comment/praise', async (ctx) => {
    const { commentId, userId, movieId } = ctx.request.query;
    await Movie.findOne({ where: { movieId: movieId } }).then(async movie => {
        if (movie) {
            await Praise.findOne({ where: { comment_id: commentId, user_id: userId, movieId } }).then(async praise => {
                if (!praise) {
                    // console.log("没有找到用户" + userId + '的赞')
                    await Praise.create({ movieId, userId: userId, commentId: commentId, m_id: movie.id });
                    ctx.body = {
                        code: 200
                    }
                } else {
                    // console.log("有找到用户" + userId + '的赞')
                    await Comment.findByPk(commentId).then(async comment => {
                        await Praise.destroy({ where: { commentId: commentId, user_id: userId } }).then(() => {
                            ctx.body = {
                                code: 200
                            }
                        })
                    });
                }
            })
        } else {
            ctx.body = {
                code: 500,
                data: '电影数据获取失败'
            }
        }
    });
});
// 获取所有评论
router.get('/comment/all', async (ctx) => {
    const { pageNo, pageSize, movieId } = ctx.request.query;
    await Comment.findAll({
        where: { movieId },
        include: [{
            model: User,
            attributes: ['name', 'avatar', 'id']
        }, {
            model: Praise
        }],
        order: [
            ['create_time', 'DESC'] // 降序
        ],
        offset: parseInt(((pageNo || 1) - 1) * (pageSize || 10)),
        limit: parseInt(pageSize || 10)
    }).then(res => {
        ctx.body = {
            code: 200,
            data: res
        }
    })
});

module.exports = router;