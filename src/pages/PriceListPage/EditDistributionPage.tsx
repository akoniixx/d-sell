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
import { ArrowLeftOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { ProductListDatasource } from "../../datasource/ProductListDatasource";
import { useLocalStorage } from "../../hook/useLocalStorage";
import {
  UpdatePriceListModelUtil,
  UpdatePriceListModel_INIT,
  UpdateProductListModel,
} from "../../components/Models/UpdateProductListModel";
import { UpdateProductListEntityUtil } from "../../entities/UpdateProductListEntity";
import Swal from "sweetalert2";

const _ = require("lodash");
let queryString = _.split(window.location.search, "=");

export const EditDistributionPage: React.FC = () => {
  const style: React.CSSProperties = {
    marginRight: "10px",
    marginBottom: "20px",
    fontFamily: "Sukhumvit set",
  };

  const urlOrDefault = (url: string) => {
    if (url) {
      return url;
    } else {
      return "media/images/product_no_img.png";
    }
  };
  const data = UpdatePriceListModelUtil
  const imageProduct = String;
  const [value, setValue] = useState(1);
  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const productId = queryString[1];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productInfo, setProductInfo] = useState<UpdateProductListModel>(
    UpdatePriceListModel_INIT
  );

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchProductById = async (productId: number) => {
    await ProductListDatasource.getProductListByID(productId).then((res) => {
      setProductInfo(res);
      console.log(res);
    });
  };
  debugger;

  const UpdateProductList = (productId: number) => {
    ProductListDatasource.updateProductListById(data, productId )
      .then((res) => {
        if (res != null) {
          Swal.fire({
            title: "บันทึกสำเร็จ",
            icon: "success",
            confirmButtonText: "ยืนยัน",
            confirmButtonColor: "#0068F4",
          }).then((result) => {
            if (result.value == true) {
              window.location.href = "/DistributionPage";
            }
          });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchProductById(productId);
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
            style={{ fontFamily: "Sukhumvit set", fontSize: "20px" }}
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
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={style}>
          <Col span={12}>
            <span style={{ fontWeight: "bold" }}>รายละเอียดสินค้า</span>
          </Col>
          <Col span={12} style={{ fontWeight: "bold" }}>
            <span>ราคาต่อหน่วย</span>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={style}>
          <Col className="gutter-row" span={6}>
            <label>Product ID NAV</label>
            <Input placeholder="" value={productId.productNoNAV} disabled />
          </Col>
          <Col className="gutter-row" span={6}></Col>
          <Col className="gutter-row" span={6}>
            <label>ปริมาณสินค้า (หน่วย)</label>
            <Input placeholder="" value={productId.packSize} disabled />
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={style}>
          <Col className="gutter-row" span={6}>
            <label>ชื่อสินค้า</label>
            <Input placeholder="" value={productId.productName} disabled />
          </Col>
          <Col className="gutter-row" span={6}>
            <label>ชื่อสามัญ</label>
            <Input placeholder="" value={productId.commonName} disabled />
          </Col>
          <Col className="gutter-row" span={6}>
            <label>ราคาสินค้า</label>
            <Input placeholder="" value={productId.qtySaleUnit} disabled />
          </Col>
          <Col className="gutter-row" span={6}>
            <label>หน่วยสินค้า</label>
            <Input placeholder="" value={productId.unitPrice} disabled />
          </Col>
          {/* <hr  style={{width: "1px",height:"500px"}}></hr> */}
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={style}>
          <Col className="gutter-row" span={6}>
            <label>กลุ่มสินค้า</label>
            <Input placeholder="" value={productId.productGroup} disabled />
          </Col>
          <Col className="gutter-row" span={6}>
            <label>Strategy Group</label>
            <Input placeholder="" value={productId.productStrategy} disabled />
          </Col>
          <Col className="gutter-row" span={6}>
            <span style={{ fontWeight: "bold" }}>ราคาตลาด</span>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={style}>
          <Col className="gutter-row" span={6}>
            <label>ประเภทสินค้า</label>
            <Input placeholder="" value={productId.productStrategy} disabled />
          </Col>
          <Col className="gutter-row" span={6}></Col>
          <Col className="gutter-row" span={6}>
            <label>ราคากลาง</label>
            <Input placeholder="" value={productId.marketPrice} disabled />
          </Col>
          <Col className="gutter-row" span={6}>
            <label>หน่วยสินค้า</label>
            <Input placeholder="" value={productId.saleUOM} disabled />
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={style}>
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
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={style}>
          <Col span={20}>
            <Button
              className="btn mr-2"
              onClick={() => (window.location.href = "/DistributionPage")}
            >
              ยกเลิก
            </Button>
          </Col>
          <Col>
            <Button type="primary" className="btn mr-2 " onClick={showModal}>
              บันทึก
            </Button>
            <Modal
              title="ยืนยันการบันทึก"
              visible={isModalVisible}
              onOk={() => (UpdateProductList(productId))}
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
