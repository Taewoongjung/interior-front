import React, {useEffect, useState} from "react";
import {ResponsivePie} from "@nivo/pie";
import useSWR from "swr";
import fetcher from "../../../../utils/fetcher";
import {Spin} from "antd";

const PieChart =() => {

    const handle = {
        padClick: (data: any) => {
            console.log(data);
        },

        legendClick: (data: any) => {
            console.log(data);
        },
    };

    const {data:businessesMaterial, error, mutate} = useSWR(
        // `http://api-interiorjung.shop:7077/api/businesses`,
        `http://localhost:7070/api/businesses`,
        fetcher);

    const [materials, setMaterials] = useState([]);

    const [categoryAmounts, setCategoryAmounts] = useState({});

    useEffect(() => {
        if (businessesMaterial !== undefined) {
            const newMaterials: any[] | ((prevState: never[]) => never[]) = []; // 새로운 재료 배열 생성
            businessesMaterial.forEach((business: { businessMaterialList: any[]; }) => {
                business.businessMaterialList.forEach((material: any) => {
                    newMaterials.push(material); // 새로운 재료를 새 배열에 추가
                });
            });


            const newCategoryAmounts = {}; // 새로운 카테고리별 수량 객체 생성
            materials.forEach((material) => {
                const { category, amount } = material; // 재료에서 카테고리와 수량 추출
                if (!newCategoryAmounts[category]) {
                    // @ts-ignore
                    newCategoryAmounts[category] = 0; // 새로운 카테고리라면 초기화
                }
                // @ts-ignore
                newCategoryAmounts[category] += amount; // 수량 누적
            });

            setCategoryAmounts(newCategoryAmounts); // 새로운 카테고리별 수량 객체로 상태 업데이트

            // @ts-ignore
            setMaterials(newMaterials); // 새로운 재료 배열로 상태 업데이트
        }
    }, [businessesMaterial]);

    const chartData = Object.entries(categoryAmounts).map(([key, value]) => ({
        id: key,
        label: key,
        value: value
    }));

    return (
        <>
            {(!businessesMaterial || businessesMaterial.length === 0) ? (
                <Spin tip="Loading..." />
            ) : (
                <ResponsivePie
                    data={chartData}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={1}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                    onClick={handle.padClick}
                    legends={[
                        {
                            anchor: 'bottom', // 위치
                            direction: 'column', // item 그려지는 방향
                            justify: false, // 글씨, 색상간 간격 justify 적용 여부
                            translateX: -100, // chart와 X 간격
                            translateY: -100, // chart와 Y 간격
                            itemsSpacing: 0, // item간 간격
                            itemWidth: 100, // item width
                            itemHeight: 18, // item height
                            itemDirection: 'left-to-right', // item 내부에 그려지는 방향
                            itemOpacity: 1, // item opacity
                            symbolSize: 18, // symbol (색상 표기) 크기
                            symbolShape: 'circle', // symbol (색상 표기) 모양
                            effects: [
                                {
                                    // 추가 효과 설정 (hover하면 textColor를 olive로 변경)
                                    on: 'hover',
                                    style: {
                                        itemTextColor: 'olive',
                                    },
                                },
                            ],
                            onClick: handle.legendClick, // legend 클릭 이벤트
                        },
                    ]}
                />
            )}
        </>
    )
}

export default PieChart;