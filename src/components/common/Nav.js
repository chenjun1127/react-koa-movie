import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button} from 'antd';
import SignInAndSignUp from '../user/SignInAndSignUp';
import {inject, observer} from 'mobx-react';
import axios from "axios";
import {Menu, Dropdown} from 'antd';

@inject(['operate'],['userInfo'])
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
        console.log(1,this)
        axios.get(`/api/session?t=${Date.now()}`).then(res => {
            if (res.data.code === 200) {
                this.props.userInfo.setInfo({
                    isLogin: true,
                    userName: res.data.data.name,
                    userImg: res.data.data.avator
                })
            }
        }).catch(err => {
            console.log(err);
        })
    }

    handleClickSignOut() {
        axios.get(`/api/user/signOut?t=${Date.now()}`).then(res => {
            if (res.data.code === 200) {
                this.props.userInfo.setInfo({
                    isLogin: false,
                    userName: '',
                    userImg: ''
                })
            }
        }).catch(err => {
            console.log(err);
        })
    }


    render() {
        const {isLogin,userImg,userName}=this.props.userInfo.info;
        const {visible} = this.props.operate;
        const tabList = this.props.tabs.map((item, index) => {
            return (
                <li key={index} className={this.state.currentIndex === index ? 'active' : ''} onClick={this.handleClick.bind(this, index)}>
                    <Link to={item.path}>{item.text}</Link>
                </li>
            )
        });
        let avatar;
        if (userImg) {
            avatar = require(`../../static/upload/${userImg}`);
        } else {
            avatar = require('../../static/images/default-head.png');
        }
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <a href="http://www.alipay.com/">个人中心</a>
                </Menu.Item>
                <Menu.Item key="1">
                    <a href="http://www.taobao.com/">我的主页</a>
                </Menu.Item>
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
                                <span>欢迎您，</span><em>{userName}</em>
                                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                                    <div className="userImg">
                                        <img src={avatar}/>
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