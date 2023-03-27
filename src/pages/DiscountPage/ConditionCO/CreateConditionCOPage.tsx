import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Checkbox, Col, Divider, Form, Modal, Row, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/lib/input/TextArea";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
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
import {
  createConditionCO,
  getConditionCoById,
  updateConditionCO,
} from "../../../datasource/CreditMemoDatasource";
import { getCustomers, getZones } from "../../../datasource/CustomerDatasource";
import { getProductGroup, getProductList } from "../../../datasource/ProductDatasource";
import { LOCATION_FULLNAME_MAPPING } from "../../../definitions/location";
import {
  ConditionCOEntiry,
  CreateConditionCOEntiry,
  CreateConditionCOEntiry_INIT,
} from "../../../entities/ConditionCOEntiry";
import { CreditMemoShopEntity } from "../../../entities/CreditMemoEntity";
import { ProductEntity } from "../../../entities/PoductEntity";
import { ProductGroupEntity } from "../../../entities/ProductGroupEntity";
import { StoreEntity, ZoneEntity } from "../../../entities/StoreEntity";
import color from "../../../resource/color";
import image from "../../../resource/image";
import { numberFormatter } from "../../../utility/Formatter";
import { ModalSelectedProduct } from "../../Shared/ModalSelecteProduct";
import { ModalSelectedShop } from "../../Shared/ModalSelectShop";
import productState from "../../../store/productList";

