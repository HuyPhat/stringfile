import { makeAjaxRequest, handleAjaxResponse } from 'utils/ajax';
import {Observable} from 'rxjs/Observable';

import {
  FETCH_TEAM_MEMBER,
  FETCH_TEAM_MEMBER_FULLFILLED,
  FETCH_TEAM_MEMBER_REJECTED,
  ADD_TEAM_MEMBER,
  ADD_TEAM_MEMBER_FULLFILLED,
  ADD_TEAM_MEMBER_REJECTED,
  EDIT_TEAM_MEMBER,
  EDIT_TEAM_MEMBER_FULLFILLED,
  EDIT_TEAM_MEMBER_REJECTED,
  REQUEST_MEMBER_CHANGE_PASSWORD,
  REQUEST_MEMBER_CHANGE_PASSWORD_FULLFILLED,
  REQUEST_MEMBER_CHANGE_PASSWORD_REJECTED,
  UPDATE_TEAM_INFO,
  UPDATE_TEAM_INFO_FILLFILLED,
  UPDATE_TEAM_INFO_REJECTED,
  RESEND_INVITATION,
  RESEND_INVITATION_FULLFILLED,
  RESEND_INVITATION_REJECTED,
  RESEND_VERIFICATION,
  RESEND_VERIFICATION_FULLFILLED,
  RESEND_VERIFICATION_REJECTED,
  DELETE_MEMBER,
  DELETE_MEMBER_FULLFILLED,
  DELETE_MEMBER_REJECTED,
  END_POINT
} from './constants';

import {actions as toastrActions} from 'react-redux-toastr';

import actionFunc from './actions';

const {
  fetchTeamMemberFullfilled,
  fetchTeamMemberRejected,
  addTeamMemberFullfilled,
  addTeamMemberRejected,
  editTeamMemberFullfilled,
  editTeamMemberRejected,
  requestMemberChangePasswordFullfilled,
  requestMemberChangePasswordRejected,
  updateTeamInfoFullfilled,
  updateTeamInfoRejected,
  resendInvitationFullfilled,
  resendInvitationRejected,
  deleteMemberFullfilled,
  deleteMemberRejected
} = actionFunc;

const fetchTeamMemberEpic = action$ =>
  action$.ofType(FETCH_TEAM_MEMBER)
    .switchMap(action =>
      makeAjaxRequest(END_POINT.fetch_team_member.method, END_POINT.fetch_team_member.url(action.payload.team_id))
        .map(data => fetchTeamMemberFullfilled(data.response.body.members))
    );
const addTeamMemberEpic = action$ =>
  action$.ofType(ADD_TEAM_MEMBER)
    .switchMap(action => {
      let payload = {
        'invitees': [{
          'first_name': action.payload.first_name,
          'last_name': action.payload.last_name,
          'identity': action.payload.email,
          'job_title': action.payload.job_title ? action.payload.job_title : '',
          'team_member_type': action.payload.member_type,
          'identity_type': 2
        }]
      };
      return makeAjaxRequest(END_POINT.add_team_member.method, END_POINT.add_team_member.url(action.payload.user_id, action.payload.team_id), payload)
        .flatMap(data => {
          let conditions = {
            'response.meta.code >= 400': {
              callbackFunc: addTeamMemberRejected,
              msg: data.response.meta.message,
              toastrType: 'error'
            },
            'response.body.results[0].status === 1': {
              callbackFunc: addTeamMemberFullfilled,
              msg: 'Invitation sent!',
              toastrType: 'success'
            },
            'response.body.results[0].status === 2': {
              callbackFunc: addTeamMemberRejected,
              msg: 'An account already exists for this email address.',
              toastrType: 'error'
            },
            'response.body.results[0].status !== 1 && response.body.results[0].status !== 2': {
              callbackFunc: addTeamMemberRejected,
              msg: 'An invitation has been sent to this email address. Please choose another one.',
              toastrType: 'error'
            }

          };
          return handleAjaxResponse(data, conditions);
        });
    });
