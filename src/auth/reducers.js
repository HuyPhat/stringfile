import { handleActions } from 'redux-actions';
import { history } from 'AppRoute';
import { DEFAULT_PATH } from '../constants';
/*eslint-disable no-unused-vars*/
import {
  REQUEST_LOGIN,
  REQUEST_LOGIN_FULFILLED,
  REQUEST_LOGIN_REJECTED,
  FETCH_USER,
  FETCH_USER_FULFILLED,
  FETCH_USER_REJECTED,
  REQUEST_LOGOUT,
  REQUEST_LOGOUT_FULFILLED,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_FULFILLED,
  REQUEST_SIGN_UP_STARTER,
  REQUEST_SIGN_UP_STARTER_FULFILLED,
  REQUEST_SIGN_UP_STARTER_REJECTED,
  RESET_SIGN_UP
} from './constants';

const defaultUserState = {
  fetching: false
};

const defaultAuthState = {
  fetching: false,
  loggingOut: false,
  error: null,
  user: {}
};

const defaultSignupState = {
  fetching: false
};

const signupReducer = handleActions({
  REQUEST_SIGN_UP_STARTER: (s, a) => ({
    fetching: true,
    formData: a.payload
  }),
  REQUEST_SIGN_UP_STARTER_FULFILLED: (s, a) => ({
    ...s,
    fetching: false,
    payload: a.payload
  }),
  REQUEST_SIGN_UP_STARTER_REJECTED: (s, a) => ({
    ...s,
    fetching: false,
    error: a.payload
  }),
  RESET_SIGN_UP: (s, a) => defaultSignupState
}, defaultSignupState);

const authReducer = handleActions(
  {
    REQUEST_LOGIN: () => ({
      fetching: true,
      error: null
    }),
    REQUEST_LOGIN_FULFILLED: (state, action) => {
      history.push(DEFAULT_PATH);
      return {
        fetching: false,
        user: action.payload
      };
    },
    REQUEST_LOGIN_REJECTED: (state, action) => {
      if (history.location.pathname !== '/sign-in') {
        history.push('/sign-in');
      }
      return {
        fetching: false,
        error: action.payload
      };
    },
    REQUEST_LOGOUT: () => ({
      fetching: true
    }),
    REQUEST_LOGOUT_FULFILLED: () => ({
      fetching: false,
      user: {}
    }),
    FORGOT_PASSWORD: () => ({
      fetching: true
    }),
    FORGOT_PASSWORD_FULFILLED: (state, action) => ({
      fetching: false,
      payload: action.payload
    }),
    FETCH_USER: state => ({
      fetching: true
    }),
    FETCH_USER_FULFILLED: (state, action) => ({
      fetching: false,
      user: action.payload
    }),
    FETCH_USER_REJECTED: (state, action) => ({
      fetching: false,
      error: action.payload
    })
  },
  defaultAuthState
);
/*eslint-enable no-unused-vars*/
export { authReducer, signupReducer };
