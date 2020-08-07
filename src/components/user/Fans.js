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
class Fans extends React.Component {
    componentDidMount() {
        const userId = this.props.userInfo.info.id;
        const currentUserId = parseInt(this.props.match.params.id);
        this.props.getInfo.getFans(currentUserId, userId);
    }

    createList(list) {
        return list.map((item, index) => {
            return (
                <li key={index}>
                    <Link to={`/user/center/${item.fansUser.id}`}>
                        <img src={item.fansUser.avatar ? require(`../../static/uploads/${item.fansUser.avatar}`) : require('../../static/images/default-head.png')} alt={name} />
                        <div>
                            <h1>
                                {item.fansUser.name} <span style={{ display: item.followStatus === 1 ? 'inline-block' : 'none' }}>互粉</span>
                            </h1>
                            <p>{item.fansUser.email}</p>
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
            return userId !== item.fansUser.id ? (
                <Button type={item.withUserStatus === 1 ? 'default' : 'primary'} htmlType="button" disabled={item.withUserStatus === 1} onClick={this.handleFollow.bind(this, item.fansUser.id, item.withUserStatus)} className="follow-btn">
                    {item.withUserStatus === 1 && userId === item.userId ? '已关注' : '+关注'}
                </Button>
            ) : null;
        } else {
            return userId !== item.fansUser.id ? (
                <Button type={item.withUserStatus === 1 ? 'default' : 'primary'} htmlType="button" disabled={item.withUserStatus === 1} onClick={this.handleFollow.bind(this, item.fansUser.id, item.withUserStatus)} className="follow-btn">
                    {item.withUserStatus === 1 ? '已关注' : '+关注'}
                </Button>
            ) : null;
        }
    }

    handleFollow(followId, status) {
        const userId = this.props.userInfo.info.id;
        const currentUserId = parseInt(this.props.match.params.id);
        this.props.getInfo.getfollowOperation(userId, followId, status);
        setTimeout(() => {
            this.props.getInfo.getFollows(currentUserId, userId);
            this.props.getInfo.getFans(currentUserId, userId);
        }, 500);
    }

    render() {
        const list = this.props.getInfo.fans;
        const isLogin = cookie.get('isLogin');
        const userId = isLogin && JSON.parse(cookie.get('userId'));
        const currentUserId = parseInt(this.props.match.params.id);
        return (
            <div>
                <div className="u-title">{userId === currentUserId ? '我的粉丝' : '他的粉丝'}</div>
                {list.length > 0 ? <ul className="common-list">{this.createList(list)}</ul> : <div>暂无粉丝 </div>}
            </div>
        );
    }
}

export default withRouter(Fans);
