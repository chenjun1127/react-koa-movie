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
export default class Active extends React.Component {
    static defaultProps = {
        tips: '为了正常使用收藏、关注、评论等功能，请激活您的账号'
    }
    state = {isSend: true}

    toEmail() {
        const {email} = this.props.userInfo.signUp;
        const text = email && email.split('@')[1];
        window.location.href = 'https://' + goToEmail(text);
    }

    componentDidMount() {
        console.log(this);
        this.sendActiveEmail();
    }

    sendActiveEmail() {
        const {userName, email, isActive} = this.props.userInfo.signUp;
        if (userName && email && !isActive) {
            axios.post('/api/user/activeEmail', {name: userName, email, url: location.href + '_status'}).then(res => {
                if (res.data.code !== 200) {
                    this.setState({
                        isSend: false
                    })
                }
            })
        }
    }

    render() {
        const {email} = this.props.userInfo.signUp;
        if (email) {
            return (
                <div className="inner">
                    <div className="card">
                        <div className="logo_box">
                            <img src={require('../../static/images/logo.png')} className="logo"/>
                            <h1>欢迎来到电影网</h1>
                        </div>
                        <h1 className="card-title">请激活账号</h1>
                        <div className="card-content">
                            <Alert description={this.props.tips} type="warning"/>
                            <div className="forgotTips">
                                {
                                    this.state.isSend ?
                                        <div className="emailTips">
                                            <p>您的 Email：<em>{email}</em></p>
                                            <p>激活邮件已发送，请注意查收（注意检查回收站、垃圾箱中是否有激活邮件）。如果仍未收到，请联系我们。</p>
                                            <p>如果接收不到激活邮件，您还可以使用注册邮箱发送任意信息到地址 <em>402074940@qq.com</em>，我们接收到邮件后会自动激活此账号。</p>
                                        </div> :
                                        <div className="emailTipsAccount">
                                            <p>邮件尚未发送，服务器开小差了，联系管理员...</p>
                                        </div>
                                }
                                <div>
                                    {
                                        this.state.isSend ? <Button type="primary" block className="forgot-button" onClick={this.toEmail.bind(this)}>前往邮箱</Button> : null
                                    }
                                    <Button block href="/">回到首页</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return <Redirect to={"/"}/>
        }
    }
}
