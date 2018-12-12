/**
 * Created by ChenJun on 2018/12/10
 */
import React from 'react'
import {Route, withRouter} from 'react-router-dom';
import NoLogin from './NoLogin';
import {cookie} from '../../utils/cookie';

class PrivateRoute extends React.Component {
    render() {
        const {component: Component, ...rest} = this.props;
        const isLogin = cookie.get('isLogin');
        return (
            isLogin? <Route {...rest} render={(props) => (<Component {...props} />)}/> : <NoLogin {...this.props}/>
        )
    }
}

export default withRouter(PrivateRoute);
// “withRouter可以包装任何自定义组件，将react-router 的 history,location,match 三个对象传入。
// 无需一级级传递react-router 的属性，当需要用的router
// 属性的时候，将组件包一层withRouter，就可以拿到需要的路由信息”