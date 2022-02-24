const initialState = {
    loggedInUser: {},
};

// Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case 'GET_LOGEDIN_USER':
            return { ...state, loggedInUser: action.payload.user };
        case 'OTHER':
            return { state };
        default:
            return state;
    }
};
