/**
 * Created by ChenJun on 2018/12/12
 */

import React from 'react';
import {Form, Icon, Input, Button, Radio, Col} from 'antd';
import {inject, observer} from 'mobx-react';
import Nav from './../common/Nav';

const {TextArea} = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@inject(['operate'], ['userInfo'])
@observer
class UserInfo extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        })
    }

    componentDidMount() {
        console.log(this)
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                sm: {span: 4},
            },
            wrapperCol: {
                sm: {span: 20},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                sm: {
                    span: 4,
                    offset: 4,
                },
            },
        };
        const {name, email, phone, avatar,userSign} = this.props.userInfo.info;
        return (
            <div className="container">
                <Nav {...this.props}/>
                <div className="inner">
                    <div className="infoInner">
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <div className="headPic uploadPic">
                                <img src={avatar ? require(`../../static/upload/${avatar}`) : require('../../static/images/default-head.png')}/>
                                <span>修改头像</span>
                            </div>
                            <div className="userInfo tc">
                                <p>{name}</p>
                                <p>{userSign || '个性签名：爱电影、爱生活'}</p>
                            </div>
                            <FormItem {...formItemLayout} label="用户名">
                                {getFieldDecorator('userName', {
                                    rules: [{required: false,}],
                                    initialValue: name
                                })(
                                    <Input disabled/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="姓别">
                                {getFieldDecorator('sex', {
                                    valuePropName: 'checked',
                                })(
                                    <RadioGroup name="sex" defaultValue={1}>
                                        <Radio value={1}>男</Radio>
                                        <Radio value={2}>女</Radio>
                                        <Radio value={3}>保密</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="邮箱">
                                {getFieldDecorator('email', {
                                    rules: [{required: true, message: '请输入正确的邮箱', pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/}],
                                    initialValue: email
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="手机号码">
                                {getFieldDecorator('phone', {
                                    rules: [{required: true, message: '请输入11位数字的正确手机号', pattern: /^1[3456789]\d{9}$/}],
                                    initialValue: phone
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="个性签名">
                                {getFieldDecorator('userSign', {
                                    rules: [{required: false, message: '请输入11位数字的正确手机号', pattern: /^1[3456789]\d{9}$/}],
                                })(
                                    <TextArea autosize={{minRows: 3, maxRows: 8}}/>
                                )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">提交</Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>

        );
    }
}

export default Form.create()(UserInfo);