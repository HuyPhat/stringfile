import ENV_VARIABLES from 'config/variables';

export const FETCH_TEAM_MEMBER = 'FETCH_TEAM_MEMBER';
export const FETCH_TEAM_MEMBER_FULLFILLED = 'FETCH_TEAM_MEMBER_FULLFILLED';
export const FETCH_TEAM_MEMBER_REJECTED = 'FETCH_TEAM_MEMBER_REJECTED';
export const ADD_TEAM_MEMBER = 'ADD_TEAM_MEMBER';
export const ADD_TEAM_MEMBER_FULLFILLED = 'ADD_TEAM_MEMBER_FULLFILLED';
export const ADD_TEAM_MEMBER_REJECTED = 'ADD_TEAM_MEMBER_REJECTED';
export const EDIT_TEAM_MEMBER = 'EDIT_TEAM_MEMBER';
export const EDIT_TEAM_MEMBER_FULLFILLED = 'EDIT_TEAM_MEMBER_FULLFILLED';
export const EDIT_TEAM_MEMBER_REJECTED = 'EDIT_TEAM_MEMBER_REJECTED';
export const REQUEST_MEMBER_CHANGE_PASSWORD = 'REQUEST_MEMBER_CHANGE_PASSWORD';
export const REQUEST_MEMBER_CHANGE_PASSWORD_FULLFILLED = 'REQUEST_MEMBER_CHANGE_PASSWORD_FULLFILLED';
export const REQUEST_MEMBER_CHANGE_PASSWORD_REJECTED = 'REQUEST_MEMBER_CHANGE_PASSWORD_REJECTED';
export const UPDATE_TEAM_INFO = 'UPDATE_TEAM_INFO';
export const UPDATE_TEAM_INFO_FULLFILLED = 'UPDATE_TEAM_INFO_FULLFILLED';
export const UPDATE_TEAM_INFO_REJECTED = 'UPDATE_TEAM_INFO_REJECTED';
export const RESEND_INVITATION = 'RESEND_INVITATION';
export const RESEND_INVITATION_FULLFILLED = 'RESEND_INVITATION_FULLFILLED';
export const RESEND_INVITATION_REJECTED = 'RESEND_INVITATION_REJECTED';
export const RESEND_VERIFICATION = 'RESEND_VERIFICATION';
export const RESEND_VERIFICATION_FULLFILLED = 'RESEND_VERIFICATION_FULLFILLED';
export const RESEND_VERIFICATION_REJECTED = 'RESEND_VERIFICATION_REJECTED';
export const DELETE_MEMBER = 'DELETE_MEMBER';
export const DELETE_MEMBER_FULLFILLED = 'DELETE_MEMBER_FULLFILLED';
export const DELETE_MEMBER_REJECTED = 'DELETE_MEMBER_REJECTED';

export const END_POINT = {
  fetch_team_member: {
    url: (team_id) => `${ENV_VARIABLES.API_SERVER}team/${team_id}/members`,
    method: 'GET'
  },
  add_team_member: {
    url: (user_id, team_id) => `${ENV_VARIABLES.API_SERVER}user/${user_id}/team/${team_id}/invite`,
    method: 'POST'
  },
  edit_team_member: {
    url: (team_id, member_uid) => `${ENV_VARIABLES.API_SERVER}team/${team_id}/member/${member_uid}`,
    method: 'POST'
  },
  reset_password: {
    url: (uid, team_id, member_uid) => `${ENV_VARIABLES.API_SERVER}user/${uid}/team/${team_id}/member/${member_uid}/password`,
    method: 'POST'
  },
  update_team_info: {
    url: (uid, team_id) => `${ENV_VARIABLES.API_SERVER}user/${uid}/team/${team_id}`,
    method: 'POST'
  },
  resend_verification: {
    url: (email) => `${ENV_VARIABLES.API_SERVER}user/identity/${email}/activation-code?is_changed=true&temaiype=team`,
    method: 'GET'
  },
  resend_invitation: {
    url: (uid, team_id) => `${ENV_VARIABLES.API_SERVER}user/${uid}/team/${team_id}/invite`,
    method: 'POST'
  },
  delete_member: {
    url: (uid, team_id) => `${ENV_VARIABLES.API_SERVER}user/${uid}/team/${team_id}/membership/change`,
    method: 'POST'
  }
};
