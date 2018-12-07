import React from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import About from '../components/About';
import Home from '../components/Home';
import HighCompent from '../components/HighCompent';
import Reset from '../components/user/Reset';
import Forgot from '../components/user/Forgot';
import Active from '../components/user/Active';
import AccountStatus from "../components/user/AccountStatus";

const Routes = () => (

    <Router>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
            <Route path="/high-compent" component={HighCompent}/>
            <Route path="/user/forgot" component={Forgot}/>
            <Route path="/user/reset" component={Reset}/>
            <Route path="/user/active" component={Active}/>
            <Route path="/user/active_status" component={AccountStatus}/>
        </Switch>
    </Router>

);

export default Routes;