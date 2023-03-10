import React, { useEffect, useState, memo, useMemo } from "react";
import { Table, Tabs, Row, Col, Avatar, Tag, Switch, Modal, message } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { EditOutlined, DeleteOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import {
  getProductBrand,
  getProductCategory,
  getProductGroup,
} from "../../datasource/ProductDatasource";
import { nameFormatter, priceFormatter } from "../../utility/Formatter";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import Text from "../../components/Text/Text";
import { BrandEntity } from "../../entities/BrandEntity";
import { STATUS_COLOR_MAPPING } from "../../definitions/product";
import { useRecoilValue } from "recoil";
import { profileAtom } from "../../store/ProfileAtom";
import { ProductGroupEntity } from "../../entities/ProductGroupEntity";
import color from "../../resource/color";
import image from "../../resource/image";

type FixedType = "left" | "right" | boolean;
import * as _ from "lodash";
import {
  getProductFreebieGroup,
  getProductFreebies,
  syncProductFreebie,
} from "../../datasource/PromotionDatasource";
import { useNavigate } from "react-router-dom";
import Select from "../../components/Select/Select";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
const SLASH_DMY = "DD/MM/YYYY";

export const FreebieListPage: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };

  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState<string>();
  const [prodGroup, setProdGroup] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [loadingSyncProduct, setLoadingSyncProduct] = useState(false);
  const [dataState, setDataState] = useState({
    count: 0,
    count_status: [],
    data: [],
    groups: [],
  });

  useEffect(() => {
    if (!loading) fetchProduct();
  }, [keyword, prodGroup, statusFilter, page]);

  const resetPage = () => setPage(1);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, count, count_status } = await getProductFreebies({
        company,
        take: pageSize,
        productGroup: prodGroup,
        searchText: keyword,
        productFreebiesStatus: statusFilter,
        page,
      });

      const { responseData } = await getProductFreebieGroup(company);
      setDataState({
        data,
        count,
        count_status,
        groups: responseData,
      });
      console.log({
        company,
        prodGroup,
        keyword,
        statusFilter,
        page,
        data,
        count_status,
        count,
        responseData,
        userProfile,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onSyncProduct = async () => {
    Modal.confirm({
      title: "ยืนยันการเชื่อมต่อ Navision",
      onOk: async () => {
        setLoadingSyncProduct(true);
        await syncProductFreebie({ company })
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
      <Row gutter={16}>
        <Col className='gutter-row' span={12}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              รายการของแถม
            </span>
          </div>
        </Col>
        <Col className='gutter-row' span={4}>
          <Select
            defaultValue={prodGroup}
            style={style}
            allowClear
            onChange={(value: string) => {
              setProdGroup(value);
              resetPage();
            }}
            placeholder='หมวดของแถมทั้งหมด'
            data={dataState.groups.map((group: ProductGroupEntity) => ({
              key: group.product_group,
              label: group.product_group,
              value: group.product_group,
            }))}
          />
        </Col>
        <Col className='gutter-row' span={4}>
          <div style={style}>
            <Input
              placeholder='ค้นหาของแถม'
              prefix={<SearchOutlined style={{ color: "grey" }} />}
              defaultValue={keyword}
              onPressEnter={(e) => {
                const value = (e.target as HTMLTextAreaElement).value;
                setKeyword(value);
                resetPage();
              }}
              onChange={(e) => {
                const value = (e.target as HTMLTextAreaElement).value;
                if (!value) {
                  setKeyword("");
                  resetPage();
                }
              }}
            />
          </div>
        </Col>
        <Col className='gutter-row' span={4}>
          <Button title='เชื่อมต่อ Navision' icon={<SyncOutlined />} onClick={onSyncProduct} />
        </Col>
      </Row>
    );
  };

  const tabsItems = [
    {
      label: `ทั้งหมด(${
        dataState?.count_status?.reduce((prev, { count }) => prev + parseInt(count), 0) || 0
      })`,
      key: "ALL",
    },
    ...(
      dataState?.count_status?.map(({ product_freebies_status, count }) => ({
        label: nameFormatter(product_freebies_status) + `(${count})`,
        key: product_freebies_status,
      })) || []
    ).reverse(),
  ];

  const columns = [
    {
      title: "ชื่อของแถม",
      dataIndex: "commonName",
      key: "commonName",
      // width: "12%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexRow align='center'>
              <div style={{ marginRight: 16 }}>
                <Avatar
                  src={row.productFreebiesImage || image.product_no_image}
                  size={50}
                  shape='square'
                />
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
    // {
    //   title: "รหัสสินค้า",
    //   dataIndex: "productFreebiesCodeNAV",
    //   key: "productFreebiesCodeNAV",
    //   // width: "18%",
    //   render: (value: any, row: any, index: number) => {
    //     return {
    //       children: (
    //         <FlexCol>
    //           <Text level={5}>{value}</Text>
    //         </FlexCol>
    //       ),
    //     };
    //   },
    // },
    {
      title: "หมวด",
      dataIndex: "productGroup",
      key: "productGroup",
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
      title: "สถานะ",
      dataIndex: "productFreebiesStatus",
      key: "productFreebiesStatus",
      // width: "15%",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Tag color={STATUS_COLOR_MAPPING[value]}>{nameFormatter(value)}</Tag>,
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
                  onClick={() => navigate("/PromotionPage/freebies/edit/" + row.productFreebiesId)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <EditOutlined style={{ color: color["primary"] }} />
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
    <>
      <div className='container '>
        <CardContainer>
          <PageTitle />
          <br />
          <Tabs
            items={tabsItems}
            onChange={(key: string) => {
              setStatusFilter(key === "ALL" ? undefined : key);
              resetPage();
            }}
          />
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
