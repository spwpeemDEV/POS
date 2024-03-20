import React, { useEffect, useState } from "react";
import CustomLayout from "../components/Layout";
import { Button, Modal, Input, Select, Form, Table, Row } from "antd";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";

const { Option } = Select;

function User() {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        config.api_path + "/user/list",
        config.headers()
      );
      console.log(res.data); // ล็อกค่าที่ได้จากการ GET ข้อมูลผู้ใช้
      if (res.data.message === "success") {
        setUsers(res.data.results);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };
  

  const showModal = () => {
    clearForm();
    setVisible(true);
  };

  const handleChange = (value) => {
    setUser({ ...user, level: value });
  };

  const handleSave = async () => {
    try {
      if (password !== passwordConfirm) {
        throw new Error("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      }

      if (user.id) {
        const res = await axios.post(
          config.api_path + "/user/edit",
          { ...user, pass: password },
          config.headers()
        );
        if (res.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึกข้อมูลเรียบร้อย",
            icon: "success",
            timer: 2000,
          });
          setVisible(false);
          fetchData();
        }
      } else {
        // เพิ่มผู้ใช้งานใหม่
        const res = await axios.post(
          config.api_path + "/user/insert",
          { ...user, pass: password },
          config.headers()
        );
        if (res.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึกข้อมูลเข้าระบบแล้ว",
            icon: "success",
            timer: 2000,
          });
          setVisible(false);
          fetchData();
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleCancel = () => {
    clearForm();
    setVisible(false);
  };

  const clearForm = () => {
    setUser({
      name: "",
      user: "",
      level: "User",
    });
    setPassword("");
    setPasswordConfirm("");
  };

  const columns = [
    {
      title: "ชื่อผู้ใช้งาน",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "username",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "ระดับ",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "การกระทำ",
      key: "action",
      render: (text, record) => (
        <span size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            แก้ไข
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            ลบ
          </Button>
        </span>
      ),
    },
  ];

  const handleEdit = (record) => {
    setUser({
      id: record.id,
      name: record.name,
      user: record.user,
      level: record.level,
    });
    setVisible(true);
  };

  const handleDelete = (record) => {
    try {
      Swal.fire({
        title: "ยืนยันการลบข้อมูล",
        text: "คุณต้องการลบหรือไม่",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      }).then(async (res) => {
        if (res.isConfirmed) {
          await axios
            .delete(
              config.api_path + "/user/delete/" + record.id,
              config.headers()
            )
            .then((response) => {
              if (response.data.message === "success") {
                fetchData();
                Swal.fire({
                  title: "ลบข้อมูลแล้ว",
                  text: "ระบบได้ทำการลบข้อมูลเรียบร้อยแล้ว",
                  icon: "success",
                  timer: 2000,
                });
              }
            })
            .catch((err) => {
              throw err.response.data;
            });
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };
  

  return (
    <CustomLayout title="ผู้ใช้งานระบบ">
      <Button type="primary" onClick={showModal}>
        เพิ่มผู้ใช้งาน
      </Button>
      <Modal
        title={user.id ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน"}
        visible={visible}
        footer={null}
        onCancel={handleCancel}
      >
        <Form>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "10px" }}>ชื่อผู้ใช้งาน</label>
            <Input
              placeholder="ชื่อผู้ใช้งาน"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "10px" }}>username</label>
            <Input
              placeholder="username"
              value={user.user}
              onChange={(e) => setUser({ ...user, user: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "10px" }}>password</label>
            <Input.Password
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "10px" }}>confirm password</label>
            <Input.Password
              placeholder="ยืนยันรหัสผ่าน"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "10px" }}>ระดับ</label>
            <Select
              style={{ width: "100%" }}
              onChange={handleChange}
              value={user.level}
            >
              <Option value="User">User</Option>
              <Option value="Admin">Admin</Option>
            </Select>
          </div>
          <Button
            type="primary"
            style={{ margin: "10px" }}
            icon={<CheckOutlined />}
            onClick={handleSave}
          >
            บันทึก
          </Button>
        </Form>
      </Modal>
      <Row></Row>
      <div style={{ marginTop: "20px" }}>
        <Table columns={columns} dataSource={users} />
      </div>
    </CustomLayout>
  );
}

export default User;
