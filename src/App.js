import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Link, withRouter, Route, Switch, Redirect } from 'react-router-dom';
import ReduxToastr from 'react-redux-toastr';

import FSComponent from 'components/FSComponent';
import Sidebar from 'components/Sidebar';
import ModalRoot from 'components/Modals';
import BreadcrumbHeader from 'components/BreadcrumbHeader';
import ScreenLoading from 'components/ScreenLoading';
import TabPanel from 'components/TabPanel';
import {MT_ADMIN, MT_VIEW_ONLY_RECEIVER, MT_RESHAEABLE_RECEIVER, MT_SENDER, MT_SUPER_ADMIN} from 'utils/teams';
import { DEFAULT_PATH } from './constants';
// import FilesContainer from 'files/components/FilesContainer';

import { history } from 'AppRoute';

import sessionActions from 'auth/actions';
const TEXT = {
  files_library: 'Files Library',
  my_files: 'My Files',
  updates_to_push: 'Update to push',
  received_files: 'Received Files',
  new_received_files: 'New Received Files',
  new_received_updates: 'New Received Updates',
  people: 'People',
  users: 'Users',
  help_feedback: 'Help & Feedback',
  team_profile: 'Team Profile',
  settings: {
    overview: 'Overview',
    personal_info: 'Personal Info',
    preferences: 'Preferences',
    linked_devices: 'Linked Devices',
    connected_networks: 'Connected Networks'
  }
};

class App extends FSComponent {
  constructor(props) {
    super(props, TEXT);
    this.state = {
      expandPanel: false
    };
  }

  componentWillMount() {
    this.props.fetchUser();
    if (this.props.location && this.props.location.pathname === '/') {
      history.push(DEFAULT_PATH);
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    const { user, routes, appClass } = this.props;
    const { expandPanel } = this.props.tabPanel;
    const { text } = this;
    let fetching = false;
    if (user && user.first_name) {
      fetching = true;
    }
    if (!routes) {
      return null;
    }
    const menus = [
      {
        title: 'File Library',
        id: 'filesLib',
        arrowIcon: true,
        children: [
          {
            link: <Link title='All Files' to='/all-files' ><span className='icon-fs-logo' />{text.my_files }</Link>,
            id: 'allFile',
            children: [{
              link: <Link title='Updates to push' to='/updates-to-push' >{text.updates_to_push}</Link>
            }]
          },
          {
            link: <Link to='/share-with-me'><span className='icon-files'/> {text.received_files}</Link>
          },
          {
            link: <Link title='People' to='/people'><span className='icon-people' />{text.people}</Link>
          }
        ]
      },
      {
        title: 'Admin Console',
        id: 'adminCons',
        arrowIcon: true,
        role: MT_ADMIN,
        children: [
          {
            link: <Link to='/users' title='Users' ><span className='icon-admin-user' />{text.users}</Link>
          },
          {
            link: <Link to='/team-profile' title={text.team_profile} ><span className='icon-admin-team' />{text.team_profile}</Link>,
            role: MT_SUPER_ADMIN
          }
        ]
      },
      {
        title: 'Settings',
        id: 'settingCons',
        arrowIcon: true,
        children: [
          {
            link: <Link to='/settings'><span className='icon-view'/>{text.settings.overview}</Link>
          },
          {
            link: <Link to='/personal-info'><span className='icon-user'/>{text.settings.personal_info}</Link>
          },
          {
            link: <Link to='/preferences'><span className='icon-equalizer'/>{text.settings.preferences}</Link>
          },
          {
            link: <Link to='/linked-devices'><span className='icon-linked-devices'/>{text.settings.linked_devices}</Link>
          },
          {
            link: <Link to='/connected-networks'><span className='icon-computer'/>{text.settings.connected_networks}</Link>
          }
        ]
      },
      {
        title: text.help_feedback,
        link: <a href='http://support.filestring.com/' target='_blank'><span className='icon-help' /> {text.help_feedback}</a>
      }
    ];

    return (

      <div className={`main-view ${fetching ? 'loading' : ''}`}>
        <div id='ip-container'>
          <ScreenLoading completed={fetching} />
          <Sidebar menus={menus} user={user}/>
          <ModalRoot/>
          <TabPanel />
          <section className={`library ${appClass} ${expandPanel ? 'expandInfoPanel' : ''}`}>
            <BreadcrumbHeader/>
            {/* <Switch> */}
            {routes.map(
              (route, i) => (
                <Route path={route.path} key={i} render={props => (
                  <route.component {...props} />
                )}/>
              ))
            }
            {/* <Route path='/all-files' component={FilesContainer}/> */}
            {/* <Redirect exact from='/' to='/all-files'/> */}
            {/* </Switch> */}
          </section>
        </div>
        <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          showCloseButton={true}
          removeOnHover={true}
          preventDuplicates
          position='top-left'
          transitionIn='fadeIn'
          transitionOut='fadeOut'
          progressBar/>
      </div>
    );
  }
}

App.propTypes = {
  fetchUser: PropTypes.func,
  className: PropTypes.string,
  error: PropTypes.object,
  user: PropTypes.object,
  errorMessages: PropTypes.object,
  routes: PropTypes.array,
  location: PropTypes.object,
  tabPanel: PropTypes.object
};
App.defaultProps = {
  errorMessages: {
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: bindActionCreators(sessionActions.fetchUser, dispatch)
  };
};

const mapStateToProps = state => {
  return {
    user: state.authReducer.user,
    error: state.authReducer.error,
    tabPanel: state.componentReducer.tabPanel,
    appClass: state.componentReducer.appClass
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
