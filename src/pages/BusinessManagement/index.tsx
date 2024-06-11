import React from "react";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

const BusinessManagement = () => {

    const {data:userData, error, mutate} = useSWR(
        `${API_URL}/api/me`,
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