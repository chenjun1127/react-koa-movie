/**
 * Created by ChenJun on 2018/12/3
 */

import React from 'react';
import {Button, Form, Icon, Input, Row, Col, message} from 'antd';
import {inject, observer} from 'mobx-react';
import axios from 'axios';

const FormItem = Form.Item;
export default class SignUp extends React.Component {
    render() {
        return (
            <WrappedNormalLoginForm history={this.props.history}/>
        );
    }
}

@inject(['operate'], ['userInfo'])
@observer
class NormalLoginForm extends React.Component {
    state = {confirmDirty: false}

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios.post('/api/user/signUp', {
                    name: values.userName,
                    password: values.password,
                    email: values.email,
                    captcha: values.captcha
                }).then(res => {
                    if (res.data.code === 200) {
                        message.success(res.data.desc, 1, () => {
                            this.props.userInfo.setInfo({
                                id:'',
                                name: values.userName,
                                email: values.email,
                                isActive: false
                            });
                            this.props.operate.setVisible(false);
                            this.props.history.push('/user/active');
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

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码输入不一致');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    singIn(type) {
        this.props.operate.setType({
            text: type === 1 ? '登录' : '注册',
            type
        })
    }

    componentDidMount() {
        this.changeCaptcha();
        this.props.operate.setForm(this.props.form);
    }

    changeCaptcha() {
        this.refs.captchaImg.src = `/api/captcha?t=${new Date().getTime()}`;
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{required: true, message: '用户名为4-16位字符', pattern: /^[\u4e00-\u9fa5\w]{2,16}$/}],
                    })(
                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="4-16位用户名"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '密码为6-12位字符（字母、数字、下划线）', pattern: /^[a-zA-Z\d_]{6,12}$/}, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password" placeholder="6-12位密码"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('confirm', {
                        rules: [{required: true, message: '密码为6-12位字符（字母、数字、下划线）', pattern: /^[a-zA-Z\d_]{6,12}$/}, {validator: this.compareToFirstPassword}],
                    })(
                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password" placeholder="6-12位密码" onBlur={this.handleConfirmBlur}/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('email', {
                        rules: [{required: true, message: '请输入邮箱', pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/}],
                    })(
                        <Input prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>} type="email" placeholder="请输入邮箱"/>
                    )}
                </FormItem>
                <FormItem>
                    <Row gutter={10}>
                        <Col span={16}>
                            {getFieldDecorator('captcha', {
                                rules: [{required: true, message: '请输入验证码'}],
                            })(
                                <Input type="text" placeholder="4位验证码"/>
                            )}
                        </Col>
                        <Col span={8}>
                            <div className="captcha">
                                <img src="" ref="captchaImg" onClick={this.changeCaptcha.bind(this)}/>
                            </div>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem>
                    <Button block type="primary" htmlType="submit" className="login-form-button">
                        注册
                    </Button>
                </FormItem>
                <FormItem>
                    <Button block type="default" className="login-form-button" onClick={this.singIn.bind(this, 1)}>
                        已有账号，去登录吧
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
