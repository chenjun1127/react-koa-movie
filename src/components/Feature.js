/**
 * Created by ChenJun on 2018/12/25
 */
import React from 'react';
import {Tabs} from 'antd';
import axios from 'axios';
import Nav from "./common/Nav";
import {Link} from 'react-router-dom';
import Loading from "./common/Loading";
import Footer from "./common/Footer";


export default class Feature extends React.Component {
    state = {data: null, index: 1}

    componentDidMount() {
        this.getFeatureMovies(1);
    }

    getFeatureMovies(page) {
        axios.get(`/koa-movie-api/movies/feature?feature_id=${this.props.match.params.id}&page=${page}&t=${Date.now()}`).then(res => {
            if (res.data.code === 200) {
                this.setState({data: res.data.data})
            }
        })
    }


    tabClick(key) {
        this.setState({index: parseInt(key)})
    }

    render() {
        const {data} = this.state;
        if (data) {
            let tabs;
            if (data.pagerSlide.length) {
                tabs = data.pagerSlide.map((item, index) => {
                    return (
                        <Tabs.TabPane tab={item} key={index + 1}>
                            <TabsContent {...this.props} index={this.state.index} data={this.state.data}/>
                        </Tabs.TabPane>
                    )
                })
            } else {
                tabs = (
                    <Tabs.TabPane tab="1-10" key={1}>
                        <TabsContent {...this.props} index={this.state.index} data={this.state.data}/>
                    </Tabs.TabPane>
                )
            }
            return (
                <div className="container">
                    <Nav history={this.props.history}/>
                    <div className="inner">
                        <h1 className="main-title">{data.mainTitle}</h1>
                    </div>
                    <div className="main-feature-bg">
                        <div className="inner">
                            <div className="mainInner" style={{margin: 0}}>
                                <div className="pre-desc">{data.desc}</div>
                                <Tabs defaultActiveKey="1" size="large" onTabClick={this.tabClick.bind(this)} className="feature-tabs">
                                    {tabs}
                                </Tabs>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>
            )
        } else {
            return <Loading/>
        }
    }
}


class TabsContent extends React.Component {
    state = {newData: null}

    componentDidMount() {
        if (this.props.index === 1) {
            this.setState({newData: this.props.data})
        } else {
            this.getFeatureMovies(this.props.index);
        }
    }

    getFeatureMovies(page) {
        axios.get(`/koa-movie-api/movies/feature?feature_id=${this.props.match.params.id}&page=${page}&t=${Date.now()}`).then(res => {
            if (res.data.code === 200) {
                this.setState({newData: res.data.data})
            }
        })
    }

    render() {
        const {newData} = this.state;
        const tabIndex = this.props.index;
        if (newData) {
            return newData.list.map((item, index) => {
                return (
                    <div className="list-feature" key={index + 1}>
                        <span className={tabIndex === 1 && index < 3 ? `circle color-${index + 1}` : 'circle'}>{index + 1 + (tabIndex - 1) * 10}</span>
                        <div className="list-con">
                            <Link to={`/movies/detail/${item.movieId}`}><img src={item.img}/></Link>
                            <div className="text-box">
                                <div className="m-title"><Link to={`/movies/detail/${item.movieId}`}>{item.title}</Link></div>
                                <div className="actors">导演：{item.director}</div>
                                {
                                    item.actors.length === 0 ? null : <div className="director">主演：{item.actors.join('  ')}</div>
                                }
                                <div className="m-desc">{item.content}</div>
                            </div>
                        </div>
                    </div>
                )
            })
        } else {
            return null
        }
    }
}