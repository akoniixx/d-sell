import { Avatar, Col, Divider, Form, Row, Table, Tabs } from "antd";
import React, { useEffect, useState, ReactNode } from "react";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import Text from "../../components/Text/Text";
import color from "../../resource/color";
import image from "../../resource/image";
import TableContainer from "../../components/Table/TableContainer";
import { ProductEntity } from "../../entities/PoductEntity";
import { CheckCircleFilled, CloseOutlined, SearchOutlined } from "@ant-design/icons";
import Select from "../../components/Select/Select";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import {
  getProductBrand,
  getProductCategory,
  getProductGroup,
  getProductList,
} from "../../datasource/ProductDatasource";
import { getProductFreebieGroup, getProductFreebies } from "../../datasource/PromotionDatasource";
import { LOCATION_DATA, LOCATION_FULLNAME_MAPPING } from "../../definitions/location";
import { numberFormatter } from "../../utility/Formatter";
import { useRecoilValue, useSetRecoilState } from "recoil";
import productState from "../../store/productList";

interface ProdNameProps {
  product: ProductEntity;
  size?: number;
  showLocation?: boolean;
}

interface SearchProps {
  list: ProductEntity[];
  setList: any;
  onClose: any;
  withFreebies?: boolean;
  isReplacing?: string;
  customTitle?: ReactNode;
}

export const ProductName = ({ product, size, showLocation }: ProdNameProps) => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const withFrame = (e: ReactNode) => (
    <div style={{ height: 25, overflow: "hidden", textOverflow: "ellipsis" }}>{e}</div>
  );
  return (
    <FlexRow align='center'>
      <div style={{ marginRight: 16 }}>
        <Avatar
          src={
            product.productImage === "No"
              ? image.product_no_image
              : product.productImage || product.productFreebiesImage || image.product_no_image
          }
          size={size || 50}
          shape='square'
          onError={() => false}
        />
      </div>
      <FlexCol>
        {withFrame(<Text level={5}>{product.productName}</Text>)}
        {product.commonName &&
          withFrame(
            <Text level={6} color='Text3'>
              {product.commonName}
            </Text>,
          )}
        {withFrame(
          <Text level={6} color='Text3'>
            Product Group : {product.productGroup}
          </Text>,
        )}
        {product.productStrategy &&
          withFrame(
            <Text level={6} color='Text3'>
              Strategy Group : {product.productStrategy}
            </Text>,
          )}
      </FlexCol>
    </FlexRow>
  );
};

interface SearchProps {
  list: ProductEntity[];
  setList: any;
  onClose: any;
  withFreebies?: boolean;
  isReplacing?: string;
  customTitle?: ReactNode;
  notFilteredProductList?: string[];
}

