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

export default class MoviesDetail extends React.Component {
    state = {data: null}

    componentDidMount() {
        const locationId = cookie.get('defaultCity') && JSON.parse(cookie.get('defaultCity')).id;
        this.getDetail(this.props.match.params.id, locationId);
    }

    getDetail(id, locationId) {
        axios.get(`/api/movies/detail?movieId=${id}&locationId=${locationId}&t=${Date.now()}`).then(res => {
            console.log(res);
            if (res.data.code === 200) {
                const data = res.data.data.data.basic;
                console.log(data);
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
                                {data.stageImg.list.length ? <MoviesImg data={data} movieId={this.props.match.params.id}/> : null}
                            </Col>
                        </Row>

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

class LightBox extends React.Component {
    state = {visible: false, currentIndex: 0}

    handleClick(index) {
        this.setState({visible: true, currentIndex: index});
    }

    handlePrev(index) {
        index--;
        if (index < 0) {
            index = this.props.images.length - 1
        }
        this.refs.ol.style.left = '-' + 100 * index + '%';
    }

    handleNext(index) {
        console.log(window.innerHeight)
        index++;
        if (index > this.props.images.length - 1) {
            index = 0
        }
        this.refs.ol.style.left = '-' + 100 * index + '%';
    }

    cancel() {
        this.setState({visible: false})
    }

    renderModalImage() {
        const {images, showTitle, loop} = this.props;
        const {visible, currentIndex} = this.state;
        const w = images.length * 100;
        const li_w = 100 / images.length;
        const imgList = images.map((item, index) => {
            if (images.length === 1) {
                return (
                    <li key={index} style={{width: `${li_w}%`}}>
                        <div>
                            <img src={item.imgUrl} alt={item.imgId}/>
                            {showTitle ? <p>{index},{item.imgId}</p> : null}
                        </div>
                    </li>
                )
            } else {
                return (
                    <li key={index} style={{width: `${li_w}%`}}>
                        <div>
                            <img src={item.imgUrl} alt={item.imgId} />
                            {showTitle ? <p>{index},{item.imgId}</p> : null}
                        </div>
                        {
                            !loop && index === 0 ? null :
                                <span className="prev" onClick={this.handlePrev.bind(this, index)}>
                                    <svg>
                                        <use xlinkHref={`#icon-arrow-l`}/>
                                    </svg>
                                </span>
                        }
                        {
                            !loop && index === images.length - 1 ? null :
                                <span className="next" onClick={this.handleNext.bind(this, index)}>
                                    <svg>
                                        <use xlinkHref={`#icon-arrow-r`}/>
                                    </svg>
                                </span>
                        }
                    </li>
                )
            }
        });
        return (
            <div className={visible ? 'light-box-mask show' : 'light-box-mask'}>
                <div className="light-box-content">
                    <span className="light-box-close" onClick={this.cancel.bind(this)}>&times;</span>
                    <ol style={{position: 'absolute', left: `-${currentIndex * 100}%`, top: 0, height: '100%', width: `${w}%`}} ref="ol">
                        {imgList}
                    </ol>
                </div>
            </div>
        )
    }

    render() {
        return (
            <ul className="img-list">
                {
                    this.props.images.map((item, index) => {
                        return (
                            <li key={index}><a href="javascript:void(0)" onClick={this.handleClick.bind(this, index)} style={{backgroundImage: `url(${item.imgUrl})`}}><img
                                src={item.imgUrl}/></a></li>
                        )
                    })
                }
                {this.renderModalImage()}
            </ul>
        )
    }
}