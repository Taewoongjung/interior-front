import React, {useCallback, useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import useSWR from "swr";
import fetcher from "../../../utils/fetcher";
import {Button, Input, Menu, MenuProps, Radio, Space, Form} from "antd";
import {AppstoreOutlined} from "@ant-design/icons";
import axios from "axios";

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

const NavMain =(props:{inlineCollapsed:any;}) => {

    const {inlineCollapsed} = props;

    const { companyId } = useParams();

    const history = useHistory();

    const handleButtonClick = (businessId: string) => {
        // 이벤트 발생 시 쿼리 파라미터를 추가하여 URL을 업데이트
        const newQueryParams = new URLSearchParams(history.location.search);
        newQueryParams.set('businessId', businessId);

        history.push({
            pathname: `/main/${companyId}`,
            search: newQueryParams.toString(),
        });
    };

    const {data:businesses, error, mutate} = useSWR(
        `http://api-interiorjung.shop:7077/api/companies/${companyId}/businesses`,
        // `http://localhost:7070/api/companies/${companyId}/businesses`,
        fetcher);

    // 초기 메뉴 아이템 설정
    const initialBusinessItems: MenuItem[] = [];

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
        getItem('사업 목록', 'sub1', <AppstoreOutlined/>, businessItems)
    ];


    const [businessListOrRegister, setBusinessListOrRegister] = useState('사업목록');

    const handleBusinessChange = (e:any) => {
        const selectedValue = e.target.value;
        setBusinessListOrRegister(selectedValue);
    };

    const [form] = Form.useForm();

    const [businessName, setBusinessName] = useState('');

    const onChangeBusinessName = (e: { target: { value: string; }; }) => {
        const value = e.target.value;
        setBusinessName(value);
    };

    const onSubmitCreateBusiness = useCallback(async (e: { preventDefault: () => void; }) => {

        await axios
            .post(`http://api-interiorjung.shop:7077/api/companies/${companyId}/businesses`, {
                    // .post(`http://localhost:7070/api/companies/${companyId}/businesses`, {
                    businessName
                }, {
                    withCredentials: true, // CORS 처리 옵션
                    headers: {
                        Authorization: localStorage.getItem("interiorjung-token")
                    }
                }
            ).then((response) => {
                if (response.data === true) {
                    mutate();
                    setBusinessName('');
                }
            })
            .catch((error) => {
                console.dir("error = ", error);
            });
        },
        [businessName]
    );

    return (
        <>
            <Radio.Group value={businessListOrRegister} onChange={handleBusinessChange}>
                <Radio.Button value="사업목록">≡ 사업 목록</Radio.Button>
                <Radio.Button value="사업등록">+ 사업 등록</Radio.Button>
            </Radio.Group>
            {businessListOrRegister === '사업목록' &&
                <Menu
                    mode="inline"
                    theme="light"
                    defaultSelectedKeys={['1']}
                    style={{
                        background: '#e7a19a',
                        color: 'white',
                        height: 'calc(100vh - (75px + 130px + 16px + 32px)'
                    }}
                    items={menuItems}
                    // onClick={({ key }) => handleButtonClick(key.toString())}
                    inlineCollapsed={inlineCollapsed}
                />
            }

            {businessListOrRegister === '사업등록' &&
                <Form form={form} onFinish={onSubmitCreateBusiness}>
                    <Form.Item
                        name="businessName"
                        label="사업 명"
                        style={{ marginTop: '30%' }}
                        rules={[{ required: true, message: '⚠️ 사업 명은 필수 입니다.' }]}
                    >
                        <Space direction="horizontal" size="middle">
                            <Space.Compact style={{ width: '100%' }}>
                                <Input minLength={2} maxLength={15} onChange={onChangeBusinessName} />
                                <Button onClick={() => form.submit()} type="primary">등록</Button>
                            </Space.Compact>
                        </Space>
                    </Form.Item>
                </Form>
            }
        </>
    );
}

export default NavMain;