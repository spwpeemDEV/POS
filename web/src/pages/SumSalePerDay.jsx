import React, { useState, useEffect } from "react";
import CustomLayout from "../components/Layout";
import { Button, DatePicker, Modal, Table } from "antd";
import axios from "axios";
import config from "../config";
import dayjs from "dayjs";

const { MonthPicker } = DatePicker;

const SumSalePerDay = () => {
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [billSales, setBillSales] = useState([]);
  const [billSaleDetails, setBillSaleDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalBillSaleDetail, setmodalBillSaleDetail] = useState(false);
  const [selectedBill, setSelectedBill] = useState({});

  const currentDate = dayjs();

  useEffect(() => {
    setSelectedYear(currentDate.year());
    setSelectedMonth(currentDate.month() + 1);
  }, []);

  const handleSearch = async () => {
    try {
      const path =
        config.api_path +
        `/billSale/listByYearAndMonth/${selectedYear}/${selectedMonth}`;
      await axios.get(path, config.headers()).then((res) => {
        if (res.data.message === "success") {
          setBillSales(res.data.results);
        }
      });
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const handleBill = (record) => {
    setSelectedBill(record.results);
    setModalVisible(true);
  };

  const handleBillSaleDetail = (record) => {
    console.log(record.billSaleDetails);
    setBillSaleDetails(record.billSaleDetails);
    setmodalBillSaleDetail(true);
  };

  const columns = [
    {
      title: "วันที่",
      dataIndex: "day",
      key: "day",
    },
    {
      title: "ผลรวมยอดขาย",
      dataIndex: "sum",
      key: "sum",
      render: (text, record) => (
        <span>
          {record.sum.toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
          })}
        </span>
      ),
    },
    {
      key: "viewItems",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleBill(record)}>
          ดูรายการ
        </Button>
      ),
    },
  ];

  const billSaleColumns = [
    {
      title: "เลขบิล",
      dataIndex: "id",
    },
    {
      title: "วันที่",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      key: "viewItems",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleBillSaleDetail(record)}>
          แสดงรายการ
        </Button>
      ),
    },
  ];

  const billSaleDetailColumns = [
    {
      title: "รายการ",
      dataIndex: ["product", "name"],
    },
    {
      title: "ราคา",
      dataIndex: ["product", "price"],
      render: (text, record) => (
        <span>
          {parseInt(record.product.price).toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
          })}
        </span>
      ),
    },

    {
      title: "จำนวน",
      dataIndex: "qty",
    },
    {
      title: "ยอดรวม",
      render: (text, record) => (
        <span>
          {(record.product.price * record.qty).toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
          })}
        </span>
      ),
    },
  ];

  return (
    <CustomLayout title="รายการบิลตามปีและเดือน">
      <div style={{ marginBottom: 16 }}>
        <MonthPicker
          placeholder="เลือกเดือน"
          defaultValue={currentDate}
          onChange={(date, dateString) => {
            setSelectedYear(date.year());
            setSelectedMonth(date.month() + 1);
          }}
          style={{ marginRight: 16 }}
        />
        <Button type="primary" onClick={handleSearch}>
          ค้นหา
        </Button>
      </div>
      <Table dataSource={billSales} columns={columns} />
      <Modal
        title="รายการบิล"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Table dataSource={selectedBill} columns={billSaleColumns} />
      </Modal>

      <Modal
        title="รายการบิลขาย"
        visible={modalBillSaleDetail}
        onCancel={() => setmodalBillSaleDetail(false)}
        footer={null}
      >
        <Table
          pagination={false}
          dataSource={billSaleDetails}
          columns={billSaleDetailColumns}
        />
      </Modal>
    </CustomLayout>
  );
};

export default SumSalePerDay;
