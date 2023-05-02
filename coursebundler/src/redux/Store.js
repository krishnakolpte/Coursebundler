import { configureStore } from '@reduxjs/toolkit';
import { adminReducer } from './reducers/adminReducer';
import { courseReducer } from './reducers/courseReducer';
import { otherReducer } from './reducers/otherReducer';
import {
  profileReduser,
  subscriptionReducer,
  userReducer,
} from './reducers/userReducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    profile: profileReduser,
    course: courseReducer,
    subscription: subscriptionReducer,
    admin: adminReducer,
    other: otherReducer,
  },
});

export default store;

export const server = 'http://localhost:4000/api/v1';
