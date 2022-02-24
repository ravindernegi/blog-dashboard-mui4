const initialState = {
    submitSnackbar: {
        status: false,
        messages: '',
        error: false,
        timeout: 2000,
    },
};

// Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_SNACKBAR':
            return { ...state, submitSnackbar: action.payload };
        case 'OTHER':
            return state;
        default:
            return state;
    }
};
