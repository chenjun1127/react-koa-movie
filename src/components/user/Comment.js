/**
 * Created by ChenJun on 2019/1/21
 */

import React from 'react';
import { cookie } from '../../utils/cookie';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject(['userInfo'], ['getInfo'])
@observer
class Comment extends React.Component {
    componentDidMount() {
        this.props.getInfo.getComments(parseInt(this.props.match.params.id));
    }

    textEllipsis = (text, length) => {
        if (text.length > length) {
            text = text.substring(0, length) + '...';
        }
        return text;
    };

    createList() {
        const list = this.props.getInfo.comments;
        return list.map((item, index) => {
            return (
                <li key={index}>
                    <div className="list-title">
                        <Link to={`/user/center/${item.user.id}`}>{item.user.name}</Link> 评论了电影 <Link to={`/movies/detail/${item.m.movieId}`}>{item.m.movieName}</Link>
                    </div>
                    <div className="list-main">
                        <Link to={`/movies/detail/${item.m.movieId}`}>
                            <img src={item.m.movieImg} alt={item.m.movieName} />
                        </Link>
                        <div className="list-text">
                            <h1>
                                <Link to={`/movies/detail/${item.m.movieId}`}>{item.m.movieName}</Link>
                            </h1>
                            <h2 className="text-summary">{this.textEllipsis(item.m.movieSummary, 150)}</h2>
                            <h3>
                                <svg className="collect">
                                    <use xlinkHref="#icon-pinglun" />
                                </svg>
                                {item.m.comments.length}条评论
                            </h3>
                        </div>
                    </div>
                </li>
            );
        });
    }

    render() {
        const list = this.props.getInfo.comments;
        const isLogin = cookie.get('isLogin');
        const userId = isLogin && JSON.parse(cookie.get('userId'));
        const id = parseInt(this.props.match.params.id);
        return (
            <div>
                <div className="u-title">{userId === id ? '我的评论' : '他的评论'}</div>
                {list.length > 0 ? <ul className="collect-list">{this.createList()}</ul> : <div>暂无评论 </div>}
            </div>
        );
    }
}

export default withRouter(Comment);
