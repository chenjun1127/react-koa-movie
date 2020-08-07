/**
 * Created by ChenJun on 2018/12/29
 */
import React from 'react';
export default class LightBox extends React.Component {
    state = {visible: false, currentIndex: 0}

    handleClick(index) {
        this.setState({visible: true, currentIndex: index});
    }

    handlePrev(index) {
        index--;
        if (index < 0) {
            index = this.props.images.length - 1
        }
        this.refs.ol.style.left = '-' + 100 * index + '%';
    }

    handleNext(index) {
        index++;
        if (index > this.props.images.length - 1) {
            index = 0
        }
        this.refs.ol.style.left = '-' + 100 * index + '%';
    }

    cancel() {
        this.setState({visible: false})
    }

    renderModalImage() {
        const {images, showTitle, loop} = this.props;
        const {visible, currentIndex} = this.state;
        const w = images.length * 100;
        const li_w = 100 / images.length;
        const imgList = images.map((item, index) => {
            if (images.length === 1) {
                return (
                    <li key={index} style={{width: `${li_w}%`}}>
                        <div>
                            <img src={item.imgUrl} alt={item.imgId}/>
                            {showTitle ? <p>{index},{item.imgId}</p> : null}
                        </div>
                    </li>
                )
            } else {
                return (
                    <li key={index} style={{width: `${li_w}%`}}>
                        <div>
                            <img src={item.imgUrl} alt={item.imgId} />
                            {showTitle ? <p>{index},{item.imgId}</p> : null}
                        </div>
                        {
                            !loop && index === 0 ? null :
                                <span className="prev" onClick={this.handlePrev.bind(this, index)}>
                                    &lt;
                                </span>
                        }
                        {
                            !loop && index === images.length - 1 ? null :
                                <span className="next" onClick={this.handleNext.bind(this, index)}>
                                    &gt;
                                </span>
                        }
                    </li>
                )
            }
        });
        return (
            <div className={visible ? 'light-box-mask show' : 'light-box-mask'}>
                <div className="light-box-content">
                    <span className="light-box-close" onClick={this.cancel.bind(this)}>&times;</span>
                    <ol style={{position: 'absolute', left: `-${currentIndex * 100}%`, top: 0, height: '100%', width: `${w}%`}} ref="ol">
                        {imgList}
                    </ol>
                </div>
            </div>
        )
    }

    render() {
        return (
            <ul className="img-list">
                {
                    this.props.images.map((item, index) => {
                        return (
                            <li key={index}><a onClick={this.handleClick.bind(this, index)} style={{backgroundImage: `url(${item.imgUrl})`}}><img
                                src={item.imgUrl}/></a></li>
                        )
                    })
                }
                {this.renderModalImage()}
            </ul>
        )
    }
}