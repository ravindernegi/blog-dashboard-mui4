const initialState = {
    userList: [],
    userById: {}
};

// Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case 'GET_USER_LIST':
            return { ...state, userList: action.payload };
        case 'GET_USER':
            return { ...state, userById: action.payload };
        case 'DELETE_USER':
            return { ...state, userList: userList.list.filter(item => !action.payload.includes(item._id)) }
        default:
            return state;
    }
};
