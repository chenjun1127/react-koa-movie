/**
 * Created by ChenJun on 2018/12/10
 */
import React from 'react';
import {Icon, Button, Tabs} from 'antd';
import {inject, observer} from 'mobx-react';
import Nav from './../common/Nav';

@inject("userInfo")
@observer
export default class UserCenter extends React.Component {
    static defaultProps = {
        userTabs: ['动态', '收藏', '评论', '关注', '粉丝']
    }

    componentDidMount() {
        console.log(this.props.match.params.id, this.props.userInfo)
        this.randomPosterImg();
    }

    randomPosterImg() {
        const postArr = ["poster-1.jpg", "poster-2.jpg", "poster-3.jpg", "poster-4.jpg", "poster-5.jpg"];
        const index = Math.floor(Math.random() * postArr.length);
        return require(`../../static/images/${postArr[index]}`);
    }

    clickTab(key) {
        console.log(key);
    }

    clickSetting() {
        this.props.history.push('/user/info');
    }

    render() {
        const {avatar, name, userSign} = this.props.userInfo.info;
        const postImgStyle = {backgroundImage: `url(${this.randomPosterImg()})`};
        const tabs = this.props.userTabs.map((item, index) => <Tabs.TabPane tab={item} key={index + 1}>{item}</Tabs.TabPane>);
        return (
            <div className="container">
                <Nav {...this.props}/>
                <div className="inner">
                    <div className="poster" style={postImgStyle}>
                        <div className="headPic">
                            <img src={avatar ? require(`../../static/uploads/${avatar}`) : require('../../static/images/default-head.png')}/>
                        </div>
                        <div className="userInfo">
                            <p>{name}</p>
                            <p>{userSign || '个性签名：爱电影、爱生活'}</p>
                        </div>
                        <div className="operateInner">
                            <Button type="primary">+关注</Button>
                            <div className="setting">
                                <Icon type="setting" onClick={this.clickSetting.bind(this)}/>
                            </div>
                        </div>
                    </div>
                    <div className="innerBox">
                        <Tabs defaultActiveKey="1" onChange={this.clickTab.bind(this)}>
                            {tabs}
                        </Tabs>
                    </div>
                </div>

            </div>
        );
    }
}


