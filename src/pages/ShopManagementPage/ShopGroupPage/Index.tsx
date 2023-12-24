import { Badge, Col, Row, Table } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { CardContainer } from "../../../components/Card/CardContainer";
import Permission from "../../../components/Permission/Permission";
import Text from "../../../components/Text/Text";
import Input from "../../../components/Input/Input";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import { color } from "../../../resource";
import { dateFormatter } from "../../../utility/Formatter";
import { getShopGroup } from "../../../datasource/ShopGroupDatasoure";

export function IndexShopGroup() {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const [dataState, setDataState] = useState<{ count: number; data: any[] }>({
    count: 0,
    data: [],
  });
  const pageSize = 8;
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isActive, setIsActive] = useState<any>("");

  const getShopGroupList = async () => {
    await getShopGroup({
      company,
      take: pageSize,
      page,
      search,
      isActive,
      sortField: "updateDate",
      sortDirection: "DESC",
    }).then((res) => {
      setDataState({ count: res.responseData.count, data: res.responseData.data });
    });
  };

  useEffect(() => {
    getShopGroupList();
  }, [page, search, isActive]);

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
          รายชื่อกลุ่มร้านค้า
        </Text>
      </Col>
      <Col span={5}>
        <Input
          placeholder='ค้นหาชื่อกลุ่มร้านค้า'
          prefix={<SearchOutlined style={{ color: "grey" }} />}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete='off'
        />
      </Col>
      <Col span={3}>
        <Select
          allowClear
          placeholder='สถานะทั้งหมด'
          data={[
            { key: true, value: true, label: "เปิดใช้งาน" },
            { key: false, value: false, label: "ปิดใช้งาน" },
          ]}
          style={{ width: "100%" }}
          onChange={(e) => {
            setIsActive(e);
          }}
        />
      </Col>
      <Permission permission={["shopGroup", "create"]}>
        <Col className='gutter-row' span={3}>
          <Button
            type='primary'
            title='+ เพิ่มกลุ่มร้านค้า'
            height={40}
            onClick={() => navigate("/ShopManagementPage/createShopGroup/create")}
          />
        </Col>
      </Permission>
    </Row>
  );

  const columns: any = [
    {
      title: "ลำดับ",
      dataIndex: "no",
      key: "no",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Text>{index + 1}</Text>,
        };
      },
    },
    {
      title: "ชื่อกลุ่ม",
      dataIndex: "customerGroupName",
      key: "customerGroupName",
      width: "30%",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Text>{value}</Text>,
        };
      },
    },
    {
      title: "จำนวนร้านค้า",
      dataIndex: "totalShop",
      key: "totalShop",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Text>{value} ร้าน</Text>,
        };
      },
    },
    {
      title: "อัพเดทโดย",
      dataIndex: "updateBy",
      key: "updateBy",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <Text level={5}>{dateFormatter(row?.updateDate || row.createDate, true)}</Text>
              <br />
              <Text level={6} color='Text3'>
                {value ? value : row.updateBy || row.createBy}
              </Text>
            </>
          ),
        };
      },
    },
    {
      title: "สถานะ",
      dataIndex: "isActive",
      key: "isActive",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"start"} gutter={8}>
              <Badge
                count={value ? "เปิดใช้งาน" : "ปิดการใช้งาน"}
                style={{ backgroundColor: value ? color.success : color.Disable }}
              />
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
      width: "12%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"start"} gutter={8}>
              <ActionBtn
                onClick={() =>
                  navigate(`/ShopManagementPage/CreateShopGroup/${row.customerGroupId}`)
                }
                icon={<EditOutlined />}
              />
            </Row>
          ),
        };
      },
    },
  ];

  return (
    <CardContainer>
      {PageTitle}
      <br />
      <Table
        columns={columns}
        dataSource={dataState.data || []}
        pagination={{
          position: ["bottomCenter"],
          pageSize,
          current: page,
          total: dataState.count,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
      />
    </CardContainer>
  );
}
