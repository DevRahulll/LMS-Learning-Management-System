import { configureStore } from '@reduxjs/toolkit'
import authSlicerReducer from './Slices/AuthSlice.js'

const store = configureStore({
    reducer: {
        auth:authSlicerReducer
    },
    devTools: true
});

export default store;