/**
 * Created by ChenJun on 2018/12/21
 */

import React from 'react';
import {axios} from 'axios';
import {Carousel} from 'antd';

export default class HotMovies extends React.Component {
    createList(list, index) {
        const _list = list.slice(4 * (index - 1), 4 * (index - 1) + 4);
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

    handleNavigator() {
        sessionStorage.setItem('moviesHotData',JSON.stringify(this.props.moviesHotData));
        this.props.history.push('/movies/hot');
    }

    render() {
        const {moviesHotData} = this.props;
        if (moviesHotData) {
            const arr = [1, 2, 3, 4];
            const list = arr.map((item, index) => {
                return (
                    <div className="movies-list" key={index + 1}>
                        {this.createList(moviesHotData.ms, index + 1)}
                    </div>
                )
            });
            return (
                <div>
                    <Carousel autoplay className="carousel-box" dotsClass="movies-dots">
                        {list}
                    </Carousel>
                    <div className="movies-more">
                        <a href="javascript:void(0);" onClick={this.handleNavigator.bind(this)}>查看更多>></a>
                    </div>
                </div>
            )
        } else {
            return null
        }

    }
}