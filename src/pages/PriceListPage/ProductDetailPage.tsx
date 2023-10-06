import React, { useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Tag, Card, Button, Image, Tabs, Table, Checkbox, Divider, Modal } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { getProductDetail } from "../../datasource/ProductDatasource";
import { nameFormatter, priceFormatter } from "../../utility/Formatter";
import Text from "../../components/Text/Text";
import { BrandEntity } from "../../entities/BrandEntity";
import { LOCATION_FULLNAME_MAPPING } from "../../definitions/location";
import { STATUS_COLOR_MAPPING } from "../../definitions/product";
import { useEffectOnce } from "react-use";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import image from "../../resource/image";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import { ProductEntity } from "../../entities/PoductEntity";
import styled from "styled-components";
import { ProductCategoryEntity } from "../../entities/ProductCategoryEntity";
import { getProductFreebieDetail } from "../../datasource/PromotionDatasource";
import TextArea from "antd/lib/input/TextArea";
import Permission from "../../components/Permission/Permission";
import { zoneDatasource } from "../../datasource/ZoneDatasource";
import Select from "../../components/Select/Select";
import Input from "../../components/Input/Input";
import { ModalSelectStore } from "../Shared/ModalSelectStore";
import { StoreEntity } from "../../entities/StoreEntity";
import TableContainer from "../../components/Table/TableContainer";
import { color } from "../../resource";
import Buttons from "../../components/Button/Button";
import { getProductShop } from "../../datasource/ProductShopDatasource";
import { CreateShopProductEntity } from "../../entities/ProductShopEntity";

const Container = styled.div`
  margin: 32px 0px 10px 0px;
`;

const ProdImage = styled.img`
  width: 136px;
  height: 136px;
  border-radius: 12px;
  object-fit: contain;
`;

interface DescProps {
  label: string;
  value: ReactNode;
}

const ProdDesc = ({ label, value }: DescProps) => {
  return (
    <Row align='middle' style={{ padding: "8px 0px" }}>
      <Col xl={6} sm={8}>
        <Text level={5} color='Text3'>
          {label}
        </Text>
      </Col>
      <Col xl={18} sm={16}>
        <Text level={5} color='Text1'>
          {value || "-"}
        </Text>
      </Col>
    </Row>
  );
};

