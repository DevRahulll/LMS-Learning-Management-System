import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createNewCourse } from '../../Redux/Slices/CourseSlice.js';
import HomeLayout from '../../Layouts/HomeLayout.jsx';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { toast } from "react-hot-toast"

function CreateCourse() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        title: "",
        category: "",
        createdBy: "",
        description: "",
        thumbnail: null,
        previewImage: "",
    });

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setUserInput({
                    ...userInput,
                    previewImage: this.result,
                    thumbnail: uploadedImage
                })
            })
        }
    }

    function handleUserInput(e) {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    }

    async function onFormSubmit(e) {
        e.preventDefault();

        if (!userInput.title || !userInput.description || !userInput.category || !userInput.thumbnail || !userInput.createdBy) {
            toast.error("All fields are mandatory");
            return;
        }

        const response = await dispatch(createNewCourse(userInput));
        console.log(response);
        if (response?.payload?.success) {
            setUserInput({
                title: "",
                category: "",
                createdBy: "",
                description: "",
                thumbnail: null,
                previewImage: "",
            })
            navigate("/courses")
        }
    }


    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh]">
                <form noValidate onSubmit={onFormSubmit}
                    className='flex flex-col gap-5 justify-center text-white p-4 w-[700px] my-10 shadow-[0_0_10px_black] relative'>

                    <Link className='absolute top-8 text-2xl link text-accent cursor-pointer'>
                        <AiOutlineArrowLeft />
                    </Link>

                    <h1 className='text-center text-2xl font-bold'>
                        Create New Course
                    </h1>

                    <main className="grid grid-cols-2 gap-x-10">
                        <div className="gap-y-6">
                            <div className="">
                                <label htmlFor="image_uploads" className='cursor-pointer'>
                                    {userInput.previewImage ? (
                                        <img
                                            className='w-full h-44 m-auto border'
                                            src={userInput.previewImage}
                                        />
                                    ) : (
                                        <div className='w-full h-44 m-auto items-center justify-center border'>
                                            <h1 className='font-bold text-lg'>Upload your course thumbnail</h1>
                                        </div>
                                    )}
                                </label>
                                <input
                                    className='hidden'
                                    type="file"
                                    id='image_uploads'
                                    accept='.jpg, .jpeg, .png, .svg'
                                    name='image_uploads'
                                    onChange={handleImageUpload}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="title" className="text-lg font-semibold">
                                    Course title
                                </label>
                                <input
                                    required
                                    type='text'
                                    name='title'
                                    id='title'
                                    placeholder='Enter course title'
                                    className='bg-transparent px-2 py-1 border'
                                    value={userInput.title}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 ">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="createdBy" className="text-lg font-semibold">
                                    Course Instructor
                                </label>
                                <input
                                    required
                                    type='text'
                                    name='createdBy'
                                    id='createdBy'
                                    placeholder='Enter course Instructor'
                                    className='bg-transparent px-2 py-1 border'
                                    value={userInput.createdBy}
                                    onChange={handleUserInput}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="category" className="text-lg font-semibold">
                                    Course category
                                </label>
                                <input
                                    required
                                    type='text'
                                    name='category'
                                    id='category'
                                    placeholder='Enter course category'
                                    className='bg-transparent px-2 py-1 border'
                                    value={userInput.category}
                                    onChange={handleUserInput}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="description" className="text-lg font-semibold">
                                    Course Description
                                </label>
                                <textarea
                                    required
                                    type='text'
                                    name='description'
                                    id='description'
                                    placeholder='Enter course description'
                                    className='bg-transparent px-2 py-1 h-24 overflow-y-scroll border resize-none'
                                    value={userInput.description}
                                    onChange={handleUserInput}
                                />
                            </div>

                        </div>
                    </main>
                    <button type='submit ' className='w-full py-2 rounded-sm text-lg font-semibold bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300'>
                        Create Course
                    </button>
                </form>
            </div>
        </HomeLayout>
    )
}

export default CreateCourse;


// error in toast at the top but successfullly get or creating the post