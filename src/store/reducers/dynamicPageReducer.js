const initialState = {
    pageList: [],
    pageById: {}
};

// Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case 'GET_PAGE_LIST':
            return { ...state, pageList: action.payload };
        case 'GET_PAGE':
            return { ...state, pageById: action.payload };
        default:
            return state;
    }
};