const editTeamMemberEpic = action$ =>
  action$.ofType(EDIT_TEAM_MEMBER)
    .switchMap(action => {
      let payload = {
        member_type: action.payload.member_type,
        loc: {
          ip: null,
          lon: null,
          lat: null
        },
        identity: {
          id: action.payload.email,
          type: 'email',
          primary: true
        },
        last_name: action.payload.last_name,
        first_name: action.payload.first_name,
        job_title: action.payload.job_title
      };
      if (action.payload.email_old) {
        payload.email = action.payload.email;
        payload.email_old = action.payload.email_old;
      }

      return makeAjaxRequest(END_POINT.edit_team_member.method, END_POINT.edit_team_member.url(action.payload.team_id, action.payload.user_id), payload)
        .flatMap((data) => {
          return handleAjaxResponse(data, null, editTeamMemberFullfilled, editTeamMemberRejected, 'User successfully updated!');
        });
    });
const requestMemberChangePwdEpic = action$ =>
  action$.ofType(REQUEST_MEMBER_CHANGE_PASSWORD)
    .switchMap(action => {
      return makeAjaxRequest(END_POINT.reset_password.method, END_POINT.reset_password.url(action.payload.uid, action.payload.team_id, action.payload.member_id), {status: 3})
        .flatMap(data => {
          return handleAjaxResponse(data, null, requestMemberChangePasswordFullfilled, requestMemberChangePasswordRejected, 'User successfully updated!');
        });
    });
const updateTeamInfoEpic = action$ =>
  action$.ofType(UPDATE_TEAM_INFO)
    .switchMap(action => {
      let payload = {
        team: action.payload.settings
      };
      return makeAjaxRequest(END_POINT.update_team_info.method, END_POINT.update_team_info.url(action.payload.uid, action.payload.team_id), payload)
        .flatMap(data => {
          return handleAjaxResponse(data, null, updateTeamInfoFullfilled, updateTeamInfoRejected, 'User successfully updated!');
        });
    });
const resendInvitationEpic = action$ =>
  action$.ofType(RESEND_INVITATION)
    .switchMap(action => {
      let payload = {
        invitees: [
          {
            identity: action.payload.identity,
            identity_type: 2,
            action: 'resend'
          }
        ]
      };
      return makeAjaxRequest(END_POINT.resend_invitation.method, END_POINT.resend_invitation.url(action.payload.uid, action.payload.team_id), payload)
        .flatMap(data => {
          return handleAjaxResponse(data, null, resendInvitationFullfilled, resendInvitationRejected, 'Invitation Sent!');
        });
    });
const resendVerificationEpic = action$ =>
  action$.ofType(RESEND_VERIFICATION)
    .switchMap(action => {
      return makeAjaxRequest(END_POINT.resend_verification.method, END_POINT.resend_verification.url(action.payload.email))
        .flatMap(data => {
          return handleAjaxResponse(data, null, resendInvitationFullfilled, resendInvitationRejected, 'Resend email success!');
        });
    });
const deleteMemberEpic = action$ =>
  action$.ofType(DELETE_MEMBER)
    .switchMap(action => {
      let payload = {
        users: [
          {
            identity: action.payload.identity,
            identity_type: action.payload.change === -1 ? 2 : 1,
            change: action.payload.change,
            new_owner: {
              uid: action.payload.new_owner
            }
          }
        ]
      };
      return makeAjaxRequest(END_POINT.delete_member.method,END_POINT.delete_member.url(action.payload.uid, action.payload.team_id), payload)
        .flatMap(data => {
          return handleAjaxResponse(data, null, deleteMemberFullfilled, deleteMemberRejected, 'Delete Successfully!');
        });
    });
export default [
  fetchTeamMemberEpic,
  addTeamMemberEpic,
  editTeamMemberEpic,
  requestMemberChangePwdEpic,
  updateTeamInfoEpic,
  resendInvitationEpic,
  resendVerificationEpic,
  deleteMemberEpic
];
