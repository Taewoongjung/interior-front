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
        if (type === '재료생성') {
            return '#4CAF50';
        }

        if (type === '재료삭제') {
            return '#F44336';
        }

        if (type === '재료명') {
            return '#2196F3';
        }

        if (type === '재료 카테고리') {
            return '#9C27B0';
        }

        if (type === '재료 수량') {
            return '#FFC107';
        }

        if (type === '재료 수량 단위') {
            return '#FF9800';
        }

        if (type === '재료 메모') {
            return '#795548';
        }

        if (type === '재료의 단가') {
            return '#03A9F4';
        }

        if (type === '재료 노무비 단가') {
            return '#8BC34A';
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
