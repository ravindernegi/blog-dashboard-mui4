import { combineReducers } from 'redux'
import auth from './authReducer';
import common from './commonReducer';
import user from './userReducer';
import dynamicPage from './dynamicPageReducer';
export default combineReducers({
    auth,
    common,
    user,
    dynamicPage
})