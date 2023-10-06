import { Col, Divider, Row, Button, Table, Avatar, Checkbox, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import { CardContainer } from "../../components/Card/CardContainer";
import Descriptions from "../../components/Description/Descriptions";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import { color } from "../../resource";
import Text from "../../components/Text/Text";
import Select from "../../components/Select/Select";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Input from "../../components/Input/Input";
import TableContainer from "../../components/Table/TableContainer";
import image from "../../resource/image";
import Buttons from "../../components/Button/Button";
import { ModalSelectedProduct } from "../Shared/ModalSelecteProduct";
import { ProductEntity } from "../../entities/PoductEntity";
import {
  createProductShop,
  getProductShopByCusComId,
} from "../../datasource/ProductShopDatasource";
import { CreateProductShopEntity, DetailProductShopEntity } from "../../entities/ProductShopEntity";
import { getProductCategory, getProductGroup } from "../../datasource/ProductDatasource";
import { getCustomers } from "../../datasource/CustomerDatasource";
import { CusComEntity } from "../../entities/CustomerEntity";

export const ProductShopDetail: React.FC = () => {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const { pathname } = window.location;
  const cusComId = pathname.split("/")[3];
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [cusDetail, setCusDetail] = useState<CusComEntity>();
  const [showModalProd, setShowModalProd] = useState<boolean>(false);
  const [selectedProd, setSelectedProd] = useState<ProductEntity[]>([]);
  const [searchProd, setSearchProd] = useState<ProductEntity[]>([]);
  const [productGroup, setProductGroup] = useState<any[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [prodGroup, setProdGroup] = useState("");

  const getByCusComId = async () => {
    const cus = await getCustomers({
      company,
      isActive: true,
    }).then(async (res) => {
      return res.data.find((x: any) => x.customerCompanyId === cusComId);
    });
    setCusDetail(cus);
    await getProductShopByCusComId({ customerCompanyId: cusComId }).then((res) => {
      const mapProduct = res.data.map((x: any) => {
        return { ...x.product, isChecked: false };
      });
      setSelectedProd(mapProduct);
      setSearchProd(mapProduct);
    });
  };
  const fetchCatetory = async () => {
    await getProductGroup(company).then((res) => {
      setProductGroup(res.responseData);
    });
  };

  useEffect(() => {
    getByCusComId();
    fetchCatetory();
  }, []);

  const searchText = (e: any) => {
    const valueUpperCase: string = e.toUpperCase();
    const find = selectedProd.filter((x) => {
      const searchName = !e || x.productName?.includes(valueUpperCase);
      const searchGroup = !prodGroup || x.productCategoryId === prodGroup;
      return searchName && searchGroup;
    });
    setSearchProd(find);
  };
  const searchProGroup = (e: any) => {
    const find = selectedProd.filter((x) => {
      const searchName = !searchProduct || x.productName?.includes(searchProduct);
      const searchGroup = !e || x.productGroup === e;
      return searchName && searchGroup;
    });
    setSearchProd(find);
  };
  const callBackProduct = (item: ProductEntity[]) => {
    item = item.map((p: any) => ({ ...p, isChecked: false }));
    setSelectedProd(item);
    setSearchProd(item);
  };
  const handleCheckBox = (e: any, prodId: string) => {
    const checkBoxed = selectedProd.map((item) => ({
      ...item,
      isChecked: item.productId === prodId ? e.target.checked : item.isChecked,
    }));
    setSelectedProd(checkBoxed);
    const find = checkBoxed.filter((x) => {
      const searchName = !searchProduct || x.productName?.includes(searchProduct);
      const searchGroup = !prodGroup || x.productCategoryId === prodGroup;
      return searchName && searchGroup;
    });
    setSearchProd(find);
  };
  const handleAllCheckBox = (e: any) => {
    const d = searchProd.map((p: any) => ({ ...p, isChecked: e.target.checked }));
    const checkBoxed = selectedProd.map((x: any) => {
      const matching = d.find((i) => i.productId === x.productId);
      if (matching) {
        return { ...matching, isChecked: e.target.checked };
      }
      return {
        ...x,
        isChecked: x.isChecked,
      };
    });
    setSelectedProd(checkBoxed);
    const find = checkBoxed.filter((x) => {
      const searchName = !searchProduct || x.productName?.includes(searchProduct);
      const searchGroup = !prodGroup || x.productCategoryId === prodGroup;
      return searchName && searchGroup;
    });
    setSearchProd(find);
  };
  const handleDelete = () => {
    const deleted = selectedProd.filter((x) => !x.isChecked);
    setSelectedProd(deleted);
    setSearchProd(deleted);
  };
  const submit = async () => {
    const mapProd: any = selectedProd.map((x) => {
      return { productId: x.productId };
    });
    const final: CreateProductShopEntity = {
      company: company,
      customerCompanyId: Number(cusDetail?.customerCompanyId) || 0,
      customerId: Number(cusDetail?.customerId) || 0,
      customerNo: cusDetail?.customerNo || "",
      customerName: cusDetail?.customerName || "",
      zone: cusDetail?.zone || "",
      createBy: userProfile.firstname + " " + userProfile.lastname,
      productIdList: mapProd,
    };
    await createProductShop(final).then((res) => {
      if (res.success) {
        getByCusComId();
        setIsEdit(!isEdit);
      }
    });
  };
  const detail = () => {
    return (
      <div
        style={{
          width: "100%",
          backgroundColor: color.background1,
          border: "1px solid",
          borderColor: color.background2,
          borderRadius: "8px",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <Row justify={"space-between"}>
          <Col span={12}>
            <Descriptions label='ชื่อร้านค้า' value={cusDetail?.customerName || "-"} />
          </Col>
          <Col span={12}>
            <Descriptions label='รหัสร้านค้า' value={cusDetail?.customerNo || "-"} />
          </Col>
        </Row>
        <Row justify={"space-between"}>
          <Col span={12}>
            <Descriptions label='เขต' value={cusDetail?.zone || "-"} />
          </Col>
        </Row>
      </div>
    );
  };
  const product = () => {
    return (
      <CardContainer>
        <Row justify={"space-between"} gutter={8}>
          <Col span={isEdit ? 8 : 11}>
            <Text fontWeight={700}>รายการสินค้า</Text>
          </Col>
          <Col span={5}>
            <Select
              allowClear
              placeholder='Product Group : ทั้งหมด'
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
              style={{ width: "100%" }}
              onChange={(e) => {
                searchProGroup(e);
                setProdGroup(e);
              }}
            />
          </Col>
          <Col span={5}>
            <Input
              placeholder='ค้นหาสินค้า...'
              suffix={<SearchOutlined style={{ color: "grey" }} />}
              onChange={(e) => {
                searchText(e.target.value);
                setSearchProduct(e.target.value);
              }}
              allowClear
            />
          </Col>
          {!isEdit && (
            <Col span={3}>
              <Button type='primary' style={{ height: "38px" }} onClick={() => setIsEdit(true)}>
                <EditOutlined />
                แก้ไขสินค้า
              </Button>
            </Col>
          )}

          {isEdit && (
            <>
              <Col>
                <Button
                  type='primary'
                  style={{ height: "38px" }}
                  onClick={() => setShowModalProd(!showModalProd)}
                >
                  <PlusOutlined />
                  เพิ่มสินค้า
                </Button>
              </Col>
              <Col>
                <Button
                  style={{
                    height: "39px",
                    backgroundColor: selectedProd.filter((x) => x.isChecked).length
                      ? color.error
                      : color.Disable,
                    color: color.white,
                  }}
                  onClick={() => handleDelete()}
                >
                  <DeleteOutlined style={{ color: "white" }} />
                  {`ลบรายการ (${selectedProd.filter((x) => x.isChecked).length})`}
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
            dataSource={searchProd}
            pagination={false}
          />
        </TableContainer>
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
                          โปรดตรวจสอบรายละเอียดสินค้าอีกครั้ง ก่อนการกดยืนยันยกเลิกการแก้ไข
                        </Text>
                      </>
                    ),
                    okText: "",
                    cancelText: "",
                    onOk: async () => {
                      getByCusComId();
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
    );
  };

  const columns: any = [
    {
      title: isEdit && (
        <Checkbox
          onClick={(e) => handleAllCheckBox(e)}
          checked={
            selectedProd.length > 0 || searchProd.length > 0
              ? selectedProd.every((x) => x.isChecked) || searchProd.every((x) => x.isChecked)
              : false
          }
        />
      ),
      width: "5%",
      dataIndex: "index",
      render: (text: string, value: any) => (
        <Checkbox checked={value.isChecked} onClick={(e) => handleCheckBox(e, value.productId)} />
      ),
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "name",
      key: "customerNo",
      width: "50%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row gutter={8}>
              <Col>
                <Avatar
                  src={row.productImage ? row.productImage : image.product_no_image}
                  size={70}
                  shape='square'
                  onError={() => false}
                />
              </Col>
              <Col>
                <Text>{row.productName}</Text>
                <br />
                <Text level={6}>{row.commonName}</Text>
                <br />
                {company !== "ICPL" ? (
                  <Text level={6} color='Text3'>
                    Product Group : {row.productGroup || "-"}
                  </Text>
                ) : (
                  <Text level={6} color='Text3'>
                    Stragery Group : {row.productStrategy || "-"}
                  </Text>
                )}
              </Col>
            </Row>
          ),
        };
      },
    },
    {
      title: "",
      dataIndex: "packSize",
      key: "packSize",
      width: isEdit ? "30%" : "35%",
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
      title: <div>{`ทั้งหมด ${selectedProd?.length} รายการ`}</div>,
    },
  ];

  return (
    <>
      <CardContainer>
        <PageTitleNested
          title='รายละเอียดร้านค้า'
          showBack
          onBack={() => navigate(`/productshop/list`)}
          customBreadCrumb={
            <BreadCrumb
              data={[
                { text: "สินค้าขายเฉพาะร้าน", path: `/productshop/list` },
                { text: "รายละเอียดร้านค้า", path: window.location.pathname },
              ]}
            />
          }
        />
        <Divider />
        {detail()}
      </CardContainer>
      <br />
      {product()}
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
