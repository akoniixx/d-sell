import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Checkbox, Col, Divider, Form, message, Modal, Row, Table } from "antd";
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
import { getProductGroup } from "../../../datasource/ProductDatasource";
import { LOCATION_DATA, LOCATION_FULLNAME_MAPPING } from "../../../definitions/location";
import {
  ConditionCOEntiry,
  CreateConditionCOEntiry,
  CreateConditionCOEntiry_INIT,
} from "../../../entities/ConditionCOEntiry";
import { ProductEntity } from "../../../entities/PoductEntity";
import { ProductGroupEntity } from "../../../entities/ProductGroupEntity";
import { StoreEntity, ZoneEntity } from "../../../entities/StoreEntity";
import color from "../../../resource/color";
import image from "../../../resource/image";
import { numberFormatter } from "../../../utility/Formatter";
import { ModalSelectedProduct } from "../../Shared/ModalSelecteProduct";
import { ModalSelectedShop } from "../../Shared/ModalSelectShop";
import productState from "../../../store/productList";
import { ModalSelectStore } from "../../Shared/ModalSelectStore";

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
  const [shopList, setShopList] = useState<StoreEntity[]>([]);
  const [productGroup, setProductGroup] = useState<ProductGroupEntity[]>([]);

  const [showModalProd, setShowModalProd] = useState<boolean>(false);
  const [showModalShop, setShowModalShop] = useState<boolean>(false);

  const [selectedProd, setSelectedProd] = useState<ProductEntity[]>([]);
  const [searchProd, setSearchProd] = useState<ProductEntity[]>([]);
  const [selectedShop, setSelectedShop] = useState<StoreEntity[]>([]);
  const [searchShop, setSearchShop] = useState<StoreEntity[]>([]);

  const [createCondition, setCreateCondition] = useState<CreateConditionCOEntiry>(
    CreateConditionCOEntiry_INIT,
  );
  const [searchKeywordProd, setSearchKeywordProd] = useState("");
  const [searchProdGroup, setSearchProdGroup] = useState("");
  const [searchKeywordShop, setSearchKeywordShop] = useState("");
  const [searchShopZone, setSearchShopZone] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // only use in edit mode
  const [loadingCoData, setLoadingCoData] = useState(false);
  const [coData, setCoData] = useState<ConditionCOEntiry>();
  const recoilProductState = useRecoilValue(productState);
  const setSetRecoilProductState = useSetRecoilState(productState);

  const fetchCoData = async () => {
    setLoadingCoData(true);
    await getConditionCoById(id, company)
      .then((res) => {
        setCoData(res);
        form1.setFieldsValue({
          promotionName: res.creditMemoConditionName,
          startDate: dayjs(res.startDate),
          endDate: dayjs(res.endDate),
          startTime: dayjs(res.startDate),
          endTime: dayjs(res.endDate),
          comment: res.comment,
        });
        console.log("check", res?.creditMemoConditionShop);

        setSelectedShop(res?.creditMemoConditionShop);
        setSearchShop(res?.creditMemoConditionShop);

        const newProd = res?.creditMemoConditionProduct || [];
        setSelectedProd(newProd);
        setSearchProd(newProd);
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

  const onClearSearchShop = () => {
    setSearchShopZone("");
    setSearchKeywordShop("");
    setSelectedShop(searchShop);
  };
  const onClearSearchProd = () => {
    setSearchProdGroup("");
    setSearchKeywordProd("");
    setSearchLocation("");
    setSelectedProd(searchProd);
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
      item = item.map((p: any) => ({ ...p, isChecked: false }));
      setSelectedShop([...selectedShop, ...item]);
      setSearchShop([...selectedShop, ...item]);
      setShowModalShop(!showModalShop);
    };
    const onSearchShop = (e: any) => {
      setSearchKeywordShop(e.target.value);
      const valueUpperCase: string = e.target.value;
      const find = searchShop.filter((x) => {
        const searchName =
          !e.target.value ||
          x.customerName?.includes(e.target.value) ||
          x.customerNo?.includes(valueUpperCase.toUpperCase());
        const searchZone = !searchShopZone || x.zone?.includes(searchProdGroup);
        return searchName && searchZone;
      });
      setSelectedShop(find);
    };
    const onSearchZone = (e: any) => {
      setSearchShopZone(e);
      const find = searchShop.filter((x) => {
        const searchName = !searchKeywordShop || x.customerName?.includes(searchKeywordShop);
        const searchZone = !e || x.zone?.includes(e);
        return searchName && searchZone;
      });
      setSelectedShop(find);
    };
    const handleCheckBoxDelete = (e: any, cusId: string) => {
      const checkBoxed = selectedShop.map((item) =>
        _.set(
          item,
          "isChecked",
          item.customerCompanyId === cusId ? e.target.checked : item.isChecked,
        ),
      );
      setSelectedShop(checkBoxed);
      setSearchShop(checkBoxed);
    };
    const handleAllCheckBoxDelete = (e: any) => {
      const checkBoxed = selectedShop.map((item) => ({ ...item, isChecked: e.target.checked }));
      const mapData = searchShop.map((item) => {
        const findObj = checkBoxed.find((el) => el.customerCompanyId === item.customerCompanyId);
        if (findObj) {
          return { ...item, isChecked: true };
        }
        return { ...item, isChecked: false };
      });
      setSelectedShop(checkBoxed);
      setSearchShop(mapData);
    };
    const handleDelete = () => {
      const deleted = selectedShop.filter((x) => !x.isChecked);
      setSelectedShop(deleted);
      setSearchShop(deleted);
    };
    const columeTableShop = [
      {
        title: selectedShop.length > 0 && (
          <Checkbox
            onClick={(e) => handleAllCheckBoxDelete(e)}
            checked={selectedShop.every((x) => x.isChecked)}
          />
        ),
        width: "5%",
        render: (text: string, value: any) => (
          <Checkbox
            onClick={(e) => handleCheckBoxDelete(e, value.customerCompanyId)}
            checked={value.isChecked}
          />
        ),
      },
      {
        title: <span>Customer No.</span>,
        dataIndex: "customerNo",
        width: "15%",
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: <span>ชื่อร้านค้า</span>,
        dataIndex: "customerName",
        width: "65%",
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: <span>เขตการขาย</span>,
        dataIndex: "zone",
        render: (text: string) => <span>{text}</span>,
      },
    ];
    return (
      <>
        <Text level={5} fontWeight={700}>
          รายละเอียดร้านค้าและเขต
        </Text>
        <br />
        <br />
        <Row>
          {searchShop.length > 0 ? (
            <Col span={19}>
              <Row gutter={8}>
                <Col span={5}>
                  <Select
                    style={{ width: "100%" }}
                    data={[
                      { label: "ทั้งหมด", key: "" },
                      ...zoneList.map((z) => ({ label: z.zoneName, key: z.zoneName })),
                    ]}
                    onChange={(e) => onSearchZone(e)}
                    value={searchShopZone}
                  />
                </Col>
                <Col span={10}>
                  <Input
                    suffix={<SearchOutlined />}
                    placeholder={"ระบุชื่อร้านค้าหรือ Customer No."}
                    onPressEnter={(e) => onSearchShop(e)}
                    defaultValue={searchKeywordShop}
                  />
                </Col>
                <Col span={4}>
                  <Button
                    title='ล้างการค้นหา'
                    typeButton='primary-light'
                    onClick={onClearSearchShop}
                  />
                </Col>
              </Row>
            </Col>
          ) : (
            <Col span={19}></Col>
          )}
          <Col span={2} style={{ paddingRight: "6px" }}>
            {selectedShop.filter((x) => x.isChecked).length > 0 && (
              <FlexRow align='center' justify='end' style={{ height: "100%" }}>
                <DeleteOutlined
                  style={{ fontSize: 20, color: color.error }}
                  onClick={handleDelete}
                />
              </FlexRow>
            )}
          </Col>
          <Col span={3}>
            <Button title='+ เพิ่มร้านค้า' onClick={() => setShowModalShop(!showModalShop)} />
          </Col>
        </Row>
        <br />
        <Row justify={"end"}>
          <Col>
            <Text>จำนวนที่เลือก {selectedShop.length} ร้าน</Text>
          </Col>
        </Row>
        <br />
        <Table
          columns={columeTableShop}
          dataSource={selectedShop || []}
          size='large'
          tableLayout='fixed'
          pagination={false}
          scroll={{ y: 500 }}
        />
        <ModalSelectStore
          company={company}
          callBackShop={callBackShop}
          showModalShop={showModalShop}
          onClose={() => setShowModalShop(!setShowModalShop)}
          currentSelectShop={selectedShop}
        />
      </>
    );
  };
  const StepThree = () => {
    const onSearchProd = (e: any) => {
      setSearchKeywordProd(e.target.value);
      const valueUpperCase: string = e.target.value;
      const find = searchProd.filter((x) => {
        const searchName =
          !e.target.value ||
          x.productName?.includes(e.target.value) ||
          x.productCodeNAV?.includes(valueUpperCase.toLocaleUpperCase());
        const searchGroup = !searchProdGroup || x.productGroup?.includes(searchProdGroup);
        const searchLocat = !searchLocation || x.productLocation?.includes(searchLocation);
        return searchName && searchGroup && searchLocat;
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
    const handleSearchLocation = (e: any) => {
      setSearchLocation(e);
      const find = searchProd.filter((x) => {
        const searchName = !searchKeywordProd || x.productName?.includes(searchKeywordProd);
        const searchLocat = !e || x.productLocation?.includes(e);
        return searchName && searchLocat;
      });
      setSelectedProd(find);
    };
    const handleCheckBoxDelete = (e: any, prodId: string) => {
      const checkBoxed = selectedProd.map((item) =>
        _.set(item, "isChecked", item.productId === prodId ? e.target.checked : item.isChecked),
      );
      setSelectedProd(checkBoxed);
      setSearchProd(checkBoxed);
    };
    const handleAllCheckBoxDelete = (e: any) => {
      const checkBoxed = selectedProd.map((item) => ({ ...item, isChecked: e.target.checked }));
      setSelectedProd(checkBoxed);
      const mapData = searchProd.map((item) => {
        const findObj = checkBoxed.find((el) => el.productId === item.productId);
        if (findObj) {
          return { ...item, isChecked: true };
        }
        return { ...item, isChecked: false };
      });
      setSearchProd(mapData);
    };
    const handleDelete = () => {
      selectedProd.forEach((item) => {
        if (item.isChecked) {
          form3.setFieldValue(item.productId, undefined);
        }
      });
      const deleted = selectedProd.filter((x) => !x.isChecked);
      setSelectedProd(deleted);
      setSearchProd(deleted);
    };
    const callBackProduct = (item: ProductEntity[]) => {
      console.log(item);
      item = item.map((p: any) => ({ ...p, isChecked: false }));
      setSelectedProd(item);
      setSearchProd(item);
    };
    const columeTable = [
      {
        title: selectedProd.length > 0 && (
          <Checkbox
            onClick={(e) => handleAllCheckBoxDelete(e)}
            checked={selectedProd.every((x) => x.isChecked)}
          />
        ),
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
        title: <span>Product Code</span>,
        dataIndex: "productCodeNAV",
        width: "10%",
        render: (text: string) => <span>{text}</span>,
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
        width: "10%",
        render: (text: string) => <span>{LOCATION_FULLNAME_MAPPING[text]}</span>,
      },
      {
        title: <span>ลดราคาขาย (บาท)</span>,
        width: "20%",
        render: (text: string, row: any, index: number) => (
          <>
            <Form.Item
              name={row.productId}
              rules={[
                {
                  validator: (rule, value, callback) => {
                    if (parseFloat(row.marketPrice || "") < parseFloat(value)) {
                      return Promise.reject("ส่วนลดมากกว่าราคาขาย โปรดระบุใหม่");
                    }
                    if (!value || parseFloat(value) <= 0) {
                      return Promise.reject("เงื่อนไขลดราคาขายต้องมากกว่า 0");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input suffix={"บาท/" + row.saleUOMTH} autoComplete='off' />
            </Form.Item>
          </>
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
        <Row>
          {searchProd.length > 0 ? (
            <Col span={19}>
              <Row gutter={8}>
                <Col span={company === "ICPF" ? 10 : 6}>
                  <Input
                    placeholder='ค้นหาสินค้า...'
                    suffix={<SearchOutlined />}
                    style={{ width: "100%" }}
                    onPressEnter={(e) => onSearchProd(e)}
                    defaultValue={searchKeywordProd}
                  />
                </Col>
                <Col span={7}>
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
                {company === "ICPI" && (
                  <Col span={6}>
                    <Select
                      data={[
                        {
                          key: "",
                          value: "",
                          label: "Location : ทั้งหมด",
                        },
                        ...LOCATION_DATA.filter((c: any) => c.company === company).map(
                          (p: any) => ({
                            key: p.LocationName,
                            value: p.LocationName,
                            label: p.LocationNameTH,
                          }),
                        ),
                      ]}
                      placeholder='Location : ทั้งหมด'
                      style={{ width: "100%" }}
                      onChange={(e) => handleSearchLocation(e)}
                      value={searchLocation}
                    />
                  </Col>
                )}
                <Col span={4}>
                  <Button
                    title='ล้างการค้นหา'
                    typeButton='primary-light'
                    onClick={onClearSearchProd}
                  />
                </Col>
              </Row>
            </Col>
          ) : (
            <Col span={19}></Col>
          )}
          <Col span={2} style={{ paddingRight: "6px" }}>
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
            <Text>จำนวนที่เลือก {selectedProd.length} สินค้า</Text>
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
    if (isEditing) {
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
                  onOk: () => navigate(`/discount/conditionCo`),
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
                onOk: () => navigate(`/discount/conditionCo`),
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
      form1
        .validateFields()
        .then((f1) => {
          create.creditMemoConditionName = f1.promotionName;
          create.comment = f1.comment || "";
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
      if (searchShop.length <= 0) {
        message.error("ไม่สามารถไปขั้นตอนถัดไปได้ กรุณาเลือกร้าน");
        return;
      }
      onClearSearchShop();
      const create2 = searchShop.map((x: any) => {
        const shop: any = {};
        shop.customerCompanyId = x.customerCompanyId;
        shop.customerNo = x.customerNo;
        (shop.customerName = x.customerName), (shop.zone = x.zone);
        if (isEditing) {
          shop.CreditMemoConditionShopId = x.creditMemoConditionShopId;
          shop.creditMemoConditionId = id;
        }
        return shop;
      });

      create.creditMemoConditionShop = create2;
      setCreateCondition(create);
      setCurrent(current + 1);
    } else if (current === 2) {
      if (searchProd.length <= 0) {
        message.error("ไม่สามารถบันทึกได้ กรุณาเลือกสินค้า");
        return;
      }
      onClearSearchProd();
      form3
        .validateFields()
        .then(() => {
          const f3 = form3.getFieldsValue(true);
          const create3 = searchProd.map((x: any) => {
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
        })
        .catch((errInfo) => {
          console.log("form1 errInfo", errInfo);
        });
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
