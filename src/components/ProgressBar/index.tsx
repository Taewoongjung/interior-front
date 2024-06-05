import React, {useEffect, useState} from "react";
import {Progress, ProgressProps} from "antd";
import axios from "axios";

const conicColors: ProgressProps['strokeColor'] = {
    '0%': '#87d068',
    '50%': '#ffe58f',
    '100%': '#ffccc7',
};

const ProgressBar = (props:{ taskId:string; setProgressBarModalOpen:any; }) => {

    const {taskId, setProgressBarModalOpen} = props

    const [percentage, setPercentage] = useState(0);

    console.log("progress", taskId);

    useEffect(() => {

        if (!taskId) return;

        const eventSource = new EventSource(
            `http://api-interiorjung.shop:7077/api/excels/tasks/${taskId}`,
            // `http://localhost:7070/api/excels/tasks/${taskId}`,
            {
            withCredentials: true, // CORS 처리 옵션
        });

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (event !== null) {
                setPercentage(Math.round((data.completeCount / data.totalCount) * 100))
            }
        };

        return () => {
            setProgressBarModalOpen(false);
            eventSource.close(); // 컴포넌트 언마운트 시 EventSource를 닫습니다.
        };
    }, [taskId]);

    return (
        <>
            <Progress type="dashboard" percent={percentage} strokeColor={conicColors} />
        </>
    );
}

export default ProgressBar;