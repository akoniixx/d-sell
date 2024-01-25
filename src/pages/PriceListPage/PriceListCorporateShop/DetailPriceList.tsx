import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row, Image, Divider, Table, Checkbox, Tabs, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import { CardContainer } from "../../../components/Card/CardContainer";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import { getProductDetail } from "../../../datasource/ProductDatasource";
import color from "../../../resource/color";
import Text from "../../../components/Text/Text";
import TextArea from "antd/lib/input/TextArea";
import { image } from "../../../resource";
import Button from "../../../components/Button/Button";
import Select from "../../../components/Select/Select";
import Input from "../../../components/Input/Input";
import TableContainer from "../../../components/Table/TableContainer";
import { StoreEntity } from "../../../entities/StoreEntity";
import { ModalSelectStore } from "../../Shared/ModalSelectStore";
import { zoneDatasource } from "../../../datasource/ZoneDatasource";
import { CreateShopProductEntity } from "../../../entities/ProductShopEntity";
import { createShopProduct, getProductShop } from "../../../datasource/ProductShopDatasource";

export const DetailPriceList: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const company = JSON.parse(localStorage.getItem("company")!);
  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const id = parseInt(pathSplit[3]);
  const [data, setData] = useState<any>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [searchZone, setSearchZone] = useState("");
  const [zone, setZone] = useState<{ label: string; value: string; key: string }[]>([]);
  const [showModalShop, setShowModalShop] = useState<boolean>(false);
  const [selectedShop, setSelectedShop] = useState<StoreEntity[]>([]);
  const [searchShop, setSearchShop] = useState<StoreEntity[]>([]);
  const [selectedTab, setSelectedTab] = useState<"product" | "shop">("product");

  const getProductById = async () => {
    const res = await getProductDetail(id);
    setData(res);
  };
  const getZoneByCompany = async () => {
    const res = await zoneDatasource.getAllZoneByCompany(company.companyCode);
    const data = res.map((item: any) => {
      return {
        label: item.zoneName,
        value: item.zoneName,
        key: item.zoneId,
      };
    });
    setZone(data);
  };

  const getShopProduct = async () => {
    await getProductShop({
      company,
      isPage: false,
      productId: id,
    }).then((res) => {
      const mapProduct = res.data.map((x: any) => {
        return { ...x, isChecked: false };
      });
      setSelectedShop(mapProduct);
      setSearchShop(mapProduct);
    });
  };

  useEffect(() => {
    getProductById();
    getZoneByCompany();
    getShopProduct();
  }, []);

  const dataGroup1: any = [
    {
      label: "รหัสสินค้า :",
      value: data?.productCodeNAV,
    },
    {
      label: "โรงงาน :",
      value: data?.productLocation,
    },
    {
      label: "ชื่อทางการค้า (Trade Name) :",
      value: data?.productName,
    },
    {
      label: "ชื่อสามัญ (Common Name) :",
      value: data?.commonName,
    },
    {
      label: "ชื่อแบรนด์สินค้า (Product Brands) :",
      value: data?.productBrand?.productBrandName,
    },
    {
      label: "กลุ่มสินค้า (Product Group) :",
      value: data?.productGroup,
    },
    {
      label: "หมวดสินค้า (Product Categoty):",
      value: data?.productCategory?.productCategoryName,
    },
  ];
  const dataGroup2: any = [
    {
      label: "ปริมาณ/หน่วย :",
      value: `${data?.packingQtyUnit} ${data?.baseUOM}`,
    },
    {
      label: "จำนวนบรรจุ :",
      value: `${data?.qtySaleUnit} ${data?.packingUOM}`,
    },
  ];
  const dataGroup3: any = [
    {
      label: "ราคาสินค้า/หน่วย :",
      value: `${data?.unitPrice} บาท`,
    },
    {
      label: "ราคาสินค้า/แพ็ค :",
      value: `${data?.marketPrice} บาท`,
    },
    {
      label: "ภาษีข้อมูลเพิ่ม (VAT) :",
      value: `${data?.vat} %`,
    },
    {
      label: "ราคาสินค้า/หน่วย + VAT :",
      value: `${(Number(data?.unitPrice) + Number(data?.unitPrice * 0.07)).toFixed(2)} บาท`,
    },
    {
      label: "ราคาสินค้า/แพ็ค + VAT :",
      value: `${(Number(data?.marketPrice) + Number(data?.marketPrice * 0.07)).toFixed(2)} บาท`,
    },
  ];

  const callBackShop = (item: StoreEntity[]) => {
    item = item.map((p: any) => ({ ...p, isChecked: false }));
    setSelectedShop([...selectedShop, ...item]);
    setSearchShop([...selectedShop, ...item]);
    setShowModalShop(!showModalShop);
  };
  const handleAllCheckBox = (e: any) => {
    const d = searchShop.map((p: any) => ({ ...p, isChecked: e.target.checked }));
    const checkBoxed = selectedShop.map((x: any) => {
      const matching = d.find((i) => `${i.customerId}` === `${x.customerId}`);
      if (matching) {
        return { ...matching, isChecked: e.target.checked };
      }
      return {
        ...x,
        isChecked: x.isChecked,
      };
    });
    setSelectedShop(checkBoxed);
    const find = checkBoxed.filter((x) => {
      const searchName = !searchText || x.customerName?.includes(searchText);
      const zone = !searchZone || x.zone === searchZone;
      return searchName && zone;
    });
    setSearchShop(find);
  };
  const handleCheckBox = (e: any, cusId: number) => {
    const checkBoxed = selectedShop.map((item) => ({
      ...item,
      isChecked: `${item.customerId}` === `${cusId}` ? e.target.checked : item.isChecked,
    }));
    setSelectedShop(checkBoxed);
    const find = checkBoxed.filter((x) => {
      const searchName = !searchText || x.customerName?.includes(searchText);
      const zone = !searchZone || x.zone === searchZone;
      return searchName && zone;
    });
    setSearchShop(find);
  };
  const handleSearchText = (e: any) => {
    const valueUpperCase: string = e.toUpperCase();
    const find = selectedShop.filter((x) => {
      const searchName = !e || x.customerName?.includes(valueUpperCase);
      const zone = !searchZone || x.zone === searchZone;
      return searchName && zone;
    });
    setSearchShop(find);
  };
  const handleSearchZone = (e: any) => {
    const find = selectedShop.filter((x) => {
      const searchName = !searchText || x.customerName?.includes(searchText);
      const zone = !e || x.zone === e;
      return searchName && zone;
    });
    setSearchShop(find);
  };
  const handleDelete = () => {
    const deleted = selectedShop.filter((x) => !x.isChecked);
    setSearchShop(deleted);
    setSelectedShop(deleted);
  };

  const columns: any = [
    {
      title: isEdit && (
        <Checkbox
          onClick={(e) => handleAllCheckBox(e)}
          checked={
            selectedShop.length > 0 || searchShop.length > 0
              ? selectedShop.every((x) => x.isChecked) || searchShop.every((x) => x.isChecked)
              : false
          }
        />
      ),
      width: "5%",
      dataIndex: "index",
      render: (text: string, value: any) => {
        return (
          <Checkbox
            checked={value.isChecked}
            onClick={(e) => handleCheckBox(e, value.customerId)}
          />
        );
      },
    },
    {
      title: "Customer No.",
      dataIndex: "customerNo",
      key: "customerNo",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row>
              <Text level={5}>{value}</Text>
            </Row>
          ),
        };
      },
    },
    {
      title: "ชื่อร้านค้า",
      dataIndex: "customerName",
      key: "customerName",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row>
              <Text level={5}>{value}</Text>
            </Row>
          ),
        };
      },
    },
    {
      title: "เขต",
      dataIndex: "zone",
      key: "zone",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row>
              <Text level={5}>{value}</Text>
            </Row>
          ),
        };
      },
    },
  ];

  const tabsItems = [
    {
      label: "รายละเอียดสินค้า ",
      key: "product",
    },
    {
      label: "ร้านค้าที่มีสินค้า ",
      key: "shop",
    },
  ];

  const submit = async () => {
    const mapCus: any = selectedShop.map((x) => {
      return {
        customerCompanyId: Number(x.customerCompanyId),
        customerId: Number(x.customerId),
        customerNo: x.customerNo,
        customerName: x.customerName,
        zone: x.zone,
      };
    });
    const final: CreateShopProductEntity = {
      company: company,
      productId: id,
      createBy: userProfile.firstname + " " + userProfile.lastname,
      customer: mapCus,
    };
    await createShopProduct(final).then((res) => {
      if (res.success) {
        setIsEdit(!isEdit);
      }
    });
  };

  return (
    <>
      <CardContainer>
        <PageTitleNested
          title='รายละเอียดสินค้า'
          showBack
          onBack={() => navigate(`/PriceListPage/DistributionPage`)}
          //extraTitle={
          //   productStatus && (
          //     <Tag color={STATUS_COLOR_MAPPING[productStatus]}>{nameFormatter(productStatus)}</Tag>
          //   )
          //}
          customBreadCrumb={
            <BreadCrumb
              data={[
                { text: "รายชื่อสินค้า", path: `/PriceListPage/DistributionPage` },
                { text: "รายละเอียดสินค้า", path: window.location.pathname },
              ]}
            />
          }
        />
        <br />
        <Tabs
          items={tabsItems}
          onChange={(key: string) => {
            setSelectedTab((key as "product" | "shop") || "product");
          }}
          defaultValue={selectedTab}
        />
        {selectedTab === "product" ? (
          <Row justify={"space-between"} gutter={8}>
            <Col span={24}>
              <CardContainer>
                <Row gutter={8} justify={"space-between"}>
                  <Col>
                    <Image
                      src={data?.productImage || image.product_no_image}
                      style={{
                        width: "136px",
                        height: "136px",
                        objectFit: "contain",
                      }}
                    />
                  </Col>
                  <Col>
                    <Button
                      typeButton='primary-light'
                      onClick={() => navigate("/PriceListPage/CreatePriceList/" + data?.productId)}
                      icon={<EditOutlined />}
                      title=' แก้ไขสินค้า'
                    />
                  </Col>
                </Row>
                <br />
                {dataGroup1.map((d: any, i) => (
                  <Row align='middle' style={{ padding: "8px 0px" }} key={i}>
                    <Col xl={6} sm={8}>
                      <Text level={5} color='Text3'>
                        {d.label}
                      </Text>
                    </Col>
                    <Col xl={18} sm={16}>
                      <Text level={5} color='Text1'>
                        {d.value}
                      </Text>
                    </Col>
                  </Row>
                ))}
                <Text color='primary' fontWeight={700}>
                  ปริมาณและจำนวนสินค้า
                </Text>
                {dataGroup2.map((d: any, i) => (
                  <Row align='middle' style={{ padding: "8px 0px" }} key={i}>
                    <Col xl={6} sm={8}>
                      <Text level={5} color='Text3'>
                        {d.label}
                      </Text>
                    </Col>
                    <Col xl={18} sm={16}>
                      <Text level={5} color='Text1'>
                        {d.value}
                      </Text>
                    </Col>
                  </Row>
                ))}
                <Text color='primary' fontWeight={700}>
                  ราคา
                </Text>
                {dataGroup3.map((d: any, i) => (
                  <Row align='middle' style={{ padding: "8px 0px" }} key={i}>
                    <Col xl={6} sm={8}>
                      <Text level={5} color='Text3'>
                        {d.label}
                      </Text>
                    </Col>
                    <Col xl={18} sm={16}>
                      <Text level={5} color='Text1'>
                        {d.value}
                      </Text>
                    </Col>
                  </Row>
                ))}
                <Row>
                  <Col xl={6} sm={8}>
                    <Text level={5} color='Text3'>
                      คุณสมบัติและประโยชน์ :
                    </Text>
                  </Col>
                  <Col xl={18} sm={16}>
                    <TextArea
                      rows={4}
                      value={data?.description}
                      bordered={false}
                      style={{
                        fontFamily: "Sarabun",
                        fontSize: "16px",
                        padding: 0,
                        color: color.BK,
                      }}
                      disabled
                    />
                  </Col>
                </Row>
              </CardContainer>
            </Col>
          </Row>
        ) : (
          <>
            <Row gutter={8} justify={"space-between"}>
              <Col span={4} className='pt-2'>
                <Text level={6}>จำนวนร้านทั้งหมด :</Text>
              </Col>
              <Col span={isEdit ? 6 : 9} className='pt-2'>
                <Text level={6}>{selectedShop.length} ร้านค้า</Text>
              </Col>
              <Col span={3}>
                <Select
                  allowClear
                  placeholder='เขต : ทั้งหมด'
                  data={zone}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    setSearchZone(e);
                    handleSearchZone(e);
                  }}
                />
              </Col>
              <Col span={5}>
                <Input
                  defaultValue={searchText}
                  allowClear
                  placeholder='ค้นหาร้านค้า...'
                  suffix={<SearchOutlined style={{ color: "grey" }} />}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    handleSearchText(e.target.value);
                  }}
                />
              </Col>
              {!isEdit && (
                <Col span={3}>
                  <Button
                    typeButton='primary-light'
                    style={{ height: "38px" }}
                    onClick={() => setIsEdit(!isEdit)}
                    title='แก้ไขร้านค้า'
                    icon={<EditOutlined />}
                  />
                </Col>
              )}
              {isEdit && (
                <>
                  <Col>
                    <Button
                      typeButton='primary-light'
                      style={{ height: "38px" }}
                      onClick={() => setShowModalShop(!showModalShop)}
                      title='เพิ่มร้านค้า'
                      icon={<PlusOutlined />}
                    />
                  </Col>
                  <Col>
                    <Button
                      typeButton={
                        selectedShop?.filter((x) => x.isChecked).length ? "danger" : "disabled"
                      }
                      style={{
                        height: "39px",
                      }}
                      onClick={() => handleDelete()}
                      title={`ลบรายการ (${selectedShop.filter((x) => x.isChecked).length})`}
                      icon={<DeleteOutlined style={{ color: "white" }} />}
                    />
                  </Col>
                </>
              )}
            </Row>
            <br />
            <TableContainer>
              <Table
                scroll={{ y: 480 }}
                columns={isEdit ? columns : columns.filter((x: any) => x.dataIndex !== "index")}
                dataSource={searchShop}
                pagination={false}
              />
            </TableContainer>
          </>
        )}
        <Divider />
        {isEdit && (
          <Row justify='space-between' gutter={12}>
            <Col xl={3} sm={6}>
              <Button
                typeButton='danger'
                title='ยกเลิกการแก้ไข'
                onClick={() => {
                  Modal.confirm({
                    title: (
                      <>
                        <Text fontWeight={700} level={4}>
                          ยืนยันการยกเลิก
                        </Text>
                        <br />
                        <Text level={6}>
                          โปรดตรวจสอบรายละเอียดร้านค้าอีกครั้ง ก่อนการกดยืนยันยกเลิกการแก้ไข
                        </Text>
                      </>
                    ),
                    okText: "",
                    cancelText: "",
                    onOk: async () => {
                      setIsEdit(!isEdit);
                    },
                  });
                }}
              />
            </Col>
            <Col xl={18} sm={12}></Col>
            <Col xl={3} sm={6}>
              <Button
                typeButton='primary'
                title='บันทึก'
                onClick={() => {
                  Modal.confirm({
                    title: (
                      <>
                        <Text fontWeight={700} level={4}>
                          ต้องการยืนยันการบันทึกรายการร้านค้า
                        </Text>
                        <br />
                        <Text level={6}>
                          โปรดตรวจสอบรายละเอียดร้านค้าอีกครั้งก่อนกดยืนยัน
                          เพราะอาจส่งผลต่อการแสดงผลในระบบแอปพลิเคชัน
                        </Text>
                      </>
                    ),
                    okText: "",
                    cancelText: "",
                    onOk: async () => {
                      submit();
                    },
                  });
                }}
              />
            </Col>
          </Row>
        )}
      </CardContainer>
      {showModalShop && (
        <ModalSelectStore
          company={company.companyCode}
          callBackShop={callBackShop}
          showModalShop={showModalShop}
          onClose={() => setShowModalShop(!setShowModalShop)}
          currentSelectShop={selectedShop}
        />
      )}
    </>
  );
};
