import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import SignInAndSignUp from '../user/SignInAndSignUp';
import {inject, observer} from 'mobx-react';
import axios from "axios";
import {Button, Menu, Dropdown} from 'antd';
import {cookie} from '../../utils/cookie';

@inject(['operate'], ['userInfo'])
@observer
export default class Nav extends Component {
    static defaultProps = {
        tabs: [{
            text: '首页',
            path: '/',
        },{
            text: '正在热映',
            path: '/movies/hot',
        }, {
            text: '即将上映',
            path: '/movies/coming',
        }]
    }

    sign(type) {
        this.props.operate.setType({
            text: type === 1 ? '登录' : '注册',
            type
        })
        this.props.operate.setVisible(true);
    }

    componentDidMount() {
        axios.get(`/koa-movie-api/session?t=${Date.now()}`).then(res => {
            if (res.data.code === 200) {
                let resData = res.data.data;
                delete resData.password;
                this.props.userInfo.setInfo(Object.assign({}, resData, {
                    isLogin: true,
                    isActive: resData.active === 1 ? true : false
                }));
                cookie.set('isLogin', true, res.data.expiresDays);
                cookie.set('userId', resData.id, res.data.expiresDays);
            } else {
                this.props.userInfo.setInfo({});
                cookie.delete('isLogin');
                cookie.delete('userId');
            }
        }).catch(err => {
            console.log(err);
        })
    }

    handleClickSignOut() {
        axios.get(`/koa-movie-api/user/signOut?t=${Date.now()}`).then(res => {
            if (res.data.code === 200) {
                this.props.userInfo.setInfo({});
                sessionStorage.removeItem('movieId');
                this.props.operate.setStatus(0);
                cookie.delete('isLogin');
                cookie.delete('userId');
                this.props.history.replace("/");
            }
        }).catch(err => {
            console.log(err);
        })
    }

    handleClickCenter(id) {
        this.props.history.replace(`/user/center/${id}`);
    }

    handleClickInfo() {
        this.props.history.replace(`/user/info`);
    }

    render() {
        const {isLogin, id, avatar, name} = this.props.userInfo.info;
        const {visible} = this.props.operate;
        const tabList = this.props.tabs.map((item, index) => {
            return (
                <li key={index} className={this.props.history.location.pathname === item.path ? 'active' : ''}>
                    <Link to={item.path}>{item.text}</Link>
                </li>
            )
        });
        let headPic = avatar ? require(`../../static/uploads/${avatar}`) : require('../../static/images/default-head.png');
        const menu = (
            <Menu>
                <Menu.Item key="0" onClick={this.handleClickCenter.bind(this, id)}>我的主页 </Menu.Item>
                <Menu.Item key="1" onClick={this.handleClickInfo.bind(this)}>个人资料 </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="3" onClick={this.handleClickSignOut.bind(this)}>注销</Menu.Item>
            </Menu>
        );

        return (
            <div className="top">
                <div className="menu">
                    <ul className="menuList">{tabList}</ul>
                    {
                        !isLogin ?
                            <div className="userBox">
                                <Button type="primary" onClick={this.sign.bind(this, 1)} htmlType="button">立即登录</Button>
                                <Button onClick={this.sign.bind(this, 2)} htmlType="button">免费注册</Button>
                            </div> :
                            <div className="userCenter">
                                <span>欢迎您，</span><em>{name}</em>
                                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                                    <div className="userImg">
                                        <img src={headPic} alt={headPic}/>
                                    </div>
                                </Dropdown>
                            </div>
                    }
                </div>
                <SignInAndSignUp visible={visible} {...this.props}/>
            </div>
        )
    }
}