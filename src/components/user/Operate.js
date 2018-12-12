/**
 * Created by ChenJun on 2018/12/10
 */

import React from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import LogoTips from '../common/LogoTips';
import {inject, observer} from "mobx-react/index";
import {withRouter} from "react-router-dom";
@inject(['operate'], ['userInfo'])
@observer
class Operate extends React.Component{
    componentDidMount() {
        this.initLogin(1)
    }
    initLogin(type){
        this.props.operate.setType({
            text: type === 1 ? '登录' : '注册',
            type
        })
    }
    render(){
        const content = this.props.operate.type.type === 1 ? <SignIn history={this.props.history}/> : <SignUp history={this.props.history}/>;
        return(
            <div className="bgGray">
                <div className="card card_login">
                    <LogoTips/>
                    {content}
                </div>
            </div>
        )
    }
}

export default withRouter(Operate);