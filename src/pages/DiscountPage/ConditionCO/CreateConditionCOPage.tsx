import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Checkbox, Col, Divider, Form, Modal, Row, Table } from "antd";
import { useEffect, useState } from "react";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import { FlexCol, FlexRow } from "../../../components/Container/Container";
import DatePicker, { TimePicker } from "../../../components/DatePicker/DatePicker";
import Input from "../../../components/Input/Input";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Select from "../../../components/Select/Select";
import StepAntd from "../../../components/StepAntd/StepAntd";
import Text from "../../../components/Text/Text";
import { getCustomers, getZones } from "../../../datasource/CustomerDatasource";
import { getProductGroup, getProductList } from "../../../datasource/ProductDatasource";
import { LOCATION_FULLNAME_MAPPING } from "../../../definitions/location";
import { ProductEntity } from "../../../entities/PoductEntity";
import { ProductGroupEntity } from "../../../entities/ProductGroupEntity";
import { StoreEntity, ZoneEntity } from "../../../entities/StoreEntity";
import color from "../../../resource/color";
import image from "../../../resource/image";
import { numberFormatter } from "../../../utility/Formatter";
import { ModalSelectedProduct } from "../../Shared/ModalSelecteProduct";
import { ModalSelectedShop } from "../../Shared/ModalSelectShop";

