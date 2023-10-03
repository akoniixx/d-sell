import { Col, Divider, Row, Button, Table, Avatar, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import { CardContainer } from "../../components/Card/CardContainer";
import Descriptions from "../../components/Description/Descriptions";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import { color } from "../../resource";
import Text from "../../components/Text/Text";
import Select from "../../components/Select/Select";
import { EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Input from "../../components/Input/Input";
import TableContainer from "../../components/Table/TableContainer";
import image from "../../resource/image";
import Buttons from "../../components/Button/Button";
import { ModalSelectedProduct } from "../Shared/ModalSelecteProduct";
import { ProductEntity } from "../../entities/PoductEntity";
import { ProductGroupEntity } from "../../entities/ProductGroupEntity";

export const ProductShopDetail: React.FC = () => {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [showModalProd, setShowModalProd] = useState<boolean>(false);
  const [selectedProd, setSelectedProd] = useState<ProductEntity[]>([]);
  const [searchProd, setSearchProd] = useState<ProductEntity[]>([]);
  const [productGroup, setProductGroup] = useState<ProductGroupEntity[]>([]);

  const [selectedStoreKeys, setSelectedStoreKeys] = useState<React.Key[]>([]);
  //const [selectedStoreList, setSelectedStoreList] = useState<StoreEntity[]>([]);

  const mockData = [
    {
      img: image.product_no_image,
      name: "ไซม๊อกซิเมท",
      packing: "40*500 cc",
      commonName: "CYMOXANIL+MANCOZEB 8%+64% WP",
      group: "Expand",
    },
    {
      img: image.product_no_image,
      name: "ไซม๊อกซิเมท",
      packing: "40*500 cc",
      commonName: "CYMOXANIL+MANCOZEB 8%+64% WP",
      group: "Expand",
    },
    {
      img: image.product_no_image,
      name: "ไซม๊อกซิเมท",
      packing: "40*500 cc",
      commonName: "CYMOXANIL+MANCOZEB 8%+64% WP",
      group: "Expand",
    },
  ];
  const callBackProduct = (item: ProductEntity[]) => {
    item = item.map((p: any) => ({ ...p, isChecked: false }));
    setSelectedProd(item);
    setSearchProd(item);
  };

  const detail = () => {
    return (
      <div
        style={{
          width: "100%",
          backgroundColor: color.background1,
          border: "1px solid",
          borderColor: color.background2,
          borderRadius: "8px",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <Row justify={"space-between"}>
          <Col span={12}>
            <Descriptions label='ชื่อร้านค้า' value='หจก.พืชสิน (จ.อุตรดิตถ์)' />
          </Col>
          <Col span={12}>
            <Descriptions label='ชื่อสมาชิก' value='คุณวรนิษฐ พิศักดิ์ศิร' />
          </Col>
        </Row>
        <Row justify={"space-between"}>
          <Col span={12}>
            <Descriptions label='รหัสสมาชิก' value='11009388577' />
          </Col>
          <Col span={12}>
            <Descriptions label='เขต' value='A01' />
          </Col>
        </Row>
      </div>
    );
  };
  const product = () => {
    return (
      <CardContainer>
        <Row justify={"space-between"} gutter={8}>
          <Col span={11}>
            <Text fontWeight={700}>รายการสินค้า</Text>
          </Col>
          <Col span={5}>
            <Select
              allowClear
              placeholder='Product Group : ทั้งหมด'
              data={[]}
              style={{ width: "100%" }}
              //onChange={(e) => searchApp(e)}
            />
          </Col>
          <Col span={5}>
            <Input
              placeholder='ค้นหาสินค้า...'
              suffix={<SearchOutlined style={{ color: "grey" }} />}
              //onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col span={3}>
            {!isEdit && (
              <Button type='primary' style={{ height: "38px" }} onClick={() => setIsEdit(true)}>
                <EditOutlined />
                แก้ไขสินค้า
              </Button>
            )}

            {isEdit && (
              <Button
                type='primary'
                style={{ height: "38px" }}
                onClick={() => setShowModalProd(!showModalProd)}
              >
                <PlusOutlined />
                เพิ่มสินค้า
              </Button>
            )}
          </Col>
        </Row>
        <br />
        <TableContainer>
          <Table
            scroll={{ y: 480 }}
            columns={isEdit ? columns : columns.filter((x: any) => x.dataIndex !== "index")}
            dataSource={mockData}
            pagination={false}
          />
        </TableContainer>
        <Divider />
        {isEdit && (
          <Row justify='space-between' gutter={12}>
            <Col xl={3} sm={6}></Col>
            <Col xl={18} sm={12}></Col>
            <Col xl={3} sm={6}>
              <Buttons typeButton='primary' title='บันทึก' />
            </Col>
          </Row>
        )}
      </CardContainer>
    );
  };

  const columns: any = [
    {
      title: isEdit && (
        <Checkbox
          //onClick={(e) => handleAllCheckBoxDelete(e)}
          checked={selectedProd.every((x) => x.isChecked)}
        />
      ),
      width: "5%",
      dataIndex: "index",
      render: (text: string, value: any) => (
        <Checkbox
          checked={value.isChecked}
          //onClick={(e) => handleCheckBoxDelete(e, value.productId)}
        />
      ),
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "name",
      key: "customerNo",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row gutter={8}>
              <Col>
                <Avatar src={row.img} size={70} shape='square' onError={() => false} />
              </Col>
              <Col>
                <Text>{row.name}</Text>
                <br />
                <Text level={6}>{row.commonName}</Text>
                <br />
                <Text level={6} color='Text3'>
                  Stragery Group : {row.group}
                </Text>
              </Col>
            </Row>
          ),
        };
      },
    },
    {
      title: "",
      dataIndex: "packing",
      key: "packing",
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
  ];

  return (
    <>
      <CardContainer>
        <PageTitleNested
          title='รายละเอียดร้านค้า'
          showBack
          onBack={() => navigate(`/productshop/list`)}
          customBreadCrumb={
            <BreadCrumb
              data={[
                { text: "สินค้าขายเฉพาะร้าน", path: `/productshop/list` },
                { text: "รายละเอียดร้านค้า", path: window.location.pathname },
              ]}
            />
          }
        />
        <Divider />
        {detail()}
      </CardContainer>
      <br />
      {product()}
      {showModalProd && (
        <ModalSelectedProduct
          prodSelected={selectedProd}
          company={company}
          showModalProd={showModalProd}
          onClose={() => setShowModalProd(!showModalProd)}
          productGroup={productGroup}
          callBackProduct={callBackProduct}
        />
      )}
    </>
  );
};
