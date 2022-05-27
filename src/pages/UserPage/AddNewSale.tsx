import {
  Avatar,
  Button,
  Col,
  message,
  Modal,
  Row,
  Space,
  Typography,
  Upload,
} from "antd";
import React, { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import {
  UserOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { SaveButton } from "../../components/Button/SaveButton";
import Layout, { Content, Header } from "antd/lib/layout/layout";
import { Link } from "react-router-dom";

export function AddNewSale() {
  const mystyle = {
    color: "black",
    backgroundColor: "white",
    padding: "20px",
    fontFamily: "Arial",
    height: "100%",
  };

  const [sale, setSale] = useState();
  const [name, setName] = useState<{ show: boolean; massage?: string }>({
    show: false,
    massage: "",
  });
  const [phone, setPhone] = useState<{ show: boolean; massage?: string }>({
    show: false,
    massage: "",
  });
  const [email, setEmail] = useState<{ show: boolean; massage?: string }>({
    show: false,
    massage: "",
  });
  const [zone, setZone] = useState<{ show: boolean; massage?: string }>({
    show: false,
    massage: "",
  });
  const [action, setAction] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const validationThLetter = (text: string) => {
    return text.match(/[ก-๙ ]/g);
  };

  const validationNumber = (text: string) => {
    return text.match(/[0-9]/g);
  };

  const validationEnLetter = (text: string) => {
    return text.match(/[a-zA-Z0-9$@$!%*?&#^-_. +:;]/g);
  };

  const validationEnNumLetter = (text: string) => {
    return text.match(/[a-zA-Z0-9]/g);
  };

  return (
    <>
      <Nav />
      <Layout style={{ height: "100vh" }}>
        <div className="sale-page" style={mystyle}>

       
        <Row>
          <Col span={2}>
            <div className="space-align-block">
              <Link to="/SaleManagementPage">
                <h3>
                  <ArrowLeftOutlined />
                </h3>
              </Link>
            </div>
          </Col>
          <Col span={6}>
            <h3>
              <Space align="start" style={mystyle}>
                เพิ่มรายชื่อพนักงาน
              </Space>
            </h3>
          </Col>
        </Row>

        <form>
          <div className="col-lg-12 col-xl-12">
            <div className="d-flex flex-row align-items-center">
              <Row justify="center">
                <Col span={14}>
                  <Avatar size={100} icon={<UserOutlined />} />
                </Col>
                <Col span={6}>
                  <Upload>
                    <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
                  </Upload>
                </Col>
              </Row>
            </div>
          </div>
          <div className="col-lg-12 col-xl-12 py-5 row">
            <div className="col-lg-6">
              <label className="text-dark-50">ชื่อ*</label>
              <input className="form-control" placeholder="ระบุชื่อ" />
              {name ? (
                <span className="text-danger">{name.massage}</span>
              ) : (
                <span></span>
              )}
            </div>
            <div className="col-lg-6">
              <label className="text-dark-50">นามสกุล*</label>
              <input className="form-control" placeholder="ระบุนามสกุล" />
            </div>
            <div className="col-lg-12 col-xl-12 py-5 row">
            <div className="col-lg-6">
              <label className="text-dark-50">ชื่อเล่น</label>
              <input className="form-control" placeholder="ระบุชื่อเล่น" />
            </div>
            </div>
            <div className="col-lg-6">
              <label className="text-dark-50">เบอร์โทรศัพท์*</label>
              <input className="form-control" placeholder="ระบุเบอร์โทรศัพท์" />
              {phone ? (
                <span className="text-danger">{phone.massage}</span>
              ) : (
                <span></span>
              )}
            </div>
          </div>
          
            <div className="col-lg-6">
              <label className="text-dark-50">E-mail*</label>
              <input className="form-control" placeholder="กรอก E-mail" />
              {email ? (
                <span className="text-danger">{email.massage}</span>
              ) : (
                <span></span>
              )}
            </div>
          
            <div className="col-lg-6">
              <label className="text-dark-50">ตำแหน่ง*</label>
              <input className="form-control" placeholder="กรอกตำแหน่ง" />
            </div>
            <div className="col-lg-6">
              <label className="text-dark-50">เขต*</label>
              <input className="form-control" placeholder="กรอกเขต" />
              {zone ? (
                <span className="text-danger">{zone.massage}</span>
              ) : (
                <span></span>
              )}
            </div>
       

          <div className="d-flex flex-row align-items-center justify-content-between">
            <div>
              <p style={{ fontSize: 14, color: "#BABCBE" }}>
                โปรดตรวจสอบข้อมูลพนักงานก่อนบันทึก
              </p>
            </div>
            <div>
              <Button
                onClick={() => (window.location.href = "")}
                className="btn btn-secondary btn-lg"
              >
                บันทึก
              </Button>
            </div>
          </div>
        </form>
        <Modal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
        >
          <p style={{ color: "#464E5F", fontSize: 24 }}>
            ยืนยันการบันทึกข้อมูล
          </p>
          <p style={{ color: "#BABCBE", fontSize: 16 }}>
            โปรดยืนยันการบันทึกข้อมูลเพิ่มตำแหน่งชื่อ
          </p>
        </Modal>
        </div>
      </Layout>
    </>
  );
}
