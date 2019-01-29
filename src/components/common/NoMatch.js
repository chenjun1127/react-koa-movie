/**
 * Created by ChenJun on 2018/12/10
 */
import React from 'react';
import {Link} from 'react-router-dom';
export default class NoMatch extends React.Component {

    render() {
        return (
            <div className="noMatch">
                <img src={require('../../static/images/404.png')} className="logo" alt={404}/>
                <h1>页面报错了，你访问的页面已离开地球</h1>
                <p><Link to='/'>点我返回首页</Link></p>
            </div>
        )
    }
}