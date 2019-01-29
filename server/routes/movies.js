/**
 * Created by ChenJun on 2018/12/22
 */
const router = require('koa-router')();
const API = require('../API/config.js');
const koa2Req = require('koa2-request');
const cheerio = require('cheerio');
const {sequelize} = require("../db");
const Movie = sequelize.import("../models/movie");
const dayjs = require('dayjs');
router.get('/movies/hot', async (ctx) => {
    const locationId = ctx.query.locationId;
    const res = await koa2Req(API.moviesHot + '?locationId=' + locationId, {json: true});
    ctx.body = {
        code: 200,
        data: res.body
    };
});

router.get('/movies/coming', async (ctx) => {
    const locationId = ctx.query.locationId;
    const res = await koa2Req(API.moviesCome + '?locationId=' + locationId, {json: true});
    ctx.body = {
        code: 200,
        data: res.body
    };
});

router.get('/movies/featureMovies', async (ctx) => {
    const res = await koa2Req('http://www.mtime.com/');
    const $ = cheerio.load(res.body);
    const list = $(".mlist").find("ul").children();
    const dataArr = [];
    let api_host = '';
    list.each((index, item) => {
        var smallArr = [], total = 0;
        const dt = $(item).find('dt');
        const img = dt.find('img');
        const a = dt.find('a');
        const text = img.attr('alt');
        const bigImg = img.data('src');
        const dd = $(item).find('dd');
        const link = a.attr('href');
        const f = link.search(/\d/);
        const t = link.lastIndexOf('.');
        api_host = link.substr(0, f);
        const id = link.substring(f, t);
        dd.each((i, t) => {
            if (i === dd.length - 1) total = $(t).find('i').text();
            smallArr.push($(t).find('img').data('src'));
        });
        dataArr.push({
            bigImg,
            text,
            smallImg: smallArr,
            link,
            feature_id: parseInt(id),
            total: parseInt(total)
        });
    });
    ctx.session.api_host = api_host;
    ctx.body = {
        code: 200,
        data: dataArr,
        desc: '特色电影'
    };
});

router.get('/movies/feature', async (ctx) => {
    const {feature_id, page} = ctx.query;
    const api_host = ctx.session.api_host;
    if (api_host) {
        ctx.body = {
            code: 200,
            data: await cheerioData(api_host, feature_id, page)
        };
    } else {
        ctx.body = {
            code: 500,
            data: '服务器出错了，请稍后再试...'
        };
    }

    async function cheerioData(api_host, feature_id, page) {
        const url = parseInt(page) > 1 ? `${feature_id}-${page}.html` : `${feature_id}.html`;
        const res = await koa2Req(`${api_host}${url}`);
        const $ = cheerio.load(res.body);
        const $list = $(".top_nlist").find('dl').children();
        let list = [];
        const desc = $(".top_title").text();
        const mainTitle = $(".top_header").find('h2').text();
        const $pagerSlide = $("#pagerSlide").children();
        let pagerSlide = [];
        $pagerSlide.each((i, t) => {
            pagerSlide.push($(t).find('a').text())
        });
        $list.each((index, item) => {
            const img = $(item).find('img').attr('src');
            const title = $(item).find('img').attr('alt');
            const director = $(item).find('.mt12').first().find('a').text();
            const actorDom = $(item).find('.mt3').find('a');
            const content = $(item).find('.mt12').last().text();
            const movieId = $(item).find('h3').find('a').attr('href').replace(/\D/g, '');
            let actors = [];
            actorDom.each((i, t) => {
                actors.push($(t).text())
            });
            list.push({img, title, director, actors, content, movieId})
        });
        return {mainTitle, desc, list, pagerSlide}
    }
});

router.get('/movies/award', async (ctx) => {
    const {url, page} = ctx.query;
    const newUrl = parseInt(page) > 1 ? `http://award.mtime.com${url}index-${page}.html` : `http://award.mtime.com${url}`;
    if (newUrl) {
        ctx.body = {
            code: 200,
            data: await cheerioData(newUrl)
        };
    } else {
        ctx.body = {
            code: 500,
            data: '服务器出错了，请稍后再试...'
        };
    }

    async function cheerioData(url) {
        const res = await koa2Req(`${url}`);
        const $ = cheerio.load(res.body);
        let mainTitleArr = [];
        let list = [];
        $(".event_list>dl>dt").each((i, t) => {
            mainTitleArr.push($(t).text())
        });
        const mainTitle = $(".award_head").find('h3').find('a').text();
        $(".event_list>dl>dd").each((i, t) => {
            let title = $(t).find(".yellowbox").find('dt').find('a').attr('title');
            let img = $(t).find(".yellowbox").find('dt').find('img').attr('src');
            let movieId = $(t).find(".yellowbox").find('dd').find('a').attr('href').replace(/\D/g, '');
            let subList = [];
            $(t).find(".bluebox").find('dl').each((i, s) => {
                subList.push({
                    title: $(s).find('dt').find('a').attr('title'),
                    img: $(s).find('dt').find('img').attr('src'),
                    movieId: $(s).find('dd').find('a').attr('href').replace(/\D/g, '')
                })
            });
            list.push({
                awardTitle: mainTitleArr[i],
                win: {title, img, movieId},
                nominee: subList
            })
        });
        return {mainTitle, list, totalPage: $(".pagenav a").length - 2}
    }
});
// 电影详情
router.get('/movies/detail', async (ctx) => {
    const {movieId, locationId} = ctx.query;
    const res = await koa2Req(`${API.moviesDetail}?locationId=${locationId}&movieId=${movieId}`, {json: true});
    ctx.body = {
        code: 200,
        data: res.body
    };
});
// 电影保存
router.post('/movies/save', async (ctx) => {
    const {movieId} = ctx.request.body;
    const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    await Movie.findOne({where: {movieId}}).then(async movie => {
        if (!movie) {
            await Movie.create(Object.assign({}, ctx.request.body, {createTime})).then(() => {
                    ctx.body = {
                        code: 200
                    }
                }
            ).catch(err => {
                ctx.body = {
                    code: 500,
                    data: err.message
                }
            })
        } else {
            ctx.body = {
                code: 200
            }
        }
    })
});

module.exports = router;
