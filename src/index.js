import 'rxjs';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRoute from './AppRoute';
import store from './store';
// import 'sanitize.css/sanitize.css';
import './app.scss';
// import registerServiceWorker from './registerServiceWorker';
ReactDOM.render(
  <Provider store={store}>
    <AppRoute />
  </Provider>,
  document.getElementById('root')
);
/*
Block drag and drop in document
*/
document.addEventListener('dragover', (event) => {
  if (event.target.className.indexOf('fileAPI') === -1 && event.target.className.indexOf('drop-zone') === -1) {
    event.preventDefault();
  }
}, false);
document.addEventListener('drop', (event) => {
  if (event.target.className.indexOf('fileAPI') === -1 && event.target.className.indexOf('drop-zone') === -1) {
    event.preventDefault();
  }
}, false);
// registerServiceWorker();
