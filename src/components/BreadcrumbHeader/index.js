import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import filesActions from 'files/actions';
import componentActions from 'components/actions';
import {history} from 'AppRoute';

class BreadcrumbHeader extends Component {
  static propTypes = {
    filesActions: PropTypes.object,
    updateBreadcrumbs: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      breadcrumbs: this.props.breadcrumbs
    };
  }

  componentWillReceiveProps(nextProps) {
    const {breadcrumbs} = nextProps;
    if (breadcrumbs) {
      this.setState({breadcrumbs: breadcrumbs});
    }
  }

  handleLinkClick = (item) => {
    const {breadcrumbs} = this.props;
    if (breadcrumbs[breadcrumbs.length - 1].name === 'Search') {
      breadcrumbs.pop();
      this.props.updateBreadcrumbs(breadcrumbs);
      this.setState({breadcrumbs: breadcrumbs});
      history.replace(item.path);
    } else {
      history.push(item.path);
    }
  }

  render() {
    const {breadcrumbs} = this.state;
    return (
      <ol className='breadcrumb' id='breadcrumb'>
        {breadcrumbs.map((item, index) => {
          return (
            <li key={item.path} className={index > 0 && index === (breadcrumbs.length - 1) ? 'disabled' : ''}>
              {index > 0 &&
                <span className='icon-breadcrumb' />
              }
              {item.path
                ? (<a onClick={() => {this.handleLinkClick(item);}}>{item.name}</a>) : (<a href='#'>{item.name}</a>)
              }

            </li>
          );
        })}
      </ol>
    );
  }
}

BreadcrumbHeader.propTypes = {
  breadcrumbs: PropTypes.array
};

const mapStateToProps = state => {
  return {
    breadcrumbs: state.componentReducer.breadcrumbs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    filesActions: bindActionCreators(filesActions, dispatch),
    updateBreadcrumbs: bindActionCreators(componentActions.updateBreadcrumbs, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BreadcrumbHeader);
