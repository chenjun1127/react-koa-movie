/**
 * Created by ChenJun on 2018/12/24
 */
import React from 'react';
import Loading from "./common/Loading";
import Nav from "./common/Nav";
import Footer from "./common/Footer";
import axios from 'axios';
import {cookie} from "../utils/cookie";
import {Row, Col} from "antd";
import LightBox from './common/LightBox';
import MoviesComment from './movies/MoviesComment';
export default class MoviesDetail extends React.Component {
    state = {data: null}

    componentDidMount() {
        const locationId = cookie.get('defaultCity') && JSON.parse(cookie.get('defaultCity')).id;
        this.getDetail(this.props.match.params.id, locationId);
    }

    getDetail(id, locationId) {
        axios.get(`/api/movies/detail?movieId=${id}&locationId=${locationId}&t=${Date.now()}`).then(res => {
            if (res.data.code === 200) {
                const data = res.data.data.data.basic;
                this.setState({data})
            }
        })
    }

    render() {
        const {data} = this.state;
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
                            <Col span={8}>
                                <img src={data.img} className="main-movies-img"/>
                            </Col>
                            <Col span={16}>
                                <h1 className="m-title-1"> {data.name}</h1>
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
