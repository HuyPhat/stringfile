import { handleActions } from 'redux-actions';
import {
  FETCH_TEAM_MEMBER,
  FETCH_TEAM_MEMBER_FULLFILLED,
  FETCH_TEAM_MEMBER_REJECTED,
  ADD_TEAM_MEMBER,
  ADD_TEAM_MEMBER_FULLFILLED,
  ADD_TEAM_MEMBER_REJECTED,
  REQUEST_MEMBER_CHANGE_PASSWORD,
  REQUEST_MEMBER_CHANGE_PASSWORD_FULLFILLED,
  REQUEST_MEMBER_CHANGE_PASSWORD_REJECTED,
  UPDATE_TEAM_INFO_FILLFILLED,
  RESEND_INVITATION,
  RESEND_INVITATION_FULLFILLED,
  RESEND_INVITATION_REJECTED,
  RESEND_VERIFICATION,
  RESEND_VERIFICATION_FULLFILLED,
  RESEND_VERIFICATION_REJECTED,
  DELETE_MEMBER,
  DELETE_MEMBER_FULLFILLED,
  DELETE_MEMBER_REJECTED
} from './constants';

const defaultState = {
  members: [],
  loading: false,
  error: false,
  needRefresh: false
};
const defaultFunc = ({...rest}, action) => {
  return {
    ...rest,
    loading: true
  };
};
const defaultFullFilledFunc = ({...rest}, action) => {
  return {
    ...rest,
    loading: false,
    needRefresh: true
  };
};
const defaultRejectedFunc = ({...rest}, action) => {
  return {
    ...rest,
    loading: false,
    error: true,
    needRefresh: false
  };
};
const teamReducer = handleActions({
  FETCH_TEAM_MEMBER: (state, action) => {
    return state;
  },
  FETCH_TEAM_MEMBER_FULLFILLED: ({memebers, needRefresh, ...state}, action) => {
    return {
      ...state,
      needRefresh: false,
      members: action.payload
    };
  },
  FETCH_TEAM_MEMBER_REJECTED: (state, action) => {
    return state;
  },
  ADD_TEAM_MEMBER: defaultFunc,
  ADD_TEAM_MEMBER_FULLFILLED: defaultFullFilledFunc,
  ADD_TEAM_MEMBER_REJECTED: defaultRejectedFunc,
  EDIT_TEAM_MEMBER: defaultFunc,
  EDIT_TEAM_MEMBER_FULLFILLED: defaultFullFilledFunc,
  EDIT_TEAM_MEMBER_REJECTED: defaultRejectedFunc,
  REQUEST_MEMBER_CHANGE_PASSWORD: defaultFunc,
  REQUEST_MEMBER_CHANGE_PASSWORD_FULLFILLED: defaultFullFilledFunc,
  REQUEST_MEMBER_CHANGE_PASSWORD_REJECTED: defaultRejectedFunc,
  UPDATE_TEAM_INFO_FILLFILLED: defaultFullFilledFunc,
  RESEND_INVITATION: defaultFunc,
  RESEND_INVITATION_FULLFILLED: defaultFullFilledFunc,
  RESEND_VERIFICATION: defaultFunc,
  RESEND_VERIFICATION_FULLFILLED: defaultFullFilledFunc,
  DELETE_MEMBER: defaultFunc,
  DELETE_MEMBER_FULLFILLED: defaultFullFilledFunc,
  DELETE_MEMBER_REJECTED: defaultRejectedFunc

}, defaultState);

export { teamReducer };
