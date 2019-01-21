import React from 'react';
import {inject, observer} from 'mobx-react';
import Nav from './common/Nav';
import axios from "axios";
import {Popover, Tabs} from "antd";
import {compare, matchesSelector} from '../utils/tools';
import {cookie} from '../utils/cookie';
import HotMovies from './movies/HotMovies';
import ComingMovies from "./movies/ComingMovies";
import FeatureMovies from "./movies/FeatureMovies";
import Footer from "./common/Footer";
import Loading from "./common/Loading";

const letters = "ABCDEFGHJKLMNPQRSTWXYZ".split('');
@inject(["userInfo"], ["cityLoc"])
@observer
export default class Home extends React.Component {
    state = {hotCities: [], loc: {id: 366, n: '深圳'}, visible: false, tabCurrentIndex: 1}

    componentDidMount() {
        this.getHotCity();
        this._onBlurHandler();
        const locObj = cookie.get('defaultCity') ? JSON.parse(cookie.get('defaultCity')) : this.state.loc;
        cookie.set('defaultCity', JSON.stringify({id: locObj.id, n: locObj.n}), 10);
        this.getMovies(1, locObj.id);
        this.featureMovies();
    }

    // 点击空白地方关闭弹窗
    _onBlurHandler() {
        document.body.addEventListener('click', (e) => {
            if (matchesSelector(e.target, '.ant-popover *')) {
                return;
            }
            this.setState({visible: false})
        }, false);
    }

    getHotCity() {
        if (!sessionStorage.getItem('hotCities')) {
            axios.get(`/api/cities?t=${Date.now()}`).then(res => {
                if (res.data.code === 200) {
                    sessionStorage.setItem('hotCities', JSON.stringify(res.data.data));
                    this.createCities(res.data.data)
                }
            })
        } else {
            var hotCities = sessionStorage.getItem('hotCities');
            this.createCities(JSON.parse(hotCities));
        }
    }

    createCities(list) {
        var _list = list.slice().splice(0, 50);
        list.sort(compare('n', 'pinyinFull')); //城市按首字母排序
        var newArr = [];
        for (let i = 0; i < letters.length; i++) {
            newArr.push(cc(list, letters[i]));
        }

        function cc(list, text) {
            let arr = [], map = new Map();
            for (let i = 0; i < list.length; i++) {
                if (list[i].pinyinFull.substr(0, 1).toUpperCase() === text) {
                    arr.push(list[i]);
                    map.set(text, arr)
                }
            }
            return map;
        }

        this.setState({
            hotCityList: _list,
            allCityList: newArr
        })
    }

    openPopover() {
        this.setState({visible: true})
    }

    tabClick(key) {
        this.setState({tabCurrentIndex: Number(key)});
        const locObj = cookie.get('defaultCity') ? JSON.parse(cookie.get('defaultCity')) : this.state.loc;
        this.getMovies(Number(key), locObj.id);
    }

    handleClick(e) {
        const locId = e.locationId ? e.locationId : e.id;
        this.setState({loc: {id: locId, n: e.n}, visible: false});
        this.props.cityLoc.setLoc({id: locId, n: e.n});
        cookie.set('defaultCity', JSON.stringify({id: locId, n: e.n}), 10);
        this.getMovies(this.state.tabCurrentIndex, locId);
    }

    getMovies(type, locId) {
        if (type === 1) {
            axios.get(`/api/movies/hot?locationId=${locId}&t=${Date.now()}`).then(res => {
                if (res.data.code === 200) {
                    this.setState({moviesHotData: res.data.data})
                }
            })
        } else {
            axios.get(`/api/movies/coming?locationId=${locId}&t=${Date.now()}`).then(res => {
                if (res.data.code === 200) {
                    this.setState({moviesComingData: res.data.data})
                }
            })
        }
    }

