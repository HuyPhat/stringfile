import { makeAjaxRequest } from 'utils/ajax';
import { Observable } from 'rxjs/Observable';
import { actions, END_POINT } from './constants';
import actionCreators from './actions';
import { FS_TOKEN, FS_UID } from '../constants';

const {
  fetchUserConnectionsFulfilled,
  fetchUserConnectionsRejected
} = actionCreators;

const fetchUserConnections = action$ =>
  action$.ofType(actions.FETCH_USER_CONNECTIONS)
    .switchMap(action => makeAjaxRequest(END_POINT.userConnections.method, END_POINT.userConnections.url(sessionStorage[FS_UID]))
      .map(data => {
        const { response } = data;
        const { body, meta } = response;
        if (body && body.connections) {
          return fetchUserConnectionsFulfilled(body.connections);
        } else {
          return fetchUserConnectionsRejected(meta);
        }
      })
    );

export default [fetchUserConnections];
