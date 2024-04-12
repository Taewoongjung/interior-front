import React from "react";
import './assets/css/main.css';
import './assets/css/fontawesome-all.min.css';
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import BottomButton from "../../components/BottomButton";
import { useParams } from "react-router-dom";
import BusinessMainScreen from "../../components/BusinessMainScreen";
import MainNav from "../../components/Nav/Main";

const Main = () => {

    const { companyId } = useParams();

    const {data:userData, error, mutate} = useSWR(
        `http://api-interiorjung.shop:7077/api/companies/${companyId}`,
        // `http://localhost:7070/api/companies/${companyId}`,
        fetcher,{
            dedupingInterval: 2000
        });

    console.log("컴포넌트 로그인 데이타 = ", userData);

    return (
        <>
            <body className="is-preload">
                <div id="header">

                    <div className="top">

                        {/*Logo*/}
                        <div id="logo">
                            <span className="image avatar48"><img src="./images/avatar.jpg" alt="" /></span>
                            <h1 id="title">{userData?.company.name}</h1>
                            <p>{userData?.userName}</p>
                        </div>

                        {/*Nav*/}
                        <nav id="nav">
                            <MainNav/>
                        </nav>

                    </div>

                    <div className="bottom">
                        <BottomButton/>
                    </div>

                </div>

                {/*Main*/}
                <div id="main">
                   <BusinessMainScreen/>
                </div>

                {/*Footer*/}
                <div id="footer">

                    {/*Copyright*/}
                    <ul className="copyright">
                        <li>&copy; Untitled. All rights reserved.</li><li>Design: <a href="https://github.com/Taewoongjung">InteriorJung</a></li>
                    </ul>

                </div>

                <script src="assets/js/jquery.min.js"></script>
                <script src="assets/js/jquery.scrolly.min.js"></script>
                <script src="assets/js/jquery.scrollex.min.js"></script>
                <script src="assets/js/browser.min.js"></script>
                <script src="assets/js/breakpoints.min.js"></script>
                <script src="assets/js/util.js"></script>
                <script src="assets/js/main.js"></script>
            </body>
        </>
    )
}

export default Main;