/**
 * Created by ChenJun on 2018/12/6
 */
import React from 'react';
import {Button, Alert} from 'antd';
import {Redirect} from 'react-router-dom';
import axios from "axios/index";
import goToEmail from '../../utils/email';
import {inject, observer} from "mobx-react/index";

@inject(['operate'], ['userInfo'])
@observer
export default class AccountStatus extends React.Component {
    state = {isActive: true, msg: ''}

    componentDidMount() {
        console.log(this);
        const search = this.props.location.search;
        const name = search.split('&')[0].split('=')[1];
        this.getActiveStatus(name);
    }

    getActiveStatus(name) {
        axios.post('/api/user/activeAccount', {name}).then(res => {
            if (res.data.code !== 200) {
                this.setState({
                    isActive: false,
                })
            }
        })
    }

    render() {
        return (
            <div className="inner">
                <div className="card">
                    <div className="logo_box">
                        <img src={require('../../static/images/logo.png')} className="logo"/>
                        <h1>欢迎来到电影网</h1>
                    </div>
                    <h1 className="card-title">请激活账号</h1>
                    <div className="card-content">
                        <div className="forgotTips">
                            <div className="emailTipsAccount">
                                {
                                   this.state.isActive?
                                       <p className="blueColor"><a href="/">账号激活成功，去登录吧</a></p>:
                                       <p>账号激活失败，请发邮件至管理员邮箱 <span className="blueColor">（402074940@qq.com）</span>进行激活</p>
                                }
                            </div>
                            <div>
                                <Button block href="/">回到首页</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}
