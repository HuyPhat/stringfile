import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ReactTooltip from 'react-tooltip';

import FSComponent from 'components/FSComponent';
import componentActions from 'components/actions';
import TextInput from 'components/TextInput';

import teamActions from '../actions';

const TEXT = {
  title: 'Team Profile',
  account_owner: 'Account Owner',
  organization: 'Organization',
  internet_domain: 'Internet Domain',
  contact_phone_number: 'Contact Phone Number',
  errorRequireMsg: (name) => `Please input your ${name}`
};

class TeamProfile extends FSComponent {

  constructor(props) {
    super(props, TEXT);
    this.state = {
      settings: this.props.user && this.props.user.team ? this.props.user.team : {},
      validateState: {}
    };
  }

  componentWillMount() {
    this.props.updateBreadcrumbs([{name: this.text.title, path: null}]);
    this.props.setAppClass({appClass: 'admin-settings'});
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.user && nextProp.user.team) {
      this.setState({settings: nextProp.user.team});
    }
  }

  setTextInputValue = (name, value) => {
    const settings = this.state.settings;
    settings[name] = value;
    return this.setState({ settings });
  }

  setValidateState = (name, value) => {
    const {validateState} = this.state;
    validateState[name] = value;
    this.setState({validateState});

  }

  onSubmit = () => {
    const {settings, validateState} = this.state;
    let isValid = true;
    for (let i in validateState) { // Check validate state
      if (validateState.hasOwnProperty(i)) {
        if (!validateState[i]) {
          isValid = false;
          return;
        }
      }
    }
    if (isValid) {
      this.props.updateTeamInfo({settings: settings, team_id: this.props.user.team.id, uid: this.props.user.uid});
    }
  }
  render() {
    const text = this.text;
    const { user } = this.props;
    const {settings} = this.state;
    if (!user || !user.uid) {
      return null;
    }
    return (
      <div className='tab pane fade in active' id='admin-settings-account' >
        <div className='container' >
          <div className='row'>
            <div className='col-md-4'>
              <h4>{ text.account_owner} </h4>
              <p>
                <strong>{ user.first_name } {user.last_name }</strong><br/>
                { user.emails.primary }
              </p>
              <h4>{text.organization}</h4>
              <form name='adminSettingsForm'>
                <div className='form-group no-border'>
                  <label>{ text.name }</label>
                  <TextInput
                    name='name'
                    required={true}
                    className='form-control'
                    placeholder='FileString Inc'
                    onChange={this.setTextInputValue}
                    errorRequireMsg={text.errorRequireMsg('team name')}
                    value={settings.name}
                    setValidateState={this.setValidateState}
                    showError={true}
                  />
                  <label>{text.internet_domain}</label>
                  <TextInput
                    name='domain'
                    required={true}
                    className='form-control'
                    placeholder='filestring.com'
                    onChange={this.setTextInputValue}
                    errorRequireMsg={text.errorRequireMsg('domain')}
                    value={settings.domain}
                    setValidateState={this.setValidateState}
                    showError={true}
                  />
                  <label>{text.contact_phone_number}</label>
                  <TextInput
                    name='phone'
                    required={true}
                    className='form-control'
                    placeholder='000 000'
                    onChange={this.setTextInputValue}
                    value={settings.phone}
                    showError={true}
                    setValidateState={this.setValidateState}
                    errorRequireMsg={text.errorRequireMsg('contact phone')}
                  />
                </div>
                <button type='button' className='btn btn-primary btn-block' onClick={this.onSubmit}>Save</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    breadcrumbs: state.componentReducer.breadcrumbs,
    user: state.authReducer.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateBreadcrumbs: bindActionCreators(componentActions.updateBreadcrumbs, dispatch),
    setAppClass: bindActionCreators(componentActions.setAppClass, dispatch),
    updateTeamInfo: bindActionCreators(teamActions.updateTeamInfo, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamProfile);
