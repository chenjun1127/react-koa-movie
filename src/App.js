import React from 'react';
import { hot } from 'react-hot-loader';
import './static/css/reset';
import './static/css/index';
import Routers from './routes/index';
import './static/js/iconfont';
const App = () => <Routers/>;

export default hot(module)(App);