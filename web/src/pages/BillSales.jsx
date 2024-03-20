import React, { useEffect, useState } from "react";
import CustomLayout from "../components/Layout";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import { Table, Button, Modal } from "antd";
import dayjs from "dayjs";

function BillSales() {
  const [billSales, setBillSales] = useState([]);
  const [selectBill, setSelectBill] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        config.api_path + "/billSale/list",
        config.headers()
      );
      if (response.data.message === "success") {
        setBillSales(response.data.results);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const columns = [
    {
      title: "เลขบิล",
      dataIndex: "id",
      key: "billNumber",
    },
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "ดูรายการ",
      dataIndex: "viewDetails",
      key: "viewDetails",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleViewDetails(record)}>
          ดูรายการ
        </Button>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    setSelectBill(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectBill({});
  };

  return (
    <CustomLayout title="รายงานบิลขาย">
      <Table dataSource={billSales} columns={columns} />

      <Modal
        title="รายการในบิล"
        visible={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            ปิด
          </Button>,
        ]}
      >
        <Table
          dataSource={selectBill.billSaleDetails}
          columns={[
            {
              title: "รายการ",
              dataIndex: ["product", "name"],
              key: "name",
            },
            {
              title: "ราคา",
              dataIndex: "price",
              key: "price",
              render: (text) => Number(text).toLocaleString("th-TH"),
            },
            {
              title: "จำนวน",
              dataIndex: "qty",
              key: "quantity",
            },
            {
              title: "ยอดรวม",
              dataIndex: "total",
              key: "total",
              render: (_, record) =>
                (record.price * record.qty).toLocaleString("th-TH"),
            },
          ]}
          pagination={false}
        />
      </Modal>
    </CustomLayout>
  );
}

export default BillSales;
