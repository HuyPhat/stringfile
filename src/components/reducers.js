import { handleActions } from 'redux-actions';
import { TOGGLE_MODAL, UPDATE_BREADCRUMBS, TOGGLE_TAB_PANEL } from './constants';
import {reducer as toastrReducer} from 'react-redux-toastr';

const defaultState = {
  visibleModal: false,
  rootModal: {
    modalName: '',
    ActiveModal: null,
    modalProps: {}
  },
  tabPanel: {
    expandPanel: false,
    tabs: [],
    tabActive: 0,
    tabContents: []
  },
  toastr: {
    toastrs: [],
    confirm: null
  },
  breadcrumbs: [{name: 'My Files', path: '/all-files'}],
  appClass: ''
};

const componentReducer = handleActions(
  {
    TOGGLE_MODAL: (state, action) => {
      return Object.assign({}, state, {
        rootModal: {
          modalProps: action.payload.modalProps,
          modalName: action.payload.modalName,
          ActiveModal: action.payload.ActiveModal
        }
      });
    },
    UPDATE_BREADCRUMBS: (state, action) => {
      return Object.assign({}, state, {
        breadcrumbs: action.payload
      });
    },
    TOGGLE_TAB_PANEL: (state, action) => {
      return Object.assign({}, state, {tabPanel: {
        expandPanel: action.payload.hasOwnProperty('expandPanel') ? action.payload.expandPanel : !state.tabPanel.expandPanel,
        tabs: action.payload.tabs ? action.payload.tabs : [],
        tabContents: action.payload.tabContents ? action.payload.tabContents : []
      }});
    },
    SET_APP_CLASS: ({...rest}, action) => {
      return {
        ...rest,
        appClass: action.payload.appClass
      };
    }
  },
  defaultState
);
export { componentReducer, toastrReducer };
