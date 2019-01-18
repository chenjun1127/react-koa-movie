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
        }, {
            text: '全部电影',
            path: '/about',
        }, {
            text: '电影录入',
            path: '/high-compent',
        },]
    }

    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
        }
    }

    handleClick(index) {
        this.setState({
            currentIndex: index
        })
    }

    sign(type) {
        this.props.operate.setType({
            text: type === 1 ? '登录' : '注册',
            type
        })
        this.props.operate.setVisible(true);
    }

    componentDidMount() {
        axios.get(`/api/session?t=${Date.now()}`).then(res => {
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
        axios.get(`/api/user/signOut?t=${Date.now()}`).then(res => {
            if (res.data.code === 200) {
                this.props.userInfo.setInfo({});
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
                <li key={index} className={this.state.currentIndex === index ? 'active' : ''} onClick={this.handleClick.bind(this, index)}>
                    <Link to={item.path}>{item.text}</Link>
                </li>
            )
        });
        let headPic;
        if (avatar) {
            headPic = require(`../../static/uploads/${avatar}`);
        } else {
            headPic = require('../../static/images/default-head.png');
        }

        const menu = (
            <Menu>
                <Menu.Item key="0" onClick={this.handleClickCenter.bind(this, id)}>我的主页 </Menu.Item>
                <Menu.Item key="1" onClick={this.handleClickInfo.bind(this)}>个人资料 </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="3" onClick={this.handleClickSignOut.bind(this)}>注销</Menu.Item>
            </Menu>
        );


        return (
            <div className="menu">
                <div className="menuBox">
                    <ul className="menuList">{tabList}</ul>
                    {
                        !isLogin ?
                            <div className="userBox">
                                <Button type="primary" onClick={this.sign.bind(this, 1)}>立即登录</Button>
                                <Button onClick={this.sign.bind(this, 2)}>免费注册</Button>
                            </div> :
                            <div className="userCenter">
                                <span>欢迎您，</span><em>{name}</em>
                                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                                    <div className="userImg">
                                        <img src={headPic}/>
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