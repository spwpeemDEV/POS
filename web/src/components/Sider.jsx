import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { InboxOutlined, FundOutlined, UserOutlined,DollarOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";

const { Sider } = Layout;

const CustomSider = () => {
  const [memberName, setMemberName] = useState();
  const [packageName, setPackageName] = useState();
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      axios
        .get(config.api_path + "/member/info", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setMemberName(res.data.result.name);
            setPackageName(res.data.result.package.name);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      Swal.fire({
        title: "error",
        message: e.message,
        icon: "error",
      });
    }
  };

  return (
    <Sider>
      <div
        style={{
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>{memberName}</p>
        <p>Package : {packageName}</p>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        onClick={handleMenuClick}
      >
        <Menu.Item key="/dashboard" icon={<FundOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="/sale" icon={<DollarOutlined />}>
          ขายสินค้า
        </Menu.Item>
        <Menu.Item key="/product" icon={<InboxOutlined />}>
          สินค้า
        </Menu.Item>
        <Menu.Item key="/user" icon={<UserOutlined />}>
          ผู้ใช้งานระบบ
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default CustomSider;
