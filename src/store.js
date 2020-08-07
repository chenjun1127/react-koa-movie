import { observable, action } from 'mobx';
import axios from 'axios';

class UserInfo {
    @observable info = {};
    @observable time = new Date().toLocaleTimeString();
    @action
    setInfo = (obj) => {
        this.info = obj;
    };
}

class Operate {
    @observable type = { text: '', type: null }; // 是哪个modal 1=登录 2=注册
    @observable form = ''; // modal里面的form
    @observable visible = false; // modal显示参数
    @observable status = 0; // 收藏状态
    @action
    setType = (obj) => {
        this.type = obj;
    };
    @action
    setForm = (form) => {
        this.form = form;
    };
    @action
    setVisible = (status) => {
        this.visible = status;
    };
    @action
    setStatus = (params) => {
        if (typeof params === 'number') {
            this.status = params;
        } else {
            axios.get(`/api/collectByUser?movieId=${params.movieId}&userId=${params.userId}&t=${Date.now()}`).then((res) => {
                if (res.data.code === 200) {
                    this.status = res.data.data.status;
                }
            });
        }
    };
}

class CityLoc {
    @observable loc = { id: '', n: '' };
    @action
    setLoc = (obj) => {
        this.loc = obj;
    };
}

/**
 * 获取用户相关信息
 */
class GetInfo {
    @observable info = {};
    @observable comments = [];
    @observable collects = [];
    @observable follows = [];
    @observable fans = [];
    @observable followStatus = 0;
    @observable followOperation = null;

    @action
    getUserInfo = (userId) => {
        axios.get(`/api/main/getInfo?id=${userId}&t=${Date.now()}`).then((res) => {
            if (res.data.code === 200) {
                this.info = res.data.data;
            }
        });
    };
    @action
    getComments = (userId, pageNo = 1, pageSize = 10) => {
        axios.get(`/api/main/comment?userId=${userId}&pageNo=${pageNo}&pageSize=${pageSize}&t=${Date.now()}`).then((res) => {
            if (res.data.code === 200) {
                this.comments = [...res.data.data];
            }
        });
    };
    @action
    getCollects = (userId, pageNo = 1, pageSize = 10) => {
        axios.get(`/api/main/collect?userId=${userId}&pageNo=${pageNo}&pageSize=${pageSize}&t=${Date.now()}`).then((res) => {
            if (res.data.code === 200) {
                this.collects = [...res.data.data];
            }
        });
    };
    @action
    getFollowStatus = (userId, followId) => {
        axios.get(`/api/main/follow/status?userId=${userId}&followId=${followId}`).then((res) => {
            if (res.data.code === 200) {
                this.followStatus = res.data.status;
            }
        });
    };
    @action
    getfollowOperation = (userId, followId, type) => {
        axios.post('/api/main/follow/operate', { userId, followId, type }).then((res) => {
            if (res.data.code === 200) {
                this.followOperation = res.data.data;
            }
        });
    };
    @action
    getFollows = (id, userId, pageNo = 1, pageSize = 10) => {
        axios.get(`/api/main/follow/list?id=${id}&userId=${userId}&pageNo=${pageNo}&pageSize=${pageSize}&t=${Date.now()}`).then((res) => {
            if (res.data.code === 200) {
                this.follows = [...res.data.data];
            }
        });
    };
    @action
    getFans = (id, userId, pageNo = 1, pageSize = 10) => {
        axios.get(`/api/main/fans/list?id=${id}&userId=${userId}&pageNo=${pageNo}&pageSize=${pageSize}&t=${Date.now()}`).then((res) => {
            if (res.data.code === 200) {
                this.fans = [...res.data.data];
            }
        });
    };
}

const userInfo = new UserInfo();
const operate = new Operate();
const cityLoc = new CityLoc();
const getInfo = new GetInfo();
export { userInfo, operate, cityLoc, getInfo };
