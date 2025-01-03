import React from 'react'
import HomeLayout from '../Layouts/HomeLayout.jsx';
import { Link } from 'react-router-dom';
import homePageImage from "../Assets/Images/homePageMainImage.png"

function HomePage() {

    return (
        <HomeLayout>
            <div className="pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[90vh]">
                <div className="w-1/2 space-y-6 ">
                    <h1 className='text-5xl font-semibold'>
                        Find Out
                        <span className='text-yellow-500 font-bold'>
                            Online Courses
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        we have a large library of courses taught by highly skilled and qualified faculties at a very affordable cost
                    </p>

                    <div className="space-x-6">
                        <Link to='/courses'>
                            <button className='bg-yellow-600 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-700 transition-all ease-in-out duration-300'>
                                Explore courses
                            </button>
                        </Link>

                        <Link to='/contact'>
                            <button className='border border-yellow-600 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-700 transition-all ease-in-out duration-300'>
                                Contact Us
                            </button>
                        </Link>

                    </div>
                </div>

                <div className="w-1/2 flex items-center justify-center">
                    <img src={homePageImage} alt="homepage image" />
                </div>
            </div>
        </HomeLayout>
    )
}

export default HomePage;