import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast"
import { createAccount } from "../Redux/Slices/AuthSlice.js";
import { isEmail, isValidPassword } from "../Helpers/regexMatcher.js";


function Signup() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [previewImage, setPreviewImage] = useState("");
    const [signupData, setSignUpData] = useState({
        fullName: "",
        email: "",
        password: "",
        avatar: ""
    })

    function handleUserInput(e) {
        const { name, value } = e.target;
        setSignUpData({
            ...signupData,
            [name]: value
        })
    }

    function getImage(e) {
        e.preventDefault();
        // getting the image
        const uploadedImage = e.target.files[0];

        if (uploadedImage) {
            setSignUpData({
                ...signupData,
                avatar: uploadedImage
            });
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                // console.log(this.result);
                setPreviewImage(this.result)
            })
        }
    }

    async function createNewAccount(e) {
        e.preventDefault();

        if (!signupData.email || !signupData.password || !signupData.fullName || !signupData.avatar) {
            toast.error("Please fill all the details")
            return;
        }

        //checking name field length
        if (signupData.fullName.length < 4) {
            toast.error("Name should be atleast 4 characters")
            return;
        }

        //checking valid email id
        if (!isEmail(signupData.email)) {
            toast.error("Invalid email Id");
            return;
        }

        //checking password validation
        if (!isValidPassword(signupData.password)) {
            toast.error("Password should contain atleast a string and special character");
            return;
        }

        const formData = new FormData();
        formData.append('fullName', signupData.fullName);
        formData.append('email', signupData.email);
        formData.append('password', signupData.password);
        formData.append('avatar', signupData.avatar);

        //dispatch create account action
        const response = await dispatch(createAccount(formData));
        // console.log(response?.payload);
        if (response?.payload?.success)
            navigate("/");

        setSignUpData({
            fullName: "",
            email: "",
            password: "",
            avatar: ""
        })
        setPreviewImage("");

    }

    // console.log(signupData);

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
                <form noValidate onSubmit={createNewAccount}
                    className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
                    <h1 className="text-center text-2xl font-bold">Registration Page</h1>

                    <label htmlFor="image_uploads" className="cursor-pointer">
                        {previewImage ? (
                            <img className="w-24 h-24 rounded-full m-auto" src={previewImage} />
                        ) : (
                            <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
                        )}
                    </label>
                    <input
                        onChange={getImage}
                        className="hidden"
                        type="file"
                        id="image_uploads"
                        name="image_uploads"
                        accept=".jpg, .jpeg, .png, .svg"
                    />

                    <div className="flex flex-col gap-1">
                        <label htmlFor="fullName" className="font-semibold">FullName</label>
                        <input
                            className="bg-transparent px-2 py-1 border rounded-md"
                            type="text"
                            required
                            id="fullName"
                            name="fullName"
                            placeholder="Enter Your fullName..."
                            onChange={handleUserInput}
                            value={signupData.fullName}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <input
                            className="bg-transparent px-2 py-1 border rounded-md"
                            type="email"
                            required
                            id="email"
                            name="email"
                            placeholder="Enter Your Email"
                            onChange={handleUserInput}
                            value={signupData.email}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-semibold">Password</label>
                        <input
                            className="bg-transparent px-2 py-1 border rounded-md"
                            type="password"
                            required
                            id="password"
                            name="password"
                            placeholder="Enter Your Password"
                            onChange={handleUserInput}
                            value={signupData.password}
                        />
                    </div>

                    <button
                        className="mt-2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out rounded-md py-2 font-semibold text-lg cursor-pointer"
                        type="submit"
                    >
                        Create Account
                    </button>

                    <p className="text-center">
                        Already have an account?<Link to="/login" className="link text-accent cursor-pointer">Login</Link>
                    </p>

                </form>

            </div>
        </HomeLayout>
    )
}

export default Signup;