import React, {useEffect, useState} from "react";
import {Table, TableColumnsType, TableProps} from "antd";
import {Link} from "react-router-dom";

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

const CompanyListTable = (props:{tableData:any;}) => {

    const [filteredInfo, setFilteredInfo] = useState<Filters>({});
    const [sortedInfo, setSortedInfo] = useState<Sorts>({});

    const handleChange: OnChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter as Sorts);
    };

    const clearFilters = () => {
        setFilteredInfo({});
    };

    const clearAll = () => {
        setFilteredInfo({});
        setSortedInfo({});
    };

const columns: TableColumnsType<DataType> = [
        {
            title: 'No',
            dataIndex: 'key',
            key: 'id',
            ellipsis: true,
            width:100
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filteredValue: filteredInfo.name || null,
            onFilter: (value, record) => record.name.includes(value as string),
            sorter: (a, b) => a.name.localeCompare(b.name, 'ko-KR'),
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
        },
        {
            title: '',
            key: 'operation',
            render: (company) => <Link to={`/main/${company.id}`}><button>→</button></Link>,
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
            <Table columns={columns} dataSource={tableData} onChange={handleChange} />
        </>
    )
}

export default CompanyListTable;