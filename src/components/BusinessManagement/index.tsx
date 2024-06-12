import React, {useEffect, useState} from "react";
import {Button, Empty, message, Row, Tabs} from "antd";
import EachBusinessManagement from "./EachBusinessManagement";
import {useParams} from "react-router-dom";
import BusinessStatistics from "./BusinessStatistics";
import axios from "axios";
import {useObserver} from "mobx-react";
import mainNavStateInstance from "../../statemanager/mainNavState";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

const BusinessManagement = () => {

    const { companyId } = useParams();
    
    const [messageApi, contextHolder] = message.useMessage();

    const errorModal = (errorMsg:string) => {
        messageApi.open({
            type: 'error',
            content: errorMsg
        });
    };
    
    const [businesses, setBusinesses] = useState<any>([]);
    
    useEffect(() => {
        const fetchBusinessList = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/companies/${companyId}/businesses?queryType=business_management`,
                    {
                        withCredentials: true, // CORS 처리 옵션
                        headers: {
                            Authorization: localStorage.getItem('interiorjung-token')
                        }
                    }
                );
                setBusinesses(response.data);
            } catch (error) {
                errorModal(`Error fetching business list: ${error}`)
            }
        };

        fetchBusinessList();
    }, [companyId]);

    return useObserver(() => (
        <>
            {contextHolder}

            {(businesses && businesses.length > 0) &&<hr/>}
            {(businesses && businesses.length > 0) &&
                <Row style={{backgroundColor: "white"}}>
                    <BusinessStatistics businesses={businesses}/>
                </Row>
            }
            {(businesses && businesses.length > 0) &&<hr/>}

            <Row style={{backgroundColor: "white", paddingTop:30}}>
                <div>
                    {(businesses && businesses.length > 0) &&
                        <Tabs
                            defaultActiveKey="1"
                            tabPosition="top"
                            type="card"
                            size="middle"
                            style={{ height: "100hr", width: "700px" }}
                            items={
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
                    }
                </div>
            </Row>

            {(businesses && businesses.length === 0) &&
                <Row style={{
                    backgroundColor: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh" // Adjust height as necessary
                }}>
                <div>
                    <Empty
                        imageStyle={{ height: 100 }}
                        description={<span style={{fontSize:20}}><strong>사업을 등록 해보세요</strong></span>}
                    >
                        <Button type="primary" onClick={() => mainNavStateInstance.setNavState("사업 등록")}>등록하러 가기</Button>
                    </Empty>
                </div>
                </Row>
            }
        </>
    ));
}

export default BusinessManagement;