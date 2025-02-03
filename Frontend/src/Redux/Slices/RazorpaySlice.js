import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"
import axiosInstance from "../../Helpers/axiosInstance"
import axios from "axios";

const initialState = {
    key: "",
    subscription_id: "",
    isPaymentVerified: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: []
}

export const getRazorPayId = createAsyncThunk("/razorpay/getId", async () => {
    try {
        const res = await axiosInstance.get("/payments/razorpay-key");
        return res.data;
    } catch (error) {
        toast.error("Failed to load Data")
    }
});

export const purchasedCourseBundle = createAsyncThunk("/payments/purchaseCourse", async () => {
    try {
        const response = await axiosInstance.post("/payments/subscribe");
        console.log("Reponse : ", response);
        return response.data
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
});

export const verifyUserPayment = createAsyncThunk("/payments/verify", async (data) => {
    try {
        const response = await axiosInstance.post("/payments/verify", {
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_subscription_id: data.razorpay_subscription_id,
            razorpay_signature: data.razorpay_signature
        })
        return response.data
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
});

export const getPaymentRecord = createAsyncThunk("/payments/record", async () => {
    try {
        const response = await axiosInstance.get("/payments?count=100");

        toast.promise(response, {
            laoding: "Getting the payment records",
            success: (data) => {
                return data?.data?.message
            }
        })
        error: "Failed to get payments records"

        return (await response).data

    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
});

export const cancelCourseBundle = createAsyncThunk("/cancelCourse", async () => {
    try {
        const response = await axiosInstance.post("/payments/unsubscribe");

        toast.promise(response, {
            laoding: "Unscribing...",
            success: "Bundle unsubscribed successfully",
            error: "Failed to Unscribe"
        });

        return (await response).data

    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
});



const razorpaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRazorPayId.fulfilled, (state, action) => {
                state.key = action?.payload?.key;
            })
            .addCase(purchasedCourseBundle.fulfilled, (state, action) => {
                console.log("State :  ", action.payload.subscription_id);
                state.subscription_id = action?.payload?.subscription_id;
            })
            .addCase(verifyUserPayment.fulfilled, (state, action) => {
                toast.success(action?.payload?.message)
                state.isPaymentVerified = action?.payload?.success
            })
            .addCase(verifyUserPayment.rejected, (state, action) => {
                toast.success(action?.payload?.message)
                state.isPaymentVerified = action?.payload?.success
            })
            .addCase(getPaymentRecord.fulfilled, (state, action) => {
                state.allPayments = action?.payload?.allPayments;
                state.finalMonths = action?.payload?.finalMonths;
                state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
            })
    }
})

export default razorpaySlice.reducer;