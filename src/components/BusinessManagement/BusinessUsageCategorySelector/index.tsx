import React, {useEffect, useState} from "react";
import {Transfer, TransferProps} from "antd";
import axios from "axios";

const API_URL = process.env.REACT_APP_REQUEST_API_URL;

const BusinessUsageCategorySelector = (props:{businessId:any}) => {

    const {businessId} = props;

    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

    const handleChange: TransferProps['onChange'] = (newTargetKeys, direction, moveKeys) => {
        setTargetKeys(newTargetKeys);

        console.log('targetKeys: ', newTargetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
    };

    const handleSelectChange: TransferProps['onSelectChange'] = (
        sourceSelectedKeys,
        targetSelectedKeys,
    ) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);

        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
    };

    const handleScroll: TransferProps['onScroll'] = (direction, e) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    };

    const [data, setData] = useState<any>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('interiorjung-token');
                if (token) {
                    const response = await axios.get(
                        `${API_URL}/api/businesses/${businessId}/usage-categories`,
                        {
                            withCredentials: true, // CORS 처리 옵션
                            headers: {
                                Authorization: token
                            }
                        }
                    );
                    setData(response.data); // Assuming response.data contains the actual data
                } else {
                    console.error('No token found');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [businessId]);

    interface RecordType {
        key: string;
        title: string;
        description: string;
        disabled: boolean;
    }



    const usageCategoryData: RecordType[] = data.map((_: any, i: number) => ({
        key: i.toString(),
        title: _.usageCategory,
        description: `description of content${i + 1}`,
        disabled: false,
    }));

    const oriTargetKeys = usageCategoryData.filter(
        (item) => Number(item.key) % 3 > 1).map((item) => item.key);

    const [targetKeys, setTargetKeys] = useState<React.Key[]>(oriTargetKeys);

    return (
        <>
            <Transfer
                dataSource={usageCategoryData}
                titles={['', '사용 할 리스트']}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                onScroll={handleScroll}
                render={(item) => item.title}
                oneWay
                style={{ marginBottom: 16 }}
            />
        </>
    )
}

export default BusinessUsageCategorySelector;
