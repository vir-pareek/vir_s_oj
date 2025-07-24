import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import questionReducer from './questionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        questions: questionReducer
    }
});


