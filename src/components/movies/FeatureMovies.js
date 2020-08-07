/**
 * Created by ChenJun on 2018/12/25
 */
import React from 'react';

const FeatureMovies = (props) => {
  const { featureMovies } = props;
  if (!featureMovies) return null;
  const renderFeatureMovies = () => {
    return featureMovies.map((item) => {
      return (
        <div className="fm-list" key={item.feature_id} onClick={() => { props.history.push(`${item.feature_id ? `/movies/feature/${item.feature_id}` : `/movies/award/1?url=${item.link.split('.com')[1]}`}`);}}>
          <div className="m-pic clearfix">
              <img src={item.bigImg} />
          </div>
          <div className="f-title"><span>{item.total}</span>&nbsp;部 &nbsp;&nbsp;&nbsp;{item.text} </div>
        </div>
      );
    });
  };
  return <div className="feature-movies clearfix">{renderFeatureMovies()}</div>;
};
export default FeatureMovies;
