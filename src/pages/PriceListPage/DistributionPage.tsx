import { Avatar, Button, Col, Image, Row, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { CardContainer } from "../../components/Card/CardContainer";
import { InputWithSerachButton } from "../../components/Input/InputWithSreachButton";
import { FormOutlined, ShopOutlined } from "@ant-design/icons";
import Layouts from "../../components/Layout/Layout";
import { ProductListDatasource } from "../../datasource/ProductListDatasource";
import { useLocalStorage } from "../../hook/useLocalStorage";
import { formatDate, numberWithCommas } from "../../utilities/TextFormatter";

const { Map } = require("immutable");

export const DistributionPage: React.FC = () => {
  const style: React.CSSProperties = {
    marginRight: "10px",
    fontFamily: "Sukhumvit set",
  };
  const { Option } = Select;
  const _ = require("lodash");
  const [optionalTextSearch, setTextSearch] = useState<string|undefined>('');
  const [productList, setProductList] = useState([]);
  const [productGroup, setProductGroup] = useState<any>([]);
  const [selectProductGroup, setSelectProductGroup] = useState<string>("");
  const [productStrategy, setProductStrategy] = useState<any>();
  const [keyword, setKeyword] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isModalDeleteVisible, setIsModalDeleteVisible] =
    useState<boolean>(false);
  const changeTextSearch = (text?: string) => {
    setTextSearch(text);
  };
  const [persistedProfile, setPersistedProfile] = useLocalStorage(
    "profile",
    []
  );

  useEffect(() => {
    fetchProductList(1, 10, persistedProfile.companyId);
  }, []);

  useEffect(() => {
    fetchProductList(1, 10, persistedProfile.companyId,optionalTextSearch,selectProductGroup);
  }, [optionalTextSearch,selectProductGroup]);

  const fetchProductList = async (
    pageNum: number,
    pageSize: number,
    companyId: number,
    search?: string,
    productGroup?:string
  ) => {
    await ProductListDatasource.getProductList(
      pageNum,
      pageSize,
      companyId,
      search,
      productGroup
    ).then((res) => {
      setProductList(res.data);
    });
  };

  const handleGroupProduct = (value: string) => {
   setSelectProductGroup(value)
  };

  const fetchProductGroup = async (companyId: number) => {
    await ProductListDatasource.getProductGroup(companyId).then((res) => {
      setProductGroup(res);
    });
  };

  const fecthProductStrategy = async () => {
    await ProductListDatasource.getProductStrategy().then((res) => {
      setProductStrategy(res);
    });
  };

  useEffect(() => {
    fetchProductList(1, 10, persistedProfile.companyId);
    fetchProductGroup(persistedProfile.companyId);
    fecthProductStrategy();
  }, []);

  const handleFileChange = (e: any) => {
    const m = Map(productList).set("image", e.target.files[0]);
    setImageUrl("");
    setProductList(m.toJS());
  };

  const handleCancelFileChange = (e: any) => {
    const m = Map(productList).set("image", "");
    setImageUrl("");
    setProductList(m.toJS());
  };

  const colorStrategyGroup = (group: string) => {
    if (group == "EXPAND") {
      return "text-warning font-weight-bold d-block";
    } else if (group == "NATURAL") {
      return "text-success font-weight-bold d-block";
    } else if (group == "SKYROCKET") {
      return "text-primary font-weight-bold d-block";
    } else if (group == "STANDARD") {
      return "text-danger font-weight-bold d-block";
    } else {
      return "text-muted font-weight-bold d-block";
    }
  };

  const PageTitle = () => {
    return (
      <Container>
        <Row>
          <Col className="gutter-row" span={10}>
            <div>
              <span
                className="card-label font-weight-bolder text-dark"
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  fontFamily: "Sukhumvit set",
                }}
              >
                Distribution (DIS) Price List-ราคาสินค้า
              </span>
            </div>
          </Col>
          <Row justify="center">
            <Col span={8} style={style}>
              <InputWithSerachButton
                sizeInput="12"
                changeTextSearch={changeTextSearch}
              />
            </Col>
            <div className="col-md-4 my-2 my-md-0">
              <Select placeholder={"เลือกกลุ่มสินค้า"} style={{ width: 170 }} onChange={handleGroupProduct} value={selectProductGroup} >
              <Option  value=''>
                 ALL
                </Option>
                {productGroup?.map((items: any, index: number) => (
                  <Option key={index} value={items}>
                    {items}
                  </Option>
                ))}
              </Select>
            </div>

            <Select placeholder={"เลือก Strategy Group"} style={{ width: 170 }}>
            <Option  value=''>
                 all
                </Option>
              {productStrategy?.map((value: any, index: number) => (
                <Option key={index} value={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Row>
        </Row>
      </Container>
    );
  };

  const sorter = (a: any, b: any) => {
    if (a === b) return 0;
    else if (a === null) return 1;
    else if (b === null) return -1;
    else return a.localeCompare(b);
  };

  const columns = [
    {
      title: "ชื่อสินค้า",
      dataIndex: "productName",
      key: "productName",
      width: "20%",
      sorter: (a: any, b: any) => a.productName.localCompare(b.productName) ,
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className="d-flex flex-row align-items-baseline">
              <div className="me-4">
                {row.productImage && row.productImage != 'https://system.icpladda.com/ProductImage/No' ?(
                  <Image width={30} src={row.productImage} />
                ) : (
                  <Avatar
                    size={45}
                    style={{ color: "#0068F4", backgroundColor: "#EFF2F9" }}
                  >
                    {row.productName.charAt(0)}
                  </Avatar>
                )}
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>{row.productName}</span>
                <br />
                <span style={{ color: "GrayText", fontSize: "12px" }}>
                  {row.commonName}
                </span>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: "ขนาด",
      dataIndex: "packSize",
      key: "packSize",
      width: "12%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className="d-flex flex-row align-items-baseline">
              <div>
                <span style={{ fontWeight: "bold" }}>{row.packSize}</span>
                <span className="text-muted font-weight-bold text-muted d-block">
                  {row.productNoNAV}
                </span>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: " กลุ่มสินค้า",
      dataIndex: "productGroup",
      key: "productGroup",
      width: "12%",
      sorter: (a: any, b: any) => sorter(a.productGroup, b.productGroup),
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className="d-flex flex-row align-items-baseline">
              <div>
                <span style={{ fontWeight: "bold" }}>{row.productGroup}</span>
                <span className={colorStrategyGroup(row.productStrategy)}>
                  {row.productStrategy}
                </span>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: "Strategy Group",
      dataIndex: "productStrategy",
      key: "productStrategy",
      width: "15%",
      sorter: (a: any, b: any) => sorter(a.productStrategy, b.productStrategy),
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <span style={{ fontWeight: "bold" }}>
              {numberWithCommas(row.productStrategy)}
            </span>
          ),
        };
      },
    },
    {
      title: "ราคาต่อหน่วย",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: "10%",
      sorter: (a: any, b: any) => sorter(a.unitPrice, b.unitPrice),
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className="d-flex flex-row align-items-baseline">
              <div>
                <span style={{ fontWeight: "bold" }}>
                  {numberWithCommas(row.unitPrice) + "฿"}
                </span>
                <span className="text-muted font-weight-bold text-muted d-block">
                  {row.saleUOM}
                </span>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: "ราคาตลาด",
      dataIndex: "marketPrice",
      key: "marketPrice",
      width: "10%",
      sorter: (a: any, b: any) => sorter(a.marketPrice, b.marketPrice),
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className="d-flex flex-row align-items-baseline">
              <div>
                <span style={{ fontWeight: "bold" }}>
                  {numberWithCommas(row.marketPrice) + "฿"}
                </span>
                <span className="text-muted font-weight-bold text-muted d-block">
                  {row.saleUOM}
                </span>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: "สถานะ",
      dataIndex: "isActive",
      key: "isActive",
      width: "7%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className="d-flex flex-row align-items-baseline">
              <div>
                <span style={{ fontWeight: "bold" }}>
                  {row.isActive === "Active" ? (
                    <span style={{ color: "green" }}>ใช้งาน</span>
                  ) : row.isActive === "inActive" ? (
                    <span style={{ color: "red" }}>ปิดการใช้งาน</span>
                  ) : (
                    <span style={{ color: "Gray" }}>
                      อยู่ระหว่างการดำเนินงาน
                    </span>
                  )}
                </span>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: "อัพเดตล่าสุด",
      dataIndex: "updateDate",
      key: "updateDate",
      width: "15%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <Row>
                <span className="text-dark-75  text-hover-primary mb-1 font-size-lg">
                  {formatDate(row.updateDate)}
                </span>
              </Row>
            </>
          ),
        };
      },
    },
    {
      title: "",
      dataIndex: "Action",
      key: "Action",
      width: "7%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <div className="d-flex flex-row ">
                <div>
                  <span
                    onClick={() =>
                      (window.location.href =
                        "/EditDistributionPage?=" + row.productId)
                    }
                    style={{
                      fontSize: "20px",
                      marginRight: "15px",
                      color: "#0068F4",
                    }}
                  >
                    <FormOutlined />
                  </span>
                </div>
                <div onClick={() => (window.location.href = "" + row.id)}>
                  <span style={{ fontSize: "20px", color: "#0068F4" }}>
                    <ShopOutlined />
                  </span>
                </div>
              </div>
            </>
          ),
        };
      },
    },
  ];

  return (
    <Layouts>
      <Container style={style}>
        <PageTitle />
        <br />
        <CardContainer>
          <Table
            className="rounded-lg"
            columns={columns}
            dataSource={productList}
            pagination={{ position: ["bottomCenter"] }}
            size="large"
            tableLayout="fixed"
          />
        </CardContainer>
      </Container>

      {/* <Modal
        visible={isModalDeleteVisible}
        onCancel={() => setIsModalDeleteVisible(false)}
      >
        <p style={{ color: "#464E5F", fontSize: 24 }}>
          ต้องการลบข้อมูลตำแหน่งผู้ใช้งานนี้
        </p>
        <p style={{ color: "#BABCBE", fontSize: 16 }}>
          โปรดยืนยันการลบข้อมูลรายการ Credit Memo
        </p>
      </Modal> */}
    </Layouts>
  );
};
