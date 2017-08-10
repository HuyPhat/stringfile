import createActions from 'utils/createActions';
import {actions} from './constants';

const sessionActions = {...createActions(actions)};
export default sessionActions;
