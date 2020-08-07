/**
 * Created by ChenJun on 2018/12/25
 */
import React from 'react';
import {Pagination} from 'antd';
import axios from 'axios';
import Nav from "./common/Nav";
import {Link} from 'react-router-dom';
import Loading from "./common/Loading";
import Footer from "./common/Footer";


export default class Award extends React.Component {
    state = {data: null, url: null,page:1}

    componentDidMount() {
        let search = this.props.location.search.split("=")[1];
        let page = this.props.match.params.id;
        this.setState({url:search,page});
        this.getFeatureMovies(search, page);


    }

    getFeatureMovies(url, page) {
        axios.get(`/koa-movie-api/movies/award?url=${url}&page=${page}&t=${Date.now()}`).then(res => {
            if (res.data.code === 200) {
                this.setState({data: res.data.data})
            }
        })
    }


    onChange(index) {
        this.getFeatureMovies(this.state.url, index);
        this.setState({page:index});
        this.props.history.push(`/movies/award/${index}?url=${this.state.url}`);
    }

    render() {
        const {data} = this.state;
        if (data && data.list.length) {
            return (
                <div className="container">
                    <Nav history={this.props.history}/>
                    <div className="inner">
                        <h1 className="main-title">{data.mainTitle}</h1>
                    </div>
                    <div className="main-feature-bg">
                        <div className="inner">
                            <div className="mainInner" style={{margin: 0}}>
                                <AwardContent {...this.props} data={this.state.data} index={this.state.page} onChange={this.onChange.bind(this)}/>
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


class AwardContent extends React.Component {
    render() {
        const newData = this.props.data;
        const index = parseInt(this.props.index);
        if (newData && newData.list.length) {
            return (
                <div>
                    {
                        newData.list.map((item, index) => {
                            return (
                                <div className="list-feature" key={index + 1}>
                                    <div className="award-title">{item.awardTitle}</div>
                                    <dl className="award-content">
                                        <dt>
                                            <h1>获奖</h1>
                                            <div>
                                                <Link to={`/movies/detail/${item.win.movieId}`}>
                                                    <img src={item.win.img}/>
                                                    <p className="nominee-title">{item.win.title}</p>
                                                </Link>
                                            </div>
                                        </dt>
                                        {
                                            item.nominee.length ?
                                                <dd>
                                                    <h1>提名</h1>
                                                    <div>
                                                        {
                                                            item.nominee.map((t, i) => {
                                                                return (
                                                                    <Link key={i} to={`/movies/detail/${t.movieId}`}>
                                                                        <img src={t.img}/>
                                                                        <p className="nominee-title">{t.title}</p>
                                                                    </Link>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </dd> : null
                                        }
                                    </dl>
                                </div>
                            )
                        })
                    }
                    <div className="pagination">
                        <Pagination  pageSize={10} total={newData.totalPage * 10} current={index} onChange={this.props.onChange}/>
                    </div>

                </div>
            )
        } else {
            return null
        }
    }
}