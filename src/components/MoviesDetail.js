/**
 * Created by ChenJun on 2018/12/24
 */
import React from 'react';
import Loading from "./common/Loading";
import Nav from "./common/Nav";
import Footer from "./common/Footer";
import axios from 'axios';
import {cookie} from "../utils/cookie";
import {Row, Col, message} from "antd";
import LightBox from './common/LightBox';
import MoviesComment from './movies/MoviesComment';
import {inject, observer} from "mobx-react";

@inject(['operate'], ['userInfo'])
@observer
export default class MoviesDetail extends React.Component {
    state = {data: null};

    componentDidMount() {
        const locationId = cookie.get('defaultCity') && JSON.parse(cookie.get('defaultCity')).id;
        this.getDetail(this.props.match.params.id, locationId);
        sessionStorage.setItem('movieId', this.props.match.params.id);
        this.getCollectByUser();
    }

    getDetail(id, locationId) {
        axios.get(`/koa-movie-api/movies/detail?movieId=${id}&locationId=${locationId}&t=${Date.now()}`).then(res => {
            if (res.data.code === 200) {
                const data = res.data.data.data.basic;
                this.saveMovie(data);
                this.setState({data})
            }
        })
    }

    saveMovie(data) {
        axios.post('/koa-movie-api/movies/save', {
            movieId: parseInt(this.props.match.params.id),
            movieName: data.name,
            movieImg: data.img,
            movieSummary: data.story,
        }).then(res => {
            if (res.data.code !== 200) {
                message.error(res.data.data, 1);
            }
        })
    }


    setCollect() {
        const isLogin = cookie.get('isLogin');
        const userId = parseInt(cookie.get('userId'));
        if (!isLogin) {
            this.props.operate.setType({text: '登录', type: 1});
            this.props.operate.setVisible(true);
            return;
        }
        axios.post('/koa-movie-api/collect', {
            movieId: parseInt(this.props.match.params.id),
            userId
        }).then(res => {
            if (res.data.code === 200) {
                this.props.operate.setStatus(res.data.data.status);
            }
        })
    }

    getCollectByUser() {
        const isLogin = cookie.get('isLogin');
        const movieId = parseInt(this.props.match.params.id);
        const userId = parseInt(cookie.get('userId'));
        isLogin && this.props.operate.setStatus({movieId, userId});
    }

    render() {
        const {data} = this.state;
        const {status} = this.props.operate;
        if (!data) return <Loading/>;
        const actors = data.actors.map((item) => {
            if (item.name) {
                return item.name + " "
            }
        });
        return (
            <div className="container">
                <Nav history={this.props.history}/>
                <div className="inner">
                    <div className="mainInner" style={{padding: '15px'}}>
                        <Row gutter={15}>
                            <Col span={8} className="movies-pic">
                                <img src={data.img} className="main-movies-img"/>
                                <div className="floatTips">
                                    <svg onClick={this.setCollect.bind(this)} className={status === 1 ? 'active' : ''}>
                                        <use xlinkHref="#icon-xihuan"/>
                                    </svg>
                                </div>
                            </Col>
                            <Col span={16}>
                                <h1 className="m-title-1">{data.name}</h1>
                                <h2 className="m-title-2">{data.nameEn}</h2>
                                <h3 className="m-title-3">{data.mins} - {data.releaseDate.replace(/(\d{4})(\d{2})(\d{2})/g, "$1年$2月$3日")} - {data.releaseArea} - {data.is3D ? '3D' : '2D'}</h3>
                                <div className="m-title">导演：{data.director.name}</div>
                                {actors.length ? <div className="m-title">主演：{actors}</div> : null}
                                <div className="m-title">类型：{data.type.join(' ')}</div>
                                <div className="m-title summary">简介：{data.story}</div>
                                {data.stageImg.list.length && <MoviesImg data={data}/>}
                            </Col>
                        </Row>
                        <div className="public-title">影评</div>
                        <MoviesComment {...this.props}/>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}


class MoviesImg extends React.Component {
    render() {
        const {data} = this.props;
        return (
            <div>
                <h1 className="video-title"><span>{data.stageImg.list.length}</span>个剧照</h1>
                <LightBox images={data.stageImg.list} loop={true}/>
            </div>
        )
    }
}
