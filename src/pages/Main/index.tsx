import React from "react";
import './assets/css/main.css';
import './assets/css/fontawesome-all.min.css';
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import BottomButton from "../../components/BottomButton";
import { useParams, useLocation } from "react-router-dom";

const Main = () => {

    let { companyId } = useParams();

    const {data:userData, error, mutate} = useSWR(
        // `http://localhost:7070/api/companies/${companyId}`,
        `http://api-interiorjung.shop:7077/api/companies/${companyId}`,
        fetcher,{
            dedupingInterval: 2000
        });

    console.log("컴포넌트 로그인 데이타 = ", userData);

    const companyName = userData?.company.name;
    const userName = userData?.userName;

    return (
        <>
            <div id="header">

                <div className="top">

                    {/*Logo*/}
                    <div id="logo">
                        <span className="image avatar48"><img src="images/avatar.jpg" alt="" /></span>
                        <h1 id="title">{companyName}</h1>
                        <p>{userName}</p>
                    </div>

                    {/*Nav*/}
                    <nav id="nav">
                        <ul>
                            <li><a href="#top" id="top-link"><span className="icon solid fa-home">Intro</span></a></li>
                            <li><a href="#portfolio" id="portfolio-link"><span className="icon solid fa-th">Portfolio</span></a></li>
                            <li><a href="#about" id="about-link"><span className="icon solid fa-user">About Me</span></a></li>
                            <li><a href="#contact" id="contact-link"><span className="icon solid fa-envelope">Contact</span></a></li>
                        </ul>
                    </nav>

                </div>

                <div className="bottom">
                    <BottomButton/>
                </div>

            </div>

            {/*Main*/}
            <div id="main">

                {/*Intro*/}
                <section id="top" className="one dark cover">
                    <div className="container">

                        <header>
                            <h2 className="alt">Hi! I'm <strong>Prologue</strong>, a <a href="http://html5up.net/license">free</a> responsive<br />
                                site template designed by <a href="http://html5up.net">HTML5 UP</a>.</h2>
                            <p>Ligula scelerisque justo sem accumsan diam quis<br />
                                vitae natoque dictum sollicitudin elementum.</p>
                        </header>

                        <footer>
                            <a href="#portfolio" className="button scrolly">Magna Aliquam</a>
                        </footer>

                    </div>
                </section>

                {/*Portfolio*/}
                <section id="portfolio" className="two">
                    <div className="container">

                        <header>
                            <h2>Portfolio</h2>
                        </header>

                        <p>Vitae natoque dictum etiam semper magnis enim feugiat convallis convallis
                            egestas rhoncus ridiculus in quis risus amet curabitur tempor orci penatibus.
                            Tellus erat mauris ipsum fermentum etiam vivamus eget. Nunc nibh morbi quis
                            fusce hendrerit lacus ridiculus.</p>

                        <div className="row">
                            <div className="col-4 col-12-mobile">
                                <article className="item">
                                    <a href="#" className="image fit"><img src="images/pic02.jpg" alt="" /></a>
                                    <header>
                                        <h3>Ipsum Feugiat</h3>
                                    </header>
                                </article>
                                <article className="item">
                                    <a href="#" className="image fit"><img src="images/pic03.jpg" alt="" /></a>
                                    <header>
                                        <h3>Rhoncus Semper</h3>
                                    </header>
                                </article>
                            </div>
                            <div className="col-4 col-12-mobile">
                                <article className="item">
                                    <a href="#" className="image fit"><img src="images/pic04.jpg" alt="" /></a>
                                    <header>
                                        <h3>Magna Nullam</h3>
                                    </header>
                                </article>
                                <article className="item">
                                    <a href="#" className="image fit"><img src="images/pic05.jpg" alt="" /></a>
                                    <header>
                                        <h3>Natoque Vitae</h3>
                                    </header>
                                </article>
                            </div>
                            <div className="col-4 col-12-mobile">
                                <article className="item">
                                    <a href="#" className="image fit"><img src="images/pic06.jpg" alt="" /></a>
                                    <header>
                                        <h3>Dolor Penatibus</h3>
                                    </header>
                                </article>
                                <article className="item">
                                    <a href="#" className="image fit"><img src="images/pic07.jpg" alt="" /></a>
                                    <header>
                                        <h3>Orci Convallis</h3>
                                    </header>
                                </article>
                            </div>
                        </div>

                    </div>
                </section>

                {/*About Me*/}
                <section id="about" className="three">
                    <div className="container">

                        <header>
                            <h2>About Me</h2>
                        </header>

                        <a href="#" className="image featured"><img src="images/pic08.jpg" alt="" /></a>

                        <p>Tincidunt eu elit diam magnis pretium accumsan etiam id urna. Ridiculus
                            ultricies curae quis et rhoncus velit. Lobortis elementum aliquet nec vitae
                            laoreet eget cubilia quam non etiam odio tincidunt montes. Elementum sem
                            parturient nulla quam placerat viverra mauris non cum elit tempus ullamcorper
                            dolor. Libero rutrum ut lacinia donec curae mus vel quisque sociis nec
                            ornare iaculis.</p>

                    </div>
                </section>

                {/*Contact*/}
                <section id="contact" className="four">
                    <div className="container">

                        <header>
                            <h2>Contact</h2>
                        </header>

                        <p>Elementum sem parturient nulla quam placerat viverra
                            mauris non cum elit tempus ullamcorper dolor. Libero rutrum ut lacinia
                            donec curae mus. Eleifend id porttitor ac ultricies lobortis sem nunc
                            orci ridiculus faucibus a consectetur. Porttitor curae mauris urna mi dolor.</p>

                        <form method="post" action="#">
                            <div className="row">
                                <div className="col-6 col-12-mobile"><input type="text" name="name" placeholder="Name" /></div>
                                <div className="col-6 col-12-mobile"><input type="text" name="email" placeholder="Email" /></div>
                                <div className="col-12">
                                    <textarea name="message" placeholder="Message"></textarea>
                                </div>
                                <div className="col-12">
                                    <input type="submit" value="Send Message" />
                                </div>
                            </div>
                        </form>

                    </div>
                </section>

            </div>

            {/*Footer*/}
            <div id="footer">

                {/*Copyright*/}
                <ul className="copyright">
                    <li>&copy; Untitled. All rights reserved.</li><li>Design: <a href="http://html5up.net">HTML5 UP</a></li>
                </ul>

            </div>

            <script src="assets/js/jquery.min.js"></script>
            <script src="assets/js/jquery.scrolly.min.js"></script>
            <script src="assets/js/jquery.scrollex.min.js"></script>
            <script src="assets/js/browser.min.js"></script>
            <script src="assets/js/breakpoints.min.js"></script>
            <script src="assets/js/util.js"></script>
            <script src="assets/js/main.js"></script>
        </>
    )
}

export default Main;