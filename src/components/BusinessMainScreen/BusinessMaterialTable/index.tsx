import React, {useEffect, useState} from "react";
import {
    Dropdown,
    Empty,
    Input,
    Menu,
    message,
    Popconfirm,
    Table,
    Tag,
    Badge,
    Layout,
    InputNumber,
    Form,
    Typography,
    Button,
    TreeSelect, Row, Col
} from "antd";
import {EditOutlined, MessageOutlined, MoreOutlined} from "@ant-design/icons";
import axios from "axios";
import {amountUnitOptions, categoryOptionsForSelection} from "../BusinessMaterialAddInput/select";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

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

interface Item {
    id : string;
    name : string;
    category : string;
    amount : string;
    unit : string;
    memo : string;
    materialCostPerUnit :  string | undefined;
    allMaterialCostPerUnit :  string | undefined;
    laborCostPerUnit :  string | undefined;
    allLaborCostPerUnit :  string | undefined;
    totalUnitPrice :  string | undefined;
    totalPrice :  string | undefined;
}


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'int' | 'text';
    record: Item;
    index: number;
}

const removeCommaInCost = (target: string | undefined) => {
    if (target !== undefined) {
        return parseInt(target.replace(/,/g, ''));
    }
};

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
        editing,
        dataIndex,
        title,
        record,
        index,
        children,
        ...restProps
    }) => {

    let inputNode = <Input />;

    if (title === '카테고리') {
        inputNode = <TreeSelect
            showSearch
            dropdownStyle={{maxHeight: 400, overflow: 'auto', minWidth: 300}}
            placement={"bottomLeft"}
            allowClear
            treeDefaultExpandAll
            defaultValue={record.unit}
            treeData={categoryOptionsForSelection}
        />;
    }

    if (title === '수량') {
        inputNode = <InputNumber min={0}/>;
    }

    if (title === '단위') {
        inputNode = <TreeSelect
            showSearch
            dropdownStyle={{maxHeight: 400, overflow: 'auto', minWidth: 300}}
            placement={"bottomLeft"}
            allowClear
            treeDefaultExpandAll
            defaultValue={record.unit}
            treeData={amountUnitOptions}
        />;
    }


    if (title === '단가' && dataIndex === 'materialCostPerUnit') {
        inputNode = <InputNumber min={0} defaultValue={removeCommaInCost(record.materialCostPerUnit)}/>;
    }

    if (title === '단가' && dataIndex === 'laborCostPerUnit') {
        inputNode = <InputNumber min={0} defaultValue={removeCommaInCost(record.laborCostPerUnit)}/>;
    }

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `${title} 은 필수에요!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const BusinessMainScreenTable = (props:{businessesMaterial:any; businessProgress:any; businessId:any; onEvent: () => void; onLogEvent: () => void; fold:any}) => {
    const [usageCategory, setUsageCategory] = useState('');
    const [usageCategoryName, setUsageCategoryName] = useState('');

    const [messageApi, contextHolder] = message.useMessage();

    const {businessesMaterial, businessProgress, businessId, onEvent, onLogEvent, fold} = props;
    const [isQuotationBtnDisable, setQuotationBtnDisable] = useState(false);
    const [isQuotationBtnAppear, setQuotationBtnAppear] = useState(false);

    const [form] = Form.useForm();
    const values = Form.useWatch([], form);

    const [editingKey, setEditingKey] = useState('');
    const isEditing = (id: string) => id === editingKey;


    useEffect(() => {
        if (businessProgress) {
            const size = businessProgress.length;
            const progressType = businessProgress[size - 1]?.progressType;

            // 만약 progress 상태값이 "MAKING_QUOTATION" 이거나 "CREATED" 이 아닌 그 외 이면 "견적서 초안 작성 완료" 버튼을 노출 시키지 않는다.
            if (!(progressType === "MAKING_QUOTATION" || progressType === "CREATED")) {

                setQuotationBtnAppear(true);

            } else { // "견적서 초안 작성 완료" 버튼이 progress 상태값이 "MAKING_QUOTATION" 이거나 "CREATED" 이면 노출 한다.

                if (progressType === "CREATED") { // 노출 된 상태에서 progress 상태값이 "CREATED" 이면 해당 버튼을 비활성화 시킨다.
                    setQuotationBtnDisable(true);
                } else {
                    setQuotationBtnDisable(false);
                }

                setQuotationBtnAppear(false);
            }
        }
    }, [businessId]);

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
            .delete(`${API_URL}/api/businesses/${businessId}/materials/${materialId}`, {
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

    const confirmReviseMaterial: () => void = async () => {

        await axios
            .put(`${API_URL}/api/businesses/${businessId}/materials/${editingKey}`, {
                    materialName: values.name,
                    materialCategory: values.category,
                    materialAmount: values.amount,
                    materialAmountUnit: values.unit,
                    materialMemo: values.memo,
                    materialCostPerUnit: values.materialCostPerUnit,
                    laborCostPerUnit: values.laborCostPerUnit
                },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: localStorage.getItem("interiorjung-token")
                    }
                }
            ).then((response) => {
                if (response.data === true) {
                    success('재료 수정 완료');
                    onEvent(); // 테이블 리랜더링
                    onLogEvent(); // 로그 목록 리랜더링
                    setEditingKey(''); // 수정 비활성화
                }})
            .catch((error) => {
                errorModal("수정에 실패 하였습니다. 다시 확인 후 시도해주세요.");
            })
    };

    const edit = (record: Partial<Item> & { id: React.Key }) => {
        form.setFieldsValue({ name: '', category: '', amount: '', unit: '', memo: '', materialCostPerUnit: 0, allMaterialCostPerUnit: 0, laborCostPerUnit: 0, allLaborCostPerUnit: 0, totalUnitPrice: 0, totalPrice: 0, ...record });
        setEditingKey(record.id);
    };

    // 확장된 테이블 렌더링 함수
    const expandedRowRender = (record: { subData: readonly Record<string | number | symbol, any>[] | undefined; }) => {
        const columns = [
            { title: '카테고리', dataIndex: 'category', key: 'category', width: '100px', editable: true },
            { title: '재료 명', dataIndex: 'name', key: 'name', width: '130px', editable: false },
            { title: '수량', dataIndex: 'amount', key: 'amount', width: '100px', editable: true },
            { title: '단위', dataIndex: 'unit', key: 'unit', width: '90px', editable: true },
            {
                title: '비용',
                dataIndex: 'cost',
                key: 'cost',
                editable: true,
                children: [
                    {
                        title: '재료비',
                        dataIndex: 'materialCost',
                        key: 'materialCost',
                        editable: true,
                        children: [
                            {
                                title: '단가',
                                dataIndex: 'materialCostPerUnit',
                                key: 'building',
                                width: 100,
                                editable: true,
                            },
                            {
                                title: '금액',
                                dataIndex: 'allMaterialCostPerUnit',
                                key: 'number',
                                width: 100,
                                editable: false
                            },
                        ],
                    },
                    {
                        title: '노무비',
                        dataIndex: 'laborCost',
                        key: 'laborCost',
                        editable: true,
                        children: [
                            {
                                title: '단가',
                                dataIndex: 'laborCostPerUnit',
                                key: 'building',
                                width: 100,
                                editable: true,
                            },
                            {
                                title: '금액',
                                dataIndex: 'allLaborCostPerUnit',
                                key: 'number',
                                width: 100,
                                editable: false
                            },
                        ],
                    },
                    {
                        title: '합계',
                        dataIndex: 'totalCost',
                        key: 'totalCost',
                        children: [
                            {
                                title: '단가',
                                dataIndex: 'totalUnitPrice',
                                key: 'totalUnitPrice',
                                width: 100,
                                editable: false
                            },
                            {
                                title: '금액',
                                dataIndex: 'totalPrice',
                                key: 'totalPrice',
                                width: 100,
                                editable: false
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
                fixed: 'right',
                render: (_: any, record: { id: string | number; category:any; name:any; memo:any; }) => (
                    <Popconfirm
                        title={<>[{record.category}] {record.name} </>}
                        description={<div style={{ paddingTop: 10, paddingBottom: 10 }}>{record.memo}</div>}
                        icon={<MessageOutlined />}
                        showCancel={false}
                        okText="닫기"
                    >
                        <MessageOutlined />
                    </Popconfirm>
                ),
            },
            {
                title: '',
                key: 'operation',
                width: (editingKey === '') ? '30px' : '130px',
                fixed: 'right',
                render: (_ : any, record :{id:string}) => {
                    const editable = isEditing(record.id);
                    return editable ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Popconfirm
                                title="수정 완료"
                                description="완료 하시겠습니까?"
                                okText="예"
                                onConfirm={() => confirmReviseMaterial()}
                                cancelText="아니요"
                            >
                                <Button>
                                  저장
                                </Button>
                            </Popconfirm>
                            <Popconfirm
                                title="수정 취소"
                                description="정말 취소하시겠습니까?"
                                okText="예"
                                onConfirm={() => setEditingKey('')}
                                cancelText="아니요"
                            >
                                <Button>
                                    취소
                                </Button>
                            </Popconfirm>
                        </span>
                    ) : (
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item>
                                        <Typography.Link onClick={() => edit(record)}>
                                            수정
                                        </Typography.Link>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Popconfirm
                                            title="재료 삭제"
                                            description="해당 재료를 삭제하시겠습니까?"
                                            onConfirm={() => confirmDelete(record.id)}
                                            okText="예"
                                            cancelText="아니요"
                                        >
                                            <div style={{ cursor: 'pointer' }}>
                                                삭제
                                            </div>
                                        </Popconfirm>
                                    </Menu.Item>
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
                    );
                },
            },
        ];

        const originSubData: Item[] = [];

        // 데이터 구조에 따라 필요한 필드를 가져옴
        record.subData?.map(item => (originSubData.push({
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
        })));

        // @ts-ignore
        const processColumns = (columns) => {
            return columns.map((col: { children: any; editable: any; dataIndex: any; title: any; }) => {
                if (col.children) {
                    return {
                        ...col,
                        children: processColumns(col.children),
                    };
                }
                if (!col.editable) {
                    return col;
                }
                return {
                    ...col,
                    onCell: (record: Item) => ({
                        record,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        editing: isEditing(record.id),
                    }),
                };
            });
        };

        const mergedColumns = processColumns(columns);

        return (
            <Form form={form} component={false}>
                <Table
                    size={"small"}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    columns={mergedColumns}
                    dataSource={originSubData} // 확장된 데이터 소스를 사용
                    pagination={false}
                    scroll={{ x: 1000 }}
                    bordered
                />
            </Form>
        );
    };

    // 공사 분류 수정 핸들러
    const handleUsageCategoryEditClick = async (subData: any[]) => {

        const subDataIds = subData.map(item => item.id);

        await axios
            .patch(`${API_URL}/api/businesses/${businessId}/usages/categories`,
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

    const usageCategoryEditConfirm = (businessName:string, subData: any[]) =>
        new Promise((resolve) => {
            setTimeout(() => resolve(handleUsageCategoryEditClick(subData)), 3000);
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
                        onConfirm={() => usageCategoryEditConfirm(record.businessName, record.subData)} // subData를 confirm 함수에 전달
                        onOpenChange={(open: boolean) => {
                            if (open) {
                                setUsageCategory(record.businessName.props.children.props.children.props.children);
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
                <Layout style={{ width:"100%", backgroundColor: "white" }}>
                    <Table
                        bordered
                        columns={columns}
                        expandable={{ expandedRowRender, defaultExpandAllRows: true }}
                        dataSource={data}
                        pagination={false}
                        tableLayout={"fixed"}
                    />
                    <br/><br/>
                    <Row justify="space-between">
                        <Col></Col>

                        <Col>
                            {!isQuotationBtnAppear &&
                                (
                                    isQuotationBtnDisable ?
                                        <Button type="primary" shape="round" size="large" disabled><strong>견적서 초안 작성 완료</strong></Button> :
                                        <Button type="primary" shape="round" size="large" ><strong>견적서 초안 작성 완료</strong></Button>
                                )
                            }
                        </Col>

                        <Col></Col>
                    </Row>
                </Layout>
            }
        </>
    );
}

export default BusinessMainScreenTable;