export const DistributionPageDetail: React.FC = (props: any) => {
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isFreebie = pathSplit[2] === "freebies";
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const id = parseInt(pathSplit[3]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState<ProductEntity>();
  const [selectedTab, setSelectedTab] = useState<"product" | "shop">("product");
  const [zone, setZone] = useState<{ label: string; value: string; key: string }[]>([]);
  const [showModalShop, setShowModalShop] = useState<boolean>(false);
  const [selectedShop, setSelectedShop] = useState<StoreEntity[]>([]);
  const [searchShop, setSearchShop] = useState<StoreEntity[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [searchZone, setSearchZone] = useState("");

  useEffect(() => {
    getShopProduct();
  }, [zone, searchText]);

  useEffectOnce(() => {
    fetchProduct();
    getZoneByCompany();
  });

  const fetchProduct = async () => {
    try {
      setLoading(true);
      let data;
      if (isFreebie) {
        data = await getProductFreebieDetail(id);
      } else {
        data = await getProductDetail(id);
      }
      setDataState(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const getZoneByCompany = async () => {
    const res = await zoneDatasource.getAllZoneByCompany(company);
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
      console.log(res);
      setSelectedShop(res.data);
      setSearchShop(res.data);
    });
  };

  const {
    baseUOM,
    commonName,
    //company,
    createDate,
    description,
    inventoryGroup,
    marketPrice,
    packSize,
    packingUOM,
    productBrand,
    productBrandId,
    productCategory,
    productCategoryId,
    productCodeNAV,
    productGroup,
    productId,
    productImage,
    productLocation,
    productName,
    productStatus,
    productStrategy,
    qtySaleUnit,
    saleUOM,
    saleUOMTH,
    unitPrice,
    updateBy,
    updateDate,
    productFreebiesId,
    productFreebiesCodeNAV,
    productFreebiesImage,
  } = dataState || {};

  const dataGroup1 = [
    {
      label: "Product Brands",
      value: (productBrand as BrandEntity)?.productBrandName,
      freebieHide: true,
    },
    {
      label: "โรงงาน",
      value: LOCATION_FULLNAME_MAPPING[productLocation as string],
      freebieHide: true,
    },
    {
      label: "รหัสสินค้า",
      value: isFreebie ? productFreebiesCodeNAV : productCodeNAV,
      freebieHide: true,
    },
    {
      label: "ชื่อทางการค้า (Tradename)",
      value: productName,
      freebieHide: true,
    },
    {
      label: "ชื่อสามัญ",
      value: commonName,
      freebieHide: true,
    },
    {
      label: "กลุ่มสินค้า (Product Group)",
      value: productGroup,
    },
    {
      label: "หมวดสินค้า (Product Category)",
      value: (productCategory as ProductCategoryEntity)?.productCategoryName,
      freebieHide: true,
    },
  ];
  const dataGroup2 = [
    {
      label: "ปริมาณสินค้า / หน่วย",
      value: qtySaleUnit + " " + (company === "ICPL" ? baseUOM || "Unit" : packingUOM),
    },
    {
      label: "ราคากลาง (Base price)",
      value:
        priceFormatter(parseFloat(unitPrice || "")) +
        "/" +
        (company === "ICPL" ? baseUOM || "Unit" : packingUOM),
    },
  ];
  const dataGroup3 = [
    {
      label: "ราคากลาง (Base price)",
      value: priceFormatter(parseFloat(marketPrice || "")) + "/" + (saleUOM || "Unit"),
    },
  ];

  const PageTitle = () => {
    return (
      <PageTitleNested
        title='รายละเอียดสินค้า'
        showBack
        onBack={() => navigate(`/${pathSplit[1]}/${pathSplit[2]}`)}
        extraTitle={
          productStatus && (
            <Tag color={STATUS_COLOR_MAPPING[productStatus]}>{nameFormatter(productStatus)}</Tag>
          )
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายชื่อสินค้า", path: `/${pathSplit[1]}/${pathSplit[2]}` },
              { text: "รายละเอียดสินค้า", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };
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
  const columns: any = [
    {
      title: isEdit && (
        <Checkbox
          //onClick={(e) => handleAllCheckBox(e)}
          checked={
            selectedShop.length > 0 || searchShop.length > 0
              ? selectedShop.every((x) => x.isChecked) || selectedShop.every((x) => x.isChecked)
              : false
          }
        />
      ),
      width: "5%",
      dataIndex: "index",
      render: (text: string, value: any) => (
        <Checkbox
          checked={value.isChecked}
          //onClick={(e) => handleCheckBox(e, value.productId)}
        />
      ),
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
  const callBackShop = (item: StoreEntity[]) => {
    item = item.map((p: any) => ({ ...p, isChecked: false }));
    setSelectedShop([...selectedShop, ...item]);
    setSearchShop([...selectedShop, ...item]);
    setShowModalShop(!showModalShop);
  };

  const submit = () => {
    console.log("s", selectedShop);
    const mapCus: any = selectedShop.map((x) => {
      return {
        customerCompanyId: x.customerCompanyId,
        customerId: x.customerId,
        customerNo: x.customerNo,
        customerName: x.customerName,
        zone: x.zone,
      };
    });
    console.log("map"), mapCus;
    const final: CreateShopProductEntity = {
      company: company,
      productId: id,
      createBy: userProfile.firstname + " " + userProfile.lastname,
      customer: mapCus,
    };
    console.log(final);
  };

  return loading ? (
    <div className='container '>
      <Card loading />
    </div>
  ) : (
    <>
      <div className='container '>
        <CardContainer>
          <PageTitle />
          <br />
          <Tabs
            items={tabsItems}
            onChange={(key: string) => {
              setSelectedTab((key as "product" | "shop") || "product");
            }}
            defaultValue={selectedTab}
          />
          {selectedTab === "product" ? (
            <>
              <Container>
                <Row gutter={8} justify={"space-between"}>
                  <Col>
                    <Image
                      src={
                        (isFreebie ? productFreebiesImage : productImage) || image.product_no_image
                      }
                      style={{
                        width: "136px",
                        height: "136px",
                        objectFit: "contain",
                      }}
                    />
                  </Col>
                  <Col>
                    <Permission permission={["productList", "edit"]}>
                      <Button
                        type='primary'
                        onClick={() =>
                          navigate(
                            `/${pathSplit[1]}/${pathSplit[2]}/edit/${
                              isFreebie ? productFreebiesId : productId
                            }`,
                          )
                        }
                      >
                        <EditOutlined />
                        แก้ไขรายละเอียด
                      </Button>
                    </Permission>
                  </Col>
                </Row>
              </Container>
              <Container>
                {dataGroup1
                  .filter((e) => !isFreebie || !e.freebieHide)
                  .map((p: DescProps, i) => (
                    <ProdDesc {...p} key={i} />
                  ))}
              </Container>
              {!isFreebie && (
                <>
                  <Container>
                    <Text color='primary' fontWeight={700}>
                      UNIT SIZE
                    </Text>
                    {dataGroup2.map((p: DescProps, i) => (
                      <ProdDesc {...p} key={i} />
                    ))}
                  </Container>
                  <Container>
                    <Text color='primary' fontWeight={700}>
                      PACKAGE SIZE
                    </Text>
                    {dataGroup3.map((p: DescProps, i) => (
                      <ProdDesc {...p} key={i} />
                    ))}
                  </Container>
                </>
              )}
              <Container>
                <Row align='middle' style={{ padding: "8px 0px" }}>
                  <Col xl={6} sm={8}>
                    <Text level={5} color='Text3'>
                      คุณสมบัติและประโยชน์
                    </Text>
                  </Col>
                  <Col xl={18} sm={16}>
                    <TextArea
                      rows={description?.length ? 5 : 0}
                      value={description || "-"}
                      bordered={false}
                      style={{ fontFamily: "Sarabun", fontSize: "16px", padding: 0 }}
                    />
                  </Col>
                </Row>
              </Container>
            </>
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
                    onChange={(e) => setSearchZone(e)}
                  />
                </Col>
                <Col span={5}>
                  <Input
                    allowClear
                    placeholder='ค้นหาร้านค้า...'
                    suffix={<SearchOutlined style={{ color: "grey" }} />}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </Col>
                {!isEdit && (
                  <Col span={3}>
                    <Button
                      type='primary'
                      style={{ height: "38px" }}
                      onClick={() => setIsEdit(!isEdit)}
                    >
                      <EditOutlined />
                      แก้ไขร้านค้า
                    </Button>
                  </Col>
                )}
                {isEdit && (
                  <>
                    <Col>
                      <Button
                        type='primary'
                        style={{ height: "38px" }}
                        onClick={() => setShowModalShop(!showModalShop)}
                      >
                        <PlusOutlined />
                        เพิ่มร้านค้า
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        style={{
                          height: "39px",
                          backgroundColor: selectedShop.filter((x) => x.isChecked).length
                            ? color.error
                            : color.Disable,
                          color: color.white,
                        }}
                        //onClick={() => handleDelete()}
                      >
                        <DeleteOutlined style={{ color: "white" }} />
                        {`ลบรายการ (${selectedShop.length})`}
                      </Button>
                    </Col>
                  </>
                )}
              </Row>
              <br />
              <TableContainer>
                <Table
                  scroll={{ y: 480 }}
                  columns={isEdit ? columns : columns.filter((x: any) => x.dataIndex !== "index")}
                  dataSource={selectedShop}
                  pagination={false}
                />
              </TableContainer>
            </>
          )}
          <Divider />
          {isEdit && (
            <Row justify='space-between' gutter={12}>
              <Col xl={3} sm={6}>
                <Buttons
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
                        getShopProduct();
                        setIsEdit(!isEdit);
                      },
                    });
                  }}
                />
              </Col>
              <Col xl={18} sm={12}></Col>
              <Col xl={3} sm={6}>
                <Buttons
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
                            โปรดตรวจสอบรายละเอียดสินค้าอีกครั้งก่อนกดยืนยัน
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
      </div>
      {showModalShop && (
        <ModalSelectStore
          company={company}
          callBackShop={callBackShop}
          showModalShop={showModalShop}
          onClose={() => setShowModalShop(!setShowModalShop)}
          currentSelectShop={selectedShop}
        />
      )}
    </>
  );
};
