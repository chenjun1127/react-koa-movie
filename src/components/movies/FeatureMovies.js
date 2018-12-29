/**
 * Created by ChenJun on 2018/12/25
 */
import React from 'react';
import {List, Card} from 'antd';

const FeatureMovies = (props) => {
    const {featureMovies} = props;
    if (!featureMovies) return null;
    return (
        <div className="feature-movies">
            <List
                grid={{gutter: 16, column: 2}}
                dataSource={featureMovies}
                renderItem={item => (
                    <List.Item>
                        <Card bodyStyle={{padding: '10px'}}>
                            <a href="javascript:void(0)" onClick={() => { props.history.push(`/movies/feature/${item.feature_id}`) }}>
                                <dl className="m-pic clearfix">
                                    <dt><img src={item.bigImg}/></dt>
                                    {item.smallImg.map((t, i) => <dd key={i}><img src={t}/> {i === item.smallImg.length - 1 ? <strong><i>{item.total}</i>部电影>></strong> : null}
                                    </dd>)}
                                </dl>
                                <div className="f-title">{item.text} </div>
                            </a>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    )
}
export default FeatureMovies;