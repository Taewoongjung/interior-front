import React, {useEffect, useRef, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import useSWR from "swr";
import fetcher from "../../../utils/fetcher";
import {Button, Menu, MenuProps, Tour, TourProps} from "antd";
import {
    AppstoreOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PlusSquareOutlined,
    SlidersOutlined
} from "@ant-design/icons";
import {useObserver} from "mobx-react";
import MainNavState from "../../../statemanager/mainNavState";

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

// 초기 메뉴 아이템 설정
const initialBusinessItems: MenuItem[] = [];

const NavMain = (props:{navState:MainNavState; tourOpen:any; onTourEvent: (e: any) => void;}) => {

    const {tourOpen, onTourEvent} = props;

    const { companyId } = useParams();

    const history = useHistory();

    const [collapsed, setCollapsed] = useState(false);

    const step1 = useRef(null);
    const step2 = useRef(null);
    const step3 = useRef(null);
    const step4 = useRef(null);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handleButtonMain3Click = async (businessId: string) => {
        mutate();
        // 이벤트 발생 시 쿼리 파라미터를 추가하여 URL을 업데이트
        const newQueryParams = new URLSearchParams(history.location.search);
        await newQueryParams.set('businessId', businessId);
        await history.push({
            pathname: `/main/${companyId}`,
            search: newQueryParams.toString(),
        });
    };

    const {data:businesses, error, mutate} = useSWR(
        `http://api-interiorjung.shop:7077/api/companies/${companyId}/businesses`,
        // `http://localhost:7070/api/companies/${companyId}/businesses`,
        fetcher);

    // 비즈니스 목록을 담을 상태
    const [businessItems, setBusinessItems] = useState<MenuItem[]>(initialBusinessItems);

    useEffect(() => {
        // 비즈니스 목록이 유효하면
        if (businesses && businesses.length > 0) {
            // 기존의 비즈니스 아이템들의 키 배열 생성
            // @ts-ignore
            const existingKeys = businessItems.map(item => item.key);

            // 비즈니스 목록에서 MenuItem 배열을 생성하고 기존의 키와 비교하여 중복되지 않는 아이템만 추가
            const newBusinessItems = businesses
                .filter((business: { id: string; name: React.ReactNode; }) => !existingKeys.includes(business.id))
                .map((business: { id: string; name: React.ReactNode; }) => (
                    getItem(business.name, business.id)
                ));

            // 새로운 비즈니스 아이템이 존재한다면 기존의 비즈니스 아이템에 추가하여 새로운 MenuItem 배열로 업데이트
            if (newBusinessItems.length > 0) {
                setBusinessItems(prevBusinessItems => [...prevBusinessItems, ...newBusinessItems]);
            }
        }
    }, [businesses]);

    // "사업 목록" 아래에 새로운 비즈니스 아이템을 추가하여 전체 메뉴 아이템 배열 생성
    const menuItems: MenuProps['items'] = [
        getItem('사업 등록', 'main1', <PlusSquareOutlined ref={step2}/>),
        getItem('사업 관리', 'main2', <SlidersOutlined ref={step3}/>),
        getItem('사업 목록', 'main3', <AppstoreOutlined ref={step4}/>, businessItems)
    ];

    // 메뉴 클릭 이벤트 핸들러
    const handleMenuClick = async (key: string) => {
        if (key === 'main1') {
            return await props.navState.setNavState('사업 등록');
        }

        if (key === 'main2') {
            return await props.navState.setNavState('사업 관리');
        }

        await handleButtonMain3Click(key.toString());
        return await props.navState.setNavState('사업 목록');
    };

    const steps: TourProps['steps'] = [
        {
            title: '메뉴 접기/펴기',
            description: '해당 버튼은 왼쪽 메뉴바를 접거나 펼 수 있습니다.',
            cover: (
                <img
                    alt="tour.png"
                    src="/mainScreen/가이드1.png"
                />
            ),
            target: () => step1.current,
        },
        {
            title: '사업 등록',
            description: '사업을 등록할 수 있습니다.',
            cover: (
                <img
                    alt="tour.png"
                    src="/mainScreen/가이드2.png"
                    width="195" height="328"
                />
            ),
            target: () => step2.current,
        },
        {
            title: '사업 관리',
            description: `업자님의 사업들을 전체적으로 관리할 수 있는 페이지 입니다.`,
            cover: (
                <img
                    alt="tour.png"
                    // src="/mainScreen/가이드3.png"
                />
            ),
            target: () => step3.current,
        },
        {
            title: '사업 목록',
            description: `등록 된 사업 목록을 보여줍니다. ["사업 등록"]에서 사업을 등록하시면 해당 목록에 추가됩니다.`,
            cover: (
                <img
                    alt="tour.png"
                    src="/mainScreen/가이드3.png"
                />
            ),
            target: () => step4.current,
        }
    ];

    return useObserver(() => (
        <>
            <div style={{background: '#e7a19a'}}>
                <Button
                    id={"menuBtn"}
                    type="text"
                    onClick={toggleCollapsed}
                    style={{
                        // background: '#e7a19a',
                    }}
                    ref={step1}
                >{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</Button>
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{
                        background: '#e7a19a',
                        color: 'white',
                        height: 'calc(100vh)',
                        minWidth: 0, flex: "auto"
                    }}
                    items={menuItems}
                    defaultOpenKeys={["main3"]}
                    onClick={({ key }) => handleMenuClick(key.toString())}
                    inlineCollapsed={collapsed}
                />
            </div>
            <Tour open={tourOpen} onClose={() => onTourEvent(false)} steps={steps}/>
        </>
    ));
}

export default NavMain;