/**
 * Created by ChenJun on 2019/1/2
 */
import React from 'react';
import { Comment, Avatar, Button, Input, message, Rate } from 'antd';
import { cookie } from '../../utils/cookie';
import SignInAndSignUp from "../user/SignInAndSignUp";
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import 'dayjs/locale/zh-cn';

const desc = ['超烂啊', '无力吐槽', '太差了', '很差', '一般', '很一般', '优秀', '非常优秀', '非常棒', '简直完美'];
dayjs.locale('zh-cn');
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
@inject(['operate'], ['userInfo'])
@observer
export default class MoviesComment extends React.Component {
    state = {
        comments: [],
        submitting: false,
        value: '', // 评论内容
        visible: false,
        rateValue: 3,
    }

    handleSubmit = () => {
        const isLogin = cookie.get('isLogin');
        const userId = cookie.get('userId');
        if (!isLogin) {
            this.props.operate.setType({ text: '登录', type: 1 });
            this.props.operate.setVisible(true);
            return;
        }
        if (!this.state.value) {
            message.error('不能为空', 1);
            return;
        }

        this.setState({ submitting: true });

        setTimeout(() => {
            axios.post('/api/comment', {
                content: this.state.value,
                movieId: parseInt(this.props.match.params.id),
                userId: parseInt(userId),
                rate: this.state.rateValue * 2,
            }).then(res => {
                if (res.data.code === 200) {
                    this.getAllComment();
                } else {
                    message.error(res.data.data, 1);
                }
                this.setState({ submitting: false, value: '', rateValue: 3 });
            })
        }, 1000);

    }

    handleChange = (e) => {
        this.setState({ value: e.target.value });
    }

    handleChangeRate = (value) => {
        this.setState({ rateValue: value });
    }

    componentDidMount() {
        this.getAllComment();
    }

    getAllComment() {
        const pageNo = 1;
        const pageSize = 10;
        axios.get(`/api/comment/all?movieId=${parseInt(this.props.match.params.id)}&pageNo=${pageNo}&pageSize=${pageSize}&t=${Date.now()}`).then(res => {
            let supportArr = [];
            if (res.data.code === 200 && res.data.data.length > 0) {
                this.setState({ comments: res.data.data });
                res.data.data.map(() => {
                    supportArr.push(false);
                })
            }
            this.setState({ commentsSupport: [...supportArr] })
        })
    }

    handleClickSupport = (commentId, userId) => {
        const isLogin = cookie.get('isLogin');
        if (!isLogin) {
            this.props.operate.setType({ text: '登录', type: 1 });
            this.props.operate.setVisible(true);
            return;
        }
        else if (parseInt(cookie.get('userId')) === userId) {
            message.info('不能给自己点赞哦！',0.5)
            return
        }
        this.getPraise(commentId);
    }

    getPraise(commentId) {
        const userId = cookie.get('userId');
        axios.get(`/api/comment/praise?movieId=${parseInt(this.props.match.params.id)}&userId=${parseInt(userId)}&commentId=${commentId}&t=${Date.now()}`).then(res => {
            if (res.data.code === 200) {
                this.getAllComment();
            }
        })
    }

    render() {
        const { comments, submitting, value, visible, rateValue, commentsSupport } = this.state;
        const { avatar } = this.props.userInfo.info;
        return (
            <div>
                <Comment avatar={(<Avatar src={avatar ? require(`../../static/uploads/${avatar}`) : require('../../static/images/default-head.png')} />)}
                    content={(<Editor onChange={this.handleChange} onSubmit={this.handleSubmit} submitting={submitting} value={value} desc={desc}
                        handleChangeRate={this.handleChangeRate} rateValue={rateValue} />)} />
                <div className="public-title" style={{ marginTop: '-30px' }}> 热门影评</div>
                {
                    comments.length > 0 ? < CommentList comments={comments} handleClickSupport={this.handleClickSupport} commentsSupport={commentsSupport}
                    /> : <div className="no-comment"> 暂无评论， 快来抢沙发吧！ </div>
                } <SignInAndSignUp visible={visible} {...this.props} />
            </div>
        );
    }
}

const TextArea = Input.TextArea;
const CommentList = (props) => {
    return props.comments.map((item, index) => {
        return (
            <div key={index} className="comment-list">
                <Avatar className="comment-avatar" src={item.user.avatar ? require(`../../static/uploads/${item.user.avatar}`) : require('../../static/images/default-head.png')} />
                <div className="comment-content">
                    <div className="comment-title"><Link to={`/user/center/${item.user.id}`}> {item.user.name} </Link> <em>发表于{dayjs(item.createTime).fromNow()}</em></div>
                    <Rate className="comment-rate" disabled allowHalf value={item.rate / 2} />
                    <div className="comment-text"> {item.content} </div>
                    <div className="comment-support">
                        <svg onClick={props.handleClickSupport.bind(this, item.id, item.user.id)} className={item.status === 1 ? 'isSupport' : ''}>
                            <use xlinkHref={`#icon-zan`} />
                        </svg>
                        <span> {item.praises.length} </span>
                    </div>
                </div>
            </div>
        )
    })
}


class Editor extends React.Component {
    render() {
        const { onChange, value, submitting, onSubmit, desc, handleChangeRate, rateValue } = this.props;
        return (
            <div className="comment-editor">
                <TextArea rows={3} onChange={onChange} value={value} placeholder="说点什么吧！" />
                <div className="rate">
                    <span> 请点击星星为电影评分 </span>
                    <Rate tooltips={desc} onChange={handleChangeRate} value={rateValue} allowHalf defaultValue={7} />
                    {rateValue ? < span className="ant-rate-text"> {desc[rateValue * 2 - 1]} </span> : ''}
                </div>
                <Button htmlType="submit" loading={submitting} onClick={onSubmit} className="comment-btn" type="primary"> 发布影评 </Button>
            </div>
        )
    }
}