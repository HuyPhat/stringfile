import { makeAjaxRequest, handleAjaxResponse } from 'utils/ajax';
import {Observable} from 'rxjs/Observable';
import {
  ADD_TOASTR
} from 'react-redux-toastr/src/constants';

import { FS_TOKEN, FS_UID } from '../constants';
import {
  UPLOAD_FILES,
  END_POINT,
  FETCH_FILES,
  CREATE_FOLDER,
  CREATE_FOLDER_FULFILLED,
  CREATE_FOLDER_REJECTED,
  GET_FILE_STATS,
  GET_FILE_RECIPIENTS,
  CHANGE_DIRECTORY_META,
  CHANGE_DIRECTORY_META_FULFILLED,
  CHANGE_DIRECTORY_META_REJECTED
} from './constants';
import actionFunc from './actions';
import * as FilesUtils from 'utils/files';

const {
  uploadedFile,
  fetchFilesFulfilled,
  fetchFilesRejected,
  createFolderFulfilled,
  createFolderRejected,
  getFileStatsFulfilled,
  getFileStatsRejected,
  getFileRecipientsFulfilled,
  getFileRecipientsRejected,
  changeDirectoryMetaFulfilled,
  changeDirectoryMetaRejected
} = actionFunc;

const uploadFilesEpic = action$ => {
  return action$.ofType(UPLOAD_FILES)
    .switchMap((action) => {
      return action.payload.files.map(file => {
        // uploadFile(file);
        return uploadedFile({});
      });
    });
};
// .subscribe((x) => {console.log(x); console.log('asdsad');});

const fetchFilesEpic = action$ => {
  return action$.ofType(FETCH_FILES)
    .switchMap(action => {
      const payload = action.payload || {};
      const params = {
        path: payload.path || '%2F',
        count_mode: payload.count_mode || 3,
        ownership: payload.ownership || 1,
        q: payload.keyword || ''
      };
      let url = END_POINT.fetch_files.url +
      '?path=' + params.path +
      '&count_mode=' + params.count_mode +
      '&ownership=' + params.ownership;
      if (payload.keyword) {
        url += '&q=' + payload.keyword;
      }
      return makeAjaxRequest(END_POINT.fetch_files.method, url)
        .map(data => {
          const {response} = data;
          const {body, meta} = response;
          if (body && body.filestring && body.filestring.items) {
            return fetchFilesFulfilled(body.filestring.items);
          } else {
            return fetchFilesRejected(meta);
          }
        });
    });
};

const createFolderEpic = action$ => {
  return action$.ofType(CREATE_FOLDER)
    .switchMap(action => {
      return makeAjaxRequest(END_POINT.create_folder.method, END_POINT.create_folder.url, action.payload)
        .flatMap(data => {
          const folder_name = action.payload.directories[0].location.name;
          return handleAjaxResponse(data, null, createFolderFulfilled, createFolderRejected, folder_name + ' created');
        });
    });
};

const changeDirectoryMetaEpic = action$ => {
  return action$.ofType(CHANGE_DIRECTORY_META)
    .switchMap(action => {
      return makeAjaxRequest(END_POINT.change_directory_meta.method, END_POINT.change_directory_meta.url(action.payload.directory_id), action.payload.data)
        .flatMap(data => {
          return handleAjaxResponse(data, null, changeDirectoryMetaFulfilled, changeDirectoryMetaRejected);
        });
    });
};

const getFileStats = action$ => {
  return action$.ofType(GET_FILE_STATS)
    .switchMap(action => {
      return makeAjaxRequest(END_POINT.get_file_stats.method, END_POINT.get_file_stats.url(action.payload))
        .map(data => {
          const {response} = data;
          const {body, meta} = response;
          if (body && body.stats) {
            return getFileStatsFulfilled(body.stats);
          } else {
            return getFileStatsRejected(meta);
          }
        });
    });
};

const getFileRecipients = action$ => {
  return action$.ofType(GET_FILE_RECIPIENTS)
    .switchMap(action => {
      return makeAjaxRequest(END_POINT.get_file_recipients.method, END_POINT.get_file_recipients.url(action.payload))
        .map(data => {
          const {response} = data;
          const {body, meta} = response;
          if (body && body.recipients) {
            return getFileRecipientsFulfilled(body.recipients);
          } else {
            return getFileRecipientsRejected(meta);
          }
        });
    });
};

export default [
  uploadFilesEpic,
  fetchFilesEpic,
  createFolderEpic,
  getFileStats,
  getFileRecipients,
  changeDirectoryMetaEpic
];
