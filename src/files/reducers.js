import { handleActions } from 'redux-actions';
// import {Map} from 'immutable';
import {
  UPLOAD_FILES,
  UPLOADED_FILE,
  FETCH_FILES,
  FETCH_FILES_FULFILLED,
  FETCH_FILES_REJECTED,
  CREATE_FOLDER,
  CREATE_FOLDER_FULFILLED,
  CREATE_FOLDER_REJECTED,
  GET_FILE_STATS_FULFILLED,
  GET_FILE_STATS_REJECTED,
  GET_FILE_RECIPIENTS_FULFILLED,
  GET_FILE_RECIPIENTS_REJECTED,
  CHANGE_DIRECTORY_META,
  CHANGE_DIRECTORY_META_FULFILLED,
  CHANGE_DIRECTORY_META_REJECTED
} from './constants';
import {insertFiles, getFilesFromPath, normalizePath} from 'utils/files';
import {UPDATE_BREADCRUMBS} from 'components/constants';

const defaultState = {
  files: {
    '%2F': []
  },
  searchedFiles: [],
  filesQueue: [],
  meta: {},
  currentDir: '',
  needUpdate: false,
  loading: false,
  fileStats: {},
  fileRecipients: []
};

const defaultFunc = ({loading, ...state}, action) => {
  return {
    ...state,
    loading: true
  };
};
const defaultFullFilledFunc = ({loading, needUpdate, ...state}, action) => {
  return {
    ...state,
    loading: false,
    needUpdate: true
  };
};
const defaultRejectedFunc = ({loading, needUpdate, ...state}, action) => {
  return {
    ...state,
    loading: false,
    needUpdate: false
  };
};

const fileReducer = handleActions({
  UPLOAD_FILES: (state, action) => {
    return {
      filesQueue: action.payload.filesQueue,
      meta: action.meta
    };
  },
  UPLOADED_FILE: (state, action) => {
    return {
      filesQueue: action.payload.filesQueue,
      meta: action.meta
    };
  },
  FETCH_FILES: ({currentDir, ...state}, action) => {
    return {
      ...state,
      currentDir: action.payload.path
    };
  },
  FETCH_FILES_FULFILLED: ({files, needUpdate, currentDir, ...state}, action) => {
    const newFiles = insertFiles(files, currentDir, action.payload);
    return {
      ...state,
      files: {...newFiles},
      needUpdate: false
    };
  },
  FETCH_FILES_REJECTED: (state, action) => {
    return state;
  },
  CREATE_FOLDER: defaultFunc,
  CREATE_FOLDER_FULFILLED: defaultFullFilledFunc,
  GET_FILE_STATS_FULFILLED: ({fileStats, ...state}, action) => {
    return {
      ...state,
      fileStats: action.payload
    };
  },
  GET_FILE_RECIPIENTS_FULFILLED: ({fileRecipients, ...state}, action) => {
    return {
      ...state,
      fileRecipients: action.payload
    };
  },
  CHANGE_DIRECTORY_META: defaultFunc,
  CHANGE_DIRECTORY_META_FULFILLED: defaultFullFilledFunc
}, defaultState);
export { fileReducer };
