import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import componentActions from 'components/actions';

class TabPanel extends React.Component {
    static propTypes = {
      tabPanel: PropTypes.object,
      toggleTabPanel: PropTypes.func
    }

    constructor(props) {
      super(props);
      this.state = {
        tabActive: 0
      };
    }
    // componentWillReceiveProps(nextProp) {
    //   const {expand} = nextProp;
    // }
    changeTab = (i) => {
      this.setState({tabActive: i});
    }

    hidePanel = () => {
      this.tabPabel.classList.remove('expand');
      this.tabPabel.classList.add('collapse');
      this.offCanvas.classList.remove('in');
      setTimeout(() => {
        this.props.toggleTabPanel({expandPanel: false});
      }, 1000);
    }

    render() {
      const { tabActive } = this.state;
      const { tabs, tabContents, expandPanel } = this.props.tabPanel;
      if (!expandPanel) {
        return null;
      }
      const tabHeader = tabs.map((tab, i) => {
        return <li className={`${tabActive === i ? 'active' : ''}`} key={i}><a href='#' onClick={() => {this.changeTab(i);}}>{tab}</a></li>;
      });

      const contents = tabContents.map((tab, i) => {
        return <div className={`tab-pane ${tabActive === i ? 'active' : ''}`} key={i}>{tab}</div>;
      });

      return (
        <section className={`tab-panel ${expandPanel ? 'expand' : ''}`}
          ref={node => {this.tabPabel = node;}}
        >
          <div className='tab-animate'>
            <ul className='nav nav-tabs' >
              {tabHeader}
            </ul>
            <div className='tab-content' >
              {contents}
            </div>
          </div>
        </section>
        // <div className=''>
        //   <div
        //     className={`off-canvas-mask fade ${expandPanel ? 'in' : ''}`}
        //     ref={node => {this.offCanvas = node;}}
        //     onClick={this.hidePanel}/> */}
        // </div>
      );
    }
}
const mapDispatchToProps = dispatch => {
  return {
    toggleTabPanel: bindActionCreators(componentActions.toggleTabPanel, dispatch)
  };
};

export default connect(state => ({
  tabPanel: state.componentReducer.tabPanel
}), mapDispatchToProps)(TabPanel);
