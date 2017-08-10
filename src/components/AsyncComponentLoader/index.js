import React, { Component } from 'react';

function asyncComponent(injectedComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);
    }

    state = {
      component: null
    }

    async componentDidMount() {
      const {default: component} = await injectedComponent();
      this.setState({component: component});
    }

    render() {
      const C = this.state.component;
      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}

export default asyncComponent;
