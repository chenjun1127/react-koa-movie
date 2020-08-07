import React from 'react';
import Loading from "./common/Loading";
import Nav from "./common/Nav";
import Footer from "./common/Footer";
import {Pagination} from "antd";
import axios from "axios";
import {cookie} from "../utils/cookie";

export default class MoviesComing extends React.Component {
    state = {
        ComingMoviesData: null,
        page: 1,
        pageSize: 12// 一页显示多少个
    }

    componentDidMount() {
        const moviesComingData = sessionStorage.getItem('moviesComingData');
        moviesComingData ? this.setState({ComingMoviesData: JSON.parse(moviesComingData)}) : this.getMoviesComing();
    }

    getMoviesComing() {
        const locObj = cookie.get('defaultCity') && JSON.parse(cookie.get('defaultCity'));
        axios.get(`/koa-movie-api/movies/coming?locationId=${locObj.id}&t=${Date.now()}`).then(res => {
            res.data.code === 200 && this.setState({ComingMoviesData: res.data.data});
        })
    }

    createList(list, page) {
        const pageSize = this.state.pageSize;
        const _list = list.slice(pageSize * (page - 1), pageSize * (page - 1) + pageSize);
        return _list.map((item, i) => {
            return (
                <li key={i}>
                    <a className="movies-inner" onClick={() => {
                        this.props.history.push(`/movies/detail/${item.id}`)
                    }}>
                        <span className="movies-icon"/>
                        <img src={item.image ? item.image : require('../static/images/no-img.png')} className="movies-img"/>
                        <div className="movies-text">{item.title}</div>
                    </a>
                </li>
            )
        })
    }

    onChange(index) {
        this.setState({page: index});
    }

    render() {
        const {ComingMoviesData, page, pageSize} = this.state;
        if (!ComingMoviesData) return <Loading/>;
        return (
            <div className="container">
                <Nav history={this.props.history}/>
                <div className="inner">
                    <div className="mainInner" style={{padding: '10px 15px 15px 15px'}}>
                        <div className="movies-list movies-list-more clearfix">
                            {this.createList(ComingMoviesData.moviecomings, page)}
                        </div>
                        <div className="pagination">
                            <Pagination pageSize={pageSize} total={ComingMoviesData.moviecomings.length} current={page} onChange={this.onChange.bind(this)}/>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}