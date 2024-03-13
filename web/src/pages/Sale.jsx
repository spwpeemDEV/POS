import React, { useEffect, useState } from "react";
import CustomLayout from "../components/Layout";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

function Sale() {
  const [products, setProducts] = useState([]);
  const [billSale, setBillSale] = useState({});
  const [currentBill, setCurrentBill] = useState({});
  const [lastBill, setLastBill] = useState({});
  const [billToday, setBillToday] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [inputMoney, setInputMoney] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedbill, setSelectedBill] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [endSaleModalVisible, setEndSaleModalVisible] = useState(false);
  const [lastBillModalVisible, setLastBillModalVisible] = useState(false);
  const [billTodayModalVisible, setBillTodayModalVisible] = useState(false);
  const [billDetailModalVisible, setBillDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
    openBill();
    fetchBillSaleDetail();
  }, []);

  const fetchBillSaleDetail = async () => {
    try {
      const res = await axios.get(
        config.api_path + "/billSale/currentBillInfo",
        config.headers()
      );
      if (res.data.results !== null) {
        setCurrentBill(res.data.results);
        sumTotalPrice(res.data.results.billSaleDetails);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const sumTotalPrice = (billSaleDetails) => {
    let sum = 0;

    for (let i = 0; i < billSaleDetails.length; i++) {
      const item = billSaleDetails[i];
      const qty = parseInt(item.qty);
      const price = parseInt(item.price);

      sum += qty * price;
    }
    setTotalPrice(sum);
  };

  const openBill = async () => {
    try {
      const res = await axios.get(
        config.api_path + "/billSale/openBill",
        config.headers()
      );
      if (res.data.message === "success") {
        setBillSale(res.data.result);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        config.api_path + "/product/listForSale",
        config.headers()
      );
      if (res.data.message === "success") {
        setProducts(res.data.results);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleSave = async (product) => {
    try {
      const res = await axios.post(
        config.api_path + "/billSale/sale",
        product,
        config.headers()
      );
      if (res.data.message === "success") {
        fetchBillSaleDetail();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleDelete = async (product) => {
    try {
      const response = await axios.delete(
        config.api_path + "/bilSale/deleteItem/" + product.id,
        config.headers()
      );
      if (response.data.message === "success") {
        fetchBillSaleDetail();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleAdjustQuantity = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handleModalSave = async () => {
    try {
      const res = await axios.post(
        config.api_path + "/billSale/updateQty",
        selectedProduct,
        config.headers()
      );
      if (res.data.message === "success") {
        fetchBillSaleDetail();
        setModalVisible(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleEndSale = async () => {
    try {
      const res = await axios.get(
        config.api_path + "/billSale/endSale",
        config.headers()
      );
      if (res.data.message === "success") {
        setEndSaleModalVisible(false);
        Swal.fire({
          title: "Success",
          text: "การขายสำเร็จ",
          icon: "success",
        });
        setCurrentBill({});
        openBill();
        fetchBillSaleDetail();
        setTotalPrice(0);
      }
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const handleLastBill = async () => {
    try {
      await axios
        .get(config.api_path + "/billSale/lastBill", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setLastBill(res.data.result[0]);
            setLastBillModalVisible(true);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const handleBillToday = async () => {
    try {
      await axios
        .get(config.api_path + "/billSale/billToday", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setBillToday(res.data.results);
            setBillTodayModalVisible(true);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const handleBillDetail = (record) => {
    setSelectedBill(record); // เก็บข้อมูลบิลที่ถูกเลือกไว้ใน state
    setBillDetailModalVisible(true); // เปิด Modal รายละเอียดในบิล
  };

  return (
    <CustomLayout title="ขายสินค้า">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "10px",
          gap: "10px",
        }}
      >
        <Button
          style={{
            background: "green",
            color: "white",
            display: totalPrice > 0 ? "block" : "none",
          }}
          onClick={() => setEndSaleModalVisible(true)}
        >
          จบการขาย
        </Button>

        <Button type="primary" onClick={handleBillToday}>
          บิลวันนี้
        </Button>
        <Button
          onClick={handleLastBill}
          style={{ background: "gray", color: "white" }}
        >
          บิลล่าสุด
        </Button>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col key={product.id} span={6}>
                <Card
                  onClick={(e) => handleSave(product)}
                  hoverable
                  cover={
                    <img
                      alt={product.imageName}
                      src={`${config.api_path}/uploads/${product.productImages[0].imageName}`}
                      style={{ width: "100%" }}
                    />
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <h2>{product.name}</h2>
                    <h2>{parseInt(product.price).toLocaleString("th-TH")}</h2>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={8}>
          <Card style={{ backgroundColor: "black" }}>
            <Title
              style={{
                color: "greenyellow",
                display: "flex",
                justifyContent: "center",
              }}
              level={1}
            >
              {totalPrice.toLocaleString("th-TH")} บาท
            </Title>
          </Card>
          {currentBill && Object.keys(currentBill).length > 0
            ? currentBill.billSaleDetails.map((product) => (
                <Card style={{marginBottom : '10px'}} key={product.id}>
                  <>
                  <Title level={4}>
                    {product.product.name}
                  </Title>
                    <Title level={5}>
                      {product.qty} x
                      {parseInt(product.price).toLocaleString("th-TH")} =
                      {(product.qty * product.price).toLocaleString("th-TH")}
                    </Title>
                    <>
                      <Button
                      style={{ marginRight : '10px'}}
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleAdjustQuantity(product)}
                      />
                      <Button
                        onClick={() => handleDelete(product)}
                        style={{ background: "red", color: "white" }}
                        icon={<DeleteOutlined />}
                      />
                    </>
                  </>
                </Card>
              ))
            : ""}
        </Col>
      </Row>
      <Modal
        title="ปรับจำนวน"
        visible={modalVisible}
        onOk={handleModalSave}
        onCancel={handleModalCancel}
      >
        {selectedProduct && (
          <>
            <label> ปรับจำนวน</label>
            <Input
              value={selectedProduct.qty}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  qty: e.target.value,
                })
              }
            />
          </>
        )}
      </Modal>
      <Modal
        title="จบการขาย"
        visible={endSaleModalVisible}
        onOk={handleEndSale}
        onCancel={() => setEndSaleModalVisible(false)}
        footer={[
          <Space style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={(e) => setInputMoney(totalPrice)}
              type="primary"
              icon={<CheckOutlined />}
            >
              จ่ายพอดี
            </Button>
            <Button
              onClick={handleEndSale}
              type="primary"
              icon={<CheckOutlined />}
            >
              จบการขาย
            </Button>
          </Space>,
        ]}
      >
        <label>ยอดเงินทั้งหมด</label>
        <Input value={totalPrice.toLocaleString("th-TH")} disabled />
        <label>รับเงิน</label>
        <Input
          value={inputMoney}
          onChange={(e) => setInputMoney(e.target.value)}
        />
        <label>เงินทอน</label>
        <Input value={(inputMoney - totalPrice).toLocaleString("th-TH")} />
      </Modal>
      <Modal
        title="บิลล่าสุด"
        visible={lastBillModalVisible}
        onCancel={() => setLastBillModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setLastBillModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <Table
          dataSource={lastBill.billSaleDetails}
          pagination={false}
          columns={[
            {
              title: "Barcode",
              dataIndex: ["product", "barcode"],
              key: "barcode",
            },
            {
              title: "รายการ",
              dataIndex: ["product", "name"],
              key: "name",
            },
            {
              title: "ราคา",
              dataIndex: "price",
              key: "price",
              render: (text) => parseInt(text).toLocaleString("th-TH"),
            },
            {
              title: "จำนวน",
              dataIndex: "qty",
              key: "qty",
            },
            {
              title: "ยอดรวม",
              key: "total",
              render: (text, record) =>
                (record.price * record.qty).toLocaleString("th-TH"),
            },
          ]}
        />
      </Modal>
      <Modal
        title="บิลวันนี้"
        visible={billTodayModalVisible}
        onCancel={() => setBillTodayModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setBillTodayModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <Table
          dataSource={billToday} // Set dataSource to billToday state
          columns={[
            {
              title: "เลขบิล",
              dataIndex: "id",
              key: "billNumber",
            },
            {
              title: "วันที่ขาย",
              dataIndex: "createdAt",
              key: "createdAt",
              render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
            },
            {
              key: "viewItems",
              render: (text, record) => (
                <Button type="primary" onClick={() => handleBillDetail(record)}>
                  ดูรายการ
                </Button>
              ),
            },
          ]}
        />
      </Modal>
      <Modal
        title="รายละเอียดในบิล"
        visible={billDetailModalVisible}
        onCancel={() => setBillDetailModalVisible(false)}
        footer={null}
      >
        <Table
          dataSource={selectedbill.billSaleDetails} // เปลี่ยน dataSource เป็น selectedbill.billSaleDetails
          pagination={false}
          columns={[
            {
              title: "Barcode",
              dataIndex: ["product", "barcode"],
              key: "barcode",
            },
            {
              title: "รายการ",
              dataIndex: ["product", "name"],
              key: "name",
            },
            {
              title: "ราคา",
              dataIndex: "price",
              key: "price",
              render: (text) => parseInt(text).toLocaleString("th-TH"),
            },
            {
              title: "จำนวน",
              dataIndex: "qty",
              key: "qty",
            },
            {
              title: "ยอดรวม",
              key: "total",
              render: (text, record) =>
                (record.price * record.qty).toLocaleString("th-TH"),
            },
          ]}
        />
      </Modal>
    </CustomLayout>
  );
}

export default Sale;
