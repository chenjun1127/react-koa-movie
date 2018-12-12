import {observable, action} from 'mobx';


class UserInfo {
    @observable info = {};
    @observable time = new Date().toLocaleTimeString();
    @action
    setInfo = (obj) => {
        this.info = obj;
    }
}

class Operate {
    @observable type = {text: '', type: null};// 是哪个modal 1=登录 2=注册
    @observable form = ""; // modal里面的form
    @observable visible = false;// modal显示隐鲹
    @action
    setType = (obj) => {
        this.type = obj;
    }
    @action
    setForm = (form) => {
        this.form = form;
    }
    @action
    setVisible = (status) => {
        this.visible = status;
    }
}


const userInfo = new UserInfo();
const operate = new Operate();
export {userInfo, operate};