import React, {useState} from "react";
import './style.css';
import {DataType} from "../../../definitions/BusinessMaterialLogTable/ILogTableDataType";
import {Table} from "antd";
import bottomButton from "../../BottomButton";

const BusinessMaterialLogTable = (props:{logData:DataType[]}) => {

    const {logData} = props;

    const columns = [
        {
            title: 'updaterName',
            dataIndex: 'updaterName',
            key: 'updaterName',
        },
        {
            title: 'changeField',
            dataIndex: 'changeField',
            key: 'changeField',
        },
        {
            title: 'changeDetail',
            dataIndex: 'changeDetail',
            key: 'changeDetail',
        },
        {
            title: 'createdAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
    ];

    return (
        <>
            {(logData !== null || logData !== undefined) &&
                <Table
                    dataSource={logData}
                    columns={columns}
                    showHeader={false}
                    size={'small'}
                    pagination={false}
                    scroll={{ y: 300 }}
                    virtual
                />
            }
        </>
    );
}

export default BusinessMaterialLogTable;