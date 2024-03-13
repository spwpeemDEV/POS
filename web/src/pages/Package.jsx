import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Button,
  Col,
  Row,
  Modal,
  Form,
  Input,
  Alert,
} from "antd";
import axios from "axios";
import config from "../config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function Package() {
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [pass, setPass] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      axios
        .get(config.api_path + "/package/list")
        .then((res) => {
          setPackages(res.data.results);
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      console.log(e.message);
    }
  };

  const showModal = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [form] = Form.useForm();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "ยืนยันการสมัคร",
        text: " โปรดยืนยันการสมัครใช้งาน Package ของเรา",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          const payload = {
            packageId: selectedPackage.id,
            name: name,
            phone: phone,
            pass: pass
          };
          axios
            .post(config.api_path + "/package/memberRegister", payload)
            .then((res) => {
              if (res.data.message === "success") {
                Swal.fire({
                  title: "บันทึกข้อมูล",
                  text: "บันทึกข้อมูลการสมัครแล้ว",
                  icon: "success",
                  timer: 2000,
                });
              }
              handleOk();
              form.resetFields();
              navigate("/login");
            })
            .catch((err) => {
              throw err.response.data;
            });
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

  return (
    <Card>
      <Title>PeemPOS : Point of sale</Title>
      <Title level={2}>กรุณาเลือกแพ็คเก็จ</Title>
      <Row>
        {packages.map((item) => (
          <Col span={6} style={{ margin: "10px" }} key={item.id}>
            <Card style={{ textAlign: "center" }}>
              <Title type="danger" level={3}>
                {item.name}
              </Title>
              <Title level={3}>
                {parseInt(item.bill_amount).toLocaleString("th-TH")} บิลต่อเดือน
              </Title>
              <Title level={3}>
                {parseInt(item.price).toLocaleString("th-TH")} บาท{" "}
              </Title>
              <Button type="primary" onClick={() => showModal(item)}>
                สมัคร
              </Button>
              <Modal
                title="สมัครใช้บริการ"
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                  <Button key="cancel" onClick={handleCancel}>
                    ยกเลิก
                  </Button>,
                  <Button key="submit" type="primary" onClick={handleRegister}>
                    ยืนยันการสมัคร
                  </Button>,
                ]}
              >
                {selectedPackage && (
                  <Alert
                    message="ข้อมูลแพ็คเกจ"
                    description={
                      <>
                        <p>Package: {selectedPackage.name}</p>
                        <p>
                          ราคา:{" "}
                          {parseInt(selectedPackage.price).toLocaleString(
                            "th-TH"
                          )}{" "}
                          บาท
                        </p>
                        <p>
                          จำนวนบิลต่อเดือน:{" "}
                          {parseInt(selectedPackage.bill_amount).toLocaleString(
                            "th-TH"
                          )}{" "}
                          บิล
                        </p>
                      </>
                    }
                    type="info"
                  />
                )}
                <Form form={form} layout="vertical">
                  <Form.Item
                    label="ชื่อร้าน"
                    name="storeName"
                    onChange={(e) => setName(e.target.value)}
                    rules={[{ required: true, message: "โปรดกรอกชื่อร้าน" }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="เบอร์โทร"
                    name="phoneNumber"
                    onChange={(e) => setPhone(e.target.value)}
                    rules={[{ required: true, message: "โปรดกรอกเบอร์โทร" }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="รหัสผ่าน"
                    name="pass"
                    onChange={(e) => setPass(e.target.value)}
                    rules={[{ required: true, message: "โปรดกรอกรหัสผ่าน" }]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Form>
              </Modal>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}

export default Package;