export const CreateConditionCOPage: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const [current, setCurrent] = useState(0);
  const [zoneList, setZoneList] = useState<ZoneEntity[]>([]);
  const [prodList, setProdList] = useState<ProductEntity[]>([]);
  const [shopList, setShopList] = useState<StoreEntity[]>([]);
  const [productGroup, setProductGroup] = useState<ProductGroupEntity[]>([]);

  const [showModalProd, setShowModalProd] = useState<boolean>(false);
  const [showModalShop, setShowModalShop] = useState<boolean>(false);

  const [selectedProd, setSelectedProd] = useState<ProductEntity[]>([]);
  const [selectedShop, setSelectedShop] = useState<StoreEntity[]>([]);

  const fetchZone = async () => {
    const getZone = await getZones(company);
    setZoneList(getZone.map((d: StoreEntity, i: number) => ({ ...d, key: d.customerCompanyId })));
  };
  const fetchProduct = async () => {
    const getProd = await getProductList({
      company,
      take: 1000,
    });
    const dataWithIschecked = getProd.data.map((p: any) => ({ ...p, isChecked: false }));
    setProdList(dataWithIschecked);
  };
  const fetchShop = async () => {
    const getShop = await getCustomers({
      company,
      customerType: "DL",
    });
    const dataWithKey = getShop.data.map((d: StoreEntity, i: number) => ({
      ...d,
      key: d.customerCompanyId,
    }));
    setShopList(dataWithKey);
  };
  const fetchProductGroup = async () => {
    const getProdGroup = await getProductGroup(company);
    setProductGroup(
      getProdGroup.responseData.map((d: any, index: number) => ({ ...d, key: index })),
    );
  };

  useEffect(() => {
    fetchZone();
    fetchShop();
    fetchProduct();
    fetchProductGroup();
  }, []);

  const PageTitle = () => {
    return (
      <PageTitleNested
        title='เพิ่มเงื่อนไข CO'
        showBack
        extra={
          <StepAntd
            current={current}
            items={[
              {
                title: "ข้อมูลเบื้องต้น",
              },
              {
                title: "เลือกเขตและร้านค้า",
              },
              {
                title: "เลือกสินค้า",
              },
            ]}
          />
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "เพิ่มเงื่อนไข CO", path: "/discount/conditionCo" },
              {
                text: "เพิ่มข้อมูลเบื้องต้น",
                path: window.location.pathname,
              },
            ]}
          />
        }
      />
    );
  };

  const StepOne = () => {
    return (
      <>
        <Text level={5} fontWeight={700}>
          รายละเอียดข้อมูลเบื้องต้น
        </Text>
        <br />
        <br />
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='promotionName'
                label='ชื่อรายการเงื่อนไข CO'
                rules={[
                  {
                    required: true,
                    message: "*โปรดระบุชื่อรายการเงื่อนไข CO",
                  },
                ]}
              >
                <Input placeholder='ระบุชื่อรายการเงื่อนไข CO' />
              </Form.Item>
            </Col>
          </Row>
          <Row align='middle' gutter={16}>
            <Col span={12}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='startDate'
                    label='วันที่เริ่มโปรโมชัน'
                    rules={[
                      {
                        required: true,
                        message: "*โปรดเลือกวันที่เริ่มโปรโมชัน",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name='startTime'
                    label='เวลาเริ่มโปรโมชัน'
                    rules={[
                      {
                        required: true,
                        message: "*โปรดเลือกเวลาเริ่มโปรโมชัน",
                      },
                    ]}
                  >
                    <TimePicker allowClear={false} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='endDate'
                    label='วันที่สิ้นสุดโปรโมชัน'
                    rules={[
                      {
                        required: true,
                        message: "*โปรดเลือกวันที่สิ้นสุดโปรโมชัน",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name='endTime'
                    label='เวลาสิ้นสุดโปรโมชัน'
                    rules={[
                      {
                        required: true,
                        message: "*โปรดเลือกเวลาสิ้นสุดโปรโมชัน",
                      },
                    ]}
                  >
                    <TimePicker allowClear={false} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </>
    );
  };
  const StepTwo = () => {
    const callBackShop = (item: StoreEntity[]) => {
      setSelectedShop(item);
      setShowModalShop(!showModalShop);
    };
    return (
      <>
        <Text level={5} fontWeight={700}>
          รายละเอียดร้านค้าและเขต
        </Text>
        <br />
        <br />
        <Row>
          <Col span={14}>
            <Row gutter={8}>
              <Col span={5}>
                <Select
                  style={{ width: "100%" }}
                  data={[
                    { label: "ทั้งหมด", key: "" },
                    ...zoneList.map((z) => ({ label: z.zoneName, key: z.zoneName })),
                  ]}
                />
              </Col>
              <Col span={10}>
                <Input suffix={<SearchOutlined />} placeholder={"ระบุชื่อร้านค้า"} />
              </Col>
              <Col span={4}>
                <Button title='ล้างการค้นหา' typeButton='primary-light' />
              </Col>
            </Row>
          </Col>
          <Col span={10}>
            <Row align='middle' justify='end' gutter={22}>
              <Col>
                <FlexRow align='center' justify='end' style={{ height: "100%" }}>
                  <DeleteOutlined style={{ fontSize: 20, color: color.error }} />
                </FlexRow>
              </Col>
              <Col span={8}>
                <Button
                  title='+ เพิ่มร้านค้า'
                  typeButton='primary'
                  onClick={() => setShowModalShop(!showModalShop)}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        <Table
          columns={[
            {
              title: <Checkbox />,
              width: "5%",
              render: (text: string) => <Checkbox />,
            },
            {
              title: <center>ชื่อร้านค้า</center>,
              dataIndex: "customerName",
              render: (text: string) => <center>{text}</center>,
            },
            {
              title: <center>เขตการขาย</center>,
              dataIndex: "zone",
              render: (text: string) => <center>{text}</center>,
            },
          ]}
          dataSource={selectedShop || []}
          size='large'
          tableLayout='fixed'
          pagination={false}
        />
        <ModalSelectedShop
          zoneList={zoneList}
          shopData={shopList}
          callBackShop={callBackShop}
          showModalShop={showModalShop}
          onClose={() => setShowModalShop(!setShowModalShop)}
        />
      </>
    );
  };
  const StepThree = () => {
    const columeTable = [
      {
        title: <Checkbox />,
        width: "5%",
        render: (text: string) => <Checkbox />,
      },
      {
        title: <center>ชื่อสินค้า</center>,
        dataIndex: "productName",
        width: "30%",
        render: (text: string, value: any, index: any) => (
          <FlexRow align='center'>
            <div style={{ marginRight: 16 }}>
              <Avatar
                src={
                  value.productImage === "No" ||
                  value.productImage === "" ||
                  value.productImage === null
                    ? image.product_no_image
                    : value.productImage
                }
                size={50}
                shape='square'
                onError={() => false}
              />
            </div>
            <FlexCol>
              <div style={{ height: 25 }}>
                <Text level={5}>{value.productName}</Text>
              </div>
              <div style={{ height: 25, overflow: "hidden", textOverflow: "ellipsis" }}>
                <Text level={5} style={{ color: color.Grey }}>
                  {value.commonName}
                </Text>
              </div>
              <div style={{ height: 25 }}>
                <Text level={5} style={{ color: color.Grey }}>
                  {value.productGroup}
                </Text>
              </div>
            </FlexCol>
          </FlexRow>
        ),
      },
      {
        title: <center>ขนาด</center>,
        dataIndex: "packSize",
        render: (text: string) => <center>{text}</center>,
      },
      {
        title: <center>ราคา/หน่วย</center>,
        dataIndex: "unitPrice",
        render: (text: string) => <center>{numberFormatter(text)}</center>,
      },
      {
        title: <center>ราคาขาย</center>,
        dataIndex: "marketPrice",
        render: (text: string) => <center>{numberFormatter(text)}</center>,
      },
      {
        title: <center>สถานที่</center>,
        dataIndex: "productLocation",
        render: (text: string) => <center>{LOCATION_FULLNAME_MAPPING[text]}</center>,
      },
      {
        title: <center>เงื่อนไขราคาขาย (บาท)</center>,
        width: "20%",
        render: (text: string, value: any) => <Input suffix={"บาท/" + value.saleUOMTH} />,
      },
    ];

    const callBackProduct = (item: ProductEntity[]) => {
      setSelectedProd(item);
    };
    return (
      <>
        <Text level={5} fontWeight={700}>
          รายละเอียดสินค้า
        </Text>
        <br />
        <br />
        <Row gutter={16}>
          <Col span={5}>
            <Input
              placeholder='ค้นหาสินค้า...'
              suffix={<SearchOutlined />}
              style={{ width: "100%" }}
            />
          </Col>
          {company === "ICPL" && (
            <Col span={6}>
              <Select
                data={[
                  {
                    key: "",
                    value: "",
                    label: "ทั้งหมด",
                  },
                  ...productGroup.map((p: any) => ({
                    key: p.product_group,
                    value: p.product_group,
                    label: p.product_group,
                  })),
                ]}
                placeholder='Product Group : ทั้งหมด'
                style={{ width: "100%" }}
              />
            </Col>
          )}
          <Col span={9}></Col>
          <Col span={4}>
            <Button title='+ เพิ่มสินค้า' onClick={() => setShowModalProd(!showModalProd)} />
          </Col>
        </Row>
        <br />
        <Row justify={"end"}>
          <Col>
            <Text>จำนวนสินค้าที่เลือก {selectedProd.length} ร้าน</Text>
          </Col>
        </Row>
        <br />
        <Table
          columns={columeTable}
          dataSource={selectedProd}
          size='large'
          tableLayout='fixed'
          pagination={false}
          scroll={{ y: 500 }}
        />

        <ModalSelectedProduct
          masterDataProd={prodList}
          prodSelected={selectedProd}
          company={company}
          showModalProd={showModalProd}
          onClose={() => setShowModalProd(!showModalProd)}
          productGroup={productGroup}
          callBackProduct={callBackProduct}
        />
      </>
    );
  };

  const nextStep = () => {
    current === 2 && setCurrent(current);
  };
  const renderStep = () => {
    switch (current) {
      case 0: {
        return <StepOne />;
      }
      case 1: {
        return <StepTwo />;
      }
      case 2: {
        return <StepThree />;
      }
    }
  };

  const footer = () => {
    return (
      <Row justify='space-between' gutter={12}>
        <Col xl={3} sm={6}>
          {current > 0 && (
            <Button
              typeButton='primary-light'
              title='ย้อนกลับ'
              onClick={() => setCurrent(current - 1)}
            />
          )}
        </Col>
        <Col xl={15} sm={6}></Col>
        <Col xl={3} sm={6}>
          <Button
            typeButton='primary'
            title={current === 2 ? "บันทึก" : "ถัดไป"}
            onClick={() => {
              setCurrent(current + 1), nextStep();
            }}
          />
        </Col>
      </Row>
    );
  };

  return (
    <>
      <CardContainer>
        <PageTitle />
        <Divider />
        {renderStep()}
        <br />
        {footer()}
      </CardContainer>
    </>
  );
};
