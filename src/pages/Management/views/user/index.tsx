import React from "react";
import {Avatar, Card} from "antd";
import useSWR from "swr";
import fetcher from "../../../../utils/fetcher";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";

const { Meta } = Card;

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#e8b5aa'];

const UserView = (props:{name:string; email:string;}) => {

    const randomColor = colorList[Math.floor(Math.random() * colorList.length)];


    const {data:userData, error, mutate} = useSWR(
        'http://api-interiorjung.shop:7077/api/me',
        // 'http://localhost:7070/api/me',
        fetcher,{
            dedupingInterval: 2000
        });

    const firstLetter = props.name?.charAt(0);

    return (
        <>
            <div id='view1' className='pane'>
                <Card
                    cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                    actions={[<SettingOutlined type="setting" />, <EditOutlined type="edit" />, <EllipsisOutlined type="ellipsis" />]}
                >
                    <Meta
                        avatar={<Avatar style={{background: randomColor}}>{firstLetter}</Avatar>}
                        title={props.name}
                        description={props.email}
                    />
                </Card>
            </div>
        </>
    );
};

export default UserView;