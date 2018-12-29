/**
 * Created by ChenJun on 2018/12/21
 */

import React from 'react';
import {axios} from 'axios';
import { Carousel} from 'antd';
import {Link} from 'react-router-dom';

export default class ComingMovies extends React.Component {

    createList(list, index) {
        const _list = list.slice(4 * (index - 1), 4 * (index - 1) + 4);
        return _list.map((item, i) => {
            return (
                <li key={i}>
                    <a className="movies-inner" onClick={() => {
                        this.props.history.push(`/movies/detail/${item.id}`)
                    }}>
                        <span className="movies-icon"/>
                        <img src={item.image ? item.image : require('../../static/images/no-img.png')} className="movies-img"/>
                        <div className="movies-text">{item.title}</div>
                    </a>
                </li>
            )
        })
    }

    render() {
        const {moviesComingData} = this.props;
        if (moviesComingData) {
            const arr = [1, 2, 3, 4];
            const list = arr.map((item, index) => {
                return (
                    <div className="movies-list" key={index + 1}>
                        {this.createList(moviesComingData.moviecomings, index + 1)}
                    </div>
                )
            })
            return (
                <div>
                    <Carousel autoplay className="carousel-box" dotsClass="movies-dots">
                        {list}
                    </Carousel>
                    <div className="movies-more">
                        <Link to="/movies/coming">查看更多>></Link>
                    </div>
                </div>
            )
        } else {
            return null
        }

    }
}