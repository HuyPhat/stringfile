import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import componentActions from 'components/actions';
import settingActions from 'settings/actions';
import RadioButton from 'components/Radio';
import Switch from 'components/ToggleSwitch';
import Checkbox from 'components/Checkbox';
import { FS_UID } from '../../constants';
import { isEqual, cloneDeep } from 'lodash';

class ConnectedPrefences extends PureComponent {

  static propTypes = {
    text: PropTypes.object,
    updateBreadcrumbs: PropTypes.func,
    setAppClass: PropTypes.func,
    teamPermission: PropTypes.number,
    fetchUserSettings: PropTypes.func,
    userSettings: PropTypes.object,
    fetchingUserSettings: PropTypes.bool,
    requestUpdateUserSettings: PropTypes.func,
    fetchUserSettingsFulfilled: PropTypes.func,
    meta: PropTypes.object
  }

  static defaultProps = {
    text: {
      title: 'Preferences',
      everyView: 'Every View',
      firstView: 'First View',
      neverView: 'Never',
      fileReshared: 'My files are re-shared',
      fileAccessRevoked: 'Another user revokes a recipients access to a file I own',
      fileAccessExpired: 'A recipient\'s access to files I own expires'
    }
  }

  state = {
    userSettings: {}
  }

  componentWillMount() {
    const { updateBreadcrumbs, text, setAppClass } = this.props;
    updateBreadcrumbs([{name: text.title, path: null}]);
    setAppClass({appClass: 'account-settings'});
  }

  componentDidMount() {
    const uid = sessionStorage[FS_UID];
    const { fetchUserSettings } = this.props;
    fetchUserSettings(uid);
  }

  componentWillReceiveProps(nextProps) {
    const { userSettings } = nextProps;
    this.setState({userSettings});
  }

  handleChangeAccessLevel = (e, setting, value) => {
    // const newUserSettings = Object.assign({}, this.state.userSettings);
    const formerUserSetting = {...this.state.userSettings};
    const newUserSettings = cloneDeep(this.state.userSettings);
    newUserSettings.sharing.file[setting] = value;
    console.log(this.state.userSettings.sharing.file);
    this.setState({userSettings: newUserSettings});
  }

  handleFileNotificationSettings = (key, value) => {
    const cloneUserSettings = cloneDeep(this.state.userSettings);
    if (key === 'file_viewed_direct') {
      cloneUserSettings.notification.file_viewed.after_shared = value;
    }
    else if (key === 'file_viewed_downstream') {
      cloneUserSettings.notification.file_viewed.after_reshared = value;
    }
    else if (key === 'file_printed_direct') {
      cloneUserSettings.notification.file_printed.after_shared = value;
    }
    else if (key === 'file_printed_downstream') {
      cloneUserSettings.notification.file_printed.after_reshared = value;
    }
    else if (key === 'file_reshared') {
      cloneUserSettings.notification.file_reshared = value;
    }
    else if (key === 'file_access_revoked') {
      cloneUserSettings.notification.file_access.revoked = value;
    }
    else if (key === 'file_access_expired') {
      cloneUserSettings.notification.file_access.expired = value;
    }
    this.setState({userSettings: cloneUserSettings});
  }

  updateUserSettings = () => {
    const uid = sessionStorage[FS_UID];
    const newUserSettings = { ...this.state.userSettings };
    const { userSettings, requestUpdateUserSettings, meta, fetchUserSettings, fetchUserSettingsFulfilled } = this.props;
    const equal = isEqual(newUserSettings, userSettings);
    if (!equal) {
      requestUpdateUserSettings({uid: uid, data: newUserSettings});
      if (meta.code < 400) {
        console.log(meta.code);
        fetchUserSettingsFulfilled({body: {settings: newUserSettings}});
      }
    }
    else {
      return;
    }
  }

