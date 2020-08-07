/**
 * Created by ChenJun on 2019/1/21
 */

import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { cookie } from '../../utils/cookie';
import { Button } from 'antd';
@inject(['userInfo'], ['getInfo'])
@observer
class Follow extends React.Component {
    componentDidMount() {
        const userId = this.props.userInfo.info.id;
        const currentUserId = parseInt(this.props.match.params.id);
        this.props.getInfo.getFollows(parseInt(currentUserId), userId);
    }

    createList(list) {
        return list.map((item, index) => {
            return (
                <li key={index}>
                    <Link to={`/user/center/${item.followedUser.id}`}>
                        <img src={item.followedUser.avatar ? require(`../../static/uploads/${item.followedUser.avatar}`) : require('../../static/images/default-head.png')} alt={name} />
                        <div>
                            <h1>{item.followedUser.name}</h1>
                            <p>{item.followedUser.email}</p>
                        </div>
                    </Link>
                    {this.createBtn(item)}
                </li>
            );
        });
    }

    createBtn(item) {
        const userId = parseInt(this.props.userInfo.info.id);
        const currentUserId = parseInt(this.props.match.params.id);
        if (userId === currentUserId) {
            return userId !== item.followedUser.id ? (
                <Button type={item.status === 1 ? 'default' : 'primary'} htmlType="button" onClick={this.handleFollow.bind(this, item.followedUser.id, item.status)} className="follow-btn">
                    {item.status === 1 && userId === item.userId ? '取消关注' : '+关注'}
                </Button>
            ) : null;
        } else {
            return userId !== item.followedUser.id ? (
                <Button type={item.withUserStatus === 1 ? 'default' : 'primary'} htmlType="button" onClick={this.handleFollow.bind(this, item.followedUser.id, item.withUserStatus)} className="follow-btn">
                    {item.withUserStatus === 1 ? '取消关注' : '+关注'}
                </Button>
            ) : null;
        }
    }

    handleFollow(followId, status) {
        const userId = this.props.userInfo.info.id;
        this.props.getInfo.getfollowOperation(userId, followId, status);
        const currentUserId = parseInt(this.props.match.params.id);
        setTimeout(() => {
            this.props.getInfo.getFollows(currentUserId, userId);
            this.props.getInfo.getFans(currentUserId, userId);
        }, 500);
    }

    render() {
        const isLogin = cookie.get('isLogin');
        const userId = isLogin && JSON.parse(cookie.get('userId'));
        const currentUserId = parseInt(this.props.match.params.id);
        const list = this.props.getInfo.follows;
        return (
            <>
                <div className="u-title">{userId === currentUserId ? '我的关注' : '他的关注'}</div>
                {list.length > 0 ? <ul className="common-list">{this.createList(list)}</ul> : <div>暂无关注 </div>}
            </>
        );
    }
}

export default withRouter(Follow);