    featureMovies() {
        axios.get(`/api/movies/featureMovies?t=${Date.now()}`).then(res => {
            if (res.data.code === 200) {
                this.setState({featureMovies: res.data.data});
            }
        })
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        const {hotCityList, allCityList, loc, visible, featureMovies} = this.state;
        const defaultCity = cookie.get('defaultCity') ? JSON.parse(cookie.get('defaultCity')) : null;
        if (!hotCityList || !allCityList || !featureMovies) return <Loading/>;
        return (
            <div className="container">
                <Nav history={this.props.history}/>
                <div className="inner">
                    <div className="mainInner">
                        <div className="locBox">
                            <Popover visible={visible} content={<RenderContent handleClick={this.handleClick.bind(this)} {...this.props} {...this.state}/>}
                                     trigger={['click']} placement="topLeft">
                                <div className="loc" onClick={this.openPopover.bind(this)}>
                                    <svg className="icon" aria-hidden="true">
                                        <use xlinkHref="#icon-weizhi"></use>
                                    </svg>
                                    <span>{defaultCity ? defaultCity.n : loc.n}</span>
                                </div>
                            </Popover>
                        </div>
                        <Tabs defaultActiveKey="1" size="large" onTabClick={this.tabClick.bind(this)}
                              tabBarStyle={{margin: 0, display: 'flex', justifyContent: 'center', fontSize: '18px'}}>
                            <Tabs.TabPane tab="正在热映" key="1">
                                <HotMovies {...this.props} {...this.state}/>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="即将上映" key="2">
                                <ComingMovies {...this.props} {...this.state}/>
                            </Tabs.TabPane>
                        </Tabs>
                        <div className="title">特色榜单</div>
                        <FeatureMovies {...this.state} {...this.props}/>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

class RenderContent extends React.Component {
    renderTabs() {
        const {hotCityList} = this.props;
        const tabsTitle = ["热门", "A-D", "E-H", "J-M", "N-R", "S-X", "Y-Z"];
        const n = Math.floor(letters.length / 5);
        return tabsTitle.map((title, index) => {
            if (index + 1 === 1) {
                return (
                    <Tabs.TabPane tab={title} key={index + 1}>
                        <div className={`tabs tabs-${index + 1}`}>
                            {hotCityList.map((item) => <span onClick={this.props.handleClick.bind(this, item)} key={item.id}>{item.n}</span>)}
                        </div>
                    </Tabs.TabPane>
                )
            } else if (index + 1 === 7) {
                return (
                    <Tabs.TabPane tab={title} key={index + 1}>
                        <div className={`tabs tabs-${index + 1}`}>{this.renderTabContent(20, 22)}</div>
                    </Tabs.TabPane>
                )
            } else {
                return (
                    <Tabs.TabPane tab={title} key={index + 1}>
                        <div className={`tabs tabs-${index + 1}`}>{this.renderTabContent(n * (index - 1), n * (index - 1) + 3)}</div>
                    </Tabs.TabPane>
                )
            }
        })
    }

    renderTabContent(fromIndex, toIndex) {
        const {allCityList} = this.props;
        var domEle = [];
        for (let i = fromIndex; i < allCityList.length; i++) {
            if (i <= toIndex) {
                var arr = allCityList[i].get(letters[i]);
                for (var j = 0; j < arr.length; j++) {
                    if (j === 0) {
                        domEle.push(<span onClick={this.props.handleClick.bind(this, arr[j])} key={arr[j].id}><em>{letters[i]}</em>{arr[j].n}</span>);
                    } else {
                        domEle.push(<span onClick={this.props.handleClick.bind(this, arr[j])} key={arr[j].id}>{arr[j].n}</span>);
                    }
                }
            }
            domEle.push(<p key={i}></p>);
        }
        return domEle;
    }

    render() {
        return (
            <div className="contentBox">
                <Tabs defaultActiveKey="1">
                    {this.renderTabs()}
                </Tabs>
            </div>
        )
    }
}