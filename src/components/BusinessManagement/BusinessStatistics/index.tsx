import React from "react";
import {Row, Col, Statistic, Card} from "antd";

const BusinessStatistics = (props:{businesses:any;}) => {

    const {businesses} = props;

    return (
        <>
            <div>
                <Row gutter={30}>
                    <Col>
                        <Card bordered={true}>
                            <Statistic
                                title="계약 전 사업"
                                value={businesses.length}
                                valueStyle={{ color: '#de8d22' }}
                            />
                        </Card>
                    </Col>
                    <Col>
                        <Card bordered={true}>
                            <Statistic
                                title="진행중인 사업"
                                value={businesses.length}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col>
                        <Card bordered={true}>
                            <Statistic
                                title="완료 된 사업"
                                value={0}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );

};

export default BusinessStatistics;