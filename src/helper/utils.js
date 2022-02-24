// Set all LocalStorage value
import Actions from '../store/actions';

export const LocalStorageService = (function () {
    let _service;
    function _getService() {
        if (!_service) {
            _service = this;
            return _service;
        }
        return _service;
    }
    function _setLoginInfo(tokenObj) {
        localStorage.setItem('accessToken', tokenObj.accessToken);
        //localStorage.setItem('userInfo', tokenObj.userInfo);
        localStorage.setItem('refreshToken', tokenObj.refreshToken);
    }
    function _getAccessToken() {
        return localStorage.getItem('accessToken');
    }
    function _clearToken() {
        localStorage.removeItem('accessToken');
        //localStorage.removeItem('userInfo');
        localStorage.removeItem('refreshToken');
    }
    return {
        getService: _getService,
        setLoginInfo: _setLoginInfo,
        getAccessToken: _getAccessToken,
        clearToken: _clearToken,
    };
})();

// check if user logged in
export const isLogin = () => {
    if (localStorage.getItem('USER')) {
        return true;
    }
    return false;
}

// set message for fields
export const setMessage = (message, name) => {
    if(message && name){
        return message.replace('{name}', name);
    }
    return '';
}

// Set Snackbar msg API
export const setSnackbarMsg = (dispatch, message, error=false, status=true, timeout=2000) => {
    dispatch(Actions.commonAction.Snackbar({
        status: status,
        messages: message,
        error: error,
        timeout: timeout,
    }));
}
