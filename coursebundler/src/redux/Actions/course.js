import { server } from '../Store';
import axios from 'axios';

export const getAllCourses =
  (category = '', keyword = '') =>
  async dispatch => {
    try {
      dispatch({ type: 'allCourseRequest' });
      const { data } = await axios.get(
        `${server}/courses?keyword=${keyword}&category=${category}`
      );
      dispatch({ type: 'allCourseSuccess', payload: data.courses });
    } catch (error) {
      dispatch({
        type: 'allCourseFail',
        payload: error.response.data.message,
      });
    }
  };

export const addToPlaylist = id => async dispatch => {
  try {
    dispatch({ type: 'addToPlaylistRequest' });
    const { data } = await axios.post(
      `${server}/addtoplaylist`,
      { id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    dispatch({ type: 'addToPlaylistSuccess', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'addToPlaylistFail',
      payload: error.response.data.message,
    });
  }
};

export const getCourseLectures = id => async dispatch => {
  try {
    dispatch({ type: 'getCourseRequest' });
    const { data } = await axios.get(`${server}/course/${id}`, {
      withCredentials: true,
    });
    dispatch({ type: 'getCourseSuccess', payload: data.lectures });
  } catch (error) {
    dispatch({
      type: 'getCourseFail',
      payload: error.response.data.message,
    });
  }
};
