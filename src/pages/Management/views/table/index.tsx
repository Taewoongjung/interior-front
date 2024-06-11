import React, {useEffect, useState} from "react";
import {message, Modal, Table, TableColumnsType, TableProps} from "antd";
import {Link} from "react-router-dom";
import {
    ArrowRightOutlined,
    DeleteOutlined,
    ExclamationCircleFilled
} from "@ant-design/icons";
import axios from "axios";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

type OnChange = NonNullable<TableProps<DataType>['onChange']>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;


interface DataType {
    key: string;
    id: string;
    name: string;
    address: string;
}

const { confirm } = Modal;

const CompanyListTable = (props:{tableData:any; onEvent: () => void;}) => {


    const [filteredInfo, setFilteredInfo] = useState<Filters>({});
    const [sortedInfo, setSortedInfo] = useState<Sorts>({});

    const handleChange: OnChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter as Sorts);
    };

    const [messageApi, contextHolder] = message.useMessage();

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

    const showDeleteConfirm = (companyId:any) => {

        confirm({
            title: '사업체를 삭제 하시겠습니까?',
            icon: <ExclamationCircleFilled />,
            content: '삭제를 하시면 모든 사업과 재료도 함께 삭제 됩니다.',
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk() {
                axios
                    .delete(`${API_URL}/api/companies/${companyId}`, {
                            withCredentials: true, // CORS 처리 옵션
                            headers: {
                                Authorization: localStorage.getItem("interiorjung-token")
                            }
                        }
                    ).then((response) => {
                        if (response.data === true) {
                            success("사업체 삭제 완료");
                            props.onEvent();
                        }
                    })
                    .catch((error) => {
                        errorModal(error.response.data.message);
                    })
            },
            onCancel() {
            },
        });
    };

    const columns: TableColumnsType<DataType> = [
        {
            title: 'No',
            dataIndex: 'key',
            key: 'id',
            ellipsis: true,
            width: 100
        },
        {
            title: '사업체 명',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            filteredValue: filteredInfo.name || null,
            onFilter: (value, record) => record.name.includes(value as string),
            sorter: (a, b) => a.name.localeCompare(b.name, 'ko-KR'),
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: '사업체 주소',
            dataIndex: 'address',
            key: 'address',
            width: 300,
            ellipsis: true,
        },
        {
            title: '',
            key: 'moveMain',
            width: 80,
            render: (company) => <Link to={`/main/${company.id}`}><ArrowRightOutlined /></Link>,
        },
        {
            title: '',
            key: 'removeCompany',
            width: 40,
            render: (company) => <DeleteOutlined onClick={() => showDeleteConfirm(company.id)} />,
        }
    ];

    const [tableData, setTableData] = useState<DataType[]>([]);

    useEffect(() => {
        console.log("companyList = ", props.tableData);
        if (props.tableData) {

            const newData: ((prevState: DataType[]) => DataType[]) | {key: string; id: string; name: string; address: string; }[] = [];

            let count = 1;

            props.tableData.forEach((company: { key:any; id: string; name: string; address: string;}) => {
                // 이미 존재하는 아이템인지 확인
                const existingItemIndex = newData.findIndex(item => item.key === company.id);
                if (existingItemIndex === -1) {
                    // 존재하지 않는 경우에만 추가
                    newData.push({
                        key: count.toString(),
                        id: company.id,
                        name: company.name,
                        address: company.address,
                    });
                    count++;
                }
            })
            setTableData(newData);
        }

    }, [props.tableData]);

    return (
        <>
            {contextHolder}
            <Table columns={columns} dataSource={tableData} onChange={handleChange} />
        </>
    )
}

export default CompanyListTable;