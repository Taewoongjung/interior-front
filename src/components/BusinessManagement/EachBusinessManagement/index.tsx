import React from "react";
import PieChart from "../../../pages/Management/charts/Pie";
import {Content} from "antd/es/layout/layout";
import {Row, DescriptionsProps, Descriptions, Badge, Card, Spin} from "antd";
import {PieChartOutlined} from "@ant-design/icons";

const EachBusinessManagement = (props: { business:any; }) => {

    const {business} = props;

    const addCommasToNumber = (number: any): string | undefined => {
        return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const getBusinessStatus = () => {
        if (business.status === "CREATED") {
            return <Badge status="warning" text="생성됨" />;
        }

        if (business.status === "IN_PROGRESS") {
            return <Badge status="processing" text="진행중" />;
        }

        return <Badge status="default" text="보류" />;
    }

    const getBusinessGrossCost = () => {
        let grossCost = 0;
        business.businessMaterialList.forEach((material:any) => {
            if (material.allLaborCostPerUnit || material.allMaterialCostPerUnit) {
                grossCost += (parseInt(material.allLaborCostPerUnit) + parseInt(material.allMaterialCostPerUnit));
            }
        });

        return grossCost;
    };

    const getBusinessLaborGrossCost = () => {
        let grossCost = 0;
        business.businessMaterialList.forEach((material:any) => {
            if (material.allLaborCostPerUnit) {
                grossCost += (parseInt(material.allLaborCostPerUnit));
            }
        });

        return grossCost;
    };

    const getBusinessGrossMaterialCost = () => {
        let grossCost = 0;
        business.businessMaterialList.forEach((material:any) => {
            if (material.allMaterialCostPerUnit) {
                grossCost += (parseInt(material.allMaterialCostPerUnit));
            }
        });

        return grossCost;
    };

    const getAddress = () => {
        return`[${business.zipCode}] ${business.address} ${business.subAddress}`
    }

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: '사업 명',
            span: { xl: 1, xxl: 2 },
            children: business.name,
        },
        {
            key: '2',
            label: '사업 상태',
            span: { xl: 2, xxl: 2 },
            children: getBusinessStatus(),
        },
        {
            key: '3',
            label: '총 공사 비용',
            children: `${addCommasToNumber(getBusinessGrossCost())} 원`,
            span: 1,
        },
        {
            key: '4',
            label: '총 공사 재료 비용',
            children: `${addCommasToNumber(getBusinessGrossMaterialCost())} 원`,
            span: 1,
        },
        {
            key: '5',
            label: '총 공사 노무 비용',
            children: `${addCommasToNumber(getBusinessLaborGrossCost())} 원`,
            span: 1,
        },
        {
            key: '6',
            label: 'Address',
            children: `${getAddress()}`,
        },
    ];

    return (
        <>
            <Content style={{width:"100%"}}>
                <br/>
                <Descriptions title="사업 정보" items={items} />
                <br/>
                <Row style={{ height: 300}}>
                    <Card title="재료 사용 현황" bordered={true} style={{ width: 350, height: 310 }}>
                        {business && business !== undefined && business.businessMaterialList.length > 0 &&
                            <div style={{ height: 250}}>
                                <PieChart businessesMaterial={business} usageType={"사업 관리"}/>
                            </div>
                        }

                        {business && business.businessMaterialList.length <= 0 &&
                            <div style={{ height: 250}}>
                                <Spin tip="재료를 추가 해보세요">
                                    <div className="container"
                                         style={{
                                             display: "flex",
                                             justifyContent: "center",
                                             alignItems: "center",
                                             height: "200px"
                                         }}
                                    >
                                        <PieChartOutlined style={{fontSize: "100px"}}/>
                                    </div>
                                </Spin>
                            </div>
                        }
                    </Card>
                </Row>
            </Content>
        </>
    );
}

export default EachBusinessManagement;