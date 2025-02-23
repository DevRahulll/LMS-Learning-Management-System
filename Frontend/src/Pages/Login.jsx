import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast"
import { login } from "../Redux/Slices/AuthSlice.js";


function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })

    function handleUserInput(e) {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        })
    }

    async function onLoginAccount(e) {
        e.preventDefault();

        if (!loginData.email || !loginData.password) {
            toast.error("Please fill all the details")
            return;
        }

        //dispatch create account action
        const response = await dispatch(login(loginData));
        // console.log(response);
        if (response?.payload?.success)
            navigate("/");

        setLoginData({
            email: "",
            password: "",
        })
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
                <form noValidate onSubmit={onLoginAccount}
                    className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
                    <h1 className="text-center text-2xl font-bold">Login Page</h1>

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
                            value={loginData.email}
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
                            value={loginData.password}
                        />
                    </div>

                    <button
                        className="mt-2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out rounded-md py-2 font-semibold text-lg cursor-pointer"
                        type="submit"
                    >
                        Login
                    </button>

                    <p className="text-center">
                        Do not have an account?<Link to="/signup" className="link text-accent cursor-pointer">Register</Link>
                    </p>

                </form>

            </div>
        </HomeLayout>
    )
}

export default Login;