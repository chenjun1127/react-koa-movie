/**
 * Created by ChenJun on 2018/12/4
 */

import React from 'react';
import { Modal } from 'antd';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { inject, observer } from 'mobx-react';

@inject("operate")
@observer
export default class SignInAndSignUp extends React.Component {

    handleCancel() {
        this.props.operate.setVisible(false);
        // 清空表单的状态
        this.props.operate.form.resetFields(['userName', 'password', 'confirm', 'email', 'captcha', []]);
    }

    render() {
        const content = this.props.operate.type.type === 1 ? <SignIn history={this.props.history} /> : <SignUp history={this.props.history} />;
        return (
            <Modal title={this.props.operate.type.text} footer={null} visible={this.props.visible} onCancel={this.handleCancel.bind(this)} > {content} </Modal>
        )
    }
}