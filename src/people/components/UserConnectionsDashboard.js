import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ControlPanel from './ControlPanel';
import UserConnectionsTable from 'people/containers/UserConnectionsTable';

function UserConnectionsDashboard(props) {
  return (
    <div>
      <ControlPanel/>
      <UserConnectionsTable connections={props.connections}/>
    </div>
  );
}

UserConnectionsDashboard.propTypes = {
  text: PropTypes.object,
  updateBreadcrumbs: PropTypes.func,
  fetchUserConnections: PropTypes.func,
  connections: PropTypes.array
};

export default UserConnectionsDashboard;
