import { Avatar, Col, Divider, Form, FormInstance, Modal, Row, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { FlexCol, FlexRow } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import styled from "styled-components";
import color from "../../../resource/color";
import image from "../../../resource/image";
import { ProductEntity } from "../../../entities/PoductEntity";
import { CloseOutlined, DeleteOutlined, DownOutlined, EditOutlined } from "@ant-design/icons";
import Input from "../../../components/Input/Input";
import Collapse from "../../../components/Collapse/collapse";
import { PromotionType } from "../../../definitions/promotion";
import AddProduct, { ProductName } from "../../Shared/AddProduct";
import { priceFormatter } from "../../../utility/Formatter";
import { inputNumberValidator } from "../../../utility/validator";
import { getProductDetail } from "../../../datasource/ProductDatasource";
import { useRecoilValue } from "recoil";
import promotionState from "../../../store/promotion";

const AddProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  padding: 16px 50px;

  cursor: pointer;

  background: ${color["background1"]};
  border: 1px dashed ${color["primary"]};
  border-radius: 12px;
`;

const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  background: ${color.primary};
  border-radius: 4px;
  cursor: pointer;
`;

const CloseIconContainer = styled(IconContainer)`
  background: #6b7995;
  border-radius: 16px;
`;

interface FreebieListProps {
  form: FormInstance;
  productId: string;
  itemIndex: number;
}

interface Props {
  form: FormInstance;
  promotionType?: PromotionType;
  isEditing?: boolean;
}

const FreebieList = ({ form, productId, itemIndex }: FreebieListProps) => {
  const [showModal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!showModal);
  };

  const getValue = () => {
    // Format: {unit: 'ลัง', quantity: '10'}, { unit: 'ลัง'}
    return form.getFieldValue(`promotion-${productId}`)[itemIndex]?.freebies || [];
  };

  const onAdd = (product: ProductEntity) => {
    const promo = form.getFieldValue(`promotion-${productId}`);
    const list = getValue() || [];
    list.push({ ...product, product, quantity: 1 });
    promo[itemIndex] = { ...promo[itemIndex], freebies: list };
    form.setFieldValue(`promotion-${productId}`, promo);
    console.log("onAdd", product);
  };

  const onDelete = (i: number) => {
    const promo = form.getFieldValue(`promotion-${productId}`);
    const list = getValue() || [];
    list.splice(i, 1);
    promo[itemIndex] = { ...promo[itemIndex], freebies: list };
    form.setFieldValue(`promotion-${productId}`, promo);
  };

  const onSetQuantity = (i: number, quantity: string) => {
    const promo = form.getFieldValue(`promotion-${productId}`);
    const list = getValue() || [];
    list[i] = { ...list[i], quantity: parseInt(quantity) };
    promo[itemIndex] = { ...promo[itemIndex], freebies: list };
    form.setFieldValue(`promotion-${productId}`, promo);
  };

  return (
    <>
      {getValue().map(
        ({ product, quantity }: { product: any; quantity?: string | number }, i: number) => (
          <Row key={i} gutter={12} align='middle'>
            <Col>
              <FlexCol align='center' style={{ width: 64, overflow: "hidden" }}>
                <Avatar
                  src={
                    product.productImage === "No"
                      ? image.product_no_image
                      : product?.productImage ||
                        product?.productFreebiesImage ||
                        image.product_no_image
                  }
                  size={64}
                  shape='square'
                />
                <Tooltip title={product?.productName}>
                  <Text
                    level={6}
                    style={{
                      display: "block",
                      width: 64,
                      height: 22,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      wordWrap: "break-word",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product?.productName}
                  </Text>
                </Tooltip>
              </FlexCol>
            </Col>
            <Col span={9}>
              <Form.Item
                // name={`${productId}-${product?.productId || product?.productFreebiesId}-quantity`}
                label='จำนวนของแถม'
                rules={[
                  {
                    required: true,
                    message: "*โปรดระบุจำนวนของแถม",
                  },
                  {
                    validator(rule, value, callback) {
                      if (!Number.isInteger(parseFloat(value))) {
                        return Promise.reject("โปรดระบุเป็นจำนวนเต็มเท่านั้น");
                      }
                      if (parseFloat(value) <= 0) {
                        return Promise.reject("จำนวนของแถมต้องมากกว่า 0");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                initialValue={quantity || 1}
              >
                <Input
                  type='number'
                  placeholder='ระบุจำนวนของแถม'
                  onChange={(e) => onSetQuantity(i, e?.target?.value)}
                  value={getValue()[i]?.quantity || quantity}
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item
                label='หน่วย'
                initialValue={product?.saleUOMTH || product?.baseUnitOfMeaEn}
              >
                <Input disabled value={product?.saleUOMTH || product?.baseUnitOfMeaEn} />
              </Form.Item>
            </Col>
            <Col>
              <FlexCol
                align='center'
                justify='center'
                style={{ height: "100%", paddingBottom: 12 }}
              >
                <CloseIconContainer>
                  <CloseOutlined style={{ color: "white" }} onClick={() => onDelete(i)} />
                </CloseIconContainer>
              </FlexCol>
            </Col>
          </Row>
        ),
      )}
      <AddProductContainer
        style={{ background: "white", color: color.primary, padding: "8px 24px" }}
        onClick={toggleModal}
      >
        +&nbsp;เพิ่มของแถม
      </AddProductContainer>
      <Modal visible={showModal} width={"80vw"} closable={false} footer={null}>
        <AddProduct
          list={getValue()}
          setList={onAdd}
          onClose={toggleModal}
          withFreebies
          customTitle={
            <FlexRow align='end'>
              <Text level={5} fontWeight={600}>
                เลือกของแถม
              </Text>
            </FlexRow>
          }
        />
      </Modal>
    </>
  );
};

export const PromotionCreateStep3 = ({ form, promotionType, isEditing }: Props) => {
  const promoStateValue = useRecoilValue(promotionState);

  const [items, setItems] = useState<ProductEntity[]>(form.getFieldValue("items") || []);
  const [itemPromo, setItemPromo] = useState<any>(form.getFieldsValue());
  const [showModal, setModal] = useState(false);
  const [isReplacing, setReplace] = useState<string | undefined>(undefined);
  const [activeKeys, setActiveKeys] = useState<string | string[]>(
    (form.getFieldValue("items") || []).map((item: any) => item.productId),
  );

  useEffect(() => {
    console.log("useEffect", form.getFieldValue("items"));
    if (isEditing && promoStateValue.promotion) {
      fetchProductData();
    }
  }, [promoStateValue]);

  const fetchProductData = async () => {
    const newItems = [...items];
    items.forEach((item, i) => {
      getProductDetail(parseInt(item.productId)).then((res) => {
        console.log(res);
        newItems[i] = { ...item, ...res };
        setItems(newItems);
      });
    });
  };

  const toggleModal = () => {
    setModal(!showModal);
    setReplace(undefined);
  };

  const onAddProduct = () => {
    if (items.length > 0) {
      Modal.confirm({
        title: "ต้องการเพิ่มหรือเปลี่ยนสินค้าใช่หรือไม่",
        content:
          "โปรดยืนยันการเพิ่มหรือเปลี่ยนสินค้า และโปรดตรวจสอบรายละเอียดโปรโมชันสินค้าอีกครั้ง",
        okText: "ยืนยัน",
        cancelText: "ยกเลิก",
        onOk: () => toggleModal(),
      });
    } else {
      toggleModal();
    }
  };

  const setProd = (list: ProductEntity[]) => {
    setItems(list);
    form.setFieldValue("items", list);
    setActiveKeys(list.map((item) => item.productId));
  };

  const onValuesChange = (changedFields: any, allFields: any) => {
    setItemPromo(allFields);
  };

  const onChangeActiveKeys = (keys: string | string[]) => {
    console.log(keys);
    setActiveKeys(keys);
  };

  const onDeleteProduct = (id: string) => {
    Modal.confirm({
      title: "ต้องการลบสินค้าใช่หรือไม่",
      content: "โปรดยืนยันการลบสินค้า และโปรดตรวจสอบรายละเอียดโปรโมชันสินค้าอีกครั้ง",
      okText: "ลบสินค้า",
      cancelText: "ยกเลิก",
      onOk: () => {
        const newList = items.filter((item) => item.productId !== id);
        setItems(newList);
        form.setFieldValue("items", newList);
      },
    });
  };

  return (
    <>
      <Row>
        <Col span={16}>
          <Row align='middle'>
            <Text level={2} fontWeight={700}>
              รายละเอียดรายการ&nbsp;&nbsp;
            </Text>
            <Text level={5} color='Text3'>
              โปรดระบุรายละเอียดโปรโมชัน
            </Text>
          </Row>
        </Col>
        <Col span={8}>
          <FlexRow align='center' justify='end' style={{ height: "100%" }}>
            <Text level={5} color='secondary'>
              ทั้งหมด&nbsp;{items.length}&nbsp;รายการ
            </Text>
          </FlexRow>
        </Col>
      </Row>
      <br />
      <Form layout='vertical' form={form} onValuesChange={onValuesChange}>
        <Collapse
          defaultActiveKey={items.map((item) => item.productId)}
          activeKey={activeKeys}
          collapsible='icon'
          onChange={onChangeActiveKeys}
          expandIconPosition='end'
          expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
        >
          {items.map((item, i) => {
            const currentKey = `promotion-${item.productId}`;
            const rowsCount = form.getFieldValue(currentKey)?.length || 0;
            return (
              <Collapse.Panel
                header={
                  <Row style={{ padding: "24px 32px" }}>
                    <Col span={9}>
                      <ProductName product={item} size={84} />
                    </Col>
                    <Col span={5}>
                      <Text>{item.packSize}</Text>
                      <br />
                      <Text color='Text3'>
                        {priceFormatter(item.unitPrice || "", 2, false, true)}
                      </Text>
                      <Text color='Text3'>&nbsp;บาท/หน่วย</Text>
                      <br />
                      <Text color='Text3'>
                        {priceFormatter(item.marketPrice || "", 2, false, true)}
                      </Text>
                      <Text color='Text3'>&nbsp;บาท/{item.saleUOMTH}</Text>
                    </Col>
                    <Col span={7}>
                      <Text>จำนวน&nbsp;{rowsCount}&nbsp;ขั้นบันได</Text>
                    </Col>
                    <Col span={2}>
                      <FlexCol
                        align='center'
                        justify='space-evenly'
                        style={{
                          height: "100%",
                          paddingLeft: 32,
                          borderLeft: `1px solid ${color.background2}`,
                        }}
                      >
                        <IconContainer>
                          <EditOutlined
                            onClick={() => {
                              setReplace(item.productId);
                              setModal(true);
                            }}
                          />
                        </IconContainer>
                        <IconContainer>
                          <DeleteOutlined onClick={() => onDeleteProduct(item.productId)} />
                        </IconContainer>
                      </FlexCol>
                    </Col>
                  </Row>
                }
                key={item.productId}
              >
                <Form.List name={currentKey}>
                  {(fields, { add, remove }) => {
                    const onAdd = () => add();
                    const onRemove = (name: number) => remove(name);
                    if (fields.length <= 0) onAdd();
                    return (
                      <>
                        {fields.map(({ key, name, ...restField }, i) => {
                          const discountValue = form.getFieldValue(currentKey)[i]?.discountPrice;
                          return (
                            <>
                              <Row key={key} gutter={16} style={{ padding: "20px 16px" }}>
                                <Col span={8}>
                                  <Form.Item
                                    {...restField}
                                    label='จำนวนที่ซื้อครบ'
                                    name={[name, "quantity"]}
                                    rules={[
                                      { required: true, message: "โปรดระบุจำนวนที่ซื้อครบ" },
                                      {
                                        // message: "จำนวนที่ซื้อครบต้องมากกว่า 0 และไม่ซ้ำกัน",
                                        validator(rule, value, callback) {
                                          if (!value) callback();
                                          if (parseInt(value) <= 0) {
                                            callback("จำนวนที่ซื้อครบต้องมากกว่า 0");
                                            // throw new Error();
                                          }
                                          const findDupplicate = form
                                            .getFieldValue(currentKey)
                                            .reduce(
                                              (acc: number, item: any) =>
                                                item.quantity === value ? acc + 1 : acc,
                                              0,
                                            );
                                          if (fields.length > 1 && findDupplicate > 1) {
                                            callback("จำนวนที่ซื้อครบต้องไม่ซ้ำกัน");
                                            // throw new Error();
                                          }
                                          callback();
                                        },
                                      },
                                    ]}
                                  >
                                    <Input
                                      type='number'
                                      placeholder='ระบุจำนวนที่ซื้อครบ'
                                      min={0}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={4}>
                                  <Form.Item
                                    {...restField}
                                    label='หน่วย'
                                    name={[name, "saleUnit"]}
                                    initialValue={item.saleUOMTH}
                                  >
                                    <Input disabled />
                                  </Form.Item>
                                </Col>
                                {promotionType === PromotionType.FREEBIES_NOT_MIX ? (
                                  <>
                                    <Col
                                      span={10}
                                      style={{ borderLeft: `1px solid ${color.background2}` }}
                                    >
                                      <Form.Item {...restField} noStyle name={[name, "freebies"]}>
                                        <FreebieList
                                          form={form}
                                          productId={item.productId}
                                          itemIndex={i}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                      {i > 0 && (
                                        <FlexRow
                                          align='center'
                                          justify='end'
                                          style={{ height: "100%", padding: "0px 18px" }}
                                        >
                                          <FlexCol
                                            align='center'
                                            justify='center'
                                            style={{
                                              height: "100%",
                                              width: 32,
                                              background: color.background1,
                                              borderRadius: 4,
                                              padding: 8,
                                              cursor: "pointer",
                                            }}
                                            onClick={() => onRemove(name)}
                                          >
                                            <DeleteOutlined
                                              style={{ fontSize: 18, color: color.secondary }}
                                            />
                                          </FlexCol>
                                        </FlexRow>
                                      )}
                                    </Col>
                                  </>
                                ) : (
                                  <>
                                    <Col span={6}>
                                      <Form.Item
                                        {...restField}
                                        label='ราคาที่ต้องการลด'
                                        name={[name, "discountPrice"]}
                                        extra={
                                          itemPromo[currentKey] &&
                                          parseFloat(itemPromo[currentKey][i]?.discountPrice) > 0 &&
                                          parseFloat(item.marketPrice || "") >=
                                            parseFloat(itemPromo[currentKey][i]?.discountPrice)
                                            ? `ราคาขายหลังหักส่วนลด ${
                                                parseFloat(item.marketPrice || "") -
                                                parseFloat(itemPromo[currentKey][i]?.discountPrice)
                                              } บาท / ${item.saleUOMTH}`
                                            : discountValue &&
                                              parseFloat(discountValue) > 0 &&
                                              parseFloat(item.marketPrice || "") >=
                                                parseFloat(discountValue)
                                            ? `ราคาขายหลังหักส่วนลด ${
                                                parseFloat(item.marketPrice || "") -
                                                parseFloat(discountValue)
                                              } บาท / ${item.saleUOMTH}`
                                            : undefined
                                        }
                                        rules={[
                                          { required: true, message: "โปรดระบุราคาที่ต้องการลด" },
                                          {
                                            validator: (rule, value, callback) => {
                                              if (
                                                parseFloat(item.marketPrice || "") <
                                                parseFloat(value)
                                              ) {
                                                return Promise.reject(
                                                  "ราคาที่ลดต้องไม่เกินราคาขาย",
                                                );
                                              }
                                              if (
                                                parseFloat(item.marketPrice || "") >=
                                                  parseFloat(value) &&
                                                parseFloat(value) <= 0
                                              ) {
                                                return Promise.reject("ราคาที่ลดต้องมากกว่า 0");
                                              }
                                              return Promise.resolve();
                                            },
                                          },
                                        ]}
                                      >
                                        <Input placeholder='ระบุราคา' suffix='บาท' type='number' />
                                      </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                      <Form.Item
                                        {...restField}
                                        label='ต่อหน่วย SKU'
                                        name={[name, "saleUnitDiscount"]}
                                        initialValue={item.saleUOMTH}
                                      >
                                        <Input disabled />
                                      </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                      {i > 0 && (
                                        <FlexRow
                                          align='center'
                                          justify='center'
                                          style={{ height: "100%", paddingBottom: 9 }}
                                        >
                                          <CloseIconContainer>
                                            <CloseOutlined
                                              style={{ color: "white" }}
                                              onClick={() => onRemove(name)}
                                            />
                                          </CloseIconContainer>
                                        </FlexRow>
                                      )}
                                    </Col>
                                  </>
                                )}
                              </Row>
                              {promotionType === PromotionType.FREEBIES_NOT_MIX && <Divider />}
                            </>
                          );
                        })}
                        <Form.Item>
                          <AddProductContainer onClick={onAdd} style={{ background: "white" }}>
                            <Text level={5} color='primary'>
                              +&nbsp;เพิ่มขั้นบันได
                            </Text>
                          </AddProductContainer>
                        </Form.Item>
                      </>
                    );
                  }}
                </Form.List>
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </Form>
      <br />
      <AddProductContainer onClick={onAddProduct}>
        {items.length <= 0 && <img style={{ width: 72, margin: 16 }} src={image.product_box} />}
        <Text level={items.length <= 0 ? 4 : 5} color='primary'>
          +&nbsp;เพิ่มสินค้า
        </Text>
        {items.length <= 0 && (
          <>
            <Text level={6} color='Text1'>
              กรุณาเพิ่มรายการสินค้าที่ต้องการทำโปรโมชัน
            </Text>
            <br />
          </>
        )}
      </AddProductContainer>
      <Modal visible={showModal} width={"80vw"} closable={false} footer={null}>
        <AddProduct
          list={items}
          setList={
            isReplacing
              ? (p: ProductEntity) => {
                  let oldItem: any;
                  let oldKey = "";
                  const newKey = `promotion-${p.productId}`;
                  setProd(
                    items.map((item: ProductEntity) => {
                      if (item.productId === isReplacing) {
                        oldItem = item;
                        oldKey = `promotion-${item?.productId}`;
                        return p;
                      }
                      return item;
                    }),
                  );
                  form.setFieldValue(newKey, form.getFieldValue(oldKey));
                  form.setFieldValue(oldKey, undefined);
                  const newItemPromo = { ...itemPromo };
                  newItemPromo[newKey] = newItemPromo[oldKey];
                  newItemPromo[oldKey] = undefined;
                  setItemPromo(newItemPromo);
                }
              : setProd
          }
          onClose={toggleModal}
          isReplacing={isReplacing}
        />
      </Modal>
    </>
  );
};
