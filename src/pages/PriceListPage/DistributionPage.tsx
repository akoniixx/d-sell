import React, { useEffect, useState } from "react";
import { Table, Tabs, Row, Col, Avatar, Tag, Modal, message } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { UnorderedListOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import {
  getProductBrand,
  getProductCategory,
  getProductGroup,
  getProductList,
  syncProduct,
} from "../../datasource/ProductDatasource";
import { nameFormatter, priceFormatter } from "../../utility/Formatter";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import Text from "../../components/Text/Text";
import { BrandEntity } from "../../entities/BrandEntity";
import { LOCATION_FULLNAME_MAPPING } from "../../definitions/location";
import { STATUS_COLOR_MAPPING } from "../../definitions/product";
import { ProductGroupEntity } from "../../entities/ProductGroupEntity";
import color from "../../resource/color";
import image from "../../resource/image";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Button from "../../components/Button/Button";
import { getBrandByCompany } from "../../datasource/BrandDatasource";

type FixedType = "left" | "right" | boolean;
const SLASH_DMY = "DD/MM/YYYY";

export const DistributionPage: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };

  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState<string>();
  const [prodGroup, setProdGroup] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [loadingSyncProduct, setLoadingSyncProduct] = useState(false);
  const [dataState, setDataState] = useState({
    count: 0,
    count_location: [],
    data: [],
    groups: [],
    categories: [],
    brands: [],
  });
  const [brand, setBrand] = useState<string>();
  const [dataBrand, setDataBrand] = useState<BrandEntity[]>([]);

  useEffect(() => {
    if (!loading) fetchProduct();
    fetchBrand();
  }, [keyword, prodGroup, location, page, brand]);

  const resetPage = () => setPage(1);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, count, count_location } = await getProductList({
        company,
        take: pageSize,
        productGroup: prodGroup,
        searchText: keyword,
        productLocation: location,
        page,
        productBrandId: brand,
      });

      const { responseData } = await getProductGroup(company);
      const brands = await getProductBrand(company);
      const categories = await getProductCategory(company);
      setDataState({
        data,
        count,
        count_location,
        groups: responseData,
        brands,
        categories,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const fetchBrand = () => {
    getBrandByCompany(company).then((res) => {
      setDataBrand(res);
    });
  };

  const onSyncProduct = async () => {
    Modal.confirm({
      title: "ยืนยันการเชื่อมต่อ Navision",
      onOk: async () => {
        setLoadingSyncProduct(true);
        await syncProduct({ company })
          .then((res) => {
            const { success } = res;
            if (success) {
              navigate(0);
            } else {
              message.error("เชื่อมต่อ Navision ไม่สำเร็จ");
            }
          })
          .catch((err) => console.log("err", err))
          .finally(() => console.log("sync product done"));
      },
    });
  };

  const PageTitle = () => {
    return (
      <Row>
        <Col className='gutter-row' span={8}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              รายการสินค้า
            </span>
          </div>
        </Col>
        <Col className='gutter-row' span={4}>
          <div style={style}>
            <Input
              placeholder='ค้นหาชื่อสินค้า'
              prefix={<SearchOutlined style={{ color: "grey" }} />}
              defaultValue={keyword}
              onPressEnter={(e) => {
                const value = (e.target as HTMLTextAreaElement).value;
                setKeyword(value);
                resetPage();
              }}
              onChange={(e) => {
                const value = (e.target as HTMLInputElement).value;
                if (!value) {
                  setKeyword("");
                  resetPage();
                }
              }}
            />
          </div>
        </Col>
        {dataBrand.length && (
          <Col className='gutter-row' span={4}>
            <Select
              defaultValue={brand}
              style={style}
              allowClear
              onChange={(value: string) => {
                setBrand(value);
                resetPage();
              }}
              placeholder='เลือกยี่ห้อสินค้า'
              data={dataBrand?.map((item: any) => ({
                key: item.productBrandId,
                label: item.productBrandName,
                value: item.productBrandId,
              }))}
            />
          </Col>
        )}

        <Col className='gutter-row' span={4}>
          <Select
            defaultValue={prodGroup}
            style={style}
            allowClear
            onChange={(value: string) => {
              setProdGroup(value);
              resetPage();
            }}
            placeholder='เลือกกลุ่มสินค้า'
            data={dataState.groups.map((group: ProductGroupEntity) => ({
              key: group.product_group,
              label: group.product_group,
              value: group.product_group,
            }))}
          />
        </Col>
        <Col className='gutter-row' span={4}>
          <Button
            title='เชื่อมต่อ Navision'
            icon={<SyncOutlined />}
            onClick={onSyncProduct}
            loading={loadingSyncProduct}
          />
        </Col>
      </Row>
    );
  };

  const tabsItems = [
    { label: "ทั้งหมด", key: "ALL" },
    ...(dataState?.count_location?.map(({ product_location, count }) => ({
      key: `${product_location}`,
      label: (LOCATION_FULLNAME_MAPPING[`${product_location}`] || "- ") + ` (${count})`,
    })) || []),
  ];

  const columns = [
    {
      title: "ชื่อสินค้า",
      dataIndex: "commonName",
      key: "commonName",
      // width: "12%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexRow align='center'>
              <div style={{ marginRight: 16 }}>
                <Avatar src={row.productImage || image.product_no_image} size={50} shape='square' />
              </div>
              <FlexCol>
                <Text level={5}>{row.productName}</Text>
                <Text level={6} color='Text3'>
                  {value}
                </Text>
              </FlexCol>
            </FlexRow>
          ),
        };
      },
    },
    {
      title: "ขนาด",
      dataIndex: "packSize",
      key: "packSize",
      // width: "18%",
      render: (value: any, row: any, index: number) => {
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
      title: "หมวดสินค้า",
      dataIndex: "productCategoryId",
      key: "productCategoryId",
      width: "124px",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>
                {(dataState?.categories?.find((c: any) => c.productCategoryId === value) as any)
                  ?.productCategoryName || "-"}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "กลุ่มสินค้า",
      dataIndex: "productGroup",
      key: "productGroup",
      width: "132px",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{value}</Text>
              <Text level={6} color='Text3'>
                {row.productStrategy}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "Product Brands",
      dataIndex: "productBrandId",
      key: "productBrandId",
      width: "180px",
      // width: "15%",
      render: (value: any, row: any, index: number) => {
        const brand: BrandEntity =
          dataState?.brands?.find((d: BrandEntity) => value === d.productBrandId) || null!;
        return {
          children: (
            <FlexCol>
              <Text level={5}>{brand.productBrandName}</Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "โรงงาน",
      dataIndex: "productLocation",
      key: "productLocation",
      // width: "13%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{LOCATION_FULLNAME_MAPPING[value] || "-"}</Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "ราคา / หน่วย",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: "132px",
      fixed: "right" as FixedType | undefined,
      render: (value: any, row: any, index: number) => {
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
      title: "สถานะ",
      dataIndex: "productStatus",
      key: "productStatus",
      fixed: "right" as FixedType | undefined,
      render: (value: any, row: any, index: number) => {
        return {
          children: <Tag color={STATUS_COLOR_MAPPING[value]}>{nameFormatter(value)}</Tag>,
        };
      },
    },
    {
      title: "ราคาขาย",
      dataIndex: "marketPrice",
      key: "marketPrice",
      width: "136px",
      fixed: "right" as FixedType | undefined,
      render: (value: any, row: any, index: number) => {
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
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      width: "5%",
      fixed: "right" as FixedType | undefined,
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <div className='d-flex flex-row justify-content-between'>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() => navigate("/PriceListPage/DistributionPage/" + row.productId)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <UnorderedListOutlined style={{ color: color["primary"] }} />
                  </span>
                </div>
              </div>
            </>
          ),
        };
      },
    },
  ];

  const changeTeb = (key: string) => {
    setLocation(key === "ALL" ? undefined : `${key}`);
    resetPage();
  };

  return (
    <>
      <div className='container '>
        <CardContainer>
          <PageTitle />
          <br />
          <Tabs items={tabsItems} onChange={changeTeb} />
          <Table
            className='rounded-lg'
            columns={columns}
            scroll={{ x: "max-content" }}
            dataSource={dataState?.data?.map((d: object, i) => ({ ...d, key: i }))}
            pagination={{
              position: ["bottomCenter"],
              pageSize,
              current: page,
              total: dataState?.count,
              onChange: (p) => setPage(p),
              showSizeChanger: false,
            }}
            loading={loading}
            size='large'
            tableLayout='fixed'
          />
        </CardContainer>
      </div>
    </>
  );
};
