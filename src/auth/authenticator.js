import { FS_TOKEN, FS_UID } from '../constants';
class Auth {

  static loggedIn() {
    return !!sessionStorage[FS_TOKEN];
  }

  static setAuth(token, uid) {
    sessionStorage.setItem(FS_TOKEN, token);
    sessionStorage.setItem(FS_UID, uid);
  }

  static logOut() {
    sessionStorage.removeItem(FS_UID);
    sessionStorage.removeItem(FS_TOKEN);
  }
}

export default Auth;
