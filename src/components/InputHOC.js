import React, { Component } from 'react';

export default (WrappedComponent) => {
    return class InputHOC extends Component {
        constructor(props) {
            super(props);
            this.state = {
                value: '',
            }
        }

        handleChange = (e) => {
            this.setState({
                value: e.target.value,
            });
        }

        render() {
            const passProps = {
                value: this.state.value,
                onChange: this.handleChange,
            }
            return <WrappedComponent { ...passProps }/>;
        }
    }
}
// 高阶组件是一个函数，接收一个组件，然后返回一个新的组件。