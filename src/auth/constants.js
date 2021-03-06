import ENV_VARIABLES from 'config/variables';
export const actions = {
  REQUEST_LOGIN: 'REQUEST_LOGIN',
  REQUEST_LOGIN_FULFILLED: 'REQUEST_LOGIN_FULFILLED',
  REQUEST_LOGIN_REJECTED: 'REQUEST_LOGIN_REJECTED',
  FETCH_USER: 'FETCH_USER',
  FETCH_USER_FULFILLED: 'FETCH_USER_FULFILLED',
  FETCH_USER_REJECTED: 'FETCH_USER_REJECTED',
  REQUEST_LOGOUT: 'REQUEST_LOGOUT',
  REQUEST_LOGOUT_FULFILLED: 'REQUEST_LOGOUT_FULFILLED',
  LOG_IN_SUCCESS: 'LOG_IN_SUCCESS',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  FORGOT_PASSWORD_FULFILLED: 'FORGOT_PASSWORD_FULFILLED',
  FORGOT_PASSWORD_REJECT: 'FORGOT_PASSWORD_REJECT',
  REQUEST_SIGN_UP_STARTER: 'REQUEST_SIGN_UP_STARTER',
  REQUEST_SIGN_UP_STARTER_FULFILLED: 'REQUEST_SIGN_UP_STARTER_FULFILLED',
  REQUEST_SIGN_UP_STARTER_REJECTED: 'REQUEST_SIGN_UP_STARTER_REJECTED',
  RESET_SIGN_UP: 'RESET_SIGN_UP'
};

export const END_POINT = {
  login: {
    url: `${ENV_VARIABLES.API_SERVER}user/session`,
    method: 'POST'
  },
  logout: {
    url: (uid) => `${ENV_VARIABLES.API_SERVER}user/session/${uid}?_method=delete`,
    method: 'POST'
  },
  forgot: {
    url: (email) => `${ENV_VARIABLES.API_SERVER}user/password?identity=${email}`,
    method: 'GET'
  },
  user: {
    url: `${ENV_VARIABLES.API_SERVER}user`,
    method: 'GET'
  },
  signupStarter: {
    url: `${ENV_VARIABLES.API_SERVER}user`,
    method: 'POST'
  }
};
