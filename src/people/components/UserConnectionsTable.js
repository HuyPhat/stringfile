import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Accordion, PanelGroup, Panel } from 'react-bootstrap';
import UserConnectionsRow from './UserConnectionsRow';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
// import Infinite from 'react-infinite';
import UserConnectionHeader from './UserConnectionHeader';

////////////////////////////////////////////////////////
// function PeopleInfo(props) {
//   const menuBtnClass = props.expanded ? 'menu-btn reversed' : 'menu-btn';
//   return (
//     <div className='accordion-toggle people-info'>
//       <span>
//         <span className='avatar sm display'>{props.i}</span>
//         <span className='name'>
//           <p>{props.c.email}</p>
//         </span>
//         <a className='sent'>{12}</a>
//         <a className='received disabled'>0</a>
//         <a className={menuBtnClass}/>
//       </span>
//     </div>
//   );
// }

/////////////////////////////////////////////////
class UserConnectionsTable extends Component {

  static propTypes = {
    connections: PropTypes.array,
    className: PropTypes.string,
    filters: PropTypes.object,
    loading: PropTypes.bool
  };

  state = {
    selectedConnections: []
  }

  // componentDidMount() {
  //   ReactDOM.findDOMNode(this.refs.peopleView).addEventListener('scroll', this.listenScrollEvent);
  // }

  // componentWillUnmount() {
  //   ReactDOM.findDOMNode(this.refs.peopleView).removeEventListener('scroll', this.listenScrollEvent);
  // }

  listenScrollEvent = () => {
    console.log('Scroll event detected!');
  }

  handleSelect = (index, uid) => {
    let { selectedConnections } = this.state;
    const pos = selectedConnections.indexOf(uid);
    if (pos > -1) {
      selectedConnections.splice(pos, 1);
    } else {
      selectedConnections.push(uid);
    }
    this.setState({selectedConnections});
  }

  shouldExpanded(uid) {
    const { selectedConnections } = this.state;
    return selectedConnections.indexOf(uid) > -1;
  }

  calculatePanelClass(c) {
    const { filters, loading } = this.props;
    const disabled = 'disabled';
    const inactive = 'inactive';
    let ret = 'people-tag';
    if (filters.showInactiveContacts && !c.sharing.status) {
      ret = `${ret} ${inactive}`;
    }
    if (filters.showInactiveContacts && !c.sharing.status && !filters.showRevokedFile || loading) {
      ret = `${ret} ${disabled}`;
    }
    return ret;
  }

  calculateSentFile(c) {
    const { filters } = this.props;
    if (filters.showInactiveContacts && !c.sharing.status && !filters.showRevokedFile) {
      return 0;
    }
    return 1;
    // return countSentFile(c.share.items);
  }

  renderListConnections() {
    let ret = this.props.connections.map((c, index) => {
      return <Panel
        key={index}
        id={index}
        className={this.calculatePanelClass(c)}
        header={<UserConnectionHeader people={c} i={index} expanded={this.shouldExpanded(c.uid)}/>}
        eventKey={index}
        onClick={() => this.handleSelect(index, c.uid)}
        collapsible
        expanded={this.shouldExpanded(c.uid)}>{c.email}</Panel>;
    });
    return ret;
  }

  loadMore = () => {
  }

  scroll = (detail, view) => {
  }

  render() {
    return (
      <div ref='peopleView' onScroll={this.listenScrollEvent} id='people-view' className={`${this.props.className} people fade in`}>
        <PanelGroup>
          { this.renderListConnections() }
        </PanelGroup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  filters: state.userConnectionsReducer.filters
});

export default connect(mapStateToProps)(UserConnectionsTable);
