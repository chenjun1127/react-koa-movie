/**
 * Created by ChenJun on 2018/12/22
 */
const router = require('koa-router')();
const { sequelize } = require("../db");
const Collect = sequelize.import("../models/collect");
const Movie = sequelize.import("../models/movie");
router.post('/collect', async (ctx) => {
    const { movieId, userId } = ctx.request.body;
    await Movie.findOne({ where: { movieId: movieId } }).then(async movie => {
        if (movie) {
            await Collect.findOne({ where: { m_id: movie.id, user_id: userId } }).then(async collect => {
                if (!collect) {
                    await Collect.create({ status: 1, m_id: movie.id, movieId, userId: userId }).then(res => {
                        ctx.body = {
                            code: 200,
                            data: res.toJSON()
                        }
                    })
                } else {
                    await Collect.update({ status: collect.status === 1 ? 0 : 1 }, { where: { id: collect.id } });
                    await Collect.findByPk(collect.id).then(res => {
                        ctx.body = {
                            code: 200,
                            data: res.toJSON()
                        }
                    });
                }
            })
        } else {
            ctx.body = {
                code: 500,
                data: '电影数据获取失败'
            }
        }
    })
});
// 用户是否收藏了该电影
router.get('/collectByUser', async (ctx) => {
    const { movieId, userId } = ctx.request.query;
    if (userId) {
        await Collect.findOne({ where: { movieId, user_id: userId } }).then(async collect => {
            let status = collect ? collect.status : 0;
            ctx.body = {
                code: 200,
                data: { status }
            }
        })
    } else {
        ctx.body = {
            code: 200,
            data: { status: 0 }
        }
    }
});

module.exports = router;