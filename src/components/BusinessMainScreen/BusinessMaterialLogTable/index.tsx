import React from "react";
import './style.css';
import {DataType} from "../../../definitions/BusinessMaterialLogTable/ILogTableDataType";
import {Table, Tag} from "antd";

const BusinessMaterialLogTable = (props: { logData: DataType[] }) => {

    const { logData } = props;

    const columns = [
        {
            title: '변경된 필드',
            dataIndex: 'changeField',
            key: 'changeField',
        },
        {
            title: '변경 내용',
            dataIndex: 'changeDetail',
            key: 'changeDetail',
        },
        {
            title: '업데이트한 사람',
            dataIndex: 'updaterName',
            key: 'updaterName',
        },
        {
            title: '생성일',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
    ];

    const getColor = (type: any) => {
        if (type === '삭제') {
            return '#f50';
        }

        if (type === '생성') {
            return '#2db7f5';
        }

        return '#87d068';
    };

    const data = logData
        .filter((rowData): rowData is DataType => !!rowData) // rowData가 undefined가 아님을 확인
        .map((rowData, index) => ({
            key: index.toString(),
            changeField: <Tag color={getColor(rowData.changeField)}><strong>{rowData.changeField}</strong></Tag>,
            changeDetail: rowData.changeDetail,
            updaterName: rowData.updaterName,
            createdAt: rowData.createdAt,
        }));

    return (
        <>
            {logData &&
                <Table
                    dataSource={data}
                    columns={columns}
                    showHeader={false}
                    size={'small'}
                    pagination={false}
                    scroll={{ y: 300 }}
                />
            }
        </>
    );
}

export default BusinessMaterialLogTable;