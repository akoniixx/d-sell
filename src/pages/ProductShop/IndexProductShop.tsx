import { Col, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { CardContainer } from "../../components/Card/CardContainer";
import Text from "../../components/Text/Text";
import Input from "../../components/Input/Input";
import { EditOutlined, SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import Select from "../../components/Select/Select";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { dateFormatter } from "../../utility/Formatter";
import { color } from "../../resource";
import { getProductShop } from "../../datasource/ProductShopDatasource";
import { ProductShopList } from "../../entities/ProductShopEntity";

export const IndexProductShop: React.FC = () => {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const take = 10;

  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<ProductShopList>();

  const getShopList = async () => {
    await getProductShop({ company }).then((res) => {
      console.log("res", res);
      setData(res.data);
    });
  };

  useEffect(() => {
    getShopList();
  }, [page]);

  const ActionBtn = ({ onClick, icon }: any) => {
    return (
      <Col span={6}>
        <div className='btn btn-icon btn-light btn-hover-primary btn-sm' onClick={onClick}>
          <span
            className='svg-icon svg-icon-primary svg-icon-2x'
            style={{ color: color["primary"] }}
          >
            {icon}
          </span>
        </div>
      </Col>
    );
  };

  const PageTitle = (
    <Row align='middle' gutter={16}>
      <Col span={13}>
        <Text level={3} fontWeight={700}>
          สินค้าขายเฉพาะร้าน
        </Text>
      </Col>
      <Col span={6}>
        <Input
          placeholder='ค้นหาร้านค้า...'
          suffix={<SearchOutlined style={{ color: "grey" }} />}
          //onChange={(e) => setSearch(e.target.value)}
        />
      </Col>
      <Col span={5}>
        <Select
          allowClear
          placeholder='เขต'
          data={[]}
          style={{ width: "100%" }}
          //onChange={(e) => searchApp(e)}
        />
      </Col>
    </Row>
  );
  const columns: any = [
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
      width: "40%",
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
    {
      title: "จำนวนสินค้า",
      dataIndex: "totalProduct",
      key: "totalProduct",
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
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"start"} gutter={8}>
              <ActionBtn
                onClick={() => {
                  navigate(`/productshop/detail`);
                }}
                icon={<UnorderedListOutlined />}
              />
            </Row>
          ),
        };
      },
    },
  ];

  return (
    <CardContainer>
      {PageTitle} <br />
      <Table
        className='rounded-lg'
        columns={columns}
        //scroll={{ x: 1300 }}
        dataSource={data?.data}
        size='large'
        tableLayout='fixed'
        pagination={{
          position: ["bottomCenter"],
          pageSize: take,
          current: page,
          total: data?.count,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
      />
    </CardContainer>
  );
};
