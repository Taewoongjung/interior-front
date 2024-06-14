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
            children: business.name,
        },
        {
            key: '2',
            label: '사업 생성일',
            children: business.createdAt,
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
            label: '사업지 주소',
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