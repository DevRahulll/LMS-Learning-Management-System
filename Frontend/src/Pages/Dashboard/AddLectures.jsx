import React, { useEffect, useState } from 'react'
import HomeLayout from '../../Layouts/HomeLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addCourseLecture } from '../../Redux/Slices/LectureSlice';
import toast from 'react-hot-toast';
import { AiOutlineArrowLeft } from 'react-icons/ai';

function AddLectures() {

    const courseDetails = useLocation().state;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        id: courseDetails?._id, //error
        lecture: undefined,
        title: "",
        description: "",
        videoSrc: "",
    })

    function handleInputChange(e) {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    }

    function handleVideo(e) {
        const video = e.target.files[0];
        const source = window.URL.createObjectURL(video);
        console.log("Video Source : ", source);
        setUserInput({
            ...userInput,
            lecture: video,
            videoSrc: source
        })
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        if (!userInput.lecture || !userInput.title || !userInput.description) {
            toast.error("All fields are mandatory")
            return;
        }
        const response = await dispatch(addCourseLecture(userInput));
        if (response?.payload?.success) {
            navigate(-1)
            setUserInput({
                id: courseDetails?._id,
                lecture: undefined,
                title: "",
                description: "",
                videoSrc: "",
            })
        }
    }

    useEffect(() => {
        if (!courseDetails) navigate("/courses")
    }, [])


    return (
        <HomeLayout>
            <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-16">
                <div className="flex flex-col p-2 shadow-[0_0_10px_black] w-96 rounded-lg">
                    <header className='flex items-center justify-center relative'>
                        <button className='absolute left-2 text-xl text-green-500'
                            onClick={() => navigate(-1)}
                        >
                            <AiOutlineArrowLeft />
                        </button>
                        <h1 className='text-xl text-yellow-500 font-semibold'>
                            Add new Lecture
                        </h1>
                    </header>
                    <form noValidate onSubmit={onFormSubmit} className='flex flex-col gap-3'>
                        <input
                            type="text"
                            name='title'
                            placeholder='enter the title of the lecture'
                            className='bg-transparent px-3  py-1 border rounded-sm'
                            onChange={handleInputChange}
                            value={userInput.title}
                        />
                        <textarea
                            type="text"
                            name='description'
                            placeholder='enter the description of the lecture'
                            className='bg-transparent px-3  py-1 border rounded-sm resize-none overflow-y-scroll h-36 '
                            onChange={handleInputChange}
                            value={userInput.description}
                        />
                        {userInput.videoSrc ? (
                            <video
                                muted
                                src={userInput.videoSrc}
                                controls
                                controlsList='nodownload nofullscreen'
                                disablePictureInPicture
                                className='object-fill rounded-tl-lg rounded-tr-lg w-full'
                            ></video>
                        )
                            : (
                                <div className="h-48 flex items-center justify-center cursor-pointer ">
                                    <label htmlFor="lecture" className='font-semibold cursor-pointer text-xl'>Choose your video</label>
                                    <input
                                        type="file"
                                        className='hidden'
                                        id='lecture'
                                        name='lecture'
                                        onChange={handleVideo}
                                        accept='video/mp4 video/x-mp4 video/*'
                                    />
                                </div>
                            )}
                        <button type='submit' className='btn btn-primary py-1 font-semibold text-lg'>
                            Add new Lecture
                        </button>
                    </form>
                </div>
            </div>
        </HomeLayout>
    )
}

export default AddLectures;