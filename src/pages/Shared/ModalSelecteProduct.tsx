import { Avatar, Checkbox, Col, Divider, Modal, Row, Table, Form } from "antd";
import { useEffect, useState } from "react";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import { ProductEntity } from "../../entities/PoductEntity";
import { ProductGroupEntity } from "../../entities/ProductGroupEntity";
import image from "../../resource/image";
import Text from "../../components/Text/Text";
import { color } from "../../resource";
import { numberFormatter } from "../../utility/Formatter";
import { LOCATION_DATA, LOCATION_FULLNAME_MAPPING } from "../../definitions/location";
import Input from "../../components/Input/Input";
import { SearchOutlined } from "@ant-design/icons";
import Select from "../../components/Select/Select";
import Button from "../../components/Button/Button";
import TableContainer from "../../components/Table/TableContainer";
import _ from "lodash";
import {
  getProductList,
  getProductCategory,
  getProductBrand,
} from "../../datasource/ProductDatasource";

export const ModalSelectedProduct = ({
  company,
  showModalProd,
  onClose,
  productGroup,
  callBackProduct,
  prodSelected,
}: {
  company: string;
  showModalProd: boolean;
  onClose: () => void;
  productGroup: ProductGroupEntity[];
  callBackProduct: (item: ProductEntity[]) => void;
  prodSelected: ProductEntity[];
}) => {
  console.log("p", productGroup);
  const [prodList, setProdList] = useState<ProductEntity[]>([]);
  const [selectedProd, setSelectedProd] = useState<ProductEntity[]>([]);
  const [prodGroup, setProdGroup] = useState("");
  const [strategyGroup, setStrategyGroup] = useState<any>([]);
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [brand, setBrand] = useState<any>([]);
  const [selectedBrand, setSelectedBrand] = useState("");

  const fetchProduct = async () => {
    const getBrand = await getProductBrand(company).then((res) => {
      return res;
    });
    setBrand(getBrand);
    const getProd = await getProductList({
      company,
      take: 1000,
      productStatus: "ACTIVE",
    });
    prodSelected = prodSelected.map((item) => ({ ...item, isChecked: false }));
    const dataWithIschecked = getProd.data.map((p: any) => ({
      ...p,
      isChecked: prodSelected.some((sp: any) =>
        sp.productId === p.productId ? !sp.isChecked : p.isChecked,
      ),
      productBrandName: getBrand?.find((x: any) => p.productBrandId === x.productBrandId)
        .productBrandName,
    }));
    setProdList(dataWithIschecked);
    setSelectedProd(dataWithIschecked);
  };
  const fetchCatetory = async () => {
    const getCatetory = await getProductCategory(company).then((res) => {
      return res;
    });
    setStrategyGroup(getCatetory);
  };

  useEffect(() => {
    fetchProduct();
    fetchCatetory();
  }, []);

  const handleChecked = (e: any, prodId: string) => {
    const d: ProductEntity[] = prodList.map((item) => ({
      ...item,
      isChecked: item.productId === prodId ? e.target.checked : item.isChecked,
    }));
    setProdList(d);
    const valueUpperCase: string = keyword.toUpperCase();
    const find = d.filter((x) => {
      const searchName =
        !keyword || x.productName?.includes(keyword) || x.productCodeNAV?.includes(valueUpperCase);
      const searchGroup = !prodGroup || x.productGroup?.includes(prodGroup);
      const searchStrategy = !selectedStrategy || x.productCategoryId?.includes(selectedStrategy);
      const searchBrand = !selectedBrand || x.productBrandId?.includes(selectedBrand);
      const searchLocation = !location || x.productLocation?.includes(location);
      return searchName && searchGroup && searchStrategy && searchBrand && searchLocation;
    });
    setSelectedProd(find);
  };
  const handleAllChecked = (e: any) => {
    const d = selectedProd.map((p: any) => ({ ...p, isChecked: e.target.checked }));
    const map = prodList.map((x: any) => {
      const matching = d.find((i) => i.productId === x.productId);
      if (matching) {
        return { ...matching, isChecked: e.target.checked };
      }
      return {
        ...x,
        isChecked: x.isChecked,
      };
    });
    setProdList(map);
    const valueUpperCase: string = keyword.toUpperCase();
    const find = map.filter((x) => {
      const searchName =
        !keyword || x.productName?.includes(keyword) || x.productCodeNAV?.includes(valueUpperCase);
      const searchGroup = !prodGroup || x.productGroup?.includes(prodGroup);
      const searchStrategy = !selectedStrategy || x.productCategoryId?.includes(selectedStrategy);
      const searchBrand = !selectedBrand || x.productBrandId?.includes(selectedBrand);
      const searchLocation = !location || x.productLocation?.includes(location);
      return searchName && searchGroup && searchStrategy && searchBrand && searchLocation;
    });
    setSelectedProd(find);
  };
  const handleSearchKeyword = (e: any) => {
    setKeyword(e.target.value);
    const valueUpperCase: string = e.target.value.toUpperCase();
    const find = prodList.filter((x) => {
      const searchName =
        !e.target.value ||
        x.productName?.includes(e.target.value) ||
        x.productCodeNAV?.includes(valueUpperCase);
      const searchGroup = !prodGroup || x.productGroup?.includes(prodGroup);
      const searchLocation = !location || x.productLocation?.includes(location);
      const searchStrategy = !selectedStrategy || x.productCategoryId?.includes(selectedStrategy);
      const searchBrand = !selectedBrand || x.productBrandId?.includes(selectedBrand);
      return searchName && searchGroup && searchStrategy && searchLocation && searchBrand;
    });
    setSelectedProd(find);
  };
  const handleSearchProdGroup = (e: any) => {
    setProdGroup(e);
    const valueUpperCase: string = keyword.toUpperCase();
    const find = prodList.filter((x) => {
      const searchName =
        !keyword || x.productName?.includes(keyword) || x.productCodeNAV?.includes(valueUpperCase);
      const searchGroup = !e || x.productGroup?.includes(e);
      const searchStrategy = !selectedStrategy || x.productCategoryId?.includes(selectedStrategy);
      const searchBrand = !selectedBrand || x.productBrandId?.includes(selectedBrand);
      const searchLocation = !location || x.productLocation?.includes(location);
      return searchName && searchGroup && searchStrategy && searchBrand && searchLocation;
    });
    setSelectedProd(find);
  };
  const handleSearchLocation = (e: any) => {
    setLocation(e);
    const valueUpperCase: string = keyword.toUpperCase();
    const find = prodList.filter((x) => {
      const searchName =
        !keyword || x.productName?.includes(keyword) || x.productCodeNAV?.includes(valueUpperCase);
      const searchLocation = !e || x.productLocation?.includes(e);
      const searchGroup = !prodGroup || x.productGroup?.includes(prodGroup);
      const searchStrategy = !selectedStrategy || x.productCategoryId?.includes(selectedStrategy);
      const searchBrand = !selectedBrand || x.productBrandId?.includes(selectedBrand);
      return searchName && searchLocation && searchStrategy && searchBrand && searchGroup;
    });
    setSelectedProd(find);
  };
  const handleSearchStrategyGroup = (e: any) => {
    setSelectedStrategy(e);
    const valueUpperCase: string = keyword.toUpperCase();
    const find = prodList.filter((x) => {
      const searchName =
        !keyword || x.productName?.includes(keyword) || x.productCodeNAV?.includes(valueUpperCase);
      const searchGroup = !prodGroup || x.productGroup?.includes(prodGroup);
      const searchStrategy = !e || x.productCategoryId?.includes(e);
      const searchBrand = !selectedBrand || x.productBrandId?.includes(selectedBrand);
      const searchLocation = !location || x.productLocation?.includes(location);
      return searchName && searchGroup && searchStrategy && searchBrand && searchLocation;
    });
    setSelectedProd(find);
  };
  const handleSearchBrand = (e: any) => {
    setSelectedBrand(e);
    const valueUpperCase: string = keyword.toUpperCase();
    const find = prodList.filter((x) => {
      const searchName =
        !keyword || x.productName?.includes(keyword) || x.productCodeNAV?.includes(valueUpperCase);
      const searchGroup = !prodGroup || x.productGroup?.includes(prodGroup);
      const searchStrategy = selectedStrategy || x.productCategoryId?.includes(selectedStrategy);
      const searchBrand = !e || x.productBrandId?.includes(e);
      const searchLocation = !location || x.productLocation?.includes(location);
      return searchName && searchGroup && searchStrategy && searchBrand && searchLocation;
    });
    setSelectedProd(find);
  };
  const handleClearSearch = () => {
    setKeyword("");
    setProdGroup("");
    setLocation("");
    setSelectedStrategy("");
    setSelectedBrand("");
    setSelectedProd(prodList);
  };

  const saveProd = () => {
    setKeyword("");
    setProdGroup("");
    callBackProduct(prodList.filter((x) => x.isChecked));
    onClose();
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
      title: <span>ชื่อสินค้า</span>,
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
            <div style={{ height: 25, textOverflow: "ellipsis" }}>
              <Text level={5}>{value.productName}</Text>
            </div>
            {value.commonName && (
              <div style={{ height: 25, textOverflow: "ellipsis" }}>
                <Text level={6} style={{ color: color.Grey }}>
                  {value.commonName}
                </Text>
              </div>
            )}
            <div style={{ height: 25 }}>
              <Text level={6} style={{ color: color.Grey }}>
                Product Group : {value.productGroup}
              </Text>
            </div>
            {value.productStrategy && (
              <div style={{ height: 25 }}>
                <Text level={6} style={{ color: color.Grey }}>
                  Strategy Group : {value.productStrategy}
                </Text>
              </div>
            )}
          </FlexCol>
        </FlexRow>
      ),
    },
    {
      title: <span>Product Code</span>,
      dataIndex: "productCodeNAV",
      width: "20%",
      render: (text: string, value: any) => (
        <FlexRow>
          <FlexCol>
            <div style={{ height: 25 }}>
              <Text level={5}>{text}</Text>
            </div>
            <div style={{ height: 25, overflow: "hidden", textOverflow: "ellipsis" }}>
              <Text level={6} style={{ color: color.Grey }}>
                Pack Size : {value.packSize}
              </Text>
            </div>
          </FlexCol>
        </FlexRow>
      ),
    },
    {
      title: <span>ราคาขาย</span>,
      dataIndex: "unitPrice",
      render: (text: string, value: any) => (
        <FlexRow>
          <FlexCol>
            <div style={{ height: 25, overflow: "hidden", textOverflow: "ellipsis" }}>
              <Text level={5}>
                {numberFormatter(value.marketPrice)} บาท/{value.saleUOMTH}
              </Text>
            </div>
            <div style={{ height: 25 }}>
              <Text level={6} style={{ color: color.Grey }}>
                ราคา/หน่วย : <br />
                {numberFormatter(text)} บาท/{value.baseUOM}
              </Text>
            </div>
          </FlexCol>
        </FlexRow>
      ),
    },
    {
      title: <span>สถานที่</span>,
      dataIndex: "productLocation",
      render: (text: string, value: any) => (
        <FlexRow>
          <FlexCol>
            <div style={{ height: 25 }}>
              <Text level={5}>{LOCATION_FULLNAME_MAPPING[text]}</Text>
            </div>
            <div style={{ height: 25, overflow: "hidden", textOverflow: "ellipsis" }}>
              <Text level={6} style={{ color: color.Grey }}>
                ยี่ห้อ : {value.productBrandName}
              </Text>
            </div>
          </FlexCol>
        </FlexRow>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={showModalProd}
        centered={true}
        onCancel={() => onClose()}
        width={1350}
        title='เลือกสินค้าที่ต้องการ'
        footer={false}
        zIndex={300}
      >
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col span={9}>
              <Form.Item label='ค้นหาสินค้า' name='searchText'>
                <Input
                  placeholder='ค้นหาชื่อสินค้าหรือรหัสสินค้า...'
                  suffix={<SearchOutlined />}
                  style={{ width: "100%" }}
                  onPressEnter={(e) => handleSearchKeyword(e)}
                  onChange={(e) => setKeyword(e.target.value)}
                  defaultValue={keyword}
                  value={keyword}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label='Product Group' name='productGroup'>
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
                  onChange={(e) => handleSearchProdGroup(e)}
                  placeholder='ทั้งหมด'
                  style={{ width: "100%" }}
                  value={prodGroup}
                />
              </Form.Item>
            </Col>
            {company === "ICPL" && (
              <Col span={4}>
                <Form.Item label='Strategy Group' name='strategyGroup'>
                  <Select
                    data={[
                      {
                        key: "",
                        value: "",
                        label: "ทั้งหมด",
                      },
                      ...strategyGroup.map((p: any) => ({
                        key: p.productCategoryId,
                        value: p.productCategoryId,
                        label: p.productCategoryName,
                      })),
                    ]}
                    onChange={(e) => handleSearchStrategyGroup(e)}
                    placeholder='ทั้งหมด'
                    style={{ width: "100%" }}
                    value={selectedStrategy}
                  />
                </Form.Item>
              </Col>
            )}
            {brand?.length && (
              <Col span={4}>
                <Form.Item label='ยี่ห้อ' name='brand'>
                  <Select
                    data={[
                      {
                        key: "",
                        value: "",
                        label: "ทั้งหมด",
                      },
                      ...brand.map((p: any) => ({
                        key: p.productBrandId,
                        value: p.productBrandId,
                        label: p.productBrandName,
                      })),
                    ]}
                    onChange={(e) => handleSearchBrand(e)}
                    placeholder='ทั้งหมด'
                    style={{ width: "100%" }}
                    value={selectedBrand}
                  />
                </Form.Item>
              </Col>
            )}
            {/* {company === "ICPI" && (
              <Col span={4}>
                <Form.Item label='Location' name='brand'>
                  <Select
                    data={[
                      {
                        key: "",
                        value: "",
                        label: "ทั้งหมด",
                      },
                      ...LOCATION_DATA.filter((c: any) => c.company === company).map((p: any) => ({
                        key: p.LocationName,
                        value: p.LocationName,
                        label: p.LocationNameTH,
                      })),
                    ]}
                    onChange={(e) => handleSearchLocation(e)}
                    placeholder='ทั้งหมด'
                    style={{ width: "100%" }}
                    value={location}
                  />
                </Form.Item>
              </Col>
            )} */}
            <Col span={3} style={{ paddingTop: "22px" }}>
              <Button title='ล้างการค้นหา' typeButton='primary-light' onClick={handleClearSearch} />
            </Col>
          </Row>
        </Form>
        <br />
        <TableContainer>
          <Table
            columns={dataTableProd}
            dataSource={selectedProd}
            pagination={false}
            scroll={{ y: 360 }}
            style={{ height: 420 }}
          />
        </TableContainer>
        <Divider style={{ margin: "12px 0px" }} />
        <Row justify='end'>
          <Button title='บันทึก' style={{ width: 136 }} onClick={saveProd} />
        </Row>
      </Modal>
    </>
  );
};
