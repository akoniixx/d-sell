import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Col, ConfigProvider, Image, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../../components/Text/Text";
import Button from "../../../components/Button/Button";
import Select from "../../../components/Select/Select";
import { color, image } from "../../../resource";
import { dateFormatter } from "../../../utility/Formatter";
import { CardContainer } from "../../../components/Card/CardContainer";
import Input from "../../../components/Input/Input";
import { getProductBrandEx } from "../../../datasource/ProductDatasource";
import { payloadProductBrand, productBrandEx } from "../../../entities/ProductBrandEntity";

export const ProductBrandSettingPage: React.FC = () => {
  const navigate = useNavigate();
  const [dataState, setDataState] = useState<{ count: number; data: any[] }>({
    count: 0,
    data: [],
  });
  const [productList,setProductList] = useState<{ count:number,data:productBrandEx[]}>({
    count:0,
    data: []
  })
  const pageSize = 8;
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isActive, setIsActive] = useState<null|boolean>();

  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const getProductBrandList = async(page:number,
    take:number,
    search?:string,
    isActive?:null|boolean) => {
    const payload:payloadProductBrand = {
        page: page,
        take: take,
        sortField: "updatedAt",
        sortDirection: 'DESC',
        search:search,
        company:company,
        isActive:isActive
    }
  
   const res = await getProductBrandEx(payload)
   setProductList({count: res.responseData.count||0, data: res.responseData.data })
  
  }

useEffect(()=>{
    getProductBrandList(page,pageSize,search,isActive)
},[search, isActive, page])

  

  const PageTitle = (
    <>
      <Row align='middle' gutter={16}>
        <Col span={3}>
          <Text level={3} fontWeight={700}>
            แบรนด์สินค้า
          </Text>
        </Col>
      </Row>
      <br />
      <Row justify={"space-between"} gutter={8}>
        <Col span={18}>
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
              setPage(1);
              setIsActive(e);
            }}
          />
        </Col>
        <Col className='gutter-row' span={3}>
          <Button
            type='primary'
            title='+ เพิ่มแบรนด์สินค้า'
            height={40}
            onClick={() => navigate("/generalSettings/createBrandSetting/create")}
          />
        </Col>
      </Row>
    </>
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
                style={{ backgroundColor: value ? color.success : color.Disable }}
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
              <Col span={6}>
                <Button
                  onClick={() => navigate(`/generalSettings/createBrandSetting/${row.productBrandId}`)}
                  /* typeButton='icon' */
                  icon={<EditOutlined />}
                  style={{ padding: "12px" }}
                />
              </Col>
            </Row>
          ),
        };
      },
    },
  ];

  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center", padding: "10%" }}>
      <Image src={image.emptyTableBrand} preview={false} style={{ width: 70, height: 70 }} />
      <br />
      <Text color='Text3'>ไม่มีรายการแบรนด์สินค้า</Text>
    </div>
  );

  return (
    <CardContainer>
      {PageTitle}
      <br />
      <ConfigProvider renderEmpty={customizeRenderEmpty}>
        <Table
          columns={columns}
          dataSource={productList?.data || []}
          pagination={{
            position: ["bottomCenter"],
            pageSize,
            current: page,
            total: productList.count,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
          }}
        />
      </ConfigProvider>
    </CardContainer>
  );
};
