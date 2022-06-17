import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
} from "antd";
import React, { useState, useEffect } from "react";
import { CardContainer } from "../../components/Card/CardContainer";
import Layouts from "../../components/Layout/Layout";
import { TabCardButton } from "../../components/TabCardButton/TabCardButton";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Container } from "react-bootstrap";
import TextArea from "antd/lib/input/TextArea";
import { ProductListDatasource } from "../../datasource/ProductListDatasource";
import { useLocalStorage } from "../../hook/useLocalStorage";
import { ProductListEntity } from "../../entities/ProductListEntity";
import { UpdatePriceListModel_INIT, UpdateProductListModel } from "../../components/Models/UpdateProductListModel";

export const EditDistributionPage: React.FC = () => {
  const [value, setValue] = useState(1);
  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productInfo, setProductInfo] = useState<UpdateProductListModel>(UpdatePriceListModel_INIT);
  const [imageUrl, setImageUrl] = useState<string>('');

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [persistedProfile, setPersistedProfile] = useLocalStorage(
    "profile",
    []
  );
  const fetchProductById = async (
    productId: number,

  ) => {
    await ProductListDatasource.getProductListByID(
     productId
    ).then((res) => {
      setProductInfo(res)
      console.log(res);
    });
  };

  useEffect(() => {
    fetchProductById(persistedProfile.productId);
  }, []);

  return (
    <Layouts>
      <CardContainer>
        <Row>
          <span
            onClick={() => (window.location.href = "/DistributionPage")}
            className="btn btn-icon btn-circle mr-4"
            style={{ marginTop: "-5px" }}
          >
            <ArrowLeftOutlined />
          </span>
          <span
            className="card-label font-weight-bolder text-dark"
            style={{ fontSize: "20px" }}
          >
            แก้ไขสินค้า
          </span>
        </Row>
        <Row justify="center">
          <Col span={6} style={{ margin: "10px" }}>
            <Image
              width={100}
              src="https://system.icpladda.com/ProductImage/กล่องม่วง.jpeg"
            />
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={12}>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              รายละเอียดสินค้า
            </span>
          </Col>
          <Col span={12}>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              ราคาต่อหน่วย
            </span>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <label>Product ID NAV</label>
            <Input
              placeholder=""
              //value={data.productId}
              disabled
            />
          </Col>
          <Col className="gutter-row" span={6}></Col>
          <Col className="gutter-row" span={6}>
            <label>ปริมาณสินค้า (หน่วย)</label>
            <Input
              placeholder=""
              // value={data.productId}
              disabled
            />
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <label>ชื่อสินค้า</label>
            <Input
              placeholder="เมทามอร์ป"
              // value={}
              disabled
            />
          </Col>
          <Col className="gutter-row" span={6}>
            <label>ชื่อสามัญ</label>
            <Input
              placeholder=""
              // value={data.commonName}
              disabled
            />
          </Col>
          <Col className="gutter-row" span={6}>
            <label>ราคาสินค้า</label>
            <Input
              placeholder=""
              // value={data.commonName}
              disabled
            />
          </Col>
          <Col className="gutter-row" span={6}>
            <label>หน่วยสินค้า</label>
            <Input
              placeholder=""
              // value={data.commonName}
              disabled
            />
          </Col>
          {/* <hr  style={{width: "1px",height:"500px"}}></hr> */}
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <label>กลุ่มสินค้า</label>
            <Input
              placeholder=""
              // value={data.productGroup}
              disabled
            />
          </Col>
          <Col className="gutter-row" span={6}>
            <label>Strategy Group</label>
            <Input
              placeholder=""
              // value={data.productStrategy}
              disabled
            />
          </Col>
          <Col className="gutter-row" span={6}>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              ราคาตลาด
            </span>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <label>ประเภทสินค้า</label>
            <Input
              placeholder=""
              // value={data.productStrategy}
              disabled
            />
          </Col>
          <Col className="gutter-row" span={6}></Col>
          <Col className="gutter-row" span={6}>
            <label>ราคากลาง</label>
            <Input
              placeholder=""
              // value={data.productStrategy}
              disabled
            />
          </Col>
          <Col className="gutter-row" span={6}>
            <label>หน่วยสินค้า</label>
            <Input
              placeholder=""
              // value={data.productStrategy}
              disabled
            />
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12}>
            <label>คุณสมบัติของสินค้า</label>
            <TextArea
              placeholder="กรอกคุณสมบัติของสินค้า"
              // value={data.productDescription}
              // onChange={handlePropertyChange}
            />
          </Col>
          <Col className="gutter-row" span={12}>
            <label>สถานะสินค้า</label>
            <br />
            <Radio.Group onChange={onChange} value={value}>
              <Space direction="vertical">
                <Radio value="active">ใช้งาน</Radio>
                <Radio value="inactive">ปิดการใช้งาน</Radio>
                <Radio value="hold">อยู่ระหว่างดำเนินการ</Radio>
              </Space>
            </Radio.Group>
          </Col>
        </Row>
        <br />
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={20}>
            <Button
              className="btn mr-2"
              onClick={() => (window.location.href = "/DistributionPage")}
            >
              ยกเลิก
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              className="btn mr-2 "
              onClick={showModal}
              // onClick={() => (window.location.href = "/DistributionPage")}
            >
              บันทึก
            </Button>
            <Modal
              title="ยืนยันการบันทึก"
              visible={isModalVisible}
              onOk={() => (window.location.href = "/DistributionPage")}
              onCancel={handleCancel}
            >
              <p>
                โปรดตรวจสอบรายละเอียดสินค้าที่คุณต้องการบันทึก
                ก่อนที่จะกดยืนยันการบันทึก
                เพราะอาจส่งผลต่อการข้อมูลสินค้าในแอปพลิเคชัน
              </p>
            </Modal>
          </Col>
        </Row>
      </CardContainer>
    </Layouts>
  );
};
