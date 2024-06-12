import React from "react";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import {Row, Tabs} from "antd";
import EachBusinessManagement from "./EachBusinessManagement";
import {useParams} from "react-router-dom";
import BusinessStatistics from "./BusinessStatistics";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

const BusinessManagement = () => {

    const {data:userData, error, mutate} = useSWR(
        `${API_URL}/api/me`,
        fetcher,{
            dedupingInterval: 2000
        });

    const { companyId } = useParams();

    const {data:businesses, error:businessListError, mutate:businessListMutate} = useSWR(
        `${API_URL}/api/companies/${companyId}/businesses`,
        fetcher);

    return (
        <>
            <Row>
                <BusinessStatistics businesses={businesses}/>
            </Row>
            <br/>
            <br/>
            <br/>
            <Row style={{backgroundColor: "white"}}>
                <div>
                    <Tabs
                        defaultActiveKey="1"
                        tabPosition="top"
                        type="card"
                        size="middle"
                        style={{ height: "100hr" }}
                        items={
                            (businesses && businesses.length > 0) &&
                                businesses.map((business:any, i:number) => {
                                    const id = String(i);
                                    return {
                                        label: `${business.name}`,
                                        key: id,
                                        disabled: i === 28,
                                        children: <EachBusinessManagement business={business}/>,
                                    };
                                }
                            )
                        }
                    />
                </div>
            </Row>
        </>
    );
}

export default BusinessManagement;