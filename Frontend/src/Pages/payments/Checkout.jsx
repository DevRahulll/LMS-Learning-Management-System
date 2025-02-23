import React, { useEffect } from 'react'
import { BiRupee } from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast"
import { getRazorPayId, purchasedCourseBundle, verifyUserPayment } from '../../Redux/Slices/RazorpaySlice';
import HomeLayout from '../../Layouts/HomeLayout';

function Checkout() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const razorpayKey = useSelector((state) => state?.razorpay?.key)
    const subscription_id = useSelector((state) => state?.razorpay?.subscription_id)


    const paymentDetails = {
        razorpay_payment_id: "",
        razorpay_subscription_id: "",
        razorpay_signature: ""
    }

    async function handleSubscription(e) {
        e.preventDefault();
        if (!razorpayKey || !subscription_id) {
            toast.error("Something went wrong ");
            return;
        }

        const options = {
            key: razorpayKey,
            subscription_id: subscription_id,
            name: "DEV PVT. LTD.",
            description: "Subscription",
            theme: {
                color: '#f37254'
            },
            // prefill: {  // it used to prefill the data in razorpay for good ux experience
            // },
            handler: async function (response) {
                

                if (!response.razorpay_payment_id || !response.razorpay_signature || !response.razorpay_subscription_id) {
                    console.error("Invalid Razorpay response:", response); // Debugging
                    toast.error("Invalid payment response. Please try again.");
                    return;
                }


                paymentDetails.razorpay_payment_id = response.razorpay_payment_id;
                paymentDetails.razorpay_signature = response.razorpay_signature;
                paymentDetails.razorpay_subscription_id = response.razorpay_subscription_id;

                console.log("Payment Details send to backend:", paymentDetails); 
                const res = await dispatch(verifyUserPayment(paymentDetails));
                

                if (res?.payload?.success) {
                    toast.success("Payment verified Successfull");
                    navigate('/checkout/success')
                } else {
                    toast.error("Payment Verification failed");
                    navigate('/checkout/fail')
                }

            },
            modal: {
                ondismiss: function () {
                    toast.error("Payment was not completed. Please try again.");
                }
            }

        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    async function load() {
        await dispatch(getRazorPayId());
        await dispatch(purchasedCourseBundle());
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


