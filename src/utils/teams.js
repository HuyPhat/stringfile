import moment from 'moment';
export const MT_VIEW_ONLY_RECEIVER = 1 << 0;
export const MT_RESHAEABLE_RECEIVER = 1 << 1;
export const MT_SENDER = 1 << 2;
export const MT_ADMIN = 1 << 3;
export const MT_SUPER_ADMIN = 1 << 4;
const PERM_VIEW_RECEIVED_FILES = 1 << 0;
const PERM_DELETE_RECEIVED_FILES = 1 << 1;
const PERM_VIEW_PERSONAL_FILE_METADATA = 1 << 2;
const PERM_MOVE_RECEIVED_FILES = 1 << 3;
// MT_RESHAREABLE_RECEIVE;
// ====================================;
const PERM_RESHARE_RECEIVED_FILES = 1 << 4;
const PERM_CHANGE_RECIPIENT_PERMS = 1 << 5;
const PERM_REVOKE_MY_RECIPIENT = 1 << 6; // see 1<<2
const PERM_VIEW_SENT_FILE_REPORT = 1 << 7;
const PERM_CREATE_PERSONAL_GROUP = 1 << 8;

// MT_SENDER
// ===============================
const PERM_STRING_FILE = 1 << 9;
const PERM_PUSH_FILE_UPDATE = 1 << 10;
// MT_ADMIN;
// ===============================================;
const PERM_DEFINE_MEMBER_TYPE = 1 << 11;
const PERM_INVITE_TEAM_MEMBER = 1 << 12;
const PERM_DELETE_PENDING_MEMBER = 1 << 13;
const PERM_UPDATE_PENDING_MEMBER = 1 << 14;
const PERM_UPDATE_MY_INFO = 1 << 15;
const PERM_UPDATE_MANAGED_TEAM_MEMBER_INFO = 1 << 16;
const PERM_DELETE_MANAGED_TEAM_MEMBER = 1 << 17;
const PERM_REQUEST_MANAGED_MEMBER_RESET_PASSWORD = 1 << 18;
const PERM_REQUEST_MEMBER_RESET_PASSWORD = 1 << 19;
const PERM_CREATE_TEAM_GROUP = 1 << 20;
const PERM_UPDATE_TEAM_GROUP = 1 << 21;
const PERM_DELETE_TEAM_GROUP = 1 << 22;
const PERM_VIEW_FILE_RECIPIENTS = 1 << 23;
const PERM_REVOKE_RECIPIENT = 1 << 24; // even not my recipient. See 1<<;
const PERM_SET_PASSWORD_RESTRICTIONS = 1 << 25;
const PERM_SUSPEND_SENDER = 1 << 26;
const PERM_SUSPEND_RECEIVER = 1 << 27;
const PERM_VIEW_CONNECTED_DEVICES_BY_MEMBER = 1 << 28;
const PERM_UNLINK_DEVICE_BY_MEMBER = 1 << 29;
const PERM_VIEW_MEMBER_LIST = 1 << 30;
// MT_SUPER_ADMI;
// ========================================;
// Delete any use;
const PERM_DELETE_TEAM_MEMBER = 1 << 31;
const PERM_UPDATE_TEAM_MEMBER_INFO = 1 << 32;
const PERM_CHANGE_BILLING_INFO = 1 << 33;
const PERM_CANCEL_MY_ACCOUNT = 1 << 34;
const PERM_SUSPEND_ADMIN = 1 << 35;
const PERM_REASSIGN_ROLE = 1 << 36;

export const getUserTypeName = ($role) => {
  switch ($role) {
    case MT_ADMIN:
      return 'Administrator';
      // break;
    case MT_SENDER:
      return 'Sender';
      // break;
    case MT_VIEW_ONLY_RECEIVER:
      return 'Viewer';
      // break;
    case MT_RESHAEABLE_RECEIVER:
      return 'Re-Sharer';
      // break;
    default:
      return 'Account Owner';
              // break;
  }
};
export const mapUserType = ($role) => {
  switch ($role) {
    case MT_ADMIN:
      return 'administrator';
    case MT_SENDER:
      return 'sender';
    case MT_VIEW_ONLY_RECEIVER:
      return 'viewer';
    case MT_RESHAEABLE_RECEIVER:
      return 'reshare';
    default:
      return '';
  }
};

export const getStatusName = (status) => {
  switch (status) {
    case -1:
      return 'Active';
    case 0:
      return 'Pending';
    case 1:
      return 'Active';
    default:
      return 'N/A';
  }
};
export const isPasswordChanged = (member) => {
  if (member) {
    if (member.password_changes.password_request_change_date === null) {
      return true;
    } else
    {return (moment(member.password_changes.password_change_date).isAfter(moment(member.password_changes.password_request_change_date)));}
  }
  return false;
};
export const checkPermission = (currentUser, member) => {
  if (currentUser && member.uid) {
    return member.team.member_type < currentUser.team.member_type;
  } else {
    return false;
  }
};
