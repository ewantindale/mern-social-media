import axios from 'axios';
import { returnErrors } from './errorActions';

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  FOLLOW_USER,
  UPLOAD_FAIL,
  UPDATE_USER,
  UPDATE_USER_FAIL
} from './types';

export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  axios.get('/api/auth/user', tokenConfig(getState))
    .then(res => dispatch({ 
      type: USER_LOADED,
      payload: res.data
    }))
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

export const followUser = id => (dispatch, getState) => {
  axios
    .post(`/api/users/follow/${id}`, null, tokenConfig(getState))
    .then(res => 
      dispatch({
        type: FOLLOW_USER,
        payload: {
          id,
          userId: getState().auth.user.id
        }
      }))
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}


export const register = ({ name, bio, email, password }) => dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ name, bio, email, password });

  axios.post('/api/users', body, config)
    .then(res => dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    }))
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
      dispatch({
        type: REGISTER_FAIL
      })
    })
}

export const login = ({ email, password }) => dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ email, password });

  axios.post('/api/auth', body, config)
    .then(res => dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    }))
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
      dispatch({
        type: LOGIN_FAIL
      })
    })
}

export const updateProfilePicture = data => (dispatch, getState) => {
  const token = getState().auth.token;
  const config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  axios.post('/upload', data, config).then(res => console.log(res.data))
  .catch(err => {
    dispatch(returnErrors(err.response.data, err.response.status, 'UPLOAD_FAIL'))
  })
}

export const updateUser = (data) => (dispatch, getState) => {
  axios.patch(`/api/users/`, data, tokenConfig(getState))
    .then(res => dispatch({
      type: UPDATE_USER,
      payload: res.data
    }))
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_USER_FAIL'));
      dispatch({
        type: UPDATE_USER_FAIL
      })
    })
}

export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
}

// This helper function supplies the authentication token and is used in the above requests to private routes
export const tokenConfig = getState => {
  const token = getState().auth.token;

  const config = {
    headers: {
      "Content-type": "application/json"
    }
  }

  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
}

