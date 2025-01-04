import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance.js"

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || "",
    data: localStorage.getItem('data') || {}
};

export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
    try {
        const res = axiosInstance.post("user/register", data);

        toast.promise(res, {
            loading: "Wait !! creating your account...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Registration failed. Please try again later."
        });

        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const login = createAsyncThunk("/auth/login", async (data) => {
    try {
        const res = axiosInstance.post("user/login", data);

        toast.promise(res, {
            loading: "Wait !! authenciation in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Login failed. Please try again."
        });

        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const logout=createAsyncThunk("/auth/logout",async()=>{
    try {
        
    } catch (error) {
        
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (buidler) => {
        buidler.addCase(login.fulfilled, (state, action) => {
            console.log(action);
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role;
        })
    }
});

// export const{}=authSlice.actions;
export default authSlice.reducer;