import React, { useState } from "react";
import { Button, Input, Layout, Modal } from "antd";
import config from "../config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DesktopOutlined } from "@ant-design/icons";

const { Header } = Layout;

const CustomHeader = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberName, setMemberName] = useState();

  const showModal = () => {
    setIsModalOpen(true);
    handleEditProfile();
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleEditProfile = async () => {
    try {
      await axios
        .get(config.api_path + "/member/info", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setMemberName(res.data.result.name);
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

  const handleChangeProfile = async () => {
    try {
      await axios
        .put(
          config.api_path + "/member/changeprofile",
          { memberName: memberName },
          config.headers()
        )
        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire({
              title: "เปลี่ยนข้อมูล",
              text: "เปลี่ยนแปลงข้อมูลร้านของคุณแล้ว",
              icon: "success",
              timer: 2000,
            });
            handleOk();
          }
        });
    } catch (e) {
      Swal.fire({
        title: "error",
        message: e.message,
        icon: "error",
      });
    }
  };

  const handleSignout = () => {
    Swal.fire({
      title: "Sign out",
      text: "ยืนยันการออกจากระบบ",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem(config.token_name);
        navigate("/login");
      }
    });
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ color: "white", fontSize: "24px" }}>PEEMPOS</div>
      <div>
        <Button type="primary" onClick={showModal} style={{ marginRight: "10px" }}>
          Profile
        </Button>
        <Button onClick={handleSignout} type="primary" danger>
          Logout
        </Button>
      </div>
      <Modal
        title="Profile"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            ยกเลิก
          </Button>,
          <Button key="submit" type="primary" onClick={handleChangeProfile}>
            แก้ไขโปรไฟล์
          </Button>,
        ]}
      >
        <>
          <p>ชื่อร้าน</p>
          <Input
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
          ></Input>
        </>
      </Modal>
    </Header>
  );
};

export default CustomHeader;
