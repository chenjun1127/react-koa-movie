/**
 * Created by ChenJun on 2018/12/24
 */
import React from 'react';
import spinner from "../../static/svg/spinner.svg";

const Loading = (props) => {
    return (
        <div className="loading">
            <svg className="spinner">
                <use xlinkHref={`#${spinner.id}`}/>
            </svg>
            {props.loadingText ? <span>{props.loadingText}</span> : null}
        </div>
    )
}

export default Loading;