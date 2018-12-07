/**
 * Created by ChenJun on 2018/12/6
 */
import React from 'react';
import {Button, Form, Input, message} from 'antd';
import axios from "axios/index";

const FormItem = Form.Item;

export default class Forgot extends React.Component {
    render() {
        return (
            <WrappedNormalLoginForm/>
        )
    }
}

class NormalLoginForm extends React.Component {
    state = {flag: false, msg: '', time: 3}
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios.post('/api/user/restPassword', {
                    name: this.state.name,
                    newPassword: values.password,
                }).then(res => {
                    if (res.data.code === 200) {
                        console.log(res, this)
                        message.success(res.data.desc, 1, () => {
                            location.href = "/";
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
        axios.get('/api/user/resetLink').then(res => {
            if (res.data.code === 200) {
                this.setState({flag: true, name: res.data.data.userName})
            } else {
                this.setState({flag: false, msg: res.data.desc});
                this.countDown(this.state.time);
            }
        }).catch(err => {
            console.log(err)
        })
    }

    countDown(time) {
        this.timer = setInterval(() => {
            time--;
            if (time === 0) {
                clearInterval(this.timer);
                location.href = "/";
            }
            this.setState({time})
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timer);
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
            <div className="inner">
                <div className="card">
                    <div className="logo_box">
                        <img src={require('../../static/images/logo.png')} className="logo"/>
                        <h1>欢迎来到电影网</h1>
                    </div>
                    <h1 className="card-title">重置密码</h1>
                    <div className="card-content">
                        {
                            this.state.flag ?
                                <Form onSubmit={this.handleSubmit} className="login-form">
                                    <FormItem {...formItemLayout} label="新密码">
                                        {getFieldDecorator('password', {
                                            rules: [{required: true, message: '密码为6-12位字符（字母、数字、下划线）', pattern: /^[a-zA-Z\d_]{6,12}$/}],
                                        })(
                                            <Input type="password" placeholder="6-12位的新密码"/>
                                        )}
                                    </FormItem>
                                    <FormItem {...tailFormItemLayout} >
                                        <Button type="primary" htmlType="submit">提交</Button>
                                    </FormItem>
                                </Form> :
                                <div className="forgotTips">
                                    <p style={{textAlign: 'center'}}>
                                        链接错误或者已经失效，<span className="red">{this.state.time}</span>秒后回到首页
                                    </p>
                                    <div>
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