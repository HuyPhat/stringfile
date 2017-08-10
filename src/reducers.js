import { combineReducers } from 'redux';
import { authReducer, signupReducer } from './auth/reducers';
import { componentReducer, toastrReducer } from './components/reducers';
import { fileReducer } from './files/reducers';
import { teamReducer } from './teams/reducers';
// import { loadingBarReducer } from 'react-redux-loading-bar';
import { userConnectionsReducer } from './people/reducers';
import { userSettingReducer } from './settings/reducers';

const rootReducer = combineReducers({
  authReducer,
  componentReducer,
  toastr: toastrReducer,
  fileReducer,
  teamReducer,
  // loadingBar: loadingBarReducer,
  signupReducer,
  userConnectionsReducer,
  userSettingReducer
});

export default rootReducer;
