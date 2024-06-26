import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Checkbox, Col, Divider, Form, Image, Row, Table, Tabs } from "antd";
import { useForm } from "antd/lib/form/Form";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import { DetailBox, FlexCol, FlexRow } from "../../../components/Container/Container";
import Input from "../../../components/Input/Input";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Select from "../../../components/Select/Select";
import TableContainer from "../../../components/Table/TableContainer";
import Text from "../../../components/Text/Text";
import { getConditionCoById } from "../../../datasource/CreditMemoDatasource";
import { getZones } from "../../../datasource/CustomerDatasource";
import { getProductGroup } from "../../../datasource/ProductDatasource";
import { LOCATION_DATA, LOCATION_FULLNAME_MAPPING } from "../../../definitions/location";
import { ConditionCOEntiry } from "../../../entities/ConditionCOEntiry";
import { ProductEntity } from "../../../entities/PoductEntity";
import { ProductGroupEntity } from "../../../entities/ProductGroupEntity";
import { StoreEntity, ZoneEntity } from "../../../entities/StoreEntity";
import color from "../../../resource/color";
import image from "../../../resource/image";
import { dateFormatter, numberFormatter } from "../../../utility/Formatter";
import { ModalSelectedProduct } from "../../Shared/ModalSelecteProduct";

