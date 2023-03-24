import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Checkbox, Col, Divider, Form, Modal, Row, Table } from "antd";
import { TransferDirection } from "antd/lib/transfer";
import _, { some } from "lodash";
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
import TableContainer from "../../../components/Table/TableContainer";
import Text from "../../../components/Text/Text";
import Transfer from "../../../components/Transfer/Transfer";
import { getCustomers, getZones } from "../../../datasource/CustomerDatasource";
import { getProductGroup, getProductList } from "../../../datasource/ProductDatasource";
import { LOCATION_FULLNAME_MAPPING } from "../../../definitions/location";
import { ProductEntity } from "../../../entities/PoductEntity";
import { ProductGroupEntity } from "../../../entities/ProductGroupEntity";
import { StoreEntity, ZoneEntity } from "../../../entities/StoreEntity";
import color from "../../../resource/color";
import image from "../../../resource/image";
import { numberFormatter } from "../../../utility/Formatter";

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

const ModalSelectedShop = ({
  zoneList,
  shopData,
  callBackShop,
  showModalShop,
  onClose,
}: {
  zoneList: ZoneEntity[];
  shopData: StoreEntity[];
  callBackShop: (item: StoreEntity[]) => void;
  showModalShop: boolean;
  onClose: () => void;
}) => {
  const [searchZone1, setSearchZone1] = useState("");
  const [keyword1, setKeyword1] = useState("");
  const [searchZone2, setSearchZone2] = useState("");
  const [keyword2, setKeyword2] = useState("");

  const [shopList, setShopList] = useState<StoreEntity[]>(shopData);

  const [targetKeys, setTargetKeys] = useState<StoreEntity[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onTransfer = (
    nextTargetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[],
  ) => {
    if (direction == "right") {
      const arrayObjectKey: any = nextTargetKeys.map((el) => {
        const matchKey = shopList.find((el2) => el2.customerCompanyId === el);
        if (matchKey) {
          return matchKey;
        }
      });
      setShopList((prev) => {
        return prev.filter((el) => {
          return !nextTargetKeys.some((el2) => el2 === el.customerCompanyId);
        });
      });
      setTargetKeys((prev) => [...prev, ...arrayObjectKey]);
    } else {
      const arrayObjectKey: any = moveKeys.map((el) => {
        const matchKey = shopData.find((el2) => el2.customerCompanyId === el);
        if (matchKey) {
          return matchKey;
        }
      });
      setTargetKeys((prev) => {
        return prev.filter((el) => {
          return !moveKeys.some((el2) => el2 === el.customerCompanyId);
        });
      });
      setShopList((prev) => {
        return [...prev, ...arrayObjectKey];
      });
    }
  };
  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    //console.log(sourceSelectedKeys, targetSelectedKeys);
    // if (sourceSelectedKeys.length === 0) {
    //   return setSelectedKeys(shopList.map((el) => el.customerCompanyId));
    // }
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const handleChangeZone1 = (value: any) => {
    setSearchZone1(value);
  };
  const handleChangeKeyword1 = (value: any) => {
    setKeyword1(value.target.value);
  };
  const handleChangeZone2 = (value: any) => {
    setSearchZone2(value);
  };
  const handleChangeKeyword2 = (value: any) => {
    setKeyword2(value.target.value);
  };

  useEffect(() => {
    if (searchZone1 && !keyword1) {
      const result = shopList.filter((x) => x.zone == searchZone1);
      setShopList(result);
    } else if (!searchZone1 && keyword1) {
      const result = shopList.filter((x) => x.customerName.includes(keyword1));
      setShopList(result);
    } else if (searchZone1 && keyword1) {
      const result = shopList.filter(
        (x) => x.customerName.includes(keyword1) && x.zone == searchZone1,
      );
      setShopList(result);
    } else {
      setShopList(
        shopData.filter(
          (x) => !targetKeys.some((y) => y.customerCompanyId === x.customerCompanyId),
        ),
      );
    }
  }, [searchZone1, keyword1]);

  useEffect(() => {
    if (searchZone2 && !keyword2) {
      const result = targetKeys.filter((x) => x.zone == searchZone2);
      setTargetKeys(result);
    } else if (!searchZone2 && keyword2) {
      const result = targetKeys.filter((x) => x.customerName.includes(keyword2));
      setTargetKeys(result);
    } else if (searchZone2 && keyword2) {
      const result = targetKeys.filter(
        (x) => x.customerName.includes(keyword2) && x.zone == searchZone2,
      );
      setTargetKeys(result);
    } else {
      setTargetKeys(
        shopData.filter((x) => !shopList.some((y) => y.customerCompanyId === x.customerCompanyId)),
      );
    }
  }, [searchZone2, keyword2]);

  const saveShop = () => {
    callBackShop(targetKeys);
  };
  return (
    <Modal
      open={showModalShop}
      centered={true}
      onCancel={() => onClose()}
      width={1000}
      title='เลือกร้านค้า'
      footer={false}
    >
      <Form layout='vertical'>
        <Row gutter={52}>
          <Col span={12}>
            <Row gutter={8}>
              <Col span={8}>
                <label>ค้นหาเขต</label>
                <Select
                  style={{ width: "100%" }}
                  data={[
                    { label: "ทั้งหมด", key: "" },
                    ...zoneList.map((z) => ({ label: z.zoneName, key: z.zoneName })),
                  ]}
                  onChange={handleChangeZone1}
                />
              </Col>
              <Col span={10}>
                <label>ค้นหาชื่อร้านค้า</label>
                <Input
                  suffix={<SearchOutlined />}
                  placeholder={"ระบุชื่อร้านค้า"}
                  onChange={handleChangeKeyword1}
                />
              </Col>
              <Col span={6}>
                <label></label>
                <Button title='ล้างการค้นหา' typeButton='primary-light' />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={8}>
              <Col span={8}>
                <label>ค้นหาเขต</label>
                <Select
                  style={{ width: "100%" }}
                  data={[
                    { label: "ทั้งหมด", key: "" },
                    ...zoneList.map((z) => ({ label: z.zoneName, key: z.zoneName })),
                  ]}
                  onChange={handleChangeZone2}
                />
              </Col>
              <Col span={10}>
                <label>ค้นหาชื่อร้านค้า</label>
                <Input
                  suffix={<SearchOutlined />}
                  placeholder={"ระบุชื่อร้านค้า"}
                  onChange={handleChangeKeyword2}
                />
              </Col>
              <Col span={6}>
                <label></label>
                <Button title='ล้างการค้นหา' typeButton='primary-light' />
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      <br />
      <Transfer
        titles={["ร้านค้าทั้งหมด", "ร้านค้าที่เลือกทั้งหมด"]}
        onChange={onTransfer}
        selectedKeys={selectedKeys}
        targetKeys={targetKeys.map((x) => x.customerCompanyId)}
        onSelectChange={onSelectChange}
      >
        {({ direction, onItemSelect, selectedKeys }) =>
          direction === "left" ? (
            <div style={{ overflow: "auto", height: 300 }}>
              {shopList.map((item) => {
                const isCheck = selectedKeys.includes(item.customerCompanyId);
                return (
                  <Row key={item.customerCompanyId}>
                    <FlexCol style={{ padding: "4px 8px" }}>
                      <Checkbox
                        checked={isCheck}
                        onClick={() => onItemSelect(item.customerCompanyId, !isCheck)}
                      />
                    </FlexCol>
                    <FlexCol style={{ padding: "4px 8px" }}>
                      <Text level={5}>{item.customerName}</Text>
                      <Text level={6} color='Text3'>
                        {item.zone}
                      </Text>
                    </FlexCol>
                  </Row>
                );
              })}
            </div>
          ) : (
            <div style={{ overflow: "auto", height: 300 }}>
              {targetKeys.map((item) => {
                const isCheck = selectedKeys.includes(item.customerCompanyId);
                return (
                  <Row key={item.customerCompanyId}>
                    <FlexCol style={{ padding: "4px 8px" }}>
                      <Checkbox
                        checked={isCheck}
                        onClick={() => onItemSelect(item.customerCompanyId, !isCheck)}
                      />
                    </FlexCol>
                    <FlexCol style={{ padding: "4px 8px" }}>
                      <Text level={5}>{item.customerName}</Text>
                      <Text level={6} color='Text3'>
                        {item.zone}
                      </Text>
                    </FlexCol>
                  </Row>
                );
              })}
            </div>
          )
        }
      </Transfer>
      <Divider />
      <Row justify='end'>
        <Button title='บันทึก' style={{ width: 136 }} onClick={saveShop} />
      </Row>
    </Modal>
  );
};

const ModalSelectedProduct = ({
  masterDataProd,
  company,
  showModalProd,
  onClose,
  productGroup,
  callBackProduct,
  prodSelected,
}: {
  masterDataProd: ProductEntity[];
  company: string;
  showModalProd: boolean;
  onClose: () => void;
  productGroup: ProductGroupEntity[];
  callBackProduct: (item: ProductEntity[]) => void;
  prodSelected: ProductEntity[];
}) => {
  const [selectedProd, setSelectedProd] = useState<ProductEntity[]>(prodSelected);
  const [prodGroup, setProdGroup] = useState("");
  const [keyword, setKeyword] = useState("");
  const [checkSave, setCheckSave] = useState(false);

  useEffect(() => {
    let result: ProductEntity[] = [];
    if (keyword && !prodGroup) {
      result = masterDataProd.filter((p: any) => p.productName.includes(keyword));
    } else if (!keyword && prodGroup) {
      result = masterDataProd.filter((p: any) => p.productGroup.includes(prodGroup));
    } else if (keyword && prodGroup) {
      result = masterDataProd.filter(
        (p: any) => p.productGroup.includes(prodGroup) && p.productName.includes(keyword),
      );
    } else {
      result = masterDataProd.map((p) =>
        _.set(
          p,
          "isChecked",
          selectedProd.some((sp) => (sp.productId === p.productId ? sp.isChecked : p.isChecked)),
        ),
      );
      checkSave && (callBackProduct(result.filter((x) => x.isChecked)), onClose());
    }
    setSelectedProd(result);
  }, [keyword, prodGroup, checkSave]);

  const handleChecked = (e: any, prodId: string) => {
    const d: ProductEntity[] = selectedProd.map((item) =>
      _.set(item, "isChecked", item.productId === prodId ? e.target.checked : item.isChecked),
    );
    setSelectedProd(d);
  };
  const handleAllChecked = (e: any) => {
    const d = masterDataProd.map((p: any) => ({ ...p, isChecked: e.target.checked }));
    setSelectedProd(d);
  };

  const handleSearchKeyword = (e: any) => {
    setKeyword(e.target.value);
  };
  const handleSearchProdGroup = (e: any) => {
    setProdGroup(e);
  };
  const handleClearSearch = () => {
    setKeyword("");
    setProdGroup("");
  };

  const saveProd = () => {
    setKeyword("");
    setProdGroup("");
    setCheckSave(true);
  };

  const dataTableProd = [
    {
      title: (
        <Checkbox
          checked={selectedProd.every((x) => x.isChecked)}
          onClick={(e) => handleAllChecked(e)}
        />
      ),
      width: "5%",
      render: (text: string, value: any) => (
        <Checkbox checked={value.isChecked} onClick={(e) => handleChecked(e, value.productId)} />
      ),
    },
    {
      title: <center>ชื่อสินค้า</center>,
      dataIndex: "productName",
      width: "40%",
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
  ];
  return (
    <Modal
      open={showModalProd}
      centered={true}
      onCancel={() => onClose()}
      width={1000}
      title='เลือกสินค้าที่ต้องการ'
      footer={false}
      zIndex={300}
    >
      <Row gutter={16}>
        <Col span={5}>
          <Input
            placeholder='ค้นหาสินค้า...'
            suffix={<SearchOutlined />}
            style={{ width: "100%" }}
            onChange={(e) => handleSearchKeyword(e)}
            value={keyword}
          />
        </Col>
        {company === "ICPL" && (
          <Col span={6}>
            <Select
              data={[
                {
                  key: "",
                  value: "",
                  label: "Product Group : ทั้งหมด",
                },
                ...productGroup.map((p: any) => ({
                  key: p.product_group,
                  value: p.product_group,
                  label: p.product_group,
                })),
              ]}
              onChange={(e) => handleSearchProdGroup(e)}
              placeholder='Product Group : ทั้งหมด'
              style={{ width: "100%" }}
              value={prodGroup}
            />
          </Col>
        )}
        <Col span={4}>
          <Button title='ล้างการค้นหา' typeButton='primary-light' onClick={handleClearSearch} />
        </Col>
      </Row>
      <br />
      <TableContainer>
        <Table
          columns={dataTableProd}
          dataSource={selectedProd}
          pagination={false}
          scroll={{ y: 360 }}
        />
      </TableContainer>
      <Divider style={{ margin: "12px 0px" }} />
      <Row justify='end'>
        <Button title='บันทึก' style={{ width: 136 }} onClick={saveProd} />
      </Row>
    </Modal>
  );
};
