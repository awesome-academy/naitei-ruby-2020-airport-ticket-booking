import {
  STAFF_LOG_IN_SUCCESS,
  STAFF_LOG_IN_ERROR,
  STAFF_SIGN_OUT,
  STAFF_GET_INFO,
} from './types';
import { railsApi } from '../../api/railsApi';
import { reqConfigStaff } from '../../utils/requestConfig';
import { notifyError, notifySuccess } from '../../services/alertService';
import history from '../../utils/history';

export const getStaff = () => async dispatch => {
  try {
    const { data } = await railsApi.get('/staffs/info', reqConfigStaff());
    const token = localStorage.getItem('staffToken');

    dispatch({ type: STAFF_LOG_IN_SUCCESS, payload: token });
    dispatch({ type: STAFF_GET_INFO, payload: data.data });
  } catch (err) {}
};

export const staffLogIn = logInData => async dispatch => {
  try {
    const { data } = await railsApi.post('/staffs/login', logInData);
    localStorage.setItem('staffToken', data.token);

    dispatch({ type: STAFF_LOG_IN_SUCCESS, payload: data.token });
    notifySuccess('Log in successful !!');
    history.push('/staff');
  } catch (err) {
    if (err.response.status === 400 || err.response.status === 404) {
      dispatch({ type: STAFF_LOG_IN_ERROR, payload: err.response.status });
      notifyError(err.response.data.message);
    } else {
      dispatch({ type: STAFF_LOG_IN_ERROR, payload: 500 });
      notifyError('Something went wrong ..');
    }
  }
};

export const staffSignOut = () => dispatch => {
  try {
    localStorage.removeItem('staffToken');
    dispatch({ type: STAFF_SIGN_OUT });
    notifySuccess('Goodbye ..');
  } catch (err) {
    notifyError(err.response.data.message);
  }
};
