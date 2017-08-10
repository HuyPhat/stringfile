import { combineEpics } from 'redux-observable';
import authEpics from 'auth/epics';
import fileEpics from 'files/epics';
import teamEpics from 'teams/epics';
import userConnectionsEpics from 'people/epics';
import userSettings from 'settings/epics';

const rootEpics = combineEpics(...authEpics, ...fileEpics, ...teamEpics, ...userConnectionsEpics, ...userSettings);
export default rootEpics;
