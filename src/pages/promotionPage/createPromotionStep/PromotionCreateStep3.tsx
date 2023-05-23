import React, { useEffect, useState } from "react";
import { Avatar, Checkbox, Col, Divider, Form, FormInstance, Modal, Row, Tooltip } from "antd";
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
import { getProductDetail } from "../../../datasource/ProductDatasource";
import { useRecoilValue } from "recoil";
import promotionState from "../../../store/promotion";
import { PromotionCreateStep3Dupplicate } from "./PromotionCreateStep3Dupplicate";
import Button from "../../../components/Button/Button";

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

export const CollapsePanelHeader = ({
  item,
  selectedKeys,
  setSelectedKeys,
  loadingProduct,
  rowsCount,
  onEdit,
}: {
  item: ProductEntity;
  selectedKeys: string[];
  setSelectedKeys: (k: string[]) => void;
  loadingProduct: boolean;
  rowsCount: number;
  onEdit: () => void;
}) => {
  return (
    <Row style={{ padding: "24px 32px" }}>
      <Col span={9}>
        <FlexRow>
          <FlexCol justify='center' style={{ height: 80, marginRight: 12 }}>
            <Checkbox
              checked={selectedKeys.includes(item.productId)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedKeys([...selectedKeys, item.productId]);
                } else {
                  setSelectedKeys(selectedKeys.filter((key) => key !== item.productId));
                }
              }}
            />
          </FlexCol>
          <ProductName product={item} size={84} />
        </FlexRow>
      </Col>
      <Col span={5}>
        <Text>{item.packSize}</Text>
        <br />
        <Text color='Text3'>
          {!loadingProduct ? priceFormatter(item.unitPrice || "", 2, false, true) : "..."}
        </Text>
        <Text color='Text3'>&nbsp;บาท/หน่วย</Text>
        <br />
        <Text color='Text3'>
          {!loadingProduct ? priceFormatter(item.marketPrice || "", 2, false, true) : "..."}
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
            <EditOutlined onClick={onEdit} />
          </IconContainer>
          {/* <IconContainer>
        <DeleteOutlined onClick={() => onDeleteProduct(item.productId)} />
      </IconContainer> */}
        </FlexCol>
      </Col>
    </Row>
  );
};