export const CreateConditionCOPage: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEditing = pathSplit[2] === "editConditionCo";
  const id = pathSplit[3];

  const navigate = useNavigate();

  const [form1] = useForm();
  const [form3] = useForm();

  const [current, setCurrent] = useState(0);
  const [zoneList, setZoneList] = useState<ZoneEntity[]>([]);
  const [prodList, setProdList] = useState<ProductEntity[]>([]);
  const [shopList, setShopList] = useState<StoreEntity[]>([]);
  const [productGroup, setProductGroup] = useState<ProductGroupEntity[]>([]);

  const [showModalProd, setShowModalProd] = useState<boolean>(false);
  const [showModalShop, setShowModalShop] = useState<boolean>(false);

  const [selectedProd, setSelectedProd] = useState<ProductEntity[]>([]);
  const [searchProd, setSearchProd] = useState<ProductEntity[]>([]);
  const [selectedShop, setSelectedShop] = useState<StoreEntity[]>([]);

  const [createCondition, setCreateCondition] = useState<CreateConditionCOEntiry>(
    CreateConditionCOEntiry_INIT,
  );
  const [searchKeywordProd, setSearchKeywordProd] = useState("");
  const [searchProdGroup, setSearchProdGroup] = useState("");

  // only use in edit mode
  const [loadingCoData, setLoadingCoData] = useState(false);
  const [coData, setCoData] = useState<ConditionCOEntiry>();
  const recoilProductState = useRecoilValue(productState);
  const setSetRecoilProductState = useSetRecoilState(productState);

  const fetchCoData = async () => {
    setLoadingCoData(true);
    await getConditionCoById(id, company)
      .then((res) => {
        console.log("getConditionCoById", res);
        setCoData(res);
        form1.setFieldsValue({
          promotionName: res.creditMemoConditionName,
          startDate: dayjs(res.startDate),
          endDate: dayjs(res.endDate),
          startTime: dayjs(res.startDate),
          endTime: dayjs(res.endDate),
          comment: res.comment,
        });
        setSelectedShop(
          res?.creditMemoConditionShop.map((shop: any) => ({
            ...shop,
            key: shop.creditMemoConditionShopId,
          })),
        );
        // TODO
        setSelectedProd(res?.creditMemoConditionProduct || []);
        res?.creditMemoConditionProduct?.forEach((p: any) => {
          form3.setFieldValue(p.productId, p.discountAmount);
        });
      })
      .catch((err) => {
        console.log("getConditionCoById ERROR!:", err);
      })
      .finally(() => {
        setLoadingCoData(false);
      });
  };

  const fetchZone = async () => {
    const getZone = await getZones(company);
    setZoneList(getZone.map((d: StoreEntity, i: number) => ({ ...d, key: d.customerCompanyId })));
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
    fetchProductGroup();
  }, []);

  useEffect(() => {
    if (isEditing && !coData) {
      fetchCoData();
    }
  }, [isEditing]);

  const PageTitle = () => {
    return (
      <PageTitleNested
        title={isEditing ? "แก้ไขเงื่อนไข CO" : "เพิ่มเงื่อนไข CO"}
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
                text: isEditing ? "แก้ไขข้อมูลเบื้องต้น" : "เพิ่มข้อมูลเบื้องต้น",
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
        <Form form={form1} layout='vertical'>
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
                <Input placeholder='ระบุชื่อรายการเงื่อนไข CO' autoComplete='off' />
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
                    initialValue={dayjs("00:00", "HH:mm")}
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
                    initialValue={dayjs("23:59", "HH:mm")}
                  >
                    <TimePicker allowClear={false} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Form.Item name='comment' label='หมายเหตุ'>
                <TextArea rows={4} placeholder='ระบุเหตุผล (ถ้ามี)' autoComplete='off' />
              </Form.Item>
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
          {selectedShop.length > 0 ? (
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
          ) : (
            <Col span={14}></Col>
          )}

          <Col span={10}>
            <Row align='middle' justify='end' gutter={22}>
              <Col>
                {selectedShop.length > 0 && (
                  <FlexRow align='center' justify='end' style={{ height: "100%" }}>
                    <DeleteOutlined style={{ fontSize: 20, color: color.error }} />
                  </FlexRow>
                )}
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
        <Row justify={"end"}>
          <Col>
            <Text>จำนวนรายการที่เลือก {selectedShop.length} ร้าน</Text>
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
              title: <span>ชื่อร้านค้า</span>,
              dataIndex: "customerName",
              render: (text: string) => <span>{text}</span>,
            },
            {
              title: <span>เขตการขาย</span>,
              dataIndex: "zone",
              render: (text: string) => <span>{text}</span>,
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
    const onSearchProd = (e: any) => {
      setSearchKeywordProd(e.target.value);
      const find = searchProd.filter((x) => {
        const searchName = !e.target.value || x.productName?.includes(e.target.value);
        const searchGroup = !searchProdGroup || x.productGroup?.includes(searchProdGroup);
        return searchName && searchGroup;
      });
      setSelectedProd(find);
    };
    const onSearchProdGroup = (e: any) => {
      setSearchProdGroup(e);
      const find = searchProd.filter((x) => {
        const searchName = !searchKeywordProd || x.productName?.includes(searchKeywordProd);
        const searchGroup = !e || x.productGroup?.includes(e);
        return searchName && searchGroup;
      });
      setSelectedProd(find);
    };
    const onClearSearchProd = () => {
      setSearchProdGroup("");
      setSearchKeywordProd("");
      setSelectedProd(searchProd);
    };
    const handleCheckBoxDelete = (e: any, prodId: string) => {
      const checkBoxed = selectedProd.map((item) =>
        _.set(item, "isChecked", item.productId === prodId ? e.target.checked : item.isChecked),
      );
      setSelectedProd(checkBoxed);
    };
    const handleDelete = () => {
      const deleted = selectedProd.filter((x) => !x.isChecked);
      setSelectedProd(deleted);
    };

    const callBackProduct = (item: ProductEntity[]) => {
      item = item.map((p: any) => ({ ...p, isChecked: false }));
      setSelectedProd(item);
      setSearchProd(item);
    };
    const columeTable = [
      {
        title: <Checkbox />,
        width: "5%",
        render: (text: string, value: any) => (
          <Checkbox
            checked={value.isChecked}
            onClick={(e) => handleCheckBoxDelete(e, value.productId)}
          />
        ),
      },
      {
        title: <span>ชื่อสินค้า</span>,
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
        title: <span>ขนาด</span>,
        dataIndex: "packSize",
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: <span>ราคา/หน่วย</span>,
        dataIndex: "unitPrice",
        render: (text: string) => <span>{numberFormatter(text)}</span>,
      },
      {
        title: <span>ราคาขาย</span>,
        dataIndex: "marketPrice",
        render: (text: string) => <span>{numberFormatter(text)}</span>,
      },
      {
        title: <span>สถานที่</span>,
        dataIndex: "productLocation",
        render: (text: string) => <span>{LOCATION_FULLNAME_MAPPING[text]}</span>,
      },
      {
        title: <span>เงื่อนไขราคาขาย (บาท)</span>,
        width: "20%",
        render: (text: string, value: any, index: number) => (
          <Form.Item name={value.productId} noStyle={true}>
            <Input suffix={"บาท/" + value.saleUOMTH} autoComplete='off' />
          </Form.Item>
        ),
      },
    ];
    return (
      <>
        <Text level={5} fontWeight={700}>
          รายละเอียดสินค้า
        </Text>
        <br />
        <br />
        <Row gutter={16}>
          {searchProd.length > 0 ? (
            <>
              <Col span={5}>
                <Input
                  placeholder='ค้นหาสินค้า...'
                  suffix={<SearchOutlined />}
                  style={{ width: "100%" }}
                  onPressEnter={(e) => onSearchProd(e)}
                  defaultValue={searchKeywordProd}
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
                    placeholder='Product Group : ทั้งหมด'
                    style={{ width: "100%" }}
                    onChange={(e) => onSearchProdGroup(e)}
                    value={searchProdGroup}
                  />
                </Col>
              )}
              <Col span={3}>
                <Button
                  title='ล้างการค้นหา'
                  typeButton='primary-light'
                  onClick={onClearSearchProd}
                />
              </Col>
            </>
          ) : (
            <>
              <Col span={14}></Col>
            </>
          )}
          <Col span={7}>
            {searchProd.filter((x) => x.isChecked).length > 0 && (
              <FlexRow align='center' justify='end' style={{ height: "100%" }}>
                <DeleteOutlined
                  style={{ fontSize: 20, color: color.error }}
                  onClick={handleDelete}
                />
              </FlexRow>
            )}
          </Col>
          <Col span={3}>
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
        <Form form={form3}>
          <Table
            columns={columeTable}
            dataSource={selectedProd}
            size='large'
            tableLayout='fixed'
            pagination={false}
            scroll={{ y: 500 }}
          />
        </Form>
        {showModalProd && (
          <ModalSelectedProduct
            prodSelected={selectedProd}
            company={company}
            showModalProd={showModalProd}
            onClose={() => setShowModalProd(!showModalProd)}
            productGroup={productGroup}
            callBackProduct={callBackProduct}
          />
        )}
      </>
    );
  };
  const submit = () => {
    console.log("need", createCondition);
    if (isEditing) {
      console.log("submit edit");
      const create: CreateConditionCOEntiry = createCondition;
      create.creditMemoConditionId = id;
      Modal.confirm({
        title: "ยืนยันการแก้ไขเงื่อนไข CO",
        content: "โปรดยืนยันการแก้ไขข้อมูลเงื่อนไข CO",
        onOk: async () => {
          await updateConditionCO(create)
            .then(({ success, userMessage }: any) => {
              if (success) {
                Modal.success({
                  title: "แก้ไขเงื่อนไข CO สำเร็จ",
                  onOk: () => navigate(0),
                });
              } else {
                Modal.error({
                  title: "แก้ไขเงื่อนไข CO ไม่สำเร็จ",
                  content: userMessage,
                });
              }
            })
            .catch((e: any) => {
              console.log(e);
            });
        },
      });
      return;
    }
    Modal.confirm({
      title: "ยืนยันการสร้างเงื่อนไข CO",
      content: "โปรดยืนยันการสร้างข้อมูลเงื่อนไข CO",
      onOk: async () => {
        await createConditionCO(createCondition)
          .then(({ success, userMessage }: any) => {
            if (success) {
              Modal.success({
                title: "สร้างเงื่อนไข CO สำเร็จ",
                onOk: () => navigate(0),
              });
            } else {
              Modal.error({
                title: "สร้างเงื่อนไข CO ไม่สำเร็จ",
                content: userMessage,
              });
            }
          })
          .catch((e: any) => {
            console.log(e);
          });
      },
    });
  };

  const nextStep = () => {
    const create: CreateConditionCOEntiry = CreateConditionCOEntiry_INIT;
    if (current === 0) {
      console.log("test");
      form1
        .validateFields()
        .then((f1) => {
          console.log("validateFields -> then ", f1);
          create.creditMemoConditionName = f1.promotionName;
          create.comment = f1.comment;
          create.company = company;
          create.updateBy = userProfile.firstname + " " + userProfile.lastname;
          create.createBy = userProfile.firstname + " " + userProfile.lastname;
          create.startDate = `${f1.startDate.format("YYYY-MM-DD")} ${f1.startTime.format(
            "HH:mm",
          )}:00.000`;
          create.endDate = `${f1.endDate.format("YYYY-MM-DD")} ${f1.endTime.format(
            "HH:mm",
          )}:00.000`;
          setCreateCondition(create);
          setCurrent(current + 1);
        })
        .catch((errInfo) => {
          console.log("form1 errInfo", errInfo);
        });
    } else if (current === 1) {
      const create2 = selectedShop.map((x: any) => {
        const shop: any = {};
        shop.customerCompanyId = x.customerCompanyId;
        (shop.customerName = x.customerName), (shop.zone = x.zone);
        if (isEditing) {
          shop.CreditMemoConditionShopId = x.creditMemoConditionProductId;
          shop.creditMemoConditionId = id;
        }
        return shop;
      });
      create.creditMemoConditionShop = create2;
      setCreateCondition(create);
      setCurrent(current + 1);
    } else if (current === 2) {
      const f3 = form3.getFieldsValue();
      const create3 = selectedProd.map((x: any) => {
        const prod: any = {};
        prod.productId = x.productId;
        prod.discountAmount = f3[x.productId];
        if (isEditing) {
          prod.creditMemoConditionProductId = x.creditMemoConditionProductId;
          prod.creditMemoConditionId = id;
        }
        return prod;
      });
      create.creditMemoConditionProduct = create3;
      setCreateCondition(create);
      submit();
    }
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
              nextStep();
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
