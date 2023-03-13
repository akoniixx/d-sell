import {
  Avatar,
  Col,
  Divider,
  Form,
  FormInstance,
  Modal,
  Row,
  Table,
  Tabs,
  Tooltip,
  Upload,
} from "antd";
import React, { useEffect, useState, memo, useMemo, ReactNode } from "react";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import Text from "../../components/Text/Text";
import styled from "styled-components";
import color from "../../resource/color";
import image from "../../resource/image";
import TableContainer from "../../components/Table/TableContainer";
import { ProductEntity } from "../../entities/PoductEntity";
import { AlignType } from "rc-table/lib/interface";
import {
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  MinusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Select from "../../components/Select/Select";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Collapse from "../../components/Collapse/collapse";
import { PromotionEntity } from "../../entities/PromotionEntity";
import { PromotionType } from "../../definitions/promotion";
import {
  getProductCategory,
  getProductGroup,
  getProductList,
} from "../../datasource/ProductDatasource";
import { useRecoilValue, useSetRecoilState } from "recoil";
import productState from "../../store/productList";
import { getProductFreebieGroup, getProductFreebies } from "../../datasource/PromotionDatasource";

interface ProdNameProps {
  product: ProductEntity;
  size?: number;
}

interface SearchProps {
  list: ProductEntity[];
  setList: any;
  onClose: any;
  withFreebies?: boolean;
  isReplacing?: string;
  customTitle?: ReactNode;
}

export const ProductName = ({ product, size }: ProdNameProps) => {
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
        {withFrame(
          <Text level={5} color='Text3'>
            {product.commonName}
          </Text>,
        )}
        {withFrame(
          <Text level={5} color='Text3'>
            {product.productGroup}
          </Text>,
        )}
      </FlexCol>
    </FlexRow>
  );
};

const AddProduct = ({
  list,
  setList,
  onClose,
  withFreebies,
  isReplacing,
  customTitle,
}: SearchProps) => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const pageSize = 100;
  const isSingleItem = withFreebies || isReplacing;
  const [form] = Form.useForm();

  const productList = useRecoilValue(productState);
  const setProductList = useSetRecoilState(productState);

  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [freebies, setFreebies] = useState<ProductEntity[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [freebieCount, setFreebieCount] = useState(0);
  const [selectedProduct, setSelectedProd] = useState<ProductEntity[]>([]);
  const [selectedProductId, setSelectedProdId] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [productGroups, setProductGroups] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [productFreebieGroups, setProductFreebieGroups] = useState([]);
  const [showFreebie, setShowFreeie] = useState("false");
  const [filter, setFilter] = useState({
    productGroup: "",
    productCategory: "",
    searchText: "",
  });

  const resetPage = () => {
    setPage(1);
    setFilter({
      productGroup: "",
      productCategory: "",
      searchText: "",
    });
    form.resetFields();
  };

  useEffect(() => {
    fetchProduct();
  }, [filter, showFreebie]);

  useEffect(() => {
    setSelectedProdId(list.map((item) => item.productId));
  }, [list]);

  const fetchFreebieList = async () => {
    const { data, count } = await getProductFreebies({
      company,
      take: pageSize,
      productGroup: filter.productGroup,
      searchText: filter.searchText,
      page,
    });
    const newData = data.map((d: ProductEntity) => ({ ...d, key: d.productFreebiesId }));
    setFreebies(newData);
    setFreebieCount(count);
  };
  const fetchProductList = async () => {
    const { data, count } = await getProductList({
      company,
      take: pageSize,
      productGroup: filter.productGroup,
      searchText: filter.searchText,
      productCategoryId: filter.productCategory,
      page,
    });
    console.log({ data, count });
    const newData = data
      // .filter(
      //   (d: ProductEntity) =>
      //     !list.find((l: ProductEntity) => `${l.productId}` === `${d.productId}`),
      // )
      .map((d: ProductEntity) => ({ ...d, key: d.productId }));
    setProducts(newData);
    setProductCount(count);

    if (productList.allData.length <= 0) {
      setProductList((oldList: any) => ({
        page,
        pageSize,
        count,
        data,
        allData: oldList?.data?.length > 0 ? oldList.data.concat(data) : data,
      }));
    }
  };
  const fetchProduct = async () => {
    try {
      setLoading(true);
      await fetchProductList();
      await fetchFreebieList();

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
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: ProductEntity[]) => {
      setSelectedProdId(selectedRowKeys as string[]);
      setSelectedProd(selectedRows);
    },
    getCheckboxProps: (record: ProductEntity) => ({
      name: record.productName,
    }),
    selectedRowKeys: selectedProductId,
  };

  const columns = [
    {
      title: "สินค้าทั้งหมด",
      dataIndex: "productName",
      render: (value: string, row: ProductEntity) => <ProductName product={row} />,
    },
    {
      title: `${showFreebie === "true" ? freebieCount : productCount} สินค้า`,
      dataIndex: "packSize",
      align: "right" as AlignType,
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
      let newList = [
        ...list,
        ...productList.allData.filter((item: any) => selectedProductId.includes(item.productId)),
      ];
      newList = newList.filter(
        (item, pos) => newList.findIndex((item2) => item.productId === item2.productId) === pos,
      );
      setList(newList);
    }
    onClear();
    onClose();
  };

  const onClear = () => {
    form.setFieldsValue({
      productGroup: "",
      productCategory: "",
      searchText: "",
    });
    setFilter({
      productGroup: "",
      productCategory: "",
      searchText: "",
    });
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
          <Col span={7}>
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
          <Col span={showFreebie === "true" ? 0 : company === "ICPL" ? 7 : 0}>
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
          <Col span={showFreebie === "true" ? 14 : company === "ICPL" ? 7 : 14}>
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
          onChange={(key: string) => {
            setShowFreeie(key);
            resetPage();
          }}
          defaultValue={showFreebie}
        />
      )}
      <TableContainer>
        <Table
          rowSelection={isSingleItem ? undefined : { type: "checkbox", ...rowSelection }}
          rowClassName={rowClassName}
          onRow={onRow}
          columns={columns}
          dataSource={
            showFreebie === "true"
              ? freebies
              : products.filter(
                  (item) => !list.find((l: ProductEntity) => item.productId === l.productId),
                )
          }
          pagination={false}
          scroll={{ y: 360 }}
          loading={loading}
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