export const DetailConditionCOPage: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const conditionId = pathSplit[4];

  const [form1] = useForm();
  const [form2] = useForm();

  const [selectedTab, setSelectedTab] = useState<"product" | "shop">("shop");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [data, setData] = useState<ConditionCOEntiry>();
  const [searchData, setSearchData] = useState<ConditionCOEntiry>();
  const [productGroup, setProductGroup] = useState<ProductGroupEntity[]>([]);
  const [zoneList, setZoneList] = useState<ZoneEntity[]>([]);

  const [showModalProd, setShowModalProd] = useState<boolean>(false);
  const [showModalShop, setShowModalShop] = useState<boolean>(false);

  const [selectedProd, setSelectedProd] = useState<ProductEntity[]>([]);
  const [searchProd, setSearchProd] = useState<ProductEntity[]>([]);

  const [searchKeywordProd, setSearchKeywordProd] = useState("");
  const [searchProdGroup, setSearchProdGroup] = useState("");
  const [searchKeywordShop, setSearchKeywordShop] = useState("");
  const [searchShopZone, setSearchShopGroup] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const getCondition = async () => {
    const getById = await getConditionCoById(conditionId, company);
    setData(getById);
    setSearchData(getById);
  };
  const fetchProductGroup = async () => {
    const getProdGroup = await getProductGroup(company);
    setProductGroup(
      getProdGroup.responseData.map((d: any, index: number) => ({ ...d, key: index })),
    );
  };
  const fetchZone = async () => {
    const getZone = await getZones(company);
    setZoneList(getZone.map((d: StoreEntity, i: number) => ({ ...d, key: d.customerCompanyId })));
  };

  useEffect(() => {
    getCondition();
    fetchProductGroup();
    fetchZone();
  }, []);

  const onClearData = () => {
    setSelectedProd([]);
  };

  const DetailItem = ({ label, value }: { label: string; value: string }) => {
    return (
      <Row gutter={16} style={{ margin: "4px 0px" }}>
        <Col span={6}>
          <Text>{label} :</Text>
        </Col>
        <Col span={18}>
          <Text color='Text2'>{value}</Text>
        </Col>
      </Row>
    );
  };
  const PageTitle = () => {
    return (
      <PageTitleNested
        title='รายละเอียดเงื่อนไขดูแลราคา'
        showBack
        onBack={() => navigate(`/discount/conditionCo`)}
        extra={
          !isEdit && (
            <Button
              type='primary'
              icon={<EditOutlined />}
              title='แก้ไขรายละเอียด'
              height={40}
              onClick={() => navigate(`/discount/editConditionCo/` + conditionId)}
            />
          )
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการเงื่อนไขดูแลราคา", path: "/discount/conditionCo" },
              { text: "รายละเอียดเงื่อนไขดูแลราคา", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };
  const tabsItems = [
    {
      label: `รายละเอียดเขตและร้านค้า`,
      key: "shop",
    },
    {
      label: `รายละเอียดสินค้า`,
      key: "product",
    },
  ];

  //#region section product
  const onSearchProd = (e: any) => {
    setSearchKeywordProd(e.target.value);
    const valueUpperCase: string = e.target.value;
    const find = searchData?.creditMemoConditionProduct.filter((x) => {
      const searchName =
        !e.target.value ||
        x.productName?.includes(e.target.value) ||
        x.productCodeNAV?.includes(valueUpperCase.toLocaleUpperCase());
      const searchGroup = !searchProdGroup || x.productGroup?.includes(searchProdGroup);
      const searchLocat = !searchLocation || x.productLocation?.includes(searchLocation);
      return searchName && searchGroup && searchLocat;
    });
    const map: any = { ...data };
    map.creditMemoConditionProduct = find;
    setData(map);
  };
  const onSearchProdGroup = (e: any) => {
    setSearchProdGroup(e);
    const find = searchData?.creditMemoConditionProduct.filter((x) => {
      const searchName = !searchKeywordProd || x.productName?.includes(searchKeywordProd);
      const searchGroup = !e || x.productGroup?.includes(e);
      return searchName && searchGroup;
    });
    const map: any = { ...data };
    map.creditMemoConditionProduct = find;
    setData(map);
  };
  const handleSearchLocation = (e: any) => {
    setSearchLocation(e);
    const find = searchData?.creditMemoConditionProduct.filter((x) => {
      const searchName = !searchKeywordProd || x.productName?.includes(searchKeywordProd);
      const searchLocat = !e || x.productLocation?.includes(e);
      return searchName && searchLocat;
    });
    const map: any = { ...data };
    map.creditMemoConditionProduct = find;
    setData(map);
  };
  const callBackProduct = (item: ProductEntity[]) => {
    item = item.map((p: any) => ({ ...p, isChecked: false }));
    setSelectedProd(item);
    setSearchProd(item);
  };
  const handleDelete = () => {
    const deleted = selectedProd.filter((x) => !x.isChecked);
    setSelectedProd(deleted);
    setSearchProd(deleted);
  };

  const dataTableProd = [
    {
      title: <span>ชื่อสินค้า</span>,
      dataIndex: "productName",
      width: "30%",
      render: (text: string, value: any, index: any) => (
        <FlexRow align='start'>
          <div style={{ marginRight: 16 }}>
            <Image
              src={
                value.productImage === "No" ||
                value.productImage === "" ||
                value.productImage === null
                  ? image.product_no_image
                  : value.productImage
              }
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
              }}
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
      width: "15%",
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
      render: (text: string) => <span>{LOCATION_FULLNAME_MAPPING[text]}</span>,
    },
    {
      title: <span>ลดราคาขาย</span>,
      dataIndex: "discountAmount",
      width: "10%",
      render: (text: string, value: any) =>
        isEdit ? (
          <Form.Item name={value.productId} noStyle={true}>
            <Input suffix={"บาท/" + value.saleUOMTH} autoComplete='off' />
          </Form.Item>
        ) : (
          <span>{numberFormatter(text)}</span>
        ),
    },
  ];
  //#endregion

  //#region section shop
  const onSearchZone = (e: any) => {
    setSearchShopGroup(e);
    const find = searchData?.creditMemoConditionShop.filter((x) => {
      const searchName = !searchKeywordShop || x.customerName?.includes(searchKeywordShop);
      const searchZone = !e || x.zone?.includes(e);
      return searchName && searchZone;
    });
    const map: any = { ...data };
    map.creditMemoConditionShop = find;
    setData(map);
  };
  const onSearchKeywordShop = (e: any) => {
    setSearchKeywordShop(e.target.value);
    const valueUpperCase: string = e.target.value;
    const find = searchData?.creditMemoConditionShop.filter((x) => {
      const searchName =
        !e.target.value ||
        x.customerName?.includes(e.target.value) ||
        x.customerNo?.includes(valueUpperCase.toLocaleUpperCase());
      const searchZone = !searchShopZone || x.zone?.includes(searchShopZone);
      return searchName && searchZone;
    });
    const map: any = { ...data };
    map.creditMemoConditionShop = find;
    setData(map);
  };
  //#endregion

  const dataTableShop = [
    {
      title: <span>Customer No.</span>,
      dataIndex: "customerNo",
      render: (text: string) => <span>{text}</span>,
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
  ];

  return (
    <>
      <CardContainer>
        <PageTitle />
        <br />
        <DetailBox>
          <DetailItem label='รหัสรายการ' value={data?.creditMemoConditionCode || ""} />
          <DetailItem label='ชื่อรายการ' value={data?.creditMemoConditionName || ""} />
          <DetailItem
            label='ระยะเวลา'
            value={
              dateFormatter(data?.startDate || "") + " - " + dateFormatter(data?.endDate || "")
            }
          />
          <DetailItem label='สร้างรายการโดย' value={data?.createBy || ""} />
          <DetailItem label='สร้างรายการวันที่' value={dateFormatter(data?.createdAt || "")} />
          <DetailItem label='อัปเดทล่าสุดโดย' value={data?.updateBy || "-"} />
          <DetailItem label='อัปเดทล่าสุดวันที่' value={dateFormatter(data?.updatedAt || "")} />
          <DetailItem label='หมายเหตุ' value={data?.comment || ""} />
        </DetailBox>
        <br />
        <Row gutter={16}>
          <Col span={8}>
            <Text level={2}>รายการละเอียดเงื่อนไข</Text>
          </Col>
          {selectedTab === "product" ? (
            <>
              {company !== "ICPI" && <Col span={5}></Col>}
              <Col span={6}>
                <Input
                  placeholder='ค้นหาสินค้า...'
                  suffix={<SearchOutlined />}
                  style={{ width: "100%" }}
                  allowClear
                  onPressEnter={(e) => onSearchProd(e)}
                  defaultValue={searchKeywordProd}
                />
              </Col>
              <Col span={5}>
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
                <Col span={5}>
                  <Select
                    data={[
                      {
                        key: "",
                        value: "",
                        label: "Location : ทั้งหมด",
                      },
                      ...LOCATION_DATA.filter((c) => c.company === company).map((p: any) => ({
                        key: p.LocationName,
                        value: p.LocationName,
                        label: p.LocationNameTH,
                      })),
                    ]}
                    placeholder='Location : ทั้งหมด'
                    style={{ width: "100%" }}
                    onChange={(e) => handleSearchLocation(e)}
                    value={searchLocation}
                  />
                </Col>
              )}
            </>
          ) : (
            <>
              <Col span={5}></Col>
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
              <Col span={6}>
                <Input
                  placeholder='ค้นหาร้านค้า...'
                  suffix={<SearchOutlined />}
                  style={{ width: "100%" }}
                  allowClear
                  onPressEnter={(e) => onSearchKeywordShop(e)}
                  defaultValue={searchKeywordShop}
                />
              </Col>
            </>
          )}
        </Row>
        <br />
        <Tabs
          items={tabsItems}
          onChange={(key: string) => {
            setSelectedTab(key as "product" | "shop");
          }}
          defaultValue={selectedTab}
        />
        <Row justify='end' gutter={16}>
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
          <Col span={4}>
            {isEdit && selectedTab === "product" && (
              <Button
                title='+ เพิ่มรายการสินค้า'
                onClick={() => setShowModalProd(!showModalProd)}
              />
            )}
            {isEdit && selectedTab === "shop" && <Button title='+ เพิ่มร้านค้า' />}
          </Col>
        </Row>
        <Row justify={"end"}>
          <Col>
            <Text>
              จำนวนที่เลือก{" "}
              {selectedTab === "product"
                ? data?.creditMemoConditionProduct.length + " สินค้า"
                : data?.creditMemoConditionShop.length + " ร้านค้า"}
            </Text>
          </Col>
        </Row>
        <TableContainer>
          {selectedTab === "product" ? (
            <>
              <Form form={form1}>
                <Table
                  columns={dataTableProd}
                  dataSource={data?.creditMemoConditionProduct}
                  pagination={false}
                  scroll={{ y: 360 }}
                />
              </Form>
            </>
          ) : (
            <Form form={form2}>
              <Table
                columns={dataTableShop}
                dataSource={data?.creditMemoConditionShop}
                pagination={false}
                scroll={{ y: 360 }}
              />
            </Form>
          )}
        </TableContainer>
        {isEdit && (
          <>
            <Divider />
            <Row justify='space-between' gutter={12}>
              <Col xl={3} sm={6}>
                <Button
                  typeButton='primary-light'
                  title='ยกเลิก'
                  onClick={() => {
                    setIsEdit(false), onClearData();
                  }}
                />
              </Col>
              <Col xl={15} sm={6}></Col>
              <Col xl={3} sm={6}>
                <Button typeButton='primary' title='บันทึก' />
              </Col>
            </Row>
          </>
        )}
      </CardContainer>
      {showModalProd && (
        <ModalSelectedProduct
          showModalProd={showModalProd}
          onClose={() => setShowModalProd(!showModalProd)}
          company={company}
          productGroup={productGroup}
          prodSelected={selectedProd}
          callBackProduct={callBackProduct}
        />
      )}
    </>
  );
};
