import {
  LOG_IN_SUCCESS,
  LOG_IN_ERROR,
  SIGN_UP_SUCCESS,
  SIGN_UP_ERROR,
  CLEAR_ERROR_MESSAGE,
  SIGN_OUT,
  GET_INFO,
  LOADING_USER,
} from './types';
import { railsApi } from '../../api/railsApi';
import { reqConfig } from '../../utils/requestConfig';
import { notifyError, notifySuccess } from '../../services/alertService';
import history from '../../utils/history';

const loadingUser = () => {
  return { type: LOADING_USER };
};

export const getUser = () => async dispatch => {
  dispatch(loadingUser());
  try {
    const { data } = await railsApi.get('/auth/me', reqConfig());
    const token = localStorage.getItem('token');

    dispatch({ type: LOG_IN_SUCCESS, payload: token });
    dispatch({ type: GET_INFO, payload: data.data });
  } catch (err) {}
};

export const logIn = logInData => async dispatch => {
  try {
    const { data } = await railsApi.post('/auth/login', logInData);
    localStorage.setItem('token', data.token);

    dispatch({ type: LOG_IN_SUCCESS, payload: data.token });
    notifySuccess('Log in successful !!');
    history.push('/');
  } catch (err) {
    if (err.response.status === 400 || err.response.status === 404) {
      dispatch({ type: LOG_IN_ERROR, payload: err.response.status });
      notifyError(err.response.data.message);
    } else {
      dispatch({ type: LOG_IN_ERROR, payload: 500 });
      notifyError('Something went wrong ..');
    }
  }
};

export const signUp = signUpData => async dispatch => {
  try {
    const { data } = await railsApi.post('/signup', signUpData);
    localStorage.setItem('token', data.token);

    dispatch({ type: SIGN_UP_SUCCESS, payload: data.token });
    notifySuccess('Sign up successful !!');
    history.push('/');
  } catch (err) {
    if (err.response.status === 400) {
      dispatch({ type: SIGN_UP_ERROR, payload: 400 });
      notifyError(err.response.data.message);
    } else {
      dispatch({ type: SIGN_UP_ERROR, payload: 500 });
      notifyError('Something went wrong ..');
    }
  }
};

export const signOut = () => dispatch => {
  try {
    localStorage.removeItem('token');
    dispatch({ type: SIGN_OUT });
    notifySuccess('Goodbye ..');
  } catch (err) {
    notifyError(err.response.data.message);
  }
};

export const updateInfo = updateData => async dispatch => {
  console.log(updateData);
  try {
    const { data } = await railsApi.put(
      `/customers/${updateData.id}`,
      updateData,
      reqConfig()
    );

    dispatch({ type: GET_INFO, payload: data.customer });
    notifySuccess('Update successful !!');
  } catch (err) {
    notifyError('Something went wrong ..');
  }
};

export const clearErrorMessage = () => dispatch => {
  dispatch({ type: CLEAR_ERROR_MESSAGE });
};
