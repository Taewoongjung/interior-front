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
            // `http://localhost:7070/api/excels/tasks/${taskId}`
        );

        eventSource.onopen = () => {
            console.log("Connection to EventSource established.");
        };

        eventSource.addEventListener(taskId, (e:any) => {
            console.log("11 = ",e.data);
            if (e && e.data) {
                try {
                    const streamData = JSON.parse(e.data);

                    if (streamData && streamData.completeCount != null && streamData.totalCount != null) {
                        const completeCount = Number(streamData.completeCount);
                        const totalCount = Number(streamData.totalCount);
                        const newPercentage = Math.round((completeCount / totalCount) * 100);

                        setPercentage(newPercentage);
                    } else {
                        console.error("Incomplete data received: ", streamData);
                    }
                } catch (error) {
                    console.error("Error parsing data: ", error);
                }
            }
        });

        eventSource.onerror = (err) => {
            console.error("EventSource error: ", err);
            eventSource.close();
        };

        return () => {
            setProgressBarModalOpen(false);
            eventSource.close(); // 컴포넌트 언마운트 시 EventSource를 닫습니다.
            console.log("EventSource closed.");
        };
    }, [taskId]);

    return (
        <>
            <Progress type="dashboard" percent={percentage} strokeColor={conicColors} />
        </>
    );
}

export default ProgressBar;