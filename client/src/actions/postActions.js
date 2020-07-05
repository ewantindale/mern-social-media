import axios from 'axios';
import { GET_POSTS, ADD_POST, LIKE_POST, ADD_COMMENT, DELETE_POST, POSTS_LOADING } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getPosts = () => (dispatch, getState) => {
  dispatch(setPostsLoading());
  axios
    .get('/api/posts', tokenConfig(getState))
    .then(res => 
      dispatch({
        type: GET_POSTS,
        payload: res.data
      }))
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}

export const getPostsByUser = (id) => (dispatch, getState) => {
  dispatch(setPostsLoading());
  axios
    .get(`/api/posts/user/${id}`)
    .then(res => 
      dispatch({
        type: GET_POSTS,
        payload: res.data
      }))
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}

export const addPost = post => (dispatch, getState) => {
  axios
    .post('/api/posts', post, tokenConfig(getState))
    .then(res => 
      dispatch({
        type: ADD_POST,
        payload: res.data
      }))
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}

export const likePost = id => (dispatch, getState) => {
  axios
    .post(`/api/posts/${id}/like`, null, tokenConfig(getState))
    .then(res => 
      dispatch({
        type: LIKE_POST,
        payload: {
          postId: id,
          userId: getState().auth.user.id
        }
      }))
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}

export const addComment = (id, comment) => (dispatch, getState) => {
  axios
    .post(`/api/posts/${id}/comment`, comment, tokenConfig(getState))
    .then(res => 
      dispatch({
        type: ADD_COMMENT,
        payload: res.data
      }))
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}

export const deletePost = id => (dispatch, getState) => {
  axios
    .delete(`/api/posts/${id}`, tokenConfig(getState))
    .then(res => 
      dispatch({
        type: DELETE_POST,
        payload: id
      }))
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}

export const setPostsLoading = () => {
  return {
    type: POSTS_LOADING
  }
}