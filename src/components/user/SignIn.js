/**
 * Created by ChenJun on 2018/12/3
 */

import React from 'react';
import {Button, Form, Icon, Input, Checkbox} from 'antd';

const FormItem = Form.Item;
import {inject, observer} from 'mobx-react';
import {message} from "antd/lib/index";
import axios from "axios/index";

export default class SignIn extends React.Component {
    render() {
        return (
            <WrappedNormalLoginForm history={this.props.history}/>
        );
    }
}

@inject(['operate'], ['userInfo'])
@observer
class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios.post('/api/user/signIn', {
                    name: values.userName,
                    password: values.password,
                    remember: values.remember
                }).then(res => {
                    if (res.data.code === 200) {
                        message.success(res.data.desc, 1, () => {
                            this.props.userInfo.setInfo({
                                isLogin: true,
                                userName: res.data.data.name,
                                userImg: res.data.data.avator,
                            })
                            if (res.data.data.active === 1) {
                                this.props.operate.setVisible(false);
                            } else {
                                this.props.userInfo.setSignUp({userName: res.data.data.name, email: res.data.data.email, isActive: false});
                                this.props.history.push('/user/active');
                            }
                        })
                    } else {
                        message.error(res.data.desc, 1)
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        });
    }

    componentDidMount() {
        this.props.operate.setForm(this.props.form);
    }

    singUp(type) {
        this.props.operate.setType({
            text: type === 1 ? '登录' : '注册',
            type
        })
    }

    handleForgot() {
        console.log(this)
        this.props.operate.setVisible(false);
        this.props.history.push('/user/forgot');

    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{required: true, message: '用户名为4-16位字符', pattern: /^[\u4e00-\u9fa5\w]{2,16}$/}],
                    })(
                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Username"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '密码为6-12位字符（字母、数字、下划线）', pattern: /^[a-zA-Z\d_]{6,12}$/}],
                    })(
                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password" placeholder="Password"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>记住我</Checkbox>
                    )}
                    <a className="login-form-forgot" href="javascript:void(0)" onClick={this.handleForgot.bind(this)}>忘记密码</a>
                </FormItem>
                <FormItem>
                    <Button block type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                </FormItem>
                <FormItem>
                    <Button block type="default" className="login-form-button" onClick={this.singUp.bind(this, 2)}>
                        没有账号，去注册吧
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
