import React, {useEffect, useState} from "react";
import {Transfer, Switch, TransferProps} from "antd";

interface RecordType {
    key: string;
    title: string;
    description: string;
    disabled: boolean;
}

const mockData: RecordType[] = Array.from({ length: 20 }).map((_, i) => ({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 3 < 1,
}));

const oriTargetKeys = mockData.filter((item) => Number(item.key) % 3 > 1).map((item) => item.key);


const BusinessUsageCategorySelector = () => {

    const [targetKeys, setTargetKeys] = useState<React.Key[]>(oriTargetKeys);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [disabled, setDisabled] = useState(false);

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


    return (
        <>
            <Transfer
                dataSource={mockData}
                titles={['Source', 'Target']}
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
