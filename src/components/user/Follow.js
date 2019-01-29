/**
 * Created by ChenJun on 2019/1/21
 */

import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import {cookie} from "../../utils/cookie";
import {Button} from "antd";

@inject(['userInfo'], ['getInfo'])
@observer
class Follow extends React.Component {
    componentDidMount() {
        this.props.getInfo.getFollows(parseInt(this.props.match.params.id), 1, 10);
    }

    createList() {
        const list = this.props.getInfo.follows;
        const isLogin = cookie.get('isLogin');
        const userId = isLogin && JSON.parse(cookie.get('userId'));
        console.log(userId)
        return list.map((item, index) => {
            return (
                <li key={index}>
                    <Link to={`/user/center/${item.user.id}`}>
                        <img src={item.user.avatar ? require(`../../static/uploads/${item.user.avatar}`) : require('../../static/images/default-head.png')} alt={name}/>
                        <div>
                            <h1>{item.user.name}</h1>
                            <p>{item.user.email}</p>
                        </div>
                    </Link>
                    <Button type={item.followStatus === 1 ? 'default' : 'primary'} htmlType="button" onClick={this.handleFollow.bind(this, item.user.id)} className="follow-btn">
                        {item.followStatus === 1 && userId===item.followUserId ? '取消关注' : '+关注'}
                    </Button>
                </li>
            )
        })
    }

    handleFollow(followId) {
        const userId = this.props.userInfo.info.id;
        console.log(userId,followId)
        this.props.getInfo.getFollowStatus(userId, followId, 1);
        setTimeout(() => {
            this.props.getInfo.getFollows(parseInt(this.props.match.params.id), 1, 10);
            this.props.getInfo.getFans(parseInt(this.props.match.params.id), 1, 10);
        }, 500)
    }

    render() {
        const list = this.props.getInfo.follows;
        const isLogin = cookie.get('isLogin');
        const userId = isLogin && JSON.parse(cookie.get('userId'));
        const id = parseInt(this.props.match.params.id);
        return (
            <div>
                <div className="u-title">{userId === id ? '我的关注' : '他的关注'}</div>
                {list.length > 0 ? <ul className="common-list">{this.createList()}</ul> : <div>暂无关注 </div>}
            </div>
        )
    }
}

export default withRouter(Follow);