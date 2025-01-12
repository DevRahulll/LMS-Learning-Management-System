import React, { useEffect } from 'react'
import { BiRupee } from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getRazorPayId, purchasedCourseBundle, verifyUserPayment } from '../../Redux/Slices/RazorpaySlice';
import HomeLayout from '../../Layouts/HomeLayout';

function Checkout() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const razorpayKey = useSelector((state) => state?.razorpay?.key)
    const subcription_id = useSelector((state) => state?.razorpay?.subcription_id)
    const isPaymentVerified = useSelector((state) => state?.razorpay?.isPaymentVerified)
    const userData = useSelector((state) => state?.auth?.data)
    const paymentDetails = {
        razorpay_payment_id: "",
        razorpay_subscription_id: "",
        razorpay_signature: ""
    }

    async function handleSubscription(e) {
        e.preventDefault();
        if (!razorpayKey || !subcription_id) {
            toast.error("Something went wrong");
            return;
        }
        const options = {
            key: razorpayKey,
            subcription_id: subcription_id,
            name: "Coursify PVT. LTD.",
            description: "Subscription",
            theme: {
                color: '#f37254'
            },
            prefill: {
                email: userData.email,
                name: userData.fullName
            },
            handler: async function (response) {
                paymentDetails.razorpay_payment_id = response.razorpay_payment_id;
                paymentDetails.razorpay_signature = response.razorpay_signature;
                paymentDetails.razorpay_subscription_id = response.razorpay_subscription_id;

                toast.success("Payment Successfull");

                const res = await dispatch(verifyUserPayment(paymentDetails));
                (res?.payload?.success) ? navigate("/checkout/sucess") : navigate("/checkout/fail");
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    async function load() {
        await dispatch(getRazorPayId());
        await dispatch(purchasedCourseBundle)
    }

    useEffect(() => {
        load();
    }, [])
    return (
        <HomeLayout>
            <form
                onSubmit={handleSubscription}
                className='min-h-[90vh] flex items-center justify-center text-white'
            >
                <div className="w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-lg relative">
                    <h1 className='bg-yellow-500 absolute top-0 w-full text-center p-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg'>Subscription bundle</h1>
                    <div className="px-4 space-y-5 text-center">
                        <p className="text-[17px]">
                            This purchase will allow you to access all available course of our platform for {" "}
                            <span className='text-yellow-500 font-bold'>
                                <br />
                                1 Year duration.
                            </span>{" "}
                            All the existing and new launched courses will be also available
                        </p>

                        <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
                            <BiRupee /> <span>499</span>only
                        </p>
                        <div className="text-gray-500">
                            <p>100% refund on cancellation</p>
                            <p>* terms and condition applied *</p>
                        </div>
                        <button type='submit'
                            className="bg-yellow-600 text-xl absolute w-full bottom-0 left-0 rounded-bl-lg rounded-br-lg font-bold py-2 hover:bg-yellow-500 transition-all ease-in-out duration-300"
                        >Buy Now</button>
                    </div>
                </div>
            </form>
        </HomeLayout>
    )
}

export default Checkout;


// full error in this page