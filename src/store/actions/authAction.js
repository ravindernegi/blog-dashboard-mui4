/*
 * Actions: Auth
 */
import client from '../../helper/axios';
import { LocalStorageService } from '../../helper/utils';

/*
 * Method: Login
 * @params: Pass form data to api
 * Desc: Do login with this api
 */
const Login = (params) => async (dispatch) => {
  return await client
    .post(`${process.env.REACT_APP_API_URL}/auth/login`, params)
    .then((response) => {
      // dispatch action
      dispatch({
        type: 'GET_LOGEDIN_USER',
        payload: response.data.data,
      });
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

/*
 * Method: Logout
 * @params: Pass form data to api
 * Desc: Do logout with this api
 */
const Logout = (params) => async (dispatch) => {
  return await client.get(`${process.env.REACT_APP_API_URL}/auth/logout`, {
    headers: {
      authorization: `${LocalStorageService.getAccessToken()}`,
    },
  });
};

/*
 * Method: GetAuth
 * Desc: Get auth detail with this api
 */
const GetAuth = () => async (dispatch) => {
  return await client
    .get(`${process.env.REACT_APP_API_URL}/auth`, {
      headers: {
        authorization: `${LocalStorageService.getAccessToken()}`,
      },
    })
    .then((response) => {
      // dispatch action
      dispatch({
        type: 'GET_LOGEDIN_USER',
        payload: response.data.data,
      });
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

/*
 * Method: ForgotPassword
 * @params: Pass form data to api
 * Desc: Do reset password with this api
 */
const ForgotPassword = (params) => async (dispatch) => {
  return await client.post(
    `${process.env.REACT_APP_API_URL}/auth/forgotpassword`,
    params
  );
};

/*
 * Method: Change Password
 * @params: Pass form data to api
 * Desc: Do change password with this api
 */
const ChangePassword = (params) => async (dispatch) => {
  return await client.post(
    `${process.env.REACT_APP_API_URL}/auth/change-password`,
    params,
    {
      headers: {
        authorization: `${LocalStorageService.getAccessToken()}`,
      },
    }
  );
};

export default { Login, Logout, GetAuth, ForgotPassword, ChangePassword };
