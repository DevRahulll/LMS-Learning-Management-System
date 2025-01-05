import { configureStore } from '@reduxjs/toolkit'
import authSlicerReducer from './Slices/AuthSlice.js'
import courseSliceReducer from './Slices/CourseSlice.js'

const store = configureStore({
    reducer: {
        auth:authSlicerReducer,
        course:courseSliceReducer
    },
    devTools: true
});

export default store;