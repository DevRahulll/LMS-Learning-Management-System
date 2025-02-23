import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
    allUseraccount: 0,
    subscribedUsersCount: 0,
}

export const getStatsData = createAsyncThunk("stats/get", async () => {
    try {
        const response =await axiosInstance.get("/admin/stats/users");
        
        toast.promise(Promise.resolve(response.data), {
            loading: "Getting the stats...",
            success: (data) => {
                return data?.data?.message || "Stats fetched successfully"
            },
            error: "Failed to Load Data"
        });
        return (await response)?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message||"Failed to fetch stats")
    }
})

const statSlice = createSlice({
    name: "stat",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getStatsData.fulfilled, (state, action) => {
            state.allUseraccount = action?.payload?.allUseraccount;
            state.subscribedUsersCount = action?.payload?.subscribedUsersCount;
        })
    }
});

export default statSlice.reducer;