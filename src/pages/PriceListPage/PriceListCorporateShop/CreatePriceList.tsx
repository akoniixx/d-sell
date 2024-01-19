import { Col, Row, Form, Upload, UploadFile, Radio, Divider, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import { CardContainer } from "../../../components/Card/CardContainer";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Text from "../../../components/Text/Text";
import { ProductCategoryEntity } from "../../../entities/ProductCategoryEntity";
import { CameraOutlined } from "@ant-design/icons";
import { color } from "../../../resource";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import TextArea from "antd/lib/input/TextArea";
import { getProductDetail } from "../../../datasource/ProductDatasource";

const ProdImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  color: grey;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PriceContainer = styled.div`
  padding: 20px;
  background: ${color["background1"]};
  border-radius: 8px;
`;

export const CreatePriceList: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEdit = pathSplit[3] !== "create";
  const id = parseInt(pathSplit[3]);

  const [categories, setCategories] = useState<Array<ProductCategoryEntity>>();
  const [file, setFile] = useState<any>();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>();
  const [isRemoved, setRemoved] = useState(false);

  const getProductById = async () => {
    const res = await getProductDetail(id);
    const url = res.productImage;
    if (url) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url,
        },
      ]);
    }
    form.setFieldsValue({
      productId: res.productId,
      productCodeNAV: res.productCodeNAV,
      productLocation: res.productLocation,
      productName: res.productName,
      commonName: res.commonName,
      productBrand: res.productBrand.productBrandName,
      productCategoryName: res.productCategory.productCategoryName,
      productGroup: res.productGroup,
      qtySaleUnit: res.qtySaleUnit,
      packingQtyUnit: res.packingQtyUnit,
      volume: res.volume,
      baseUOM: res.baseUOM,
      unitPrice: res.unitPrice,
      marketPrice: res.marketPrice,
      saleUOMTH: res.saleUOMTH,
      description: res.description,
      productStatus: res.productStatus,
    });
  };

  useEffect(() => {
    isEdit && getProductById();
  }, []);

  const PageTitle = () => {
    return (
      <PageTitleNested
        title={!isEdit ? "เพิ่มสินค้า" : "แก้ไขสินค้า"}
        showBack
        onBack={
          !isEdit
            ? () => navigate(`/PriceListPage/DistributionPage`)
            : () => navigate(`/PriceListPage/DistributionPage`)
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการสินค้า", path: `/PriceListPage/DistributionPage` },
              { text: !isEdit ? "เพิ่มสินค้า" : "แก้ไขสินค้า", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };
  const ProductSetting = () => {
    return (
      <>
        <Row style={{ padding: "16px 0px" }}>
          <Form.Item valuePropName='file' name={"productImage"}>
            <Upload
              listType='picture-card'
              maxCount={1}
              beforeUpload={() => false}
              fileList={fileList}
              //customRequest={() => {}}
              onChange={({ file, fileList: newFileList }: any) => {
                setFile(file);
                setFileList(newFileList);
                return "success";
              }}
              onRemove={() => {
                setFile(undefined);
                setFileList([]);
                setRemoved(true);
              }}
            >
              {!fileList?.length && (
                <ProdImage>
                  <CameraOutlined />
                </ProdImage>
              )}
            </Upload>
            <span style={{ color: color.error }}>
              รูปภาพประกอบสินค้า JPG, PNG. Size of 800*800px 1:1
            </span>
          </Form.Item>
        </Row>
        <Row justify={"space-between"} gutter={8}>
          <Col span={12}>
            <Form.Item name='productCodeNAV' label='รหัสสินค้า'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='productLocation' label='โรงงาน'>
              <Select data={[]} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"space-between"} gutter={8}>
          <Col span={12}>
            <Form.Item name='productName' label='ชื่อทางการค้า (Trade name)'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='commonName' label='ชื่อสามัญ (Common Name)'>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"space-between"} gutter={8}>
          <Col span={12}>
            <Form.Item name='productBrand' label='Product Brands'>
              <Select data={[]} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='productCategoryName' label='หมวดสินค้า (Product Category)'>
              <Select data={[]} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"space-between"} gutter={8}>
          <Col span={12}>
            <Form.Item name='productGroup' label='Product Group'>
              <Select data={[]} />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };
  const PackSizeSetting = () => {
    return (
      <PriceContainer>
        <Text color='primary' fontWeight={700}>
          กำหนดขนาด/ปริมาณสินค้า
        </Text>
        <br />
        <Row justify={"space-between"} gutter={8}>
          <Col span={3}>
            <Form.Item name='qtySaleUnit' label='จำนวนบรรจุ'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name='sellUnit' label='หน่วยย่อย'>
              <Select data={[]} />
            </Form.Item>
          </Col>
          <Col style={{ paddingTop: "30px" }}>
            <Text>X</Text>
          </Col>
          <Col span={3}>
            <Form.Item name='packingQtyUnit' label='ปริมาณต่อหน่วยย่อย'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item name='baseUOM' label='หน่วยปริมาณ'>
              <Select data={[]} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='volume' label='ปริมาณทั้งหมด'>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='baseUOM' label='หน่วยปริมาณ'>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
      </PriceContainer>
    );
  };
  const PriceSetting = () => {
    return (
      <PriceContainer>
        <Text color='primary' fontWeight={700}>
          กำหนดราคาขาย
        </Text>
        <br />
        <Row justify={"space-between"} gutter={8}>
          <Col span={6}>
            <Form.Item name='unitPrice' label='ราคาหน่วยย่อย'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='sellUnit' label='หน่วยย่อย'>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='marketPrice' label='ราคาหน่วยขาย'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='saleUOMTH' label='หน่วยขาย'>
              <Select data={[]} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"space-between"} gutter={8}>
          <Col span={6}>
            <Form.Item name='vat' label='ภาษีมูลค่าเพิ่ม (Vat)'>
              <Input suffix='%' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='costWithVat' label='ราคาหน่วยย่อย + Vat'>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='priceWithVat' label='ราคาหน่วยขาย + Vat'>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}></Col>
        </Row>
      </PriceContainer>
    );
  };

  return (
    <CardContainer>
      <PageTitle />
      <br />
      <Row>
        <Text level={5} fontWeight={700}>
          รายละเอียดข้อมูลสินค้า
        </Text>
      </Row>
      <Form form={form} layout='vertical'>
        <ProductSetting />
        <PackSizeSetting />
        <br />
        <PriceSetting />
        <br />
        <Row>
          <Col span={24}>
            <Form.Item label='คุณสมบัติและประโยชน์' name='description'>
              <TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label={"สถานะสินค้า"} name='productStatus'>
          <Radio.Group>
            <Radio value={"ACTIVE"}>ใช้งาน</Radio>
            <Radio value={"INACTIVE"}>ปิดการใช้งาน</Radio>
          </Radio.Group>
        </Form.Item>
        <Divider />
        <Row align='middle' justify='end'>
          <Button
            type='primary'
            htmlType='submit'
            size='large'
            style={{ width: 136 }}
            loading={uploading}
          >
            บันทึก
          </Button>
        </Row>
      </Form>
    </CardContainer>
  );
};
