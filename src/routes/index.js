import React from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import Home from '../components/Home';
import Reset from '../components/user/Reset';
import Forgot from '../components/user/Forgot';
import Active from '../components/user/Active';
import AccountStatus from '../components/user/AccountStatus';
import UserCenter from '../components/user/UserCenter';
import UserInfo from '../components/user/UserInfo';
import Operate from '../components/user/Operate';
import PrivateRoute from '../components/common/PrivateRoute';
import NoMatch from '../components/common/NoMatch';
import MoviesDetail from '../components/MoviesDetail';
import Feature from '../components/Feature';
import Award from '../components/Award';
import MoviesHot from '../components/MoviesHot';
import MoviesComing from '../components/MoviesComing';
const Routes = () => (

    <Router>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/user/forgot" component={Forgot}/>
            <Route path="/user/reset" component={Reset}/>
            <Route path="/user/active" component={Active}/>
            <Route path="/user/active_status" component={AccountStatus}/>
            <Route path="/movies/feature/:id" component={Feature}/>
            <Route path="/movies/detail/:id" component={MoviesDetail}/>
            <Route path="/movies/award/:id" component={Award}/>
            <Route path="/movies/hot" component={MoviesHot}/>
            <Route path="/movies/coming" component={MoviesComing}/>
            <PrivateRoute path="/user/center/:id" component={UserCenter}/>
            <PrivateRoute path="/user/info" component={UserInfo}/>
            /***权限控制***/
            <Route path="/operate" component={Operate}/>
            <Route component={NoMatch}/>
        </Switch>
    </Router>

);

export default Routes;