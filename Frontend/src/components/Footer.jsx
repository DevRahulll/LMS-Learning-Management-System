import React from 'react'
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs';
import { FaGithub } from "react-icons/fa";

function Footer() {

    const currentDate = new Date();
    const year = currentDate.getFullYear();

    return (
        <>
            <footer className='relative left-0 bottom-0 h-[10vh] py-5 flex flex-col sm:flex-row items-center justify-between text-white bg-gray-800 sm:px-20'>
                <section className="text-lg">
                    Copyright {year} | All rights reserved
                </section>
                <section className="flex items-center justify-center gap-5 text-2xl text-white">
                    <a target='_blank' className='hover:text-yellow-500 transition-all ease-in-out duration-300' href="https://github.com/devrahulll">
                        <FaGithub />
                    </a>
                    <a target='_blank' className='hover:text-yellow-500 transition-all ease-in-out duration-300' href="https://www.linkedin.com/in/devrahulll/">
                        <BsLinkedin />
                    </a>
                    <a target='_blank' className='hover:text-yellow-500 transition-all ease-in-out duration-300' href="https://x.com/RahulDe13551305">
                        <BsTwitter />
                    </a>
                </section>

            </footer>
        </>
    )
}

export default Footer;