import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, Col, Divider, Form, FormInstance, Modal, Row, Table, Tabs, Tooltip } from "antd";
import { FlexCol, FlexRow, ScrollContainer } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import Input from "../../../components/Input/Input";
import Collapse from "../../../components/Collapse/collapse";
import color from "../../../resource/color";
import image from "../../../resource/image";
import { PromotionType } from "../../../definitions/promotion";
import { CloseOutlined } from "@ant-design/icons";
import { ProductEntity } from "../../../entities/PoductEntity";
import { ProductName } from "../../Shared/AddProduct";
import { AlignType } from "rc-table/lib/interface";
import { LOCATION_FULLNAME_MAPPING } from "../../../definitions/location";
import TableContainer from "../../../components/Table/TableContainer";
import Button from "../../../components/Button/Button";
import { useForm } from "antd/lib/form/Form";
import { CollapsePanelAddBtn, CollapsePanelItem } from "./PromotionCreateStep3";

const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    width: calc(44vw - 26px);
    font-size: 14px;
    font-weight: 700;
    font-family: "IBM Plex Sans Thai";

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: default;
  }
`;

interface Props {
  open: boolean;
  setOpen: (a: boolean) => void;
  items: ProductEntity[];
  form: FormInstance;
  promotionType: PromotionType;
}

export const PromotionCreateStep3Dupplicate = ({
  open,
  setOpen,
  items,
  form,
  promotionType,
}: Props) => {
  const TAB_KEY_1 = "TAB1";
  const TAB_KEY_2 = "TAB2";
  const [activeTabKey, setActiveTabKey] = useState<string>(TAB_KEY_1);

  const [selectedItemKeys, setSelectedItemKeys] = useState<React.Key[]>([]);
  const [selectedItems, setSelectedItems] = useState<ProductEntity[]>();
  const [condition, setConditions] = useState<any[]>();

  const [innerForm] = useForm();

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: ProductEntity[]) => {
      setSelectedItemKeys(selectedRowKeys);
      setSelectedItems(selectedRows);
    },
    getCheckboxProps: (record: ProductEntity) => ({
      name: record.productId,
    }),
    selectedRowKeys: selectedItemKeys,
  };

  const productTableColumns = [
    {
      title: "สินค้าทั้งหมด",
      dataIndex: "productName",
      render: (value: string, row: ProductEntity) => <ProductName product={row} />,
    },
    {
      title: `${items.length} สินค้า`,
      dataIndex: "packSize",
      align: "right" as AlignType,
      render: (value: string, row: ProductEntity) => (
        <FlexCol align='end' justify='space-around'>
          <Text>{value}</Text>
          <br />
          {row.productLocation && (
            <Text level={6} color='Text3'>
              {LOCATION_FULLNAME_MAPPING[row.productLocation]}
            </Text>
          )}
        </FlexCol>
      ),
    },
  ];

  const tabItems = [
    {
      label: `1. เลือกรายการสินค้า (4 สินค้า)`,
      key: TAB_KEY_1,
      children: (
        <>
          <TableContainer>
            <Table
              dataSource={items.map((e, i) => ({ ...e, key: e.productId }))}
              columns={productTableColumns}
              pagination={false}
              scroll={{ y: 360 }}
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
            />
          </TableContainer>
        </>
      ),
    },
    {
      label: `2. ตั้งค่าเงื่อนไข`,
      key: TAB_KEY_2,
      children: (
        <>
          <ScrollContainer height={420} scrollableY>
            <Form layout='vertical' form={innerForm}>
              <Form.List name={"key"}>
                {(fields, { add, remove }) => {
                  const onAdd = () => add();
                  const onRemove = (name: number) => remove(name);
                  return (
                    <>
                      {fields.map(({ key, name, ...restField }, i) => {
                        return (
                          <>
                            <CollapsePanelItem
                              key={key}
                              fieldKey={key}
                              restField={restField}
                              form={innerForm}
                              currentKey={"key"}
                              promotionType={promotionType}
                              name={name}
                              i={i}
                              onRemove={onRemove}
                            />
                            {promotionType !== PromotionType.FREEBIES_NOT_MIX && <Divider />}
                          </>
                        );
                      })}
                      <Form.Item>
                        <CollapsePanelAddBtn onClick={onAdd} />
                      </Form.Item>
                    </>
                  );
                }}
              </Form.List>
            </Form>
          </ScrollContainer>
        </>
      ),
    },
  ];

  const onReset = () => {
    setActiveTabKey(TAB_KEY_1);
    setSelectedItemKeys([]);
    setSelectedItems([]);
    innerForm.resetFields();
  };

  const onSubmit = () => {
    innerForm
      .validateFields()
      .then((values) => {
        console.log("values", values);
        const newValue = {
          ...form.getFieldsValue(),
        };
        selectedItems?.forEach((item: ProductEntity) => {
          newValue[`promotion-${item.productId}`] = values?.key?.map((value: any) => ({
            ...value,
            saleUnit: item?.saleUOMTH,
            saleUnitDiscount: item?.saleUOMTH,
          }));
        });
        form.setFieldsValue(newValue);
        setOpen(false);
        onReset();
      })
      .catch((errInfo) => {
        console.log("errInfo", errInfo, innerForm.getFieldsValue());
      });
    // console.log("onSubmit", {
    //   form: form?.getFieldsValue(),
    //   innerForm: innerForm.getFieldsValue(),
    //   selectedItems,
    // });
  };

  const onClose = () => {
    onReset();
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} closable={false} width={"88vw"} footer={null}>
        <Row>
          <Col span={16}>
            <Row align='middle'>
              <Text fontWeight={700}>เพื่มเงื่อนไขเดียวกัน&nbsp;</Text>
              <Text level={6} color='Text3'>
                สามารถเลือกได้มากกว่า 1 สินค้า
              </Text>
            </Row>
          </Col>
          <Col span={8}>
            <Row align='middle' justify='end'>
              <CloseOutlined style={{ cursor: "pointer" }} onClick={onClose} />
            </Row>
          </Col>
        </Row>
        <br />
        <StyledTabs type='card' items={tabItems} activeKey={activeTabKey} />
        <Row align='middle' justify='space-between' style={{ padding: "24px 0px 12px" }}>
          <Col span={activeTabKey === TAB_KEY_1 ? 0 : 4}>
            <Button
              title='ย้อนกลับ'
              typeButton='border-light'
              onClick={() => setActiveTabKey(TAB_KEY_1)}
            />
          </Col>
          <Col span={activeTabKey === TAB_KEY_1 ? 20 : 16} />
          <Col span={activeTabKey === TAB_KEY_1 ? 4 : 0}>
            <Button
              title='ถัดไป'
              typeButton='primary'
              onClick={() => setActiveTabKey(TAB_KEY_2)}
              disabled={selectedItemKeys?.length <= 0}
            />
          </Col>
          <Col span={activeTabKey === TAB_KEY_1 ? 0 : 4}>
            <Button title='บันทึก' typeButton='primary' onClick={onSubmit} />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
