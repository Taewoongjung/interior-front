import React, {useState} from "react";
import {Dropdown, Empty, Input, Menu, message, Popconfirm, Table, Tag, Badge, Button} from "antd";
import {EditOutlined, MessageOutlined, MoreOutlined, PlusOutlined} from "@ant-design/icons";
import axios from "axios";
import useSWR from "swr";
import fetcher from "../../../utils/fetcher";

// 랜덤 색상 목록
const colors = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple'
];

const BusinessMainScreenTable = (props:{businessesMaterial:any; businessId:any; onEvent: () => void; onLogEvent: () => void; fold:any}) => {
    const [usageCategory, setUsageCategory] = useState('');
    const [usageCategoryName, setUsageCategoryName] = useState('');

    const [messageApi, contextHolder] = message.useMessage();

    const {businessesMaterial, businessId, onEvent, onLogEvent, fold} = props;

    // 데이터 로딩 중이거나 에러가 발생한 경우를 처리
    if (!businessesMaterial) {
        return <Empty />;
    }

    const handleUsageCategoryNameOnChange = (e: React.SetStateAction<string>) => {
        setUsageCategoryName(e);
    }

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

    const addCommasToNumber = (number: any): string | undefined => {
        return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const confirmDelete: (materialId: (string | number)) => void = async (materialId:string | number) => {

        await axios
            .delete(`http://api-interiorjung.shop:7077/api/businesses/${businessId}/materials/${materialId}`, {
            // .delete(`http://localhost:7070/api/businesses/${businessId}/materials/${materialId}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: localStorage.getItem("interiorjung-token")
                    }
                }
            ).then((response) => {
                if (response.data === true) {
                    success('재료 삭제 완료');
                    onEvent();
                    onLogEvent();
                }})
            .catch((error) => {
                errorModal(error.response.data.message);
            })
    };

    // 확장된 테이블 렌더링 함수
    const expandedRowRender = (record: { subData: readonly Record<string | number | symbol, any>[] | undefined; }) => {
        const columns = [
            { title: '카테고리', dataIndex: 'category', key: 'category', width: '100px', editable: true },
            { title: '재료 명', dataIndex: 'name', key: 'name', width: '130px' },
            { title: '수량', dataIndex: 'amount', key: 'amount', width: '100px', editable: true },
            { title: '단위', dataIndex: 'unit', key: 'unit', width: '70px', editable: true },
            {
                title: '비용',
                children: [
                    {
                        title: '재료비',
                        dataIndex: 'street',
                        key: 'street',
                        width: 150,
                        children: [
                            {
                                title: '단가',
                                dataIndex: 'materialCostPerUnit',
                                key: 'building',
                                width: 100,
                                editable: true
                            },
                            {
                                title: '금액',
                                dataIndex: 'allMaterialCostPerUnit',
                                key: 'number',
                                width: 100,
                                editable: true
                            },
                        ],
                    },
                    {
                        title: '노무비',
                        children: [
                            {
                                title: '단가',
                                dataIndex: 'laborCostPerUnit',
                                key: 'building',
                                width: 100,
                                editable: true
                            },
                            {
                                title: '금액',
                                dataIndex: 'allLaborCostPerUnit',
                                key: 'number',
                                width: 100,
                                editable: true
                            },
                        ],
                    },
                    {
                        title: '합계',
                        children: [
                            {
                                title: '단가',
                                dataIndex: 'totalUnitPrice',
                                key: 'totalUnitPrice',
                                width: 100,
                            },
                            {
                                title: '금액',
                                dataIndex: 'totalPrice',
                                key: 'totalPrice',
                                width: 100,
                            },
                        ],
                    },
                ],
            },
            {
                title: '비고',
                dataIndex: 'memo',
                key: 'memo',
                width: '70px',
                editable: true,
                render: (_: any, record: { id: string | number; category:any; name:any; memo:any; }) => (
                    <Popconfirm
                        title={<>[{record.category}] {record.name} </>}
                        description={<div style={{paddingTop:10, paddingBottom: 10}}>{record.memo}</div>}
                        icon={<MessageOutlined/>}
                        showCancel={false}
                        okText="닫기"
                    >
                        <MessageOutlined />
                    </Popconfirm>
                )
            },
            {
                title: '',
                key: 'operation',
                width: '30px',
                render: (_: any, record: { id: string | number; }) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item>수정(개발예정)</Menu.Item>
                                <Menu.Item>
                                    <Popconfirm
                                        title="재료 삭제"
                                        description="해당 재료를 삭제하시겠습니까?"
                                        onConfirm={() => confirmDelete(record.id)}
                                        okText="예"
                                        cancelText="아니요"
                                    >
                                        <div style={{cursor: 'pointer'}}>
                                            삭제
                                        </div>
                                    </Popconfirm></Menu.Item>
                            </Menu>
                        }
                        trigger={['click']}
                        placement="bottom"
                        arrow={{ pointAtCenter: true }}
                    >
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            <MoreOutlined />
                        </a>
                    </Dropdown>
                ),
            },
        ];

        // 데이터 구조에 따라 필요한 필드를 가져옴
        const subData = record.subData?.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            amount: item.amount,
            unit: item.unit,
            memo: item.memo,
            materialCostPerUnit: addCommasToNumber(item.businessMaterialExpense?.materialCostPerUnit),
            allMaterialCostPerUnit: addCommasToNumber(item?.allMaterialCostPerUnit),
            laborCostPerUnit: addCommasToNumber(item.businessMaterialExpense?.laborCostPerUnit),
            allLaborCostPerUnit: addCommasToNumber(item?.allLaborCostPerUnit),
            totalUnitPrice: addCommasToNumber(item?.totalUnitPrice),
            totalPrice: addCommasToNumber(item?.totalPrice)
        }));

        return (
            <Table
                size={"small"}
                columns={columns}
                dataSource={subData} // 확장된 데이터 소스를 사용
                pagination={false}
                tableLayout={"fixed"}
                bordered
            />
        );
    };

    // 클릭 이벤트 핸들러
    const handleEditClick = async (subData: any[]) => {
        const subDataIds: any[] = [];

        await axios
            .patch(`http://api-interiorjung.shop:7077/api/businesses/${businessId}`,
            // .patch(`http://localhost:7070/api/businesses/${businessId}`,
                {subDataIds, usageCategoryName},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: localStorage.getItem("interiorjung-token"),
                        "Content-Type": "application/json"
                    }
                }
            ).then((response) => {
                if (response.data === true) {
                    success('수정 완료');
                    onEvent();
                }})
            .catch((error) => {
                errorModal(error.message);
            })
    };

    const confirm = (businessName:string, subData: any[]) =>
        new Promise((resolve) => {
            setTimeout(() => resolve(handleEditClick(subData)), 3000);
        });

    const setDefaultValueOfReviseUsageCategory = (businessName:any) => {
        setUsageCategoryName(businessName.props.children.props.children);
    }

    // 상위 테이블의 컬럼 정의
    const columns = [
        { title: '공사', dataIndex: 'businessName', key: 'businessName' },
        { title: '', key: 'operation', width: '103px',
            render: (_: any, record: { businessName:any; subData: any; }) => (
                <>
                    <Popconfirm
                        title="공사 구분 수정"
                        okText="수정"
                        cancelText="취소"
                        description={<Input
                            prefix={<EditOutlined style={{ color: 'rgba(0,0,0,.25)', paddingRight:10 }} />}
                            defaultValue={usageCategory}
                            onChange={(e) => handleUsageCategoryNameOnChange(e.target.value)}/>
                        }
                        onConfirm={() => confirm(record.businessName, record.subData)} // subData를 confirm 함수에 전달
                        onOpenChange={(open: boolean) => {
                            if (open) {
                                setUsageCategory(record.businessName.props.children.props.children);
                            }
                            if (!open) {
                                // 팝업이 닫힐 때의 로직
                                setUsageCategory('');
                            }
                        }}
                    >
                        <EditOutlined onClick={() => setDefaultValueOfReviseUsageCategory(record.businessName)}>수정</EditOutlined>
                    </Popconfirm>
                </>
            ) }
    ];

    let colorIndex = 0; // 현재 사용 중인 색상 인덱스

    // 다음 순서의 색상을 가져오는 함수
    const getNextColor = () => {
        const color = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length; // 다음 색상 인덱스 계산 후 반복
        return color;
    };

    // 상위 테이블의 데이터 준비
    const data = Object.keys(businessesMaterial).map((key, index) => {
        const color = getNextColor(); // 다음 색상 가져오기
        return {
            key: index.toString(),
            businessName: <Badge count={businessesMaterial[key]?.length} size="small"><Tag color={color}><strong>{key}</strong></Tag></Badge>, // 다음 순서의 색상을 가진 태그 생성
            subData: businessesMaterial[key], // 해당 카테고리의 배열 데이터를 사용
        };
    });

    return (
        <>
            {contextHolder}
            {businessesMaterial !== undefined &&
                <Table
                    columns={columns}
                    expandable={{ expandedRowRender, defaultExpandAllRows: true }}
                    dataSource={data}
                />
            }
        </>
    );
}

export default BusinessMainScreenTable;