export const CollapsePanelItem = ({
  fieldKey,
  restField,
  form,
  currentKey,
  fields,
  item,
  promotionType,
  i = 0,
  onRemove,
  extra,
  name,
}: {
  fieldKey: React.Key;
  restField: any;
  form: FormInstance;
  currentKey: string;
  fields?: any[];
  item?: ProductEntity;
  promotionType?: string;
  i: number;
  onRemove: (n: any) => void;
  extra?: any;
  name: React.Key;
}) => {
  return (
    <>
      <Row key={fieldKey} gutter={16} style={{ padding: "20px 16px" }}>
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
                      (acc: number, item: any) => (item.quantity === value ? acc + 1 : acc),
                      0,
                    );
                  if (fields && fields.length > 1 && findDupplicate > 1) {
                    callback("จำนวนที่ซื้อครบต้องไม่ซ้ำกัน");
                    // throw new Error();
                  }
                  callback();
                },
              },
            ]}
          >
            <Input type='number' placeholder='ระบุจำนวนที่ซื้อครบ' min={0} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            {...restField}
            label='หน่วย'
            name={[name, "saleUnit"]}
            initialValue={item?.saleUOMTH || "หน่วย"}
          >
            <Input disabled />
          </Form.Item>
        </Col>
        {promotionType === PromotionType.FREEBIES_NOT_MIX ? (
          <>
            <Col span={10} style={{ borderLeft: `1px solid ${color.background2}` }}>
              <Form.Item {...restField} noStyle name={[name, "freebies"]}>
                <FreebieList form={form} productId={item?.productId || ""} itemIndex={i} />
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
                    <DeleteOutlined style={{ fontSize: 18, color: color.secondary }} />
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
                extra={extra}
                rules={[
                  { required: true, message: "โปรดระบุราคาที่ต้องการลด" },
                  {
                    validator: (rule, value, callback) => {
                      if (parseFloat(item?.marketPrice || "") < parseFloat(value)) {
                        return Promise.reject("ราคาที่ลดต้องไม่เกินราคาขาย");
                      }
                      if (
                        parseFloat(item?.marketPrice || "") >= parseFloat(value) &&
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
                initialValue={item?.saleUOMTH || "หน่วย"}
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
                    <CloseOutlined style={{ color: "white" }} onClick={() => onRemove(name)} />
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
};

export const CollapsePanelAddBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <AddProductContainer onClick={onClick} style={{ background: "white" }}>
      <Text level={5} color='primary'>
        +&nbsp;เพิ่มขั้นบันได
      </Text>
    </AddProductContainer>
  );
};

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

  const key = productId ? `promotion-${productId}` : "key";

  const getValue = () => {
    // Format: {unit: 'ลัง', quantity: '10'}, { unit: 'ลัง'}
    if (form.getFieldValue(key)) {
      return form.getFieldValue(key)[itemIndex]?.freebies || [];
    } else {
      return [];
    }
  };

  const onAdd = (product: ProductEntity) => {
    const promo = form.getFieldValue(key) || [];
    const list = getValue() || [];
    list.push({ ...product, product, quantity: 1 });
    promo[itemIndex] = { ...promo[itemIndex], freebies: list };
    form.setFieldValue(key, promo);
    console.log("onAdd", product, form.getFieldsValue());
  };

  const onDelete = (i: number) => {
    const promo = form.getFieldValue(key) || [];
    const list = getValue() || [];
    list.splice(i, 1);
    promo[itemIndex] = { ...promo[itemIndex], freebies: list };
    form.setFieldValue(key, promo);
  };

  const onSetQuantity = (i: number, quantity: string) => {
    const promo = form.getFieldValue(key) || [];
    const list = getValue() || [];
    list[i] = { ...list[i], quantity: parseInt(quantity) };
    promo[itemIndex] = { ...promo[itemIndex], freebies: list };
    form.setFieldValue(key, promo);
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
                    product?.productImage === "No"
                      ? image?.product_no_image
                      : product?.productImage ||
                        product?.productFreebiesImage ||
                        image?.product_no_image
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
      <Modal open={showModal} width={"80vw"} closable={false} footer={null}>
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
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [isReplacing, setReplace] = useState<string | undefined>(undefined);
  const [activeKeys, setActiveKeys] = useState<string | string[]>(
    (form.getFieldValue("items") || []).map((item: any) => item.productId),
  );
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openDupplicateModal, setOpenDupplicateModal] = useState<boolean>(false);

  useEffect(() => {
    console.log("useEffect", form.getFieldValue("items"));
    if (isEditing && promoStateValue.promotion) {
      fetchProductData();
    }
  }, [promoStateValue]);

  const fetchProductData = async () => {
    const newItems = [...items];
    setLoadingProduct(true);
    const result = items.map(async (item, i) => {
      await getProductDetail(parseInt(item.productId)).then((res) => {
        console.log(res);
        newItems[i] = { ...item, ...res };
        setItems(newItems);
      });
    });
    await Promise.all(result);
    setLoadingProduct(false);
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

  const onSelectAll = () => {
    const newSelectedKeys = items.map((item) => item.productId);
    setSelectedKeys(newSelectedKeys);
  };

  const onDeleteSelectedProduct = () => {
    Modal.confirm({
      title: "ต้องการลบรายการสินค้าที่เลือกหรือไม่",
      content: `โปรดยืนยันการลบรายการสินค้า (${selectedKeys.length} รายการ)`,
      okText: "ลบสินค้า",
      cancelText: "ยกเลิก",
      onOk: () => {
        const newList = items.filter((item) => !selectedKeys.includes(item.productId));
        setItems(newList);
        form.setFieldValue("items", newList);
        setSelectedKeys([]);
      },
    });
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <Row align='middle'>
            <Text level={2} fontWeight={700}>
              รายละเอียดรายการ&nbsp;&nbsp;
            </Text>
            <Text level={5} color='Text3'>
              โปรดระบุรายละเอียดโปรโมชัน
            </Text>
          </Row>
        </Col>
        <Col span={items.length > 0 ? 12 : 0}>
          <FlexRow align='end' justify='end' style={{ height: "100%", fontSize: 14 }}>
            <Text level={5} color='secondary'>
              ทั้งหมด&nbsp;{items.length}&nbsp;รายการ
            </Text>
            &nbsp;&nbsp;
            <Button
              title='เพิ่มเงื่อนไขเดียวกัน'
              typeButton='primary'
              style={{ width: 132, fontSize: 14 }}
              textStyle={{ fontSize: 14 }}
              onClick={() => setOpenDupplicateModal(true)}
            />
            <Divider type='vertical' />
            <Button
              title='เลือกทั้งหมด'
              typeButton='primary-light'
              style={{ width: 96, fontSize: 14 }}
              textStyle={{ fontSize: 14 }}
              onClick={onSelectAll}
              disabled={items.length === selectedKeys.length}
            />
            &nbsp;
            <Button
              title={`ลบรายการ (${selectedKeys.length})`}
              icon={<DeleteOutlined />}
              typeButton='danger'
              style={{ width: 140 }}
              textStyle={{ fontSize: 14 }}
              onClick={onDeleteSelectedProduct}
            />
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
                  <CollapsePanelHeader
                    item={item}
                    selectedKeys={selectedKeys}
                    setSelectedKeys={setSelectedKeys}
                    loadingProduct={loadingProduct}
                    rowsCount={rowsCount}
                    onEdit={() => {
                      setReplace(item.productId);
                      setModal(true);
                    }}
                  />
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
                          let extra;
                          if (promotionType === PromotionType.DISCOUNT_NOT_MIX) {
                            extra =
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
                                  parseFloat(item.marketPrice || "") >= parseFloat(discountValue)
                                ? `ราคาขายหลังหักส่วนลด ${
                                    parseFloat(item.marketPrice || "") - parseFloat(discountValue)
                                  } บาท / ${item.saleUOMTH}`
                                : undefined;
                          }
                          return (
                            <CollapsePanelItem
                              key={key}
                              fieldKey={key}
                              restField={restField}
                              form={form}
                              currentKey={currentKey}
                              fields={fields}
                              item={item}
                              promotionType={promotionType}
                              i={i}
                              onRemove={onRemove}
                              extra={extra}
                              name={name}
                            />
                          );
                        })}
                        <Form.Item>
                          <CollapsePanelAddBtn onClick={onAdd} />
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
      <Modal open={showModal} width={"80vw"} closable={false} footer={null}>
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
      <PromotionCreateStep3Dupplicate
        open={openDupplicateModal}
        setOpen={setOpenDupplicateModal}
        items={items}
        form={form}
        promotionType={promotionType}
      />
    </>
  );
};
