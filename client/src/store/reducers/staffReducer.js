import {
  STAFF_LOG_IN_SUCCESS,
  STAFF_LOG_IN_ERROR,
  STAFF_SIGN_OUT,
  STAFF_GET_INFO,
} from '../actions/types';

const initialState = {
  user: {},
  token: null,
  error: '',
};

const staffReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case STAFF_LOG_IN_SUCCESS:
      return { ...state, error: '', token: payload };
    case STAFF_LOG_IN_ERROR:
      return { ...state, error: payload };
    case STAFF_GET_INFO:
      return { ...state, user: { ...payload } };
    case STAFF_SIGN_OUT:
      return { ...initialState };
    default:
      return state;
  }
};

export default staffReducer;
