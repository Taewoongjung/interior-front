import React, {useEffect, useState} from "react";
import PieChart from "../../../pages/Management/charts/Pie";
import {Content} from "antd/es/layout/layout";
import {Row, DescriptionsProps, Descriptions, Card, Spin, Col, Steps} from "antd";
import {PieChartOutlined} from "@ant-design/icons";
import {StepProps} from "antd/es/steps";

const EachBusinessManagement = (props: { business:any; }) => {

    const {business} = props;

    const [stepCurrent, setStepCurrent] = useState(0);

    const addCommasToNumber = (number: any): string | undefined => {
        if (!(business.businessMaterialList && business.businessMaterialList.length > 0)) {
            return '-';
        }

        return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " 원";
    };

    const getBusinessGrossCost = () => {
        let grossCost = 0;
        if (business.businessMaterialList && business.businessMaterialList.length > 0) {
            business.businessMaterialList.forEach((material: any) => {
                if (material.allLaborCostPerUnit || material.allMaterialCostPerUnit) {
                    grossCost += (parseInt(material.allLaborCostPerUnit) + parseInt(material.allMaterialCostPerUnit));
                }
            });
        }

        return grossCost;
    };

    const getBusinessLaborGrossCost = () => {
        let grossCost = 0;
        if (business.businessMaterialList && business.businessMaterialList.length > 0) {
            business.businessMaterialList.forEach((material: any) => {
                if (material.allLaborCostPerUnit) {
                    grossCost += (parseInt(material.allLaborCostPerUnit));
                }
            });
        }

        return grossCost;
    };

    const getBusinessGrossMaterialCost = () => {
        let grossCost = 0;
        if (business.businessMaterialList && business.businessMaterialList.length > 0) {
            business.businessMaterialList.forEach((material: any) => {
                if (material.allMaterialCostPerUnit) {
                    grossCost += (parseInt(material.allMaterialCostPerUnit));
                }
            });
        }

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
            span: 4,
        },
        {
            key: '2',
            label: '사업 생성일',
            children: business.createdAt,
            span: 4,
        },
        {
            key: '3',
            label: '총 공사 비용',
            children: `${addCommasToNumber(getBusinessGrossCost())}`,
            span: 4,
        },
        {
            key: '4',
            label: '총 공사 재료 비용',
            children: `${addCommasToNumber(getBusinessGrossMaterialCost())}`,
            span: 4,
        },
        {
            key: '5',
            label: '총 공사 노무 비용',
            children: `${addCommasToNumber(getBusinessLaborGrossCost())}`,
            span: 4,
        },
        {
            key: '6',
            label: '사업지 주소',
            children: `${getAddress()}`,
            span: 4,
        },
    ];

    const [firstStepDesc, setFirstStepDesc] = useState('');
    const [secondStepDesc, setSecondStepDesc] = useState('');
    const [thirdStepDesc, setThirdStepDesc] = useState('');
    const [fourthStepDesc, setFourthStepDesc] = useState('');

    const getStep = () => {
        if (business.businessProgressList && business.businessProgressList.length > 0) {
            const size = business.businessProgressList.length;
            const progressType = business.businessProgressList[size - 1].progressType;

            if (progressType === 'CREATED') {
                setStepCurrent(0);
                setFirstStepDesc(business.businessProgressList[0].createdAt)
            }

            if (progressType === 'MAKING_QUOTATION') {
                setStepCurrent(1);
                setFirstStepDesc(business.businessProgressList[0].createdAt)
                setSecondStepDesc(business.businessProgressList[1].createdAt)
            }

            if (progressType === 'REQUESTED') {
                setStepCurrent(2);
                setFirstStepDesc(business.businessProgressList[0].createdAt)
                setSecondStepDesc(business.businessProgressList[1].createdAt)
                setThirdStepDesc(business.businessProgressList[2].createdAt)
            }

            if (progressType === 'CONTRACTED') {
                setStepCurrent(3);
                setFirstStepDesc(business.businessProgressList[0].createdAt)
                setSecondStepDesc(business.businessProgressList[1].createdAt)
                setThirdStepDesc(business.businessProgressList[2].createdAt)
                setFourthStepDesc(business.businessProgressList[3].createdAt)
            }
        }
    }

    const stepItems: StepProps[] = [
        {
            title: '사업 생성',
            description: firstStepDesc,
        },
        {
            title: '견적서 작성',
            description: secondStepDesc,
        },
        {
            title: '견적서 요청',
            description: thirdStepDesc,
        },
        {
            title: '계약 성사',
            description: fourthStepDesc,
        },
    ]

    useEffect(() => {
        getStep();
    }, []);
    
    return (
        <>
            <Content style={{width:"1000px"}}>
                <br/>
                <br/>
                <Row>
                    <Col span={15} push={1}>
                        <Descriptions
                            bordered
                            title="사업 정보"
                            column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                            items={items}
                        />
                        <br/>
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
                    </Col>
                    <Col span={9} push={3}>
                        {business && business !== undefined && business.businessMaterialList.length > 0 &&
                            <Steps
                                current={stepCurrent}
                                direction="vertical"
                                // onChange={onChange}
                                items={stepItems}
                            />
                        }
                    </Col>
                </Row>
            </Content>
        </>
    );
}

export default EachBusinessManagement;