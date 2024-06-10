import React from "react";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";

const BusinessManagement = () => {

    const {data:userData, error, mutate} = useSWR(
        'http://api-interiorjung.shop:7077/api/me',
        // 'http://localhost:7070/api/me',
        fetcher,{
            dedupingInterval: 2000
        });

    return (
        <>
            <div>aaa</div>
        </>
    );
}

export default BusinessManagement;