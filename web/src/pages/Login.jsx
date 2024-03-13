import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import axios from "axios";
import config from "../config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Login() {
  const [phone, setPhone] = useState();
  const [pass, setPass] = useState();

  const navigate = useNavigate();

  const handleSignin = async () => {
    try {
      const payload = {
        phone: phone,
        pass: pass,
      };
      await axios
        .post(config.api_path + "/member/signin", payload)
        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire({
              title: "Sign In",
              text: "เข้าสู่ระบบแล้ว",
              icon: "success",
              timer: 2000,
            });

            localStorage.setItem(config.token_name, res.data.token);

            navigate('/home')
          } else {
            Swal.fire({
              title: "Sign In",
              text: "ไม่พบข้อมูลในระบบ",
              icon: "warning",
              timer: 2000,
            });
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            Swal.fire({
              title: "Sign In",
              text: "ไม่พบข้อมูลในระบบ",
              icon: "warning",
              timer: 2000,
            });
          } else {
            throw err.response.data;
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
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      autoComplete="off"
    >
      <Form.Item label="Phone" name="phone">
        <Input onChange={(e) => setPhone(e.target.value)} />
      </Form.Item>

      <Form.Item label="Password" name="password">
        <Input.Password onChange={(e) => setPass(e.target.value)} />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      ></Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" onClick={handleSignin}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Login;
