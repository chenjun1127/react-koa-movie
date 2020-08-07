/**
 * Created by ChenJun on 2018/12/10
 */
import React from 'react';
import { Icon, Button, Tabs, message } from 'antd';
import { inject, observer } from 'mobx-react';
import Nav from './../common/Nav';
import Collect from './Collect';
import Comment from './Comment';
import Follow from './Follow';
import Fans from './Fans';
import Footer from '../common/Footer';
import Loading from '../common/Loading';
import axios from 'axios';
import { cookie } from '../../utils/cookie';

@inject(['userInfo'], ['getInfo'])
@observer
export default class UserCenter extends React.Component {
    static defaultProps = {
        posterArr: ['poster-1.jpg', 'poster-2.jpg', 'poster-3.jpg', 'poster-4.jpg', 'poster-5.jpg'],
        userTabs: [
            {
                text: '收藏',
                component: <Collect />,
            },
            {
                text: '评论',
                component: <Comment />,
            },
            {
                text: '关注',
                component: <Follow />,
            },
            {
                text: '粉丝',
                component: <Fans />,
            },
        ],
    };

    state = { height: 300 };

    componentDidMount() {
        this.randomPosterImg();
        const currentUserId = parseInt(this.props.match.params.id);
        const isLogin = cookie.get('isLogin');
        const userId = isLogin && JSON.parse(cookie.get('userId'));
        this.props.getInfo.getUserInfo(currentUserId);
        userId !== currentUserId && this.props.getInfo.getFollowStatus(userId, currentUserId);
        this.screenChange();
        this.resize();
    }
    screenChange() {
        window.addEventListener('resize', this.resize);
    }
    resize = () => {
        this.setState({ height: document.body.clientHeight - (270 + 66 + 80) });
    };

    randomPosterImg() {
        const posterArr = this.props.posterArr;
        const index = Math.floor(Math.random() * posterArr.length);
        return require(`../../static/images/${posterArr[index]}`);
    }

    clickSetting() {
        this.props.history.push('/user/info');
    }

    handleFollow(followId, status) {
        // 关注操作
        const userId = this.props.userInfo.info.id;
        this.props.getInfo.getfollowOperation(userId, followId, status);
        setTimeout(() => {
            this.props.getInfo.getFollowStatus(userId, followId);
            this.props.getInfo.getFollows(followId, userId);
            this.props.getInfo.getFans(followId, userId);
        }, 500);
    }

    // 监听URL变化
    componentWillReceiveProps(nextProps, nextContext) {
        const currentId = parseInt(nextProps.match.params.id);
        const userId = parseInt(this.props.userInfo.info.id);
        axios.get(`/api/main/getInfo?id=${currentId}&t=${Date.now()}`).then((res) => {
            res.data.code !== 200 &&
                message.error(res.data.desc, 1, () => {
                    this.props.history.push('/operate');
                });
        });
        this.props.getInfo.getUserInfo(currentId);
        this.props.getInfo.getCollects(currentId);
        this.props.getInfo.getComments(currentId);
        this.props.getInfo.getFollows(currentId, userId);
        this.props.getInfo.getFans(currentId, userId);
        userId !== currentId && this.props.getInfo.getFollowStatus(userId, currentId);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    render() {
        if (!this.props.getInfo.info) return <Loading />;
        const isLogin = cookie.get('isLogin');
        const userId = isLogin && JSON.parse(cookie.get('userId'));
        const { id, avatar, name, userSign } = this.props.getInfo.info;
        const postImgStyle = { backgroundImage: `url(${this.randomPosterImg()})` };
        const tabs = this.props.userTabs.map((item, index) => (
            <Tabs.TabPane tab={item.text} key={index + 1}>
                {item.component}
            </Tabs.TabPane>
        ));
        const status = this.props.getInfo.followStatus;
        const text = status === 1 ? '取消关注' : '+关注';

        return (
            <div className="container">
                <Nav {...this.props} />
                <div className="inner">
                    <div className="poster" style={postImgStyle}>
                        <div className="headPic">
                            <img src={avatar ? require(`../../static/uploads/${avatar}`) : require('../../static/images/default-head.png')} alt={name} />
                        </div>
                        <div className="userInfo">
                            <p>{name}</p>
                            <p>{userSign || '个性签名：爱电影、爱生活'}</p>
                        </div>
                        <div className="operateInner">
                            {userId !== id && (
                                <Button type={status === 1 ? 'default' : 'primary'} htmlType="button" onClick={this.handleFollow.bind(this, id, status)}>
                                    {text}
                                </Button>
                            )}
                            <div className="setting">
                                <Icon type="setting" onClick={this.clickSetting.bind(this)} />
                            </div>
                        </div>
                    </div>
                    <div className="inner-box" style={{ minHeight: this.state.height }}>
                        <Tabs defaultActiveKey="1">{tabs}</Tabs>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}
