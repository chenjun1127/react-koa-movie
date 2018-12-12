/**
 * Created by ChenJun on 2018/12/10
 */
import React from 'react';

export default class LogoTips extends React.Component {
    static defaultProps = {
        title: '欢迎来到电影网'
    }

    render() {
        return (
            <div className="logo_box">
                <img src={require('../../static/images/logo.png')} className="logo"/>
                <h1>{this.props.title}</h1>
            </div>
        )
    }
}