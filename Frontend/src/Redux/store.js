import { configureStore } from '@reduxjs/toolkit'
import authSlicerReducer from './Slices/AuthSlice.js'
import courseSliceReducer from './Slices/CourseSlice.js'
import razorpaySliceReducer from './Slices/RazorpaySlice.js'
import lectureSliceReducer from './Slices/LectureSlice.js'

const store = configureStore({
    reducer: {
        auth: authSlicerReducer,
        course: courseSliceReducer,
        razorpay: razorpaySliceReducer,
        lecture: lectureSliceReducer
    },
    devTools: true
});

export default store;