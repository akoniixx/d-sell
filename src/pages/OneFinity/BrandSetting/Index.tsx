import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Col, Image, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { CardContainer } from "../../../components/Card/CardContainer";
import Permission from "../../../components/Permission/Permission";
import Button from "../../../components/Button/Button";
import Text from "../../../components/Text/Text";
import Input from "../../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { dateFormatter } from "../../../utility/Formatter";
import { color } from "../../../resource";
import { getBrandSetting } from "../../../datasource/OneFinity/BrandSettingDatasource";
import Select from "../../../components/Select/Select";
import image from "../../../resource/image";

export const IndexBrandSetting: React.FC = () => {
  const navigate = useNavigate();
  const [dataState, setDataState] = useState<{ count: number; data: any[] }>({
    count: 0,
    data: [],
  });
  const pageSize = 8;
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isActive, setIsActive] = useState<any>("");

  const getBrandList = async () => {
    await getBrandSetting({
      page,
      take: pageSize,
      search,
      isActive,
      sortField: "updatedAt",
      sortDirection: "DESC",
    }).then((res) => {
      console.log(res.responseData);
      setDataState({ count: res.responseData.count || 0, data: res.responseData.data });
    });
  };

  useEffect(() => {
    getBrandList();
  }, [search, isActive]);

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
      <Col span={3}>
        <Text level={3} fontWeight={700}>
          แบรนด์สินค้า
        </Text>
      </Col>
      <Col span={15}>
        <Input
          placeholder='ค้นหาชื่อแบรนด์สินค้า'
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
      <Permission permission={["oneFinity", "create"]}>
        <Col className='gutter-row' span={3}>
          <Button
            type='primary'
            title='+ เพิ่มแบรนด์สินค้า'
            height={40}
            onClick={() => navigate("/oneFinity/createBrandSetting/create")}
          />
        </Col>
      </Permission>
    </Row>
  );

  const columns: any = [
    {
      title: "ยี่ห้อ/แบรนด์สินค้า",
      dataIndex: "productBrandName",
      key: "productBrandName",
      width: "60%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"space-between"}>
              <Col span={4}>
                <Image
                  src={row?.productBrandLogo || image.emptyProductBrand}
                  height={60}
                  width={60}
                  style={{ borderRadius: "100px", objectFit: "cover" }}
                />
              </Col>
              <Col span={20}>
                <Text>{value}</Text>
              </Col>
            </Row>
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
                style={{ backgroundColor: value ? color.success : color.Grey }}
              />
            </Row>
          ),
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
              <Text level={5}>{dateFormatter(row?.updatedAt || row.createAt, true)}</Text>
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
                onClick={() => navigate(`/oneFinity/createBrandSetting/${row.productBrandId}`)}
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
        dataSource={dataState?.data || []}
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
};
