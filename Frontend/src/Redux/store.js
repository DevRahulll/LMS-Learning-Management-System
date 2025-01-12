import { configureStore } from '@reduxjs/toolkit'
import authSlicerReducer from './Slices/AuthSlice.js'
import courseSliceReducer from './Slices/CourseSlice.js'
import razorpaySliceReducer from './Slices/RazorpaySlice.js'

const store = configureStore({
    reducer: {
        auth:authSlicerReducer,
        course:courseSliceReducer,
        razorpay:razorpaySliceReducer
    },
    devTools: true
});

export default store;