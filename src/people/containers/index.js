import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import UserConnectionsDashboard from 'people/components/UserConnectionsDashboard';
import ControlPanel from 'people/components/ControlPanel';
import UserConnectionsTable from 'people/components/UserConnectionsTable';
import UserConnectionsSort from 'people/components/UserConnectionsSort';
import userConnectionsActions from 'people/actions';
import componentActions from 'components/actions';
import style from 'people/style.scss';

class UserConnections extends Component {
  componentWillMount() {
    this.props.updateBreadcrumbs([{name: this.props.text.title, path: '/people'}]);
  }

  componentDidMount() {
    this.props.fetchUserConnections();
  }

  render() {
    const { connections, fetching, error } = this.props;
    if (fetching) {
      return null;
    }
    if (!connections) {
      return null;
    }
    return (
      <div id='user-connections-wrapper'>
        <ControlPanel/>
        <UserConnectionsSort/>
        {connections.length > 0 && <UserConnectionsTable connections={connections}/>}
        {!connections.length && <h1>Empty!</h1>}
      </div>
    );
  }
}

UserConnections.propTypes = {
  text: PropTypes.object,
  updateBreadcrumbs: PropTypes.func,
  fetchUserConnections: PropTypes.func,
  connections: PropTypes.array,
  fetching: PropTypes.bool,
  error: PropTypes.object
};

UserConnections.defaultProps = {
  text: {
    title: 'People'
  }
};

const mapStateToProps = (state) => ({
  fetching: state.userConnectionsReducer.fetching,
  connections: state.userConnectionsReducer.payload,
  error: state.userConnectionsReducer.error
});

const ConnectedUserConnections = connect(mapStateToProps, {
  updateBreadcrumbs: componentActions.updateBreadcrumbs,
  fetchUserConnections: userConnectionsActions.fetchUserConnections
})(UserConnections);

export default ConnectedUserConnections;
