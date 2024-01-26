import {
  Col,
  Row,
  Form,
  Upload,
  UploadFile,
  Radio,
  Divider,
  Button,
  Select as AntSelect,
  Cascader,
  Checkbox,
  Tooltip,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import { CardContainer } from "../../../components/Card/CardContainer";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Text from "../../../components/Text/Text";
import { CameraOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { color } from "../../../resource";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import TextArea from "antd/lib/input/TextArea";
import {
  createPriceListCorporate,
  getProductBrand,
  getProductCategory,
  getProductDetail,
  getProductGroup,
  updatePriceListCorporate,
} from "../../../datasource/ProductDatasource";
import { getFactory } from "../../../datasource/FactoryDatasource";
import { getUnitMea } from "../../../datasource/UnitMeaDatasource";
import { validateOnlyNumWDecimal } from "../../../utility/validator";

const { Option } = AntSelect;

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
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const company = JSON.parse(localStorage.getItem("company")!);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEdit = pathSplit[3] !== "create";
  const id = parseInt(pathSplit[3]);

  const [file, setFile] = useState<any>();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>();
  const [isRemoved, setRemoved] = useState(false);
  const [factory, setFactory] = useState<any>();
  const [categoty, setCategoty] = useState<any>();
  const [proBrand, setProBrand] = useState<any>();
  const [proGroup, setProGroup] = useState<any>();
  const [unitMea, setUnitMea] = useState<any>();
  const [isVat, setIsVat] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  const getProductById = async () => {
    const res = await getProductDetail(id);
    const url = res.productImage;
    if (url) {
      setFile({
        uid: "-1",
        name: "image.png",
        status: "done",
        url,
      });
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url,
        },
      ]);
    }
    setIsVat(res.vat === "0" ? false : true);
    form.setFieldsValue({
      productId: res.productId,
      productCodeNAV: res.productCodeNAV,
      productLocation: res.productLocation,
      productName: res.productName,
      commonName: res.commonName,
      productBrandId: res.productBrand.productBrandId,
      productCategoryId: res.productCategory.productCategoryId,
      productGroup: res.productGroup,
      qtySaleUnit: res.qtySaleUnit,
      packingQtyUnit: res.packingQtyUnit,
      volume: res.volume,
      baseUOM: [res.baseUOM],
      unitPrice: res.unitPrice,
      marketPrice: res.marketPrice,
      saleUOMTH: res.saleUOMTH,
      packingUOM: [res.packingUOM],
      description: res.description,
      productStatus: res.productStatus,
      vat: res.vat,
      productImage: res.productImage,
      unPriceWvat: res.unitPrice * Number(res.vat),
      mkPriceWvat: res.marketPrice * Number(res.vat),
    });
  };
  const getMasterData = async () => {
    await getFactory({ company: company?.companyCode }).then((res) => {
      setFactory(res);
    });
    await getProductCategory(company?.companyCode).then((res) => {
      setCategoty(res);
    });
    await getProductBrand(company?.companyCode).then((res) => {
      setProBrand(res);
    });
    await getProductGroup(company?.companyCode).then((res) => {
      setProGroup(res.responseData);
    });
    await getUnitMea(company?.companyCode).then((res) => {
      setUnitMea(res);
    });
  };

  useEffect(() => {
    if (isEdit) {
      getProductById();
    } else {
      form.setFieldsValue({
        productStatus: "ACTIVE",
        vat: 7,
      });
    }
    getMasterData();
  }, []);

  const calVolume = (enable?: boolean) => {
    const payload = form.getFieldsValue(true);
    if (!enable) {
      const qtySaleUnit = Number(payload.qtySaleUnit) || "";
      const packingQtyUnit = Number(payload.packingQtyUnit) || "";
      const calVolume = Number(packingQtyUnit) * Number(qtySaleUnit);
      const unitPrice = Number(payload.unitPrice) || "";
      const marketPrice =
        Number(unitPrice) * Number(calVolume) === 0 ? "" : Number(unitPrice) * Number(calVolume);
      form.setFieldValue("qtySaleUnit", qtySaleUnit);
      form.setFieldValue("packingQtyUnit", packingQtyUnit);
      form.setFieldValue("marketPrice", marketPrice);
      form.setFieldValue("packSize", `${payload.qtySaleUnit}*${payload.packingQtyUnit} L`);
      form.setFieldValue("volume", calVolume);

      if (payload.vat) {
        form.setFieldValue("unPriceWvat", Number(unitPrice) * Number(payload.vat) || "");
        form.setFieldValue("mkPriceWvat", Number(marketPrice) * Number(payload.vat) || "");
      } else {
        form.setFieldValue("vat", null);
        form.setFieldValue("unPriceWvat", "");
        form.setFieldValue("mkPriceWvat", "");
      }
    } else {
      form.setFieldValue("mkPriceWvat", Number(payload.marketPrice) * Number(payload.vat));
    }
  };
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
            <Form.Item
              name='productCodeNAV'
              label='รหัสสินค้า'
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกรหัสสินค้า",
                },
              ]}
            >
              <Input placeholder='ระบุรหัสสินค้า' autoComplete='off' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='productLocation' label='โรงงาน'>
              <Select
                data={factory?.map((z) => ({
                  label: z.factoryName,
                  key: z.factoryId,
                  value: z.factoryName,
                }))}
                placeholder='ระบุโรงงาน'
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"space-between"} gutter={8}>
          <Col span={12}>
            <Form.Item
              name='productName'
              label='ชื่อทางการค้า (Trade name)'
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกชื่อทางการค้า",
                },
              ]}
            >
              <Input placeholder='ระบุชื่อทางการค้า' autoComplete='off' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='commonName'
              label='ชื่อสามัญ (Common Name)'
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกชื่อสามัญ",
                },
              ]}
            >
              <Input placeholder='ระบุชื่อสามัญ' autoComplete='off' />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"space-between"} gutter={8}>
          <Col span={12}>
            <Form.Item
              name='productBrandId'
              label='แบรนด์สินค้า (Product Brand)'
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกแบรนด์สินค้า",
                },
              ]}
            >
              <Select
                data={
                  proBrand?.map((z: any) => ({
                    label: z.productBrandName,
                    key: z.productBrandId,
                    value: z.productBrandId,
                  })) || []
                }
                placeholder='ระบุเลือกแบรนด์สินค้า'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='productGroup'
              label='กลุ่มสินค้า (Product Group)'
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกกลุ่มสินค้า",
                },
              ]}
            >
              <Select
                data={
                  proGroup?.map((z: any) => ({
                    label: z.product_group,
                    key: z.product_group,
                    value: z.product_group,
                  })) || []
                }
                placeholder='ระบุเลือกกลุ่มสินค้า'
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"space-between"} gutter={8}>
          <Col span={12}>
            <Form.Item
              name='productCategoryId'
              label='หมวดสินค้า (Product Category)'
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกหมวดสินค้า",
                },
              ]}
            >
              <Select
                data={
                  categoty?.map((z: any) => ({
                    label: z.productCategoryName,
                    key: z.productCategoryId,
                    value: z.productCategoryId,
                  })) || []
                }
                placeholder='ระบุเลือกหมวดสินค้า'
              />
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
          ขนาดและจำนวนสินค้า
        </Text>
        <br />
        <Row justify={"space-between"} gutter={8}>
          <Col span={12}>
            <Form.Item
              name='qtySaleUnit'
              label='ปริมาณสินค้า/หน่วย'
              rules={[
                {
                  required: true,
                  message: "กรุณาระบุปริมาณสินค้าต่อหน่วย ",
                },
              ]}
            >
              <Input
                size='large'
                placeholder='ระบุปริมาณสินค้าต่อหน่วย'
                onChange={() => calVolume(false)}
                addonAfter={
                  <Form.Item
                    noStyle
                    name='packingUOM'
                    rules={[
                      {
                        required: true,
                        message: "เลือกหน่วยนับปริมาณ",
                      },
                    ]}
                  >
                    <Cascader
                      placeholder='เลือกหน่วยนับปริมาณ'
                      size='large'
                      style={{
                        width: "200px",
                      }}
                      options={
                        unitMea?.map((z: any) => ({
                          label: z.unitMeasureName,
                          key: z.unitMeasureId,
                          value: z.unitMeasureName,
                        })) || []
                      }
                    />
                  </Form.Item>
                }
                autoComplete='off'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='packingQtyUnit'
              label='จำนวนสินค้าที่บรรจุ/แพ็ค'
              rules={[
                {
                  required: true,
                  message: "กรุณาระบุจำนวนสินค้าที่บรรจุต่อแพ็ค",
                },
              ]}
            >
              <Input
                size='large'
                placeholder='ระบุจำนวนสินค้าที่บรรจุแพ็ค'
                onChange={() => calVolume(false)}
                addonAfter={
                  <Form.Item
                    noStyle
                    name='baseUOM'
                    rules={[
                      {
                        required: true,
                        message: "หน่วยนับแพ็คสินค้า",
                      },
                    ]}
                  >
                    <Cascader
                      placeholder='เลือกหน่วยนับแพ็ค'
                      size='large'
                      style={{ width: "200px" }}
                      options={
                        unitMea?.map((z: any) => ({
                          label: z.unitMeasureName,
                          key: z.unitMeasureId,
                          value: z.unitMeasureName,
                        })) || []
                      }
                    />
                  </Form.Item>
                }
                autoComplete='off'
              />
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
          ราคาสินค้า
        </Text>
        <br />
        <Row justify={"space-between"} gutter={8}>
          <Col span={12} className='pt-2'>
            <Form.Item
              name='unitPrice'
              label='ราคาสินค้า/หน่วย'
              rules={[
                {
                  required: true,
                  message: "กรุณาระบุราคาขาย",
                },
              ]}
            >
              <Input
                onChange={() => calVolume(false)}
                suffix='บาท'
                placeholder='ระบุราคาขาย'
                autoComplete='off'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='marketPrice'
              label='ราคาสินค้า/แพ็ค'
              rules={[
                {
                  required: true,
                  message: "กรุณาระบุราคาขาย และหน่วยนับแพ็คสินค้า",
                },
              ]}
            >
              <Input
                size='large'
                suffix='บาท'
                placeholder='ระบุราคาขาย'
                onChange={() => calVolume(true)}
                addonAfter={
                  <Form.Item noStyle name='saleUOMTH'>
                    <Cascader
                      placeholder='เลือกหน่วยนับแพ็ค'
                      size='large'
                      style={{ width: "200px" }}
                      options={
                        unitMea?.map((z: any) => ({
                          label: z.unitMeasureName,
                          key: z.unitMeasureId,
                          value: z.unitMeasureName,
                        })) || []
                      }
                    />
                  </Form.Item>
                }
                autoComplete='off'
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"space-between"} gutter={8}>
          <Col span={3}>
            <Form.Item
              label={
                <>
                  ภาษีมูลค่าเพิ่ม (VAT)
                  <Tooltip
                    placement='top'
                    title='กรุณาระบุภาษีมูลค่าเพิ่มของสินค้าให้ถูกต้อง เพราะมีผลกระทบต่อการคำนวณ และแสดงผลราคายอดรวมในคำสั่งซื้อ'
                    className='ps-2'
                  >
                    <ExclamationCircleOutlined style={{ color: color.error }} />
                  </Tooltip>
                </>
              }
            >
              <Checkbox
                style={{ paddingTop: "10px" }}
                checked={isVat}
                onChange={(e) => {
                  setIsVat(e.target.checked);
                  if (e.target.checked) {
                    form.setFieldValue("vat", 7);
                    calVolume();
                  } else {
                    form.setFieldsValue({
                      vat: 0,
                      unPriceWvat: "",
                      mkPriceWvat: "",
                    });
                  }
                }}
              >
                <Text>มีภาษีมูลค่าเพิ่ม</Text>
              </Checkbox>
            </Form.Item>
          </Col>
          <Col span={5} className='pt-4'>
            <Form.Item name='vat' label=''>
              <Input suffix='%' defaultValue={7} autoComplete='off' disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='unPriceWvat' label='ราคาสินค้า/หน่วย + VAT'>
              <Input suffix='บาท' style={{ color: color.BK }} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='mkPriceWvat' label='ราคาสินค้า/แพ็ค + VAT'>
              <Input suffix='บาท' style={{ color: color.BK }} disabled />
            </Form.Item>
          </Col>
        </Row>
      </PriceContainer>
    );
  };
  const createProduct = async () => {
    const payload = form.getFieldsValue(true);
    form
      .validateFields()
      .then(async (f) => {
        const data = new FormData();
        data.append("productCodeNAV", payload.productCodeNAV);
        data.append("productName", payload.productName);
        data.append("company", company.companyCode);
        data.append("productLocation", payload.productLocation);
        data.append("productBrandId", payload.productBrandId);
        data.append("productCategoryId", payload.productCategoryId);
        data.append("commonName", payload.commonName);
        data.append("packSize", `${payload.qtySaleUnit}*${payload.packingQtyUnit} L`);
        data.append("qtySaleUnit", payload.qtySaleUnit);
        data.append("packingQtyUnit", payload.packingQtyUnit);
        data.append("volume", payload.volume);
        data.append("baseUOM", payload?.baseUOM[0]);
        data.append("packingUOM", payload?.packingUOM[0]);
        data.append("saleUOMTH", payload.saleUOMTH);
        data.append("productGroup", payload.productGroup);
        data.append("marketPrice", payload.marketPrice);
        data.append("unitPrice", payload.unitPrice);
        data.append("productStatus", payload.productStatus);
        data.append("description", payload.description);
        data.append("vat", payload.vat);
        data.append("updateBy", `${userProfile.firstname} ${userProfile.lastname}`);
        if (!isRemoved && payload.productImage) {
          data.append("productImage", payload.productImage);
        }
        if (file && file.uid !== "-1") {
          data.append("file", file!);
        }
        if (payload.productId) {
          data.append("productId", payload.productId);
          await updatePriceListCorporate(data).then((res) => {
            if (res.success) {
              navigate("/PriceListPage/DistributionPage");
            }
          });
        } else {
          await createPriceListCorporate(data).then((res) => {
            if (res.success) {
              navigate(-1);
            }
          });
        }
      })
      .catch((e) => {
        console.log("e", e);
        return false;
      });
  };

  return (
    <>
      <CardContainer>
        <PageTitle />
        <br />
        <Row>
          <Text level={5} fontWeight={700}>
            รายละเอียดข้อมูลสินค้า
          </Text>
        </Row>
        <Form form={form} layout='vertical' initialValues={{ productStatus: "ACTIVE" }}>
          <ProductSetting />
          <PackSizeSetting />
          <br />
          <PriceSetting />
          <br />
          <Row>
            <Col span={24}>
              <Form.Item label='คุณสมบัติและประโยชน์' name='description'>
                <TextArea rows={4} placeholder='ระบุคุณสมบัติและประโยชน์' autoComplete='off' />
              </Form.Item>
            </Col>
          </Row>
          {isEdit && (
            <Form.Item label={"สถานะสินค้า"} name='productStatus'>
              <Radio.Group>
                <Radio value={"ACTIVE"}>ใช้งาน</Radio>
                <Radio value={"INACTIVE"}>ปิดการใช้งาน</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          <Divider />
          <Row align='middle' justify='end'>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              style={{ width: 136 }}
              loading={uploading}
              onClick={() => setShowModal(!showModal)}
            >
              บันทึก
            </Button>
          </Row>
        </Form>
      </CardContainer>
      {showModal && (
        <Modal
          centered
          open={showModal}
          closable={false}
          onOk={createProduct}
          onCancel={() => setShowModal(false)}
          destroyOnClose
          okText={"ยืนยัน"}
          cancelButtonProps={{ style: { color: color.primary, borderColor: color.primary } }}
        >
          <Text level={2}>ยืนยันการบันทึกสินค้า</Text>
          <br />
          <Text level={5} color='Text3'>
            โปรดตรวจสอบรายละเอียดสินค้าอีกครั้งก่อนกดยืนยัน
          </Text>
          <br />
          <Text level={5} color='Text3'>
            เพราะอาจส่งผลต่อการแสดงผลข้อมูลในระบบ
          </Text>
        </Modal>
      )}
    </>
  );
};
