import ENV_VARIABLES from 'config/variables';

export const UPLOAD_FILES = 'UPLOAD_FILES';
export const UPLOADED_FILE = 'UPLOADED_FILE';
export const FETCH_FILES = 'FETCH_FILES';
export const FETCH_FILES_FULFILLED = 'FETCH_FILES_FULFILLED';
export const FETCH_FILES_REJECTED = 'FETCH_FILES_REJECTED';
export const UPDATE_CURRENT_DIR = 'UPDATE_CURRENT_DIR';
export const CREATE_FOLDER = 'CREATE_FOLDER';
export const CREATE_FOLDER_FULFILLED = 'CREATE_FOLDER_FULFILLED';
export const CREATE_FOLDER_REJECTED = 'CREATE_FOLDER_REJECTED';
export const GET_FILE_STATS = 'GET_FILE_STATS';
export const GET_FILE_STATS_FULFILLED = 'GET_FILE_STATS_FULFILLED';
export const GET_FILE_STATS_REJECTED = 'GET_FILE_STATS_REJECTED';
export const GET_FILE_RECIPIENTS = 'GET_FILE_RECIPIENTS';
export const GET_FILE_RECIPIENTS_FULFILLED = 'GET_FILE_RECIPIENTS_FULFILLED';
export const GET_FILE_RECIPIENTS_REJECTED = 'GET_FILE_RECIPIENTS_REJECTED';
export const CHANGE_DIRECTORY_META = 'CHANGE_DIRECTORY_META';
export const CHANGE_DIRECTORY_META_FULFILLED = 'CHANGE_DIRECTORY_META_FULFILLED';
export const CHANGE_DIRECTORY_META_REJECTED = 'CHANGE_DIRECTORY_META_REJECTED';

export const END_POINT = {
  upload_file: {
    url: `${ENV_VARIABLES.FILE_SERVER}/upload`,
    method: 'POST'
  },
  fetch_files: {
    url: `${ENV_VARIABLES.API_SERVER}files`,
    method: 'GET'
  },
  create_folder: {
    url: `${ENV_VARIABLES.API_SERVER}directory`,
    method: 'POST'
  },
  get_file_stats: {
    url: (file_id) => `${ENV_VARIABLES.API_SERVER}file/${file_id}/stats`,
    method: 'GET'
  },
  get_file_recipients: {
    url: (file_id) => `${ENV_VARIABLES.API_SERVER}file/${file_id}/recipients`,
    method: 'GET'
  },
  change_directory_meta: {
    url: (directory_id) => `${ENV_VARIABLES.API_SERVER}directory/${directory_id}/meta`,
    method: 'POST'
  }
};
