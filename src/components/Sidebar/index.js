import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, withRouter, Route } from 'react-router-dom';

import {AccountMenuDropup} from '../AccountMenuDropup';
import actionFunc from '../actions';
import { preventTriggerParent} from 'utils/utils';

const { toggleModal, updateBreadcrumbs } = actionFunc;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.nodes = [];
    this.state = {
      needUpdate: true
    };
  }

  componentDidMount() {
    this.updateMenu();
  }

  componentDidUpdate() {
    this.updateMenu();
  }

  componentWillReceivedProps(nextProps) {
    if (nextProps.user && nextProps.user.uid !== this.props.user.uid) {
      this.state({needUpdate: true});
    }
  }

  updateMenu = () => {
    if (this.state.needUpdate) {
      let contextContainer = ReactDOM.findDOMNode(this);
      if (contextContainer) {
        let element = contextContainer.getElementsByClassName('active')[0];
        if (element) {
          let parent = element.parentNode;
          while (parent && !this.nodes.hasOwnProperty(parent.id)) { // Looking parent node to tooge expanded class
            parent = parent.parentNode;
          }
          parent.classList.add('expanded');
          this.setState({needUpdate: false});
        }
      }
    }
  }

  toggleMenu = (event, id) => {
    event.preventDefault();
    let node = this.nodes[id];
    if (!node) {
      return;
    }
    for (let i in this.nodes) {
      if (this.nodes.hasOwnProperty(i) && i !== id) {
        this.nodes[i].classList.remove('expanded');
      }
    }
    node.classList.toggle('expanded');
  }

  renderMenuItems = (items, user) => {
    let menus = items.map((item, i) => {
      if (item.role && ((user && user.team && item.role > user.team.member_type) || (!user.team))) {
        return null;
      }
      if (item.children) {
        if (item.link) {
          let linkProps = item.link.props;
          return <Route path={linkProps.to} exact={linkProps.exact} key={i} children={({match}) => (
            <li id={item.id} className={match ? 'active' : null} onClick={preventTriggerParent}>
              {item.link}
              <ul>
                {this.renderMenuItems(item.children, user)}
              </ul>
            </li>)
          } />;
        }
        return <li id={item.id}
          key={i}
          className={item.className}
          ref={node => {this.nodes[item.id] = node;}} onClick={() => {this.toggleMenu(event, item.id);}}>
          <a href='#' ><span className={item.icon} />{item.title} {item.arrowIcon && <span className='icon-arrow-up' />}</a>
          <ul>
            {this.renderMenuItems(item.children, user)}
          </ul>
        </li>;
      }
      if (item.link) {
        let linkProps = item.link.props;
        if (linkProps && linkProps.to) {
          return <Route path={linkProps.to} exact={linkProps.exact} key={i} children={({match}) => (
            <li id={item.id} className={match ? 'active' : null} onClick={preventTriggerParent}>
              {item.link}
            </li>)} />;
        } else {
          return <li id={item.id} onClick={preventTriggerParent} key={i}>
            {item.link}
          </li>;
        }

      }
      return <li id={item.id} key={i} onClick={preventTriggerParent}>
        <a href='' className={item.className}><span className={item.icon} />{item.title}</a>
      </li>;
    });
    return menus;
  }

  openStringFileModal = (event) => {
    event.preventDefault();
    this.props.actions.toggleModal({
      modalType: 'STRING_FILE_MODAL',
      modalProps: {}
    });
  }

  render() {
    const { messages, menus, user } = this.props;
    if (!user || !user.uid) {
      return null;
    }
    const renderMenus = this.renderMenuItems(menus, user);
    return (
      <nav className='navbar'>
        <div className='navbar-header' >
          <button type='button' className='navbar-toggle' >
            <span className='sr-only'>Toggle navigation</span>
          </button>
          <span className='navbar-brand' />
        </div>
        <div className='navbar-collapse'>
          <div className='navbar-string visible'>
            {/* <h3>{ messages.string_new_file }</h3>
            <p>{ messages.select_a_storage }</p>
            <ul>
              <li>
                <a href='' className='animated' onClick={this.openStringFileModal}>
                  <span className='icon-my-computer' />
                  { messages.my_computer }
                </a>
              </li>
              <li>
                <a href='' className='animated'>
                  <span className='icon-push-update' />
                  { messages.my_cloud }
                </a>
              </li>
            </ul> */}
          </div>
          {/* TO-DO: create components for dynamic list items */}
          <ul className='nav navbar-nav' id='navbar'>
            {renderMenus}
          </ul>
        </div>
        {user &&
          <div id='navbar-account-menu'>
            <AccountMenuDropup user={user} />
          </div>
        }
      </nav>
    );
  }
}

Sidebar.propTypes = {
  messages: PropTypes.object,
  openStringFileModal: PropTypes.func,
  actions: PropTypes.object,
  error: PropTypes.object,
  user: PropTypes.object,
  menus: PropTypes.array
};
Sidebar.defaultProps = {
  messages: {
    string_new_file: 'String new file',
    select_a_storage: 'Select a storage location',
    my_computer: 'My Computer',
    my_cloud: 'My Cloud',
    files_library: 'Files Library',
    my_files: 'My Files',
    updates_to_push: 'Updates to push',
    received_files: 'Received Files',
    new_received_files: 'New Received Files',
    new_received_updates: 'New Received Updates'
  }
};
// const mapStateToProps = state => ({
//   user: state.authReducer.user,
//   error: state.authReducer.error
// });
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      toggleModal
    },
    dispatch
  )
});
export default connect(null, mapDispatchToProps)(Sidebar);