const AddProduct = ({
  list,
  setList,
  onClose,
  withFreebies,
  isReplacing,
  customTitle,
  notFilteredProductList,
}: SearchProps) => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const pageSize = 1000;
  const isSingleItem = withFreebies || isReplacing;
  const [form] = Form.useForm();

  const recoilProductList = useRecoilValue(productState);
  const setRecoilProductList = useSetRecoilState(productState);

  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [selectedProduct, setSelectedProd] = useState<ProductEntity[]>([]);
  const [selectedProductId, setSelectedProdId] = useState<string[]>(
    list.map((item) => item.productId),
  );
  const [allSelectedList, setAllSelectedList] = useState<Set<string>>(
    new Set(list.map((item) => item.productId)),
  );
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [brand, setBrand] = useState([]);
  const [productGroups, setProductGroups] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [productFreebieGroups, setProductFreebieGroups] = useState([]);
  const [showFreebie, setShowFreebie] = useState("false");
  const [filter, setFilter] = useState({
    productGroup: "",
    productCategory: "",
    searchText: "",
    productLocation: "",
    productBrandId: "",
  });

  const resetPage = () => {
    setPage(1);
    setFilter({
      productGroup: "",
      productCategory: "",
      searchText: "",
      productLocation: "",
      productBrandId: "",
    });
    form.resetFields();
  };

  useEffect(() => {
    fetchProduct();
  }, [filter, showFreebie]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      let newData: any = [];
      if (showFreebie === "true") {
        const { data, count } = await getProductFreebies({
          company,
          take: pageSize,
          productGroup: filter.productGroup,
          searchText: filter.searchText,
          productLocation: filter.productLocation,
          page,
          productStatus: "ACTIVE",
        });
        newData = data.map((d: ProductEntity) => ({ ...d, key: d.productFreebiesId }));
        if (recoilProductList.freebies.length <= 0) {
          setRecoilProductList({
            ...recoilProductList,
            freebies: newData,
          });
        }
      } else {
        const { data, count } = await getProductList({
          company,
          take: pageSize,
          productGroup: filter.productGroup,
          searchText: filter.searchText,
          productCategoryId: filter.productCategory,
          productLocation: filter.productLocation,
          page,
          productStatus: "ACTIVE",
          productBrandId: filter.productBrandId,
        });
        const getBrand = await getProductBrand(company).then((res) => {
          return res;
        });
        setBrand(getBrand);
        newData = data.map((d: ProductEntity) => ({
          ...d,
          key: d.productId,
          productBrandName: getBrand?.find((x: any) => d.productBrandId === x.productBrandId)
            .productBrandName,
        }));

        if (recoilProductList.allData.length <= 0) {
          setRecoilProductList({
            ...recoilProductList,
            allData: newData,
          });
        }
      }
      setProducts(newData);

      if (!productGroups || !productGroups.length) {
        const { responseData } = await getProductGroup(company);
        setProductGroups(responseData);
      }
      if (!productCategories || !productCategories.length) {
        const categories = await getProductCategory(company);
        setProductCategories(categories);
      }
      if (!productFreebieGroups || !productFreebieGroups.length) {
        const { responseData } = await getProductFreebieGroup(company);
        setProductFreebieGroups(responseData);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: ProductEntity[]) => {
      // TODO
      if (selectedRowKeys.length) {
        if (selectedRowKeys.length < 2) {
          const checkInclude = selectedProductId.includes(selectedRowKeys[0].toString());
          selectedRowKeys = checkInclude
            ? selectedProductId.filter((x) => x === selectedRowKeys[0])
            : selectedRowKeys;
          setSelectedProdId(selectedRowKeys as string[]);
          setSelectedProd(selectedRows);
        } else {
          setSelectedProdId(selectedRowKeys as string[]);
          setSelectedProd(selectedRows);
        }
      } else {
        setSelectedProdId([] as string[]);
        setSelectedProd([]);
      }

      const newAllSelectedList = new Set(allSelectedList);
      // remove
      allSelectedList.forEach((x) => {
        if (!selectedRowKeys.includes(x) && products.find((p) => `${p.productId}` === `${x}`)) {
          newAllSelectedList.delete(x);
        }
      });
      // add
      selectedRowKeys.forEach((x) => newAllSelectedList.add(`${x}`));
      // save
      setAllSelectedList(newAllSelectedList);
    },
    getCheckboxProps: (record: ProductEntity) => ({
      name: record.productName,
    }),
    selectedRowKeys: selectedProductId,
  };

  const columns = [
    {
      title: <span>ชื่อสินค้า</span>,
      dataIndex: "productName",
      width: "40%",
      render: (text: string, value: any, index: any) => {
        return (
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
        );
      },
    },
    {
      title: <span>Product Code</span>,
      dataIndex: "productCodeNAV",
      width: "20%",
      render: (text: string, value: any) => (
        <FlexRow>
          <FlexCol>
            <div style={{ height: 25 }}>
              <Text level={5}>
                {showFreebie === "false" ? value.productCodeNAV : value.productFreebiesCodeNAV}
              </Text>
            </div>
            <div style={{ height: 25, overflow: "hidden", textOverflow: "ellipsis" }}>
              <Text level={6} style={{ color: color.Grey }}>
                Pack Size : {showFreebie === "false" ? value.packSize : value.baseUnitOfMeaTh}
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
    {
      dataIndex: "checkedFreebie",
      width: "5%",
      render: (text: string, value: any) => {
        const checked = selectedProduct.length
          ? showFreebie === "true"
            ? selectedProduct[0].productFreebiesId === value.productFreebiesId
            : selectedProduct[0].productId === value.productId
          : false;
        return (
          <FlexRow>
            <FlexCol>
              {isSingleItem !== undefined && checked && (
                <CheckCircleFilled style={{ color: color.success, fontSize: "25px" }} />
              )}
            </FlexCol>
          </FlexRow>
        );
      },
    },
  ];

  const onRow = (record: ProductEntity) => ({
    onClick: () => {
      setSelectedProd([record]);
    },
  });

  const onSave = () => {
    if (isSingleItem) {
      setList(selectedProduct[0]);
    } else {
      const map = (
        showFreebie === "true" ? recoilProductList.freebies : recoilProductList.allData
      ).filter((x) => {
        const find = allSelectedList.has(x.productId);
        return find;
      });
      setList(map);
    }
    onClear();
    onClose();
  };

  const onClear = () => {
    form.setFieldsValue({
      productGroup: "",
      productCategory: "",
      searchText: "",
      productBrandId: "",
    });
    setFilter({
      productGroup: "",
      productCategory: "",
      searchText: "",
      productLocation: "",
      productBrandId: "",
    });
    setSelectedProd([]);
    setSelectedProdId([]);
  };

  const rowClassName = (r: ProductEntity) => {
    const isSelectedProduct =
      selectedProduct[0]?.productId && r.productId === selectedProduct[0]?.productId;
    const isSelectedFreebie =
      selectedProduct[0]?.productFreebiesId &&
      r.productFreebiesId === selectedProduct[0]?.productFreebiesId;
    return isSingleItem && (isSelectedProduct || isSelectedFreebie)
      ? "table-row-highlight table-row-clickable"
      : "table-row-clickable";
  };

  const tabsItems = [
    { label: `สินค้าแบรนด์ตัวเอง`, key: "false" },
    { label: `สินค้าอื่นๆ`, key: "true" },
  ];

  return (
    <>
      <Row align='middle' justify='space-between'>
        <Col span={20}>
          {customTitle ? (
            customTitle
          ) : (
            <FlexRow align='end'>
              <Text level={5} fontWeight={600}>
                เลือกสินค้า
              </Text>
              <Text level={6} color='Text3'>
                &nbsp;&nbsp;สามารถเลือกได้มากกว่า 1 สินค้า
              </Text>
            </FlexRow>
          )}
        </Col>
        <Col span={4}>
          <FlexRow justify='end'>
            <CloseOutlined
              onClick={() => {
                onClear();
                onClose();
              }}
            />
          </FlexRow>
        </Col>
      </Row>
      <br />
      <Form layout='vertical' form={form}>
        <Row gutter={8} align='bottom'>
          <Col span={showFreebie === "true" ? 10 : company === "ICPL" ? 9 : 10}>
            <Form.Item label='ค้นหาสินค้า' name='searchText'>
              <Input
                suffix={<SearchOutlined />}
                placeholder={"ระบุชื่อสินค้า"}
                onPressEnter={(e) => {
                  const searchText = (e.target as HTMLTextAreaElement).value;
                  setFilter({ ...filter, searchText });
                }}
                value={filter.searchText}
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
                  ...(showFreebie === "true" ? productFreebieGroups : productGroups).map(
                    (g: any) => ({
                      key: g.product_group,
                      value: g.product_group,
                      label: g.product_group,
                    }),
                  ),
                ]}
                onChange={(v) => setFilter({ ...filter, productGroup: v })}
                value={filter.productGroup}
              />
            </Form.Item>
          </Col>
          <Col span={showFreebie === "true" ? 0 : company === "ICPL" ? 4 : 0}>
            <Form.Item label='Startegy Group' name='productCategory'>
              <Select
                data={[
                  {
                    key: "",
                    value: "",
                    label: "ทั้งหมด",
                  },
                  ...productCategories.map((g: any) => ({
                    key: g.productCategoryId,
                    value: g.productCategoryId,
                    label: g.productCategoryName,
                  })),
                ]}
                onChange={(v) => setFilter({ ...filter, productCategory: v })}
                value={filter.productCategory}
              />
            </Form.Item>
          </Col>
          {showFreebie === "false" && (
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
                  onChange={(v) => setFilter({ ...filter, productBrandId: v })}
                  value={filter.productBrandId}
                />
              </Form.Item>
            </Col>
          )}
          {company === "ICPI" && (
            <Col span={4}>
              <Form.Item label='Location' name='productLocation'>
                <Select
                  data={[
                    {
                      key: "",
                      value: "",
                      label: "ทั้งหมด",
                    },
                    ...LOCATION_DATA.filter((l) => l.company === company).map((l: any) => ({
                      key: l.LocationName,
                      value: l.LocationName,
                      label: l.LocationNameTH,
                    })),
                  ]}
                  onChange={(v) => setFilter({ ...filter, productLocation: v })}
                  value={filter.productLocation}
                />
              </Form.Item>
            </Col>
          )}
          <Col span={3}>
            <Form.Item label='' name='clear'>
              <Button title='ล้างการค้นหา' typeButton='primary-light' onClick={onClear} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {withFreebies && (
        <Tabs
          items={tabsItems}
          onChange={(key: any) => {
            setShowFreebie(key);
            resetPage();
          }}
          defaultValue={String(showFreebie)}
        />
      )}
      <TableContainer>
        <Table
          rowSelection={isSingleItem ? undefined : { type: "checkbox", ...rowSelection }}
          rowClassName={rowClassName}
          onRow={onRow}
          columns={
            showFreebie === "true"
              ? columns.filter(
                  (x) => x.dataIndex !== "productLocation" && x.dataIndex !== "unitPrice",
                )
              : columns
          }
          dataSource={products.filter(
            (item) =>
              notFilteredProductList?.find((id) => `${item.productId}` === `${id}`) ||
              !list.find((l: ProductEntity) => `${item.productId}` === `${l.productId}`) ||
              (showFreebie === "true" &&
                !list.find(
                  (l: ProductEntity) => `${item.productFreebiesId}` === `${l.productFreebiesId}`,
                )),
          )}
          pagination={false}
          scroll={{ y: 360 }}
          loading={loading}
          style={{ height: 420 }}
        />
      </TableContainer>
      <Divider style={{ margin: "12px 0px" }} />
      <Row justify='end'>
        <Button title='บันทึก' style={{ width: 136 }} onClick={onSave} />
      </Row>
    </>
  );
};

export default AddProduct;
