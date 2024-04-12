import React from "react";
import './styles.css';
import useSWR from "swr";
import fetcher from "../../../utils/fetcher";

const ManagementNav = ((props: { userName?: string; userEmail?: string; }) => {
    const {userName, userEmail} = props;

    const {data:userData, error, mutate} = useSWR(
        'http://api-interiorjung.shop:7077/api/me',
        // 'http://localhost:7070/api/me',
        fetcher);

    return(
        <>
            <nav className="navbar">
                <div className="navbar_logo">
                    <div>
                        {userName}
                        <p>{userEmail}</p>
                    </div>
                </div>

                <ul className="navbar_menu">
                    <li>Home</li>
                    <li>About</li>
                    <li>Goal</li>
                    <li>Project</li>
                </ul>

                <div className="navbar_contact">
                    <a href="mailto:kimboyoon0908@gmail.com"><i className="fa-regular fa-envelope"></i></a>
                    <a href="https://github.com/kimboyoon" target="_blank"><i className="fa-brands fa-github"></i></a>
                    <a href=""><i className="fa-brands fa-blogger-b"></i></a>
                </div>

                <a href="#" className="toggleBtn">
                    <i className="fa-solid fa-bars"></i>
                </a>

            </nav>

            <script src="nav.js"></script>
        </>
    )
})

export default ManagementNav;