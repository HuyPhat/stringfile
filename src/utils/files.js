import {extensionsIcons, FILE_TYPE} from '../constants';
import * as Utils from 'utils/utils';

export const getExtension = (name) => {
  return name.split('.').pop().toLowerCase();
};

export const getIconForMineType = (extension, is_dir, name) => {
  if (is_dir) {
    if (name && name.toLowerCase() === 'FileString Received Files'.toLowerCase()) {
      return 'icon-folder-f';
    }
    return 'icon-folder';
  }
  for (var i = 0; i < extensionsIcons.length; i++) {
    if (extension.indexOf(extensionsIcons[i].ext) > -1) {
      return extensionsIcons[i].icon;
    }
  }
  return 'icon-text';
};

export const loadBreadcrumbs = (path) => {
  const pathArr = path.split('/');
  const results = [];
  let url = '/';
  let hasRoot = false;
  for (var i = 0; i < pathArr.length; i++) {
    if (pathArr[i].length) {
      if (pathArr[i] === 'all-files' && !hasRoot) {
        url += pathArr[i];
        hasRoot = true;
        results.push({name: 'My Files', path: url});
      } else {
        url += '/' + encodeURIComponent(pathArr[i]);
        results.push({name: decodeURIComponent(pathArr[i]), path: url});
      }
    }
  }
  return results;
};

export const normalizePath = (path) => {
  let pathname = path;
  if (!pathname.length) {
    pathname = '/';
  }
  if (pathname.indexOf('/all-files/') === 0) {
    pathname = pathname.replace('/all-files/', '/');
  } else if (pathname.indexOf('/all-files') === 0) {
    pathname = pathname.replace('/all-files', '/');
  }
  return encodeURIComponent(pathname);
};

export const insertFiles = (files, path, newFiles) => {
  if (!files[path]) {
    files[path] = [];
  }
  files[path] = newFiles;
  return files;
};

export const getFilesFromPath = (files, path) => {
  if (!path.length) {
    return files['%2F'];
  } else if ((path === '%2F' && !files[path].length) || !files[path]) {
    return null;
  }
  return files[path];
};

export const fileSize = (size, is_dir) => {
  if (!is_dir) {
    let string;
    let sizeNum;
    if (size >= 1024 * 1024 * 1024 * 1024 / 10) {
      sizeNum = size / (1024 * 1024 * 1024 * 1024 / 10);
      string = 'Tb';
    } else if (size >= 1024 * 1024 * 1024 / 10) {
      sizeNum = size / (1024 * 1024 * 1024 / 10);
      string = 'Gb';
    } else if (size >= 1024 * 1024 / 10) {
      sizeNum = size / (1024 * 1024 / 10);
      string = 'Mb';
    } else if (size >= 1024 / 10) {
      sizeNum = size / (1024 / 10);
      string = 'Kb';
    } else {
      sizeNum = size * 10;
      string = 'b';
    }
    return (Math.round(size) / 10) + ' ' + string;
  } else {
    return '';
  }
};

export const fsSort = (a, b, field, reverse) => {
  if ((a.location.is_dir && !b.location.is_dir) || a.name === 'FileString Received Files') {
    return -1;
  }
  if ((b.location.is_dir && !a.location.is_dir) || b.name === 'FileString Received Files') {
    return 1;
  }
  let tmp1 = '';
  let tmp2 = '';
  let fcs1 = '';
  let fcs2 = '';
  if (tmp1 === null) {
    tmp1 = '';
  }
  if (tmp2 === null) {
    tmp2 = '';
  }
  if (a.fcs && a.fcs === 'fcs' && field === 'name') {
    fcs1 = 'FCS';
  }
  if (b.fcs && b.fcs === 'fcs' && field === 'name') {
    fcs2 = 'FCS';
  }
  if (!reverse) {
    return Utils.naturalSort(fcs1 + Utils.getValuePath(a, field).toString().toUpperCase() + tmp1.toString().toUpperCase(), fcs2 + Utils.getValuePath(b, field).toString().toUpperCase() + tmp2.toString().toUpperCase());
  } else {
    return Utils.naturalSort(fcs2 + Utils.getValuePath(b, field).toString().toUpperCase() + tmp1.toString().toUpperCase(), fcs1 + Utils.getValuePath(a, field).toString().toUpperCase() + tmp2.toString().toUpperCase());
  }
};

export const orderFile = (items, field, reverse) => {
  let filtered = [];
  items.map((item) => {
    filtered.push(item);
  });

  filtered.sort((a, b) => fsSort(a, b, field, reverse));
  return filtered;
};

export const getFileType = (fileName) => {
  const extension = getExtension(fileName);
  return FILE_TYPE[extension];
};

export const getFileOwnerName = (file) => {
  if (file.ownership === 1) {
    return 'Me';
  } else {
    return file.sharing.owner.name;
  }
};
