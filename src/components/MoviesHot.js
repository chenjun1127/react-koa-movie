import React from 'react';
import Loading from "./common/Loading";
import Nav from "./common/Nav";
import Footer from "./common/Footer";
import {Pagination} from "antd";
import {cookie} from "../utils/cookie";
import axios from "axios";

export default class MoviesHot extends React.Component {
    state = {
        hotMoviesData: null,
        page: 1,
        pageSize: 12// 一页显示多少个
    }

    componentDidMount() {
        const moviesHotData = sessionStorage.getItem('moviesHotData');
        moviesHotData ? this.setState({hotMoviesData: JSON.parse(moviesHotData)}) : this.getMoviesHot();
    }

    getMoviesHot() {
        const locObj = cookie.get('defaultCity') && JSON.parse(cookie.get('defaultCity'));
        axios.get(`/api/movies/hot?locationId=${locObj.id}&t=${Date.now()}`).then(res => {
            res.data.code === 200 && this.setState({hotMoviesData: res.data.data});
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
                        <span className="movies-icon movies-icon-1"/>
                        <img src={item.img} className="movies-img"/>
                        <div className="movies-score">{item.r < 0 ? 0 : item.r}</div>
                        <div className="movies-text">{item.t}</div>
                    </a>
                </li>
            )
        })
    }

    onChange(index) {
        this.setState({page: index});
    }

    render() {
        const {hotMoviesData, page, pageSize} = this.state;
        if (!hotMoviesData) return <Loading/>;
        return (
            <div className="container">
                <Nav history={this.props.history}/>
                <div className="inner">
                    <div className="mainInner" style={{padding: '10px 15px 15px 15px'}}>
                        <div className="movies-list movies-list-more clearfix">
                            {this.createList(hotMoviesData.ms, page)}
                        </div>
                        <div className="pagination">
                            <Pagination pageSize={pageSize} total={hotMoviesData.ms.length} current={page} onChange={this.onChange.bind(this)}/>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}