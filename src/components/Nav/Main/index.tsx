import React from "react";
import useSWR from "swr";
import fetcher from "../../../utils/fetcher";
import {useHistory, useParams} from 'react-router-dom';

const MainNav = (() => {

    const { companyId } = useParams();

    const history = useHistory();

    const {data:businesses, error, mutate} = useSWR(
        'http://api-interiorjung.shop:7077/api/businesses',
        // 'http://localhost:7070/api/businesses',
        fetcher);

    console.log("businesses = ", businesses);

    const handleButtonClick = (businessId: string) => {
        // 이벤트 발생 시 쿼리 파라미터를 추가하여 URL을 업데이트
        const newQueryParams = new URLSearchParams(history.location.search);
        newQueryParams.set('businessId', businessId);

        history.push({
            pathname: `/main/${companyId}`,
            search: newQueryParams.toString(),
        });
    };

    return(
        <>
            <ul>
                {/*<li><a href="#top" id="top-link"><span className="icon solid fa-home">Intro</span></a></li>*/}
                {/*<li><a href="#portfolio" id="portfolio-link"><span className="icon solid fa-th">Portfolio</span></a></li>*/}
                {/*<li><a href="#about" id="about-link"><span className="icon solid fa-user">About Me</span></a></li>*/}
                {/*<li><a href="#contact" id="contact-link"><span className="icon solid fa-envelope">Contact</span></a></li>*/}
                {businesses?.map((business: { id: string; name: React.ReactNode; }) => (
                    <li key={business.id}>
                        <a onClick={() => handleButtonClick(business.id)}><span className="icon solid fa-th">{business.name}</span></a>
                    </li>
                ))}
            </ul>

        </>
    );
});

export default MainNav;