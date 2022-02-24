/*
 * Actions: User
 */
import client from '../../helper/axios';
import { LocalStorageService } from '../../helper/utils';

/*
 * Method: GetUserList
 * Desc: Get user list with this api
 */
const GetUserList = () => async (dispatch) => {
    return await client
        .get(`${process.env.REACT_APP_API_URL}/users`, {
            headers: {
                authorization: `${LocalStorageService.getAccessToken()}`,
            },
        }).then((response) => {
            // dispatch action
            dispatch({
                type: 'GET_USER_LIST',
                payload: response.data.data,
            });
            return response.data;
        }).catch((error) => {
            throw error;
        });
};

/*
 * Method: CreateUser
 * @params: Pass form data to api
 * Desc: Do create user with this api
 */
const CreateUser = (params) => async (dispatch) => {
    return await client.post(`${process.env.REACT_APP_API_URL}/users`, params, {
        headers: {
            authorization: `${LocalStorageService.getAccessToken()}`,
        },
    });
};

/*
 * Method: GetUserById
 * Desc: Get user by id this api
 */
const GetUserById = (id) => async (dispatch) => {
    return await client
        .get(`${process.env.REACT_APP_API_URL}/users/${id}`, {
            headers: {
                authorization: `${LocalStorageService.getAccessToken()}`,
            },
        }).then((response) => {
            // dispatch action
            dispatch({
                type: 'GET_USER',
                payload: response.data,
            });
            return response.data;
        }).catch((error) => {
            throw error;
        });
};

/*
 * Method: UpdateUser
 * @params: Pass form data to api
 * Desc: Do update user with this api
 */
const UpdateUser = (params) => async (dispatch) => {
    return await client.put(`${process.env.REACT_APP_API_URL}/users/${params._id}`, params, {
        headers: {
            authorization: `${LocalStorageService.getAccessToken()}`,
        },
    });
};

/*
 * Method: DeleteUser
 * @params: Pass form data to api
 * Desc: Do delete user with this api
 */
const DeleteUser = (params) => async (dispatch) => {
    return await client.post(`${process.env.REACT_APP_API_URL}/users/delete`, {'ids': params}, {
        headers: {
            authorization: `${LocalStorageService.getAccessToken()}`,
        },
    }).then((response) => {
        console.log("Action", response);
        // dispatch action
        dispatch({
            type: 'DELETE_USER',
            payload: params,
        });
        return response;
    }).catch((error) => {
        throw error;
    });
};

export default { GetUserList, CreateUser, GetUserById, UpdateUser, DeleteUser };
