/**
 * Created by ChenJun on 2018/12/10
 */
import React from 'react';
import LogoTips from '../common/LogoTips';
import {Button} from 'antd';
import {withRouter} from "react-router-dom";

class NoLogin extends React.Component {
    state = {time: 3}

    componentDidMount() {
        this.countDown(this.state.time)
    }

    countDown(time) {
        this.timer = setInterval(() => {
            time--;
            if (time === 0) {
                clearInterval(this.timer);
                this.toLogin();
            }
            this.setState({time})
        }, 1000)
    }

    toLogin() {
        this.props.history.push('/operate');
    }

    toHome() {
        this.props.history.replace('/');
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        return (
            <div className="bgGray">
                <div className="card">
                    <LogoTips/>
                    <div className="card-content">
                        <div className="forgotTips">
                            <p style={{textAlign: 'center', padding: '10px 0'}}>
                                您需要登录后才能继续浏览或操作，现在将转入登录页面
                            </p>
                            <div>
                                <Button block type="primary" onClick={this.toLogin.bind(this)} style={{marginBottom: '30px'}}>登录({this.state.time}秒)</Button>
                                <Button block onClick={this.toHome.bind(this)}>回到首页</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(NoLogin);