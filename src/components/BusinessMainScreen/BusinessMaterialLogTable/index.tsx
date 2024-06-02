import React from "react";
import './style.css';
import {DataType} from "../../../definitions/BusinessMaterialLogTable/ILogTableDataType";
import {Table} from "antd";

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
            <table>
                {(logData !== null || logData !== undefined) &&
                    <Table
                        dataSource={logData}
                        columns={columns}
                        showHeader={false}
                    />
                }
            </table>
        </>
    );
}

export default BusinessMaterialLogTable;