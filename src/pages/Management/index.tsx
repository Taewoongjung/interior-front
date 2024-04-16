import React from "react";
import {Layout} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content, Footer} from "antd/es/layout/layout";
import UserView from "./views/user";
import './styles.css';
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import CompanyListTable from "./views/table";
import CompanyRegister from "./register";

const baseStyle: React.CSSProperties = {
    width: '25%',
    height: 54,
};

const Management = () => {

    const {data:userData, error, mutate} = useSWR(
        'http://api-interiorjung.shop:7077/api/me',
        // 'http://localhost:7070/api/me',
        fetcher,{
            dedupingInterval: 2000
        });

    return (
        <div>
            <Layout style={{ height: 920 }}>
                <Sider width={300} style={{backgroundColor:'#eee'}}>
                    <Content style={{ height: 200 }}>
                        {/*<View1 user={selectedUser}/>*/}
                        <UserView name={userData?.name} email={userData?.email}/>
                    </Content>
                    <Content style={{ height: 300 }}>
                        {/*<View2 data={filteredData}/>*/}
                    </Content>
                    <Content style={{ height: 400 }}>
                        {/*<View3*/}
                        {/*    changeGreaterThenAge={this.changeGreaterThenAge}*/}
                        {/*    changeIncludedGender={this.changeIncludedGender}*/}
                        {/*/>*/}
                    </Content>
                </Sider>
                <Layout>
                    <Content>
                        <CompanyRegister/>
                    </Content>
                    <Content style={{ height: 300 }}>
                        <section>사업체 리스트</section>
                        {userData?.companyList.length !== 0 &&
                            <CompanyListTable tableData={userData?.companyList}/>
                        }
                    </Content>
                    <Layout style={{ height: 600 }}>
                        <Content>
                            {/*<View5 data={filteredData}/>*/}
                        </Content>
                        {/*<Sider width={300} style={{backgroundColor:'#eee'}}>*/}
                        {/*    /!*<View6 data={filteredData} changeSelectUser={this.changeSelectUser}/>*!/*/}
                        {/*</Sider>*/}
                    </Layout>
                </Layout>
            </Layout>
            <Layout>
                <Footer style={{ height: 20 }}>
                    <div style={{marginTop: -10}}>
                        produced by tws
                        Author <a href='https://sdq.ai'>sdq</a>;
                    </div>
                </Footer>
            </Layout>
        </div>
    );
}

export default Management;