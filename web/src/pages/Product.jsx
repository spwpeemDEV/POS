import React, { useEffect, useState } from "react";
import CustomLayout from "../components/Layout";
import {
  Input,
  Col,
  Row,
  Form,
  Button,
  Modal,
  Table,
  Upload,
  Divider,
  Card,
  Space,
} from "antd";
import {
  CheckOutlined,
  EditOutlined,
  DeleteOutlined,
  FileImageOutlined,
  UploadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";

function Product() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [productImage, setProductImage] = useState({});
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        config.api_path + "/product/list",
        config.headers()
      );
      if (response.data.message === "success") {
        setProducts(response.data.results);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let url = config.api_path + "/product/insert";

    if (product.id !== undefined) {
      url = config.api_path + "/product/update";
    }
    try {
      const response = await axios.post(url, product, config.headers());
      if (response.data.message === "success") {
        Swal.fire({
          title: "บันทึกข้อมูล",
          text: "บันทึกข้อมูลสินค้าแล้ว",
          icon: "success",
          timer: 2000,
        });
        fetchData();
        clearForm();
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

  const clearForm = () => {
    setProduct({
      name: "",
      detail: "",
      price: "",
      cost: "",
      barcode: "",
    });
    setFileList([]); // เคลียร์รายการไฟล์ที่เลือก
  };

  const handleEdit = (record) => {
    setProduct(record);
    setModalVisible(true);
  };

  const handleProductImage = (item) => {
    handleChooseProduct(item);
    setIsProductModalVisible(true);
  };

  const handleChangeFile = (info) => {
    setFileList(info.fileList);
  };

  const handleChooseProduct = (item) => {
    setProduct(item);
    fetchDataProductImage(item);
  };

  const handleChooseMainImage = async (item) => {
    Swal.fire({
      title: "เลือกภาพสินค้า",
      text: "ยืนยันการเลือกภาพนี้",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const url =
            config.api_path +
            "/productImage/chooseMainImage/" +
            item.id +
            "/" +
            item.productId;

          const response = await axios.get(url, config.headers());
          if (response.data.message === "success") {
            fetchDataProductImage({
              id: item.productId,
            });
            Swal.fire({
              title: "เลือกภาพหลัก",
              text: "บันทึกภาพหลักของสินค้าแล้ว",
              icon: "success",
              timer: 2000,
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
          });
        }
      }
    });
  };

  const handleUpload = () => {
    Swal.fire({
      title: "ยืนยันการอัพโหลดสินค้า",
      text: "โปรดทำการยืนยัน เพื่ออัพโหลดสินค้านี้",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const _config = {
            headers: {
              Authorization: "Bearer" + localStorage.getItem(config.token_name),
              "Content-Type": "multipart/form-data",
            },
          };
          const formData = new FormData();
          fileList.forEach((file) => {
            formData.append("productImage", file.originFileObj);
            formData.append("productImageName", file.name);
            formData.append("productId", product.id);
          });

          const response = await axios.post(
            config.api_path + "/productImage/insert",
            formData,
            _config
          );

          if (response.data.message === "success") {
            Swal.fire({
              title: "upload ภาพสินค้า",
              text: "upload ภาพสินค้าเรียบร้อยแล้ว",
              icon: "success",
              timer: 2000,
            });
            fetchDataProductImage({ id: product.id });
            setIsProductModalVisible(false);
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
          });
        }
      }
    });
  };

  const fetchDataProductImage = async (item) => {
    try {
      await axios
        .get(
          config.api_path + "/productImage/list/" + item.id,
          config.headers()
        )
        .then((res) => {
          if (res.data.message === "success") {
            setProductImages(res.data.results);
          }
        });
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleDelete = async (record) => {
    Swal.fire({
      title: "ลบข้อมูล",
      text: "ยืนยันการลบข้อมูลออกจากระบบ",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            config.api_path + "/product/delete/" + record.id,
            config.headers()
          );
          Swal.fire({
            title: "ลบข้อมูลสำเร็จ",
            text: "ข้อมูลถูกลบออกจากระบบเรียบร้อยแล้ว",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchData();
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
          });
        }
      }
    });
  };

  const handleDeleteImage = (item) => {
    try {
      Swal.fire({
        title: "ลบภาพสินค้า",
        text: "ยืนยันการลบภาพสินค้าออกจากระบบ",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      }).then(async (res) => {
        if (res.isConfirmed) {
          await axios
            .delete(
              config.api_path + "/productImage/delete/" + item.id,
              config.headers()
            )
            .then((res) => {
              if (res.data.message === "success") {
                fetchDataProductImage({ id: item.productId });
                Swal.fire({
                  title: "ลบภาพสินค้า",
                  text: "ลบภาพสินค้าออกจากระบบแล้ว",
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
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const columns = [
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ราคาทุน",
      dataIndex: "cost",
      key: "cost",
      render: (text) => numberWithCommas(text),
    },
    {
      title: "ราคาจำหน่าย",
      dataIndex: "price",
      key: "price",
      render: (text) => numberWithCommas(text),
    },
    {
      title: "รายละเอียด",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "การดำเนินการ",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<FileImageOutlined />}
            onClick={() => handleProductImage(record)}
          >
            ภาพสินค้า
          </Button>
          <Button
            type="warning"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            แก้ไข
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            ลบ
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <CustomLayout title="สินค้า">
      <Button type="primary" onClick={() => setModalVisible(true)}>
        เพิ่มสินค้า
      </Button>
      <Divider style={{ marginTop: "20px" }} />
      <Table columns={columns} dataSource={products} />

      <Modal
        title="เพิ่มสินค้า"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1000}
      >
        <Form>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <>
                <label>Barcode</label>
                <Input
                  placeholder="ป้อน Barcode"
                  value={product.barcode}
                  onChange={(e) =>
                    setProduct({ ...product, barcode: e.target.value })
                  }
                />
              </>
            </Col>
            <Col span={12}>
              <>
                <label>ชื่อสินค้า</label>
                <Input
                  placeholder="ป้อนชื่อสินค้า"
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                />
              </>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <>
                <label>ราคาจำหน่าย</label>
                <Input
                  placeholder="ป้อนราคาจำหน่าย"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                />
              </>
            </Col>
            <Col span={6}>
              <>
                <label>ราคาทุน</label>
                <Input
                  placeholder="ป้อนราคาทุน"
                  value={product.cost}
                  onChange={(e) =>
                    setProduct({ ...product, cost: e.target.value })
                  }
                />
              </>
            </Col>
            <Col span={12}>
              <>
                <label>รายละเอียด</label>
                <Input
                  placeholder="ป้อนรายละเอียด"
                  value={product.detail}
                  onChange={(e) =>
                    setProduct({ ...product, detail: e.target.value })
                  }
                />
              </>
            </Col>
          </Row>
          <Button
            type="primary"
            onClick={handleSave}
            style={{ margin: "10px" }}
            icon={<CheckOutlined />}
          >
            บันทึก
          </Button>
        </Form>
      </Modal>
      <Modal
        title="ภาพสินค้า"
        visible={isProductModalVisible}
        onCancel={() => setIsProductModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <>
                <label>Barcode</label>
                <Input
                  placeholder="ป้อน Barcode"
                  value={product.barcode}
                  onChange={(e) =>
                    setProduct({ ...product, barcode: e.target.value })
                  }
                  disabled
                />
              </>
            </Col>
            <Col span={12}>
              <>
                <label>ชื่อสินค้า</label>
                <Input
                  placeholder="ป้อนชื่อสินค้า"
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                  disabled
                />
              </>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <>
                <label>ราคาจำหน่าย</label>
                <Input
                  placeholder="ป้อนราคาจำหน่าย"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                  disabled
                />
              </>
            </Col>
            <Col span={6}>
              <>
                <label>ราคาทุน</label>
                <Input
                  placeholder="ป้อนราคาทุน"
                  value={product.cost}
                  onChange={(e) =>
                    setProduct({ ...product, cost: e.target.value })
                  }
                  disabled
                />
              </>
            </Col>
            <Col span={12}>
              <>
                <label>รายละเอียด</label>
                <Input
                  placeholder="ป้อนรายละเอียด"
                  value={product.detail}
                  onChange={(e) =>
                    setProduct({ ...product, detail: e.target.value })
                  }
                  disabled
                />
              </>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <>
                <label>เลือกภาพสินค้า</label>
                <>
                  <Upload
                    listType="picture"
                    fileList={fileList}
                    onChange={handleChangeFile}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </>
              </>
            </Col>
          </Row>
          <Divider />
          <label>ภาพสินค้า</label>
          <Row gutter={[16, 16]}>
            {productImages.map((item) => (
              <Col span={6} key={item.id}>
                <Card
                  style={{ width: "100%" }}
                  cover={
                    <img
                      alt={item.imageName}
                      src={`${config.api_path}/uploads/${item.imageName}`}
                    />
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      type="primary"
                      style={{ marginTop: "8px", marginRight: "8px" }}
                      icon={item.isMain ? <CheckOutlined /> : <CloseOutlined />}
                      onClick={() => handleChooseMainImage(item)}
                      disabled={item.isMain}
                    >
                      {item.isMain ? "ภาพหลัก" : "ภาพรอง"}
                    </Button>
                    <Button
                      style={{ marginTop: "8px" }}
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteImage(item)}
                    ></Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Button
            type="primary"
            onClick={handleUpload}
            style={{ margin: "10px" }}
            icon={<CheckOutlined />}
          >
            อัปโหลดและบันทึก
          </Button>
        </Form>
      </Modal>
    </CustomLayout>
  );
}

export default Product;
