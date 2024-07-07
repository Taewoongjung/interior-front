import React, {useEffect, useState} from "react";
import {Drawer, TableColumnsType, Table, Button, Input, message, Space, Typography, Collapse, Tag, Empty} from "antd";
import {AlimtalkDataType, DataType} from "../../../definitions/BusinessMaterialLogTable/ILogTableDataType";
import axios from "axios";
import {BUSINESS_ERROR_CODES} from "../../../codes/ErrorCodes";
import {CheckOutlined} from "@ant-design/icons";
import useSWR from "swr";
import fetcher from "../../../utils/fetcher";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

const { Title } = Typography;

const QuotationDraftRequestHistory = (props:{businessId:any}) => {

    const {businessId} = props;

    const [open, setOpen] = useState(false);
    const [requestPhoneNumber, setRequestPhoneNumber] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const {data:alimtalkHistory, error:logError, mutate:alimtalkHistoryMutate} = useSWR(
        businessId ?
            `${API_URL}/api/businesses/${businessId}/alimtalks/logs?progressType=QUOTATION_REQUESTED`
            : null,
        fetcher);

    const columns: TableColumnsType<AlimtalkDataType> = [
        {
            title: '수신자',
            dataIndex: 'receiverPhone',
        },
        {
            title: '메시지 타입',
            dataIndex: 'msgType',
        },
        {
            title: '발송일',
            dataIndex: 'date',
        },
        {
            title: '발송 결과',
            dataIndex: 'result',
        },
    ];

    const [tableData, setTableData] = useState<AlimtalkDataType[]>();

    useEffect(() => {

        if (alimtalkHistory) {
            const newData: AlimtalkDataType[] = alimtalkHistory.map((item: { receiverPhone: any; messageType: any; createdAt: any; isSuccess: any; }) => ({
                receiverPhone: item.receiverPhone,
                msgType: item.messageType === 'KKO' ? <Tag color="gold">카카오톡</Tag> : <Tag color="green">SMS</Tag>,
                date: item.createdAt,
                result: item.isSuccess === 'T' ? "성공" : "실패"
            }));

            setTableData(newData);
        }

    }, [alimtalkHistory]);

    const success = (successMsg:string) => {
        messageApi.open({
            type: 'success',
            content: successMsg,
        });
    };

    const errorModal = (errorMsg:string) => {
        messageApi.open({
            type: 'error',
            content: errorMsg
        });
    };

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const requestQuotationDraftHandler = async (receiverPhoneNumber:string) => {

        await axios
            .post(`${API_URL}/api/businesses/${businessId}/quotations/draft/completions`,
                {receiverPhoneNumber},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: localStorage.getItem("interiorjung-token"),
                        "Content-Type": "application/json"
                    }
                }
            ).then((response) => {
                if (response.data === true) {
                    const successStr = receiverPhoneNumber + '에 알림톡 발송 완료';
                    success(successStr);
                    setRequestPhoneNumber('');
                    alimtalkHistoryMutate();
                }})
            .catch((error) => {
                const errorCode = error.response.data.errorCode;

                if (BUSINESS_ERROR_CODES.includes(errorCode)) {
                    errorModal(error.response.data.message);
                } else {
                    errorModal(error.message);
                }
            })
    }

    const handleInputChange = (e:any) => {
        setRequestPhoneNumber(e.target.value);
    };

    return (
        <>
            {contextHolder}
            <Button type="primary" onClick={showDrawer}>
                견적서 초안 발송/내역
            </Button>
            <Drawer width={640} placement="right" onClose={onClose} open={open}>

                <Title level={4}>
                    <CheckOutlined /> 초안 작성 발송
                </Title>
                <Space.Compact style={{ width: '50%' }}>
                    <Input
                        placeholder="발송 할 전화번호를 입력해주세요."
                        value={requestPhoneNumber}
                        onChange={handleInputChange}
                    />
                    <Button
                        type="primary" shape="round" size="middle"
                        onClick={() => requestQuotationDraftHandler(requestPhoneNumber)}>
                        <strong>초안 발송</strong>
                    </Button>
                </Space.Compact>

                <br/>
                <br/>
                <Title level={4}>
                    <CheckOutlined /> 초안 발송 히스토리
                </Title>
                <Collapse
                    size="small"
                    defaultActiveKey={['1']}
                    items={[{ key: '1',
                        children:
                            <>
                                {/*발송 히스토리*/}
                                {tableData?.length !== 0 ?
                                <Table columns={columns} dataSource={tableData} size="small" /> :
                                    <Empty description={"발송 이력이 없습니다."}/>
                                }
                            </>
                    }]}
                />
            </Drawer>
        </>
    );
}

export default QuotationDraftRequestHistory;
