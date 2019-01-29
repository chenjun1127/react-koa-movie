import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'mobx-react';
import App from './App';
import {userInfo, operate, cityLoc,getInfo} from './store';

if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
}

render((
    <Provider userInfo={userInfo} operate={operate} cityLoc={cityLoc} getInfo={getInfo}>
        <App/>
    </Provider>
), document.querySelector('#root'));