  render() {
    const { text, fetchingUserSettings } = this.props;
    const {
      accessLevel,
      downloadPermission,
      printingPermission,
      displayWatermark,
      teamPermission,
      fileViewed,
      filePrinted,
      notification,
      userSettings
    } = this.state;
    // console.log(userSettings);
    if (Object.keys(userSettings).length === 0 && userSettings.constructor === Object) {
      return null;
    }
    return (
      <div id='AppSetting' className='container disabled'>
        <div className='row'>
          <div id='knCol' className='col-md-7'>
            <div className='mask'/>
            <div id='messagePanel' className='messages'/>
            <div id='sharing-default'>
              {
                teamPermission !== 511 &&
                <div className='form-group'>
                  <div className='well well-sm'>By default, when I share files...</div>
                  <label>Access Level</label>
                  <RadioButton labelText='View-Only' checked={userSettings.sharing.file.perm === 'view'} onClick={(e) => this.handleChangeAccessLevel(e, 'perm', 'view')}/>
                  <RadioButton labelText='Re-share' checked={userSettings.sharing.file.perm === 'reshare'} onClick={(e) => this.handleChangeAccessLevel(e, 'perm', 'reshare')}/>
                </div>
              }
              <div className='form-group'>
                <label>Allow Downloading</label>
                <Switch className='pull-right download' switchState={userSettings.sharing.file.downloadable === 1} onClick={(e) => this.handleChangeAccessLevel(e, 'downloadable', userSettings.sharing.file.downloadable === 1 ? 0 : 1)}/>
              </div>
              <div className='form-group'>
                <label>Allow Printing</label>
                <Switch disabled={userSettings.sharing.file.downloadable === 1} className='pull-right printable' switchState={userSettings.sharing.file.printable === 1} onClick={(e) => this.handleChangeAccessLevel(e, 'printable', userSettings.sharing.file.printable === 1 ? 0 : 1)}/>
              </div>
              <div className='form-group'>
                <label>Display Watermark</label>
                <Switch className='pull-right printable' switchState={userSettings.sharing.file.watermarked === 1} onClick={(e) => this.handleChangeAccessLevel(e, 'watermarked', userSettings.sharing.file.watermarked === 1 ? 0 : 1)}/>
              </div>
            </div>
            <div id='notification-settings'>
              <div className='form-group file-viewed'>
                <div className='well well-sm'>Notify me when my files are viewed by...</div>
                {
                  teamPermission !== 511 &&
                  <div>
                    <label>Direct Recipients</label>
                    <RadioButton labelText={text.everyView} checked={userSettings.notification.file_viewed.after_shared === 2} onClick={() => this.handleFileNotificationSettings('file_viewed_direct', 2)} />
                    <RadioButton labelText={text.firstView} checked={userSettings.notification.file_viewed.after_shared === 1} onClick={() => this.handleFileNotificationSettings('file_viewed_direct', 1)} />
                    <RadioButton labelText={text.neverView} checked={userSettings.notification.file_viewed.after_shared === 0} onClick={() => this.handleFileNotificationSettings('file_viewed_direct', 0)} />
                  </div>
                }
                <div>
                  <label>Downstream Recipients</label>
                  <RadioButton labelText={text.everyView} checked={userSettings.notification.file_viewed.after_reshared === 2} onClick={() => this.handleFileNotificationSettings('file_viewed_downstream', 2)} />
                  <RadioButton labelText={text.firstView} checked={userSettings.notification.file_viewed.after_reshared === 1} onClick={() => this.handleFileNotificationSettings('file_viewed_downstream', 1)} />
                  <RadioButton labelText={text.neverView} checked={userSettings.notification.file_viewed.after_reshared === 0} onClick={() => this.handleFileNotificationSettings('file_viewed_downstream', 0)} />
                </div>
              </div>

              <div className='form-group file-printed'>
                <div className='well well-sm'>Notify me when my files are printed by...</div>
                {
                  teamPermission !== 511 &&
                  <div>
                    <label>Direct Recipients</label>
                    <RadioButton labelText={text.everyView} checked={userSettings.notification.file_printed.after_shared === 2} onClick={() => this.handleFileNotificationSettings('file_printed_direct', 2)} />
                    <RadioButton labelText={text.firstView} checked={userSettings.notification.file_printed.after_shared === 1} onClick={() => this.handleFileNotificationSettings('file_printed_direct', 1)} />
                    <RadioButton labelText={text.neverView} checked={userSettings.notification.file_printed.after_shared === 0} onClick={() => this.handleFileNotificationSettings('file_printed_direct', 0)} />
                  </div>
                }
                <div>
                  <label>Downstream Recipients</label>
                  <RadioButton labelText={text.everyView} checked={userSettings.notification.file_printed.after_reshared === 2} onClick={() => this.handleFileNotificationSettings('file_printed_downstream', 2)} />
                  <RadioButton labelText={text.firstView} checked={userSettings.notification.file_printed.after_reshared === 1} onClick={() => this.handleFileNotificationSettings('file_printed_downstream', 1)} />
                  <RadioButton labelText={text.neverView} checked={userSettings.notification.file_printed.after_reshared === 0} onClick={() => this.handleFileNotificationSettings('file_printed_downstream', 0)} />
                </div>
              </div>

              {
                teamPermission !== 511 &&
                <div className='form-group'>
                  <div className='well well-sm'>Notify me when...</div>
                  <div className='show'>
                    <Checkbox labelText={text.fileReshared} checked={userSettings.notification.file_reshared === 1} onClick={() => this.handleFileNotificationSettings('file_reshared', userSettings.notification.file_reshared === 1 ? 0 : 1)}/>
                    <Checkbox labelText={text.fileAccessRevoked} checked={userSettings.notification.file_access.revoked === 1} onClick={() => this.handleFileNotificationSettings('file_access_revoked', userSettings.notification.file_access.revoked === 1 ? 0 : 1)}/>
                    <Checkbox labelText={text.fileAccessExpired} checked={userSettings.notification.file_access.expired === 1} onClick={() => this.handleFileNotificationSettings('file_access_expired', userSettings.notification.file_access.expired === 1 ? 0 : 1)}/>
                  </div>
                </div>
              }
            </div>
            <div className='form-group no-border'><button type='button' id='savePreferences' className='btn btn-primary' onClick={() => this.updateUserSettings()}>Save</button></div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateBreadcrumbs: componentActions.updateBreadcrumbs,
  setAppClass: componentActions.setAppClass,
  fetchUserSettings: settingActions.fetchUserSettings,
  requestUpdateUserSettings: settingActions.requestUpdateUserSettings,
  fetchUserSettingsFulfilled: settingActions.fetchUserSettingsFulfilled
};

const mapStateToProps = (state, ownProps) => ({
  teamPermission: state.authReducer.user && state.authReducer.user.team,
  fetchingUserSettings: state.userSettingReducer.fetching,
  errorFetchingUserSettings: state.userSettingReducer.error,
  userSettings: state.userSettingReducer.settings,
  meta: state.userSettingReducer.meta
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedPrefences);
