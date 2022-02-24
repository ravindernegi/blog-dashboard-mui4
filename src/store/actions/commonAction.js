/*
 * Actions: Common
 */
//import client from '../../helper/axios';

/*
 * Method: Snackbar
 * @params: Pass form data to api
 * Desc: Set snackbar values on this api
 */
const Snackbar = (params) => async (dispatch) => {
    return await dispatch({
        type: 'UPDATE_SNACKBAR',
        payload: params,
    });
};



export default { Snackbar };
