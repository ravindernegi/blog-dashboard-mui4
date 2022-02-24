/*
 * Actions: Dynamic Page
 */
import client from '../../helper/axios';
import { LocalStorageService } from '../../helper/utils';

/*
 * Method: GetPageList
 * Desc: Get page list with this api
 */
const GetPageList = () => async (dispatch) => {
    return await client
        .get(`${process.env.REACT_APP_API_URL}/pages`, {
            headers: {
                authorization: `${LocalStorageService.getAccessToken()}`,
            },
        }).then((response) => {
            // dispatch action
            dispatch({
                type: 'GET_PAGE_LIST',
                payload: response.data.data,
            });
            return response.data;
        }).catch((error) => {
            throw error;
        });
};

/*
 * Method: CreatePage
 * @params: Pass form data to api
 * Desc: Do create page with this api
 */
const CreatePage = (params) => async (dispatch) => {
    console.log("params", params);
    return await client.post(`${process.env.REACT_APP_API_URL}/pages`, params, {
        headers: {
            authorization: `${LocalStorageService.getAccessToken()}`,
        },
    });
};

/*
 * Method: GetPageById
 * Desc: Get page by id this api
 */
const GetPageById = (id) => async (dispatch) => {
    return await client
        .get(`${process.env.REACT_APP_API_URL}/pages/${id}`, {
            headers: {
                authorization: `${LocalStorageService.getAccessToken()}`,
            },
        }).then((response) => {
            // dispatch action
            dispatch({
                type: 'GET_PAGE',
                payload: response.data,
            });
            return response.data;
        }).catch((error) => {
            throw error;
        });
};

/*
 * Method: UpdatePage
 * @params: Pass form data to api
 * Desc: Do update page with this api
 */
const UpdatePage = (params) => async (dispatch) => {
    return await client.put(`${process.env.REACT_APP_API_URL}/pages/${params._id}`, params, {
        headers: {
            authorization: `${LocalStorageService.getAccessToken()}`,
        },
    });
};

/*
 * Method: DeletePage
 * @params: Pass form data to api
 * Desc: Do delete page with this api
 */
const DeletePage = (params) => async (dispatch) => {
    return await client.post(`${process.env.REACT_APP_API_URL}/pages/delete`, {'ids': params}, {
        headers: {
            authorization: `${LocalStorageService.getAccessToken()}`,
        },
    });
};

export default { GetPageList, CreatePage, GetPageById, UpdatePage, DeletePage };
