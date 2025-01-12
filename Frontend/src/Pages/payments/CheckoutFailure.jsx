import React from 'react'
import HomeLayout from '../../Layouts/HomeLayout'
import { RxCrossCircled } from 'react-icons/rx'
import { Link } from 'react-router-dom'

function CheckoutFailure() {
    return (
        <HomeLayout>
            <div className="min-h-[90vh] flex items-center justify-center text-white">
                <div className="w-80 h-[26rem] flex flex-col justify-center items-center shadow-[0_0_10px_black] rounded-lg relative">
                    <h1 className='absolute bg-red-500 top-0 w-full py-4 text-2xl font-bold text-center rounded-tr-lg rounded-tl-lg'>Payment Failed</h1>

                    <div className="px-4 flex flex-col items-center justify-center space-y-2">
                        <div className="text-center space-y-2">
                            <h2 className='text-lg font-semibold'>
                                Oops! Your Payment Failed
                            </h2>
                            <p className="text-left">
                                Please try again later
                            </p>
                        </div>
                        <RxCrossCircled className='text-red-500 text-5xl ' />
                        <Link to="/checkout" className='bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-300 absolute bottom-0 py-2 text-xl font-semibold text-center rounded-br-lg rounded-bl-lg w-full'>
                            <button>Try Again</button>
                        </Link>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default CheckoutFailure;