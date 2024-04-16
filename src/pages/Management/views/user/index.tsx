import React from "react";
import {Avatar} from "antd";
import './styles.css';
import useSWR from "swr";
import fetcher from "../../../../utils/fetcher";

const UserView = (props:{name:string; email:string;}) => {

    const {data:userData, error, mutate} = useSWR(
        'http://api-interiorjung.shop:7077/api/me',
        // 'http://localhost:7070/api/me',
        fetcher,{
            dedupingInterval: 2000
        });

    return (
        <>
            <div id='view1' className='pane'>
                <div className='header'>User Profile</div>
                <div>
                    <div className={'avatar-view'}>
                        <Avatar shape="square" size={120} icon="user" />
                    </div>
                    <div className={'info-view'}>
                        <div>name: {props.name}</div>
                        <div>email: {props.email}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserView;