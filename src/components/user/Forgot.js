/**
 * Created by ChenJun on 2018/12/6
 */
import React from 'react';
import {Button, Form, Row, Col, Input, message} from 'antd';
import axios from "axios/index";
import goToEmail from '../../utils/email';
import LogoTips from '../common/LogoTips';
const FormItem = Form.Item;

export default class Forgot extends React.Component {
    render() {
        return (
            <WrappedNormalLoginForm/>
        )
    }
}

class NormalLoginForm extends React.Component {
    state = {flag: true}
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios.post('/api/user/getBackPassword', {
                    name: values.userName,
                    email: values.email,
                    captcha: values.captcha,
                    time: Date.now(),
                    url: location.href.replace('forgot', 'reset')
                }).then(res => {
                    if (res.data.code === 200) {
                        this.setState({
                            sendSuccessTime: Date.now(),
                            flag: false,
                            email: values.email
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
        this.state.flag && this.changeCaptcha();
    }

    changeCaptcha() {
        this.refs.captchaImg.src = `/api/captcha?t=${new Date().getTime()}`;
    }

    toEmail() {
        const text = this.state.email.split('@')[1];
        window.location.href = 'https://' + goToEmail(text);
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 4},
            },
            wrapperCol: {
                xs: {span: 20},
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                md: {
                    span: 20,
                    offset: 4,
                },
                xs: {
                    span: 24,
                    offset: 0
                }
            },
        };
        return (
            <div className="bgGray">
                <div className="card">
                    <LogoTips/>
                    <h1 className="card-title">重置密码</h1>
                    <div className="card-content">
                        {
                            this.state.flag ?
                                <Form onSubmit={this.handleSubmit} className="login-form">
                                    <FormItem {...formItemLayout} label="用户名">
                                        {getFieldDecorator('userName', {
                                            rules: [{required: true, message: '用户名为2-16位字符', pattern: /^[a-zA-Z0-9_]{2,16}$/}],
                                        })(
                                            <Input placeholder="您的用户名"/>
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="邮箱">
                                        {getFieldDecorator('email', {
                                            rules: [{required: true, message: '请输入邮箱', pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/}],
                                        })(
                                            <Input placeholder="您的注册邮箱"/>
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="验证码">
                                        <Row gutter={10}>
                                            <Col span={15}>
                                                {getFieldDecorator('captcha', {
                                                    rules: [{required: true, message: '请输入验证码'}],
                                                })(
                                                    <Input type="text" placeholder="4位验证码"/>
                                                )}
                                            </Col>
                                            <Col span={9}>
                                                <div className="captcha">
                                                    <img src="" ref="captchaImg" onClick={this.changeCaptcha.bind(this)}/>
                                                </div>
                                            </Col>
                                        </Row>
                                    </FormItem>
                                    <FormItem {...tailFormItemLayout} >
                                        <Button type="primary" htmlType="submit">下一步</Button>
                                    </FormItem>
                                </Form> :
                                <div className="forgotTips">
                                    <p>
                                        感谢你使用 MovieFuns ，我们发送了一封邮件到你的邮箱：<em>{this.state.email}</em>，请及时查看（1 小时内有效）
                                    </p>
                                    <div>
                                        <Button type="primary" block className="forgot-button" onClick={this.toEmail.bind(this)}>前往邮箱</Button>
                                        <Button block href="/">回到首页</Button>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);