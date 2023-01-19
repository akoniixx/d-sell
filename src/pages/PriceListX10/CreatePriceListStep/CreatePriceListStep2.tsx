import {
  Col,
  Form as AntdForm,
  FormInstance,
  message,
  Row,
  Upload,
  Select as AntdSelect,
  Table,
  Divider,
  Avatar,
  Modal,
  Radio,
  Space,
} from "antd";
import React, { useEffect, useState, memo, useMemo } from "react";
import { FlexCol, FlexRow } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import styled from "styled-components";
import color from "../../../resource/color";
import { CloseOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import DatePicker, { TimePicker } from "../../../components/DatePicker/DatePicker";
import TextArea from "../../../components/Input/TextArea";
import dayjs, { Dayjs } from "dayjs";
import { PromotionType, PROMOTION_TYPE_NAME } from "../../../definitions/promotion";
import { checkPromotionCode, getPromotion } from "../../../datasource/PromotionDatasource";
import TableContainer from "../../../components/Table/TableContainer";
import Button from "../../../components/Button/Button";
import { ProductEntity } from "../../../entities/PoductEntity";
import { AlignType } from "rc-table/lib/interface";
import { useRecoilValue, useSetRecoilState } from "recoil";
import productState from "../../../store/productList";
import {
  getProductCategory,
  getProductGroup,
  getProductList,
} from "../../../datasource/ProductDatasource";
import { priceFormatter } from "../../../utility/Formatter";

const Form = styled(AntdForm)`
  .table-form-item.ant-form-item {
    margin-bottom: 0px !important;
  }
`;

interface Props {
  form: FormInstance;
  isEditing?: boolean;
}

interface SearchProps {
  list: ProductEntity[];
  setList: any;
  onClose: any;
  withFreebies?: boolean;
  isReplacing?: string;
}

interface ProdNameProps {
  product: ProductEntity;
  size?: number;
}

const ProductName = ({ product, size }: ProdNameProps) => {
  return (
    <FlexRow align='center'>
      <div style={{ marginRight: 16 }}>
        <Avatar
          src={product.productImage || product.productFreebiesImage}
          size={size || 50}
          shape='square'
        />
      </div>
      <FlexCol>
        <Text level={5}>{product.productName}</Text>
        <Text level={5} color='Text3'>
          {product.commonName}
        </Text>
        <Text level={5} color='Text3'>
          {product.productGroup}
        </Text>
      </FlexCol>
    </FlexRow>
  );
};

const AddProduct = ({ list, setList, onClose, withFreebies, isReplacing }: SearchProps) => {
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

  const fetchProductList = async () => {
    const { data, count } = await getProductList({
      company,
      take: pageSize,
      productGroup: filter.productGroup,
      searchText: filter.searchText,
      productCategoryId: filter.productCategory,
      page,
    });
    const newData = data.map((d: ProductEntity) => ({ ...d, key: d.productId }));
    setProducts(newData);
    setProductCount(count);

    setProductList((oldList: any) => ({
      page,
      pageSize,
      count,
      data,
      allData: oldList?.data?.length > 0 ? oldList.data.concat(data) : data,
    }));
  };
  const fetchProduct = async () => {
    try {
      setLoading(true);
      await fetchProductList();

      if (!productGroups || !productGroups.length) {
        const { responseData } = await getProductGroup(company);
        setProductGroups(responseData);
      }

      if (!productCategories || !productCategories.length) {
        const categories = await getProductCategory(company);
        setProductCategories(categories);
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
      setList(products.filter((item) => selectedRowKeys.includes(item.productId)));
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
      setList(products.filter((item) => selectedProductId.includes(item.productId)));
    }
    onClose();
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
          <Col span={showFreebie === "true" ? 0 : 7}>
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
          <Col span={showFreebie === "true" ? 14 : 7}>
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
              <Button
                title='ล้างการค้นหา'
                typeButton='primary-light'
                onClick={() => {
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
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <TableContainer>
        <Table
          rowSelection={isSingleItem ? undefined : { type: "checkbox", ...rowSelection }}
          rowClassName={rowClassName}
          onRow={onRow}
          columns={columns}
          dataSource={showFreebie === "true" ? freebies : products}
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

export const CreatePriceListStep2 = ({ form, isEditing }: Props) => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const [items, setItems] = useState<ProductEntity[]>(form.getFieldValue("items") || []);
  const [showModal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!showModal);
  };

  const setProd = (list: ProductEntity[]) => {
    console.log(list);
    setItems(list);
    form.setFieldValue("items", list);
  };

  useEffect(() => {
    // fetchPromotion();
  }, []);

  const columns = [
    {
      title: "ชื่อสินค้า",
      dataIndex: "productName",
      render: (value: string, row: ProductEntity) => <ProductName product={row} />,
    },
    {
      title: "ขนาด",
      dataIndex: "packSize",
      render: (value: string, row: ProductEntity) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{value}</Text>
              <Text level={6} color='Text3'>
                {row.productCodeNAV}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "UNIT PRICE",
      dataIndex: "unitPrice",
      render: (value: string, row: ProductEntity) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{priceFormatter(value)}</Text>
              <Text level={6} color='Text3'>
                {row.saleUOM}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "PACK PRICE",
      dataIndex: "marketPrice",
      render: (value: string, row: ProductEntity) => {
        return {
          children: (
            <FlexCol>
              <Text level={5} color='primary' fontWeight={700}>
                {priceFormatter(value || "")}
              </Text>
              <Text level={6} color='Text3'>
                {row.saleUOM}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "TYPE",
      render: (value: string, row: ProductEntity) => {
        return (
          <Form.Item name={`${row.productId}-type`} initialValue={1} noStyle>
            <Radio.Group value={value}>
              <Space direction='vertical'>
                <Radio value={1}>เพิ่มราคา</Radio>
                <Radio value={-1}>ลดราคา</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        );
      },
    },
    {
      title: "SPECIAL PRICE",
      render: (value: string, row: ProductEntity) => {
        return (
          <Form.Item name={`${row.productId}-price`} initialValue={1} noStyle>
            <Input placeholder='ระบุราคา' suffix='บาท' />
          </Form.Item>
        );
      },
    },
    {
      title: "จัดการ",
      render: (value: string, row: ProductEntity) => {
        return (
          <div
            className='btn btn-icon btn-light btn-hover-primary btn-sm'
            // onClick={() => }
          >
            <span className='svg-icon svg-icon-primary svg-icon-2x'>
              <DeleteOutlined style={{ color: color["primary"] }} />
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Row gutter={16}>
        <Col span={9}>
          <Text level={4} fontWeight={700}>
            รายการสินค้าราคาพิเศษ
          </Text>
        </Col>
        <Col span={5}>
          <Input
            placeholder='ค้นหาสินค้า...'
            suffix={<SearchOutlined />}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={5}>
          <Select data={[]} placeholder='Product Group : ทั้งหมด' style={{ width: "100%" }} />
        </Col>
        <Col span={5}>
          <Button title='+ เพิ่มรายการสินค้าราคาพิเศษ' onClick={toggleModal} />
        </Col>
      </Row>
      <br />
      <TableContainer>
        <Form form={form}>
          <Table dataSource={items} columns={columns} pagination={false} />
        </Form>
      </TableContainer>
      <br />
      <Modal visible={showModal} width={"80vw"} closable={false} footer={null}>
        <Row align='middle' justify='space-between'>
          <Col span={20}>
            <FlexRow align='end'>
              <Text level={5} fontWeight={600}>
                เลือกสินค้า
              </Text>
              <Text level={6} color='Text3'>
                &nbsp;&nbsp;สามารถเลือกได้มากกว่า 1 สินค้า
              </Text>
            </FlexRow>
          </Col>
          <Col span={4}>
            <FlexRow justify='end'>
              <CloseOutlined onClick={toggleModal} />
            </FlexRow>
          </Col>
        </Row>
        <br />
        <AddProduct list={items} setList={setProd} onClose={toggleModal} />
      </Modal>
    </>
  );
};
