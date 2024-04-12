import React, {useEffect, useState} from "react";
import {useLocation} from 'react-router-dom';
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import BusinessMaterialAddInput from "./BusinessMaterialAddInput";

const BusinessMainScreen = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [businessId, setBusinessId] = useState('');

    const {data:businessesMaterial, error, mutate} = useSWR(
        `http://api-interiorjung.shop:7077/api/businesses/${businessId}`,
        // `http://localhost:7070/api/businesses/${businessId}`,
        fetcher);

    console.log("businessesMaterial = ", businessesMaterial?.businessMaterialList);

    useEffect(() => {
        if (queryParams.size !== 0) {
            // @ts-ignore
            setBusinessId(queryParams.get('businessId')[0]);

            mutate();
        }
    }, [businessId]);

    return (
        <>
            {/*Intro*/}
            {/*<section id="top" className="one dark cover">*/}
            {/*    <div className="container">*/}

            {/*        <header>*/}
            {/*            <h2 className="alt">Hi! I'm <strong>Prologue</strong>, a <a href="http://html5up.net/license">free</a> responsive<br />*/}
            {/*                site template designed by <a href="http://html5up.net">HTML5 UP</a>.</h2>*/}
            {/*            <p>Ligula scelerisque justo sem accumsan diam quis<br />*/}
            {/*                vitae natoque dictum sollicitudin elementum.</p>*/}
            {/*        </header>*/}

            {/*        <footer>*/}
            {/*            <a href="#portfolio" className="button scrolly">Magna Aliquam</a>*/}
            {/*        </footer>*/}

            {/*    </div>*/}
            {/*</section>*/}

            {/*Portfolio*/}
            <section id="portfolio" className="two">
                <div className="container">
                    {queryParams.size === 0 && <div className="default_msg"><u>← 메뉴에서 사업을 선택해주세요</u></div>}

                    {queryParams.size !== 0 &&
                        <section>
                            <BusinessMaterialAddInput businessIdParam={businessId}/>
                        </section>
                    }

                    {queryParams.size !== 0 &&
                        <header>
                            <h2>인테리어 재료 목록</h2>
                        </header>
                    }

                    {queryParams.size !== 0 &&
                        <div className="row">
                            <div className="col-12 col-100-mobile">
                                <article className="item">
                                    <div className="table-container">
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>재료 명</th>
                                                <th>수량</th>
                                                <th>카테고리</th>
                                                <th>메모</th>
                                                <th></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {businessesMaterial?.businessMaterialList.length > 0 ? (
                                                    businessesMaterial.businessMaterialList.map((material: { id: string | number | bigint | null | undefined; name: React.ReactNode; amount: React.ReactNode; category: React.ReactNode; memo: React.ReactNode; }) => (
                                                        <tr key={material.id}>
                                                            <td>{material.name}</td>
                                                            <td>{material.amount}</td>
                                                            <td>{material.category}</td>
                                                            <td>{material.memo}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td align={"center"} colSpan={4}>데이터가 없습니다.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </article>
                            </div>
                        </div>
                    }
                </div>
            </section>

            {/*/!*About Me*!/*/}
            {/*<section id="about" className="three">*/}
            {/*    <div className="container">*/}

            {/*        <header>*/}
            {/*            <h2>About Me</h2>*/}
            {/*        </header>*/}

            {/*        <a href="#" className="image featured"><img src="images/pic08.jpg" alt="" /></a>*/}

            {/*        <p>Tincidunt eu elit diam magnis pretium accumsan etiam id urna. Ridiculus*/}
            {/*            ultricies curae quis et rhoncus velit. Lobortis elementum aliquet nec vitae*/}
            {/*            laoreet eget cubilia quam non etiam odio tincidunt montes. Elementum sem*/}
            {/*            parturient nulla quam placerat viverra mauris non cum elit tempus ullamcorper*/}
            {/*            dolor. Libero rutrum ut lacinia donec curae mus vel quisque sociis nec*/}
            {/*            ornare iaculis.</p>*/}

            {/*    </div>*/}
            {/*</section>*/}

            {/*/!*Contact*!/*/}
            {/*<section id="contact" className="four">*/}
            {/*    <div className="container">*/}

            {/*        <header>*/}
            {/*            <h2>Contact</h2>*/}
            {/*        </header>*/}

            {/*        <p>Elementum sem parturient nulla quam placerat viverra*/}
            {/*            mauris non cum elit tempus ullamcorper dolor. Libero rutrum ut lacinia*/}
            {/*            donec curae mus. Eleifend id porttitor ac ultricies lobortis sem nunc*/}
            {/*            orci ridiculus faucibus a consectetur. Porttitor curae mauris urna mi dolor.</p>*/}

            {/*        <form method="post" action="#">*/}
            {/*            <div className="row">*/}
            {/*                <div className="col-6 col-12-mobile"><input type="text" name="name" placeholder="Name" /></div>*/}
            {/*                <div className="col-6 col-12-mobile"><input type="text" name="email" placeholder="Email" /></div>*/}
            {/*                <div className="col-12">*/}
            {/*                    <textarea name="message" placeholder="Message"></textarea>*/}
            {/*                </div>*/}
            {/*                <div className="col-12">*/}
            {/*                    <input type="submit" value="Send Message" />*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </form>*/}

            {/*    </div>*/}
            {/*</section>*/}
        </>
    );
};

export default BusinessMainScreen;