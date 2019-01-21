/**
 * Created by ChenJun on 2018/12/12
 */

import React from 'react';
import {Form, Input, Button, Radio} from 'antd';
import {inject, observer} from 'mobx-react';
import Nav from './../common/Nav';
import axios from "axios";
import {cookie} from "../../utils/cookie";
import {message} from "antd";
import {isEmptyObject} from '../../utils/tools';
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
                console.log('Received values of form: ', values, this.file);
                console.log(this.props.userInfo.info.avatar);
                let formData = new FormData();
                let avatar = this.props.userInfo.info.avatar;
                if (avatar) formData.append('avatar', avatar);
                formData.append('file', this.file);
                formData.append('sex', values.sex);
                formData.append('email', values.email);
                formData.append('phone', values.phone);
                formData.append('userSign', values.userSign);
                formData.append('name', values.userName);
                // 添加私有的，看不到的，可以用formData.get('file')看有没有
                // console.log(formData.get('name'));
                const config = {headers: {'Content-Type': 'multipart/form-data'}};
                axios.post('/api/user/updateInfo', formData, config).then(res => {
                    if (res.data.code === 200) {
                        message.success(res.data.desc, 1, () => {
                            this.props.history.push(`/user/center/${cookie.get('userId')}`);
                        })
                    } else {
                        // console.log("error:" + res.data.desc);
                        message.error(res.data.message,1)
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        })
    }

    componentDidMount() {
        const id = cookie.get('userId');
        axios.get(`/api/user/getInfo?id=${id}&t=${Date.now()}`).then(res => {
            let resData = res.data.data;
            delete resData.password;
            this.props.userInfo.setInfo(Object.assign({}, resData, {
                isLogin: true,
                isActive: resData.active === 1 ? true : false
            }));
        })
    }

    getFile(e) {
        this.file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = (e) => {
            this.refs.imgPreview.src = e.target.result;
        }
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

        if(!isEmptyObject(this.props.userInfo.info)){
            const {name, email, phone, avatar, userSign, sex} = this.props.userInfo.info;
            return (
                <div className="container">
                    <Nav {...this.props}/>
                    <div className="inner">
                        <div className="infoInner">
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <div className="headPic uploadPic">
                                    <img ref="imgPreview" src={avatar ? require(`../../static/uploads/${avatar}`) : require('../../static/images/default-head.png')}/>
                                    {
                                        process.env.NODE_ENV ?
                                            <span>
                                        修改头像<input type="file" id="uploadPic" name="file" accept="image/png,image/gif,image/jpeg" onChange={this.getFile.bind(this)}/>
                                        </span> : null
                                    }
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
                                        initialValue: sex
                                    })(
                                        <RadioGroup name="sex" defaultValue={sex}>
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
                                        // rules: [{required: false, message: '请输入11位数字的正确手机号', pattern: /^1[3456789]\d{9}$/}],
                                        rules: [{required: false}],
                                        initialValue: userSign && userSign!=='null' ? userSign:''
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
            )
        }else{
            return <p>数据加载中。。。</p>
        }
    }
}

export default Form.create()(UserInfo);