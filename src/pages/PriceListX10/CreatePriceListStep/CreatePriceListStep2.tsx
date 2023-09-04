import {
  Col,
  Form as AntdForm,
  FormInstance,
  Row,
  Select as AntdSelect,
  Table,
  Modal,
  Radio,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { FlexCol } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import styled from "styled-components";
import color from "../../../resource/color";
import { DeleteOutlined } from "@ant-design/icons";
import Input from "../../../components/Input/Input";
import TableContainer from "../../../components/Table/TableContainer";
import Button from "../../../components/Button/Button";
import { ProductEntity } from "../../../entities/PoductEntity";
import { AlignType } from "rc-table/lib/interface";
import { priceFormatter } from "../../../utility/Formatter";
import AddProduct, { ProductName } from "../../Shared/AddProduct";

const Form = styled(AntdForm)`
  .table-form-item.ant-form-item {
    margin-bottom: 0px !important;
  }
`;

interface Props {
  form: FormInstance;
  isEditing?: boolean;
}

export const CreatePriceListStep2 = ({ form, isEditing }: Props) => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const [items, setItems] = useState<ProductEntity[]>(form.getFieldValue("items") || []);
  const [showModal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!showModal);
  };

  const setProd = (list: ProductEntity[]) => {
    const newList = [...items, ...list];
    console.log("newList", newList);
    setItems(newList);
    form.setFieldValue("items", newList);
  };

  useEffect(() => {
    // fetchPromotion();
  }, []);

  const columns = [
    {
      title: "ชื่อสินค้า",
      dataIndex: "productName",
      ellipsis: true,
      render: (value: string, row: ProductEntity) => (
        <ProductName product={row} showLocation={true} />
      ),
    },
    {
      title: "ขนาด",
      dataIndex: "packSize",
      ellipsis: true,
      width: 144,
      render: (value: string, row: ProductEntity) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{value}</Text>
              <Text level={6} color='Text3'>
                {row.saleUOMTH || " "}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "UNIT PRICE",
      dataIndex: "unitPrice",
      ellipsis: true,
      width: 144,
      render: (value: string, row: ProductEntity) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{priceFormatter(value)}</Text>
              <Text level={6} color='Text3'>
                {row.baseUOM || "Unit"}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "PACK PRICE",
      dataIndex: "marketPrice",
      ellipsis: true,
      width: 148,
      render: (value: string, row: ProductEntity) => {
        return {
          children: (
            <FlexCol>
              <Text level={5} color='primary' fontWeight={700}>
                {priceFormatter(value || "")}
              </Text>
              <Text level={6} color='Text3'>
                {row.saleUOMTH || row.saleUOM}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "TYPE",
      width: 126,
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
      width: 192,
      render: (value: string, row: ProductEntity) => {
        return (
          <Form.Item
            name={`${row.productId}-price`}
            initialValue={1}
            // noStyle
            rules={[
              {
                validator: (rule, value, callback) => {
                  if (!Number.isInteger(parseFloat(value))) {
                    return Promise.reject("โปรดระบุเป็นจำนวนเต็มเท่านั้น");
                  }
                  if (parseFloat(value) <= 0) {
                    return Promise.reject("ราคาต้องมากกว่า 0 โปรดระบุใหม่");
                  }
                  const type = form.getFieldValue(`${row.productId}-type`);
                  if (type === -1 && parseFloat(value) > parseFloat(row.marketPrice || "")) {
                    return Promise.reject("ส่วนลดมากกว่าราคาขาย โปรดระบุใหม่");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder='ระบุราคา' suffix='บาท' style={{ width: 160 }} type='number' />
          </Form.Item>
        );
      },
    },
    {
      title: "จัดการ",
      width: 80,
      align: "center" as AlignType,
      render: (value: string, row: ProductEntity) => {
        return (
          <div
            className='btn btn-icon btn-light btn-hover-primary btn-sm'
            onClick={() =>
              Modal.confirm({
                title: "ต้องการลบราคาสินค้าพิเศษนี้",
                okText: "ยืนยัน",
                cancelText: "ยกเลิก",
                onOk: () => {
                  setProd(items.filter((e) => e.productId !== row.productId));
                },
              })
            }
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
          {/* <Input
            placeholder='ค้นหาสินค้า...'
            suffix={<SearchOutlined />}
            style={{ width: "100%" }}
          /> */}
        </Col>
        <Col span={5}>
          {/* <Select data={[]} placeholder='Product Group : ทั้งหมด' style={{ width: "100%" }} /> */}
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
        <AddProduct list={items} setList={setProd} onClose={toggleModal} />
      </Modal>
    </>
  );
};
