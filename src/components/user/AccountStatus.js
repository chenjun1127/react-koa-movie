/**
 * Created by ChenJun on 2018/12/6
 */
import React from 'react';
import {Button} from 'antd';
import axios from "axios/index";
import LogoTips from '../common/LogoTips';
import {inject, observer} from "mobx-react/index";
import {withRouter} from "react-router-dom";

@inject(['operate'], ['userInfo'])
@observer
class AccountStatus extends React.Component {
    state = {isActive: true, msg: ''};

    componentDidMount() {
        const search = this.props.location.search;
        const name = search.split('&')[0].split('=')[1];
        this.getActiveStatus(name);
    }

    getActiveStatus(name) {
        axios.post('/koa-movie-api/user/activeAccount', {name}).then(res => {
            if (res.data.code !== 200) {
                this.setState({
                    isActive: false,
                })
            }
        })
    }

    login() {
        this.props.history.push('/operate');
    }

    render() {
        return (
            <div className="bgGray">
                <div className="card">
                    <LogoTips/>
                    <h1 className="card-title">请激活账号</h1>
                    <div className="card-content">
                        <div className="forgotTips">
                            <div className="emailTipsAccount">
                                {
                                    this.state.isActive ?
                                        <p className="blueColor"><a href="/">账号激活成功!</a></p> :
                                        <p>账号激活失败，请发邮件至管理员邮箱 <span className="blueColor">（402074940@qq.com）</span>进行激活</p>
                                }
                            </div>
                            <div>
                                <Button block onClick={this.login.bind(this)}>去登录吧</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(AccountStatus);