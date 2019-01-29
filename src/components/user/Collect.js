/**
 * Created by ChenJun on 2019/1/21
 */

import React from 'react';
import {cookie} from "../../utils/cookie";
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";

@inject(['userInfo'], ['getInfo'])
@observer
class Collect extends React.Component {

    componentDidMount() {
        this.props.getInfo.getCollects(parseInt(this.props.match.params.id), 1, 10);
    }


    textEllipsis = (text, length) => {
        if (text.length > length) {
            text = text.substring(0, length) + '...';
        }
        return text;
    };

    createList() {
        const list = this.props.getInfo.collects;
        return list.map((item, index) => {
            return (
                <li key={index}>
                    <div className="list-title"><Link to={`/user/center/${item.user.id}`}>{item.user.name}</Link> 收藏了电影 <Link
                        to={`/movies/detail/${item.m.movieId}`}>{item.m.movieName}</Link></div>
                    <div className="list-main">
                        <Link to={`/movies/detail/${item.m.movieId}`}><img src={item.m.movieImg} alt={item.m.movieName}/></Link>
                        <div className="list-text">
                            <h1><Link to={`/movies/detail/${item.m.movieId}`}>{item.m.movieName}</Link></h1>
                            <h2 className="text-summary">{this.textEllipsis(item.m.movieSummary, 150)}</h2>
                            <h3>
                                <svg className="collect">
                                    <use xlinkHref="#icon-xihuan"/>
                                </svg>
                                {item.m.collects.length}人收藏了
                            </h3>
                        </div>
                    </div>
                </li>
            )
        })
    }

    render() {
        const list = this.props.getInfo.collects;
        const isLogin = cookie.get('isLogin');
        const userId = isLogin && JSON.parse(cookie.get('userId'));
        const id = parseInt(this.props.match.params.id);
        return (
            <div>
                <div className="u-title">{userId === id ? '我的收藏' : '他的收藏'}</div>
                {list.length > 0 ? <ul className="collect-list">{this.createList()}</ul> : <div>暂无收藏 </div>}
            </div>
        )
    }
}

export default withRouter(Collect);