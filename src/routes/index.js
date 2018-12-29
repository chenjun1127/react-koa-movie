import React from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import About from '../components/About';
import Home from '../components/Home';
import HighComponent from '../components/HighComponent';
import Reset from '../components/user/Reset';
import Forgot from '../components/user/Forgot';
import Active from '../components/user/Active';
import AccountStatus from "../components/user/AccountStatus";
import UserCenter from "../components/user/UserCenter";
import UserInfo from "../components/user/UserInfo";
import Operate from "../components/user/Operate";
import PrivateRoute from '../components/common/PrivateRoute';
import NoMatch from '../components/common/NoMatch';
import MoviesDetail from '../components/MoviesDetail';
import Feature from "../components/Feature";
const Routes = () => (

    <Router>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
            <Route path="/high-compent" component={HighComponent}/>
            <Route path="/user/forgot" component={Forgot}/>
            <Route path="/user/reset" component={Reset}/>
            <Route path="/user/active" component={Active}/>
            <Route path="/user/active_status" component={AccountStatus}/>
            <Route path="/movies/feature/:id" component={Feature}/>
            <Route path="/movies/detail/:id" component={MoviesDetail}/>
            <PrivateRoute path="/user/center/:id" component={UserCenter}/>
            <PrivateRoute path="/user/info" component={UserInfo}/>
            /***权限控制***/
            <Route path="/operate" component={Operate}/>
            <Route component={NoMatch}/>
        </Switch>
    </Router>

);

export default Routes;