import React from "react";
import { Card, Layout } from "antd";
import CustomHeader from "./Header";
import CustomSider from "./Sider";
import CustomContent from "./Content";
import CustomFooter from "./Footer";

const { Content } = Layout;

const CustomLayout = (props) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <CustomHeader />
      <Layout>
        <CustomSider />
        <Layout>
          <Card title={props.title} style={{ margin: "10px" }}>
            <CustomContent />
            {props.children}
          </Card>
          <CustomFooter />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
