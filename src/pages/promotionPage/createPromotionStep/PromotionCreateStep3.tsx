import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  FormInstance,
  Modal,
  Radio,
  Row,
  Tooltip,
} from "antd";
import { FlexCol, FlexRow } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import styled from "styled-components";
import color from "../../../resource/color";
import image from "../../../resource/image";
import { ProductEntity } from "../../../entities/PoductEntity";
import {
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import Input from "../../../components/Input/Input";
import Collapse from "../../../components/Collapse/collapse";
import {
  PromotionGroup,
  PromotionGroupOption,
  PromotionType,
  PROMOTION_TYPE_NAME,
} from "../../../definitions/promotion";
import AddProduct, { ProductName } from "../../Shared/AddProduct";
import { priceFormatter } from "../../../utility/Formatter";
import {
  getProductDetail,
  getProductUnit,
  getProductBrand,
} from "../../../datasource/ProductDatasource";
import { useRecoilValue, useSetRecoilState } from "recoil";
import promotionState from "../../../store/promotion";
import { PromotionCreateStep3Dupplicate } from "./PromotionCreateStep3Dupplicate";
import Button from "../../../components/Button/Button";
import { GroupCardContainer } from "../../../components/Card/CardContainer";
import TextArea from "../../../components/Input/TextArea";
import Select from "../../../components/Select/Select";
import { LOCATION_FULLNAME_MAPPING } from "../../../definitions/location";
import { validateOnlyNumber } from "../../../utility/validator";

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
  hideCheckbox,
  uneditable,
  withForm,
  groupKey,
  onDeleteProduct,
  promotionType,
  promotionGroupOption,
  viewOnly,
}: {
  item: ProductEntity;
  selectedKeys: string[];
  setSelectedKeys: (k: string[]) => void;
  loadingProduct: boolean;
  rowsCount: number;
  onEdit?: () => void;
  hideCheckbox?: boolean;
  uneditable?: boolean;
  withForm?: FormInstance;
  groupKey?: React.Key;
  onDeleteProduct?: (p: string) => void;
  promotionType: PromotionType;
  promotionGroupOption?: PromotionGroupOption;
  viewOnly?: boolean;
}) => {
  return (
    <Row style={{ padding: "24px 32px" }}>
      <Col span={8}>
        <FlexRow>
          {!hideCheckbox && (
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
          )}
          <ProductName product={item} size={84} />
        </FlexRow>
      </Col>
      <Col span={4}>
        <Text>{item.packSize}</Text>
        <br />
        <Text color='Text3' level={6}>
          {item.productCodeNAV}
        </Text>
        <br />
        {withForm && (
          <>
            <Text>{LOCATION_FULLNAME_MAPPING[item?.productLocation || ""]}</Text>
            <br />
            <Text color='Text3' level={6}>
              ยี่ห้อ : {item?.productBrandName}
            </Text>
          </>
        )}
      </Col>
      <Col span={4}>
        <Text>
          {!loadingProduct ? priceFormatter(item.marketPrice || "", 2, false, true) : "..."}
        </Text>
        <Text>&nbsp;บาท/{item.saleUOMTH}</Text>
        <br />
        <Text color='Text3'>
          {!loadingProduct ? priceFormatter(item.unitPrice || "", 2, false, true) : "..."}
        </Text>
        <Text color='Text3'>&nbsp;บาท/{item.baseUOM}</Text>
      </Col>
      {!withForm && (
        <Col span={4}>
          <Text>{LOCATION_FULLNAME_MAPPING[item?.productLocation || ""]}</Text>
          <br />
          <Text color='Text3' level={6}>
            ยี่ห้อ : {item?.productBrandName}
          </Text>
        </Col>
      )}
      {withForm && (
        <Col span={withForm ? 7 : 1}>
          <CollapsePanelItem
            fieldKey={item.productId}
            form={withForm}
            currentKey={"currentKey"}
            item={item}
            promotionType={promotionType}
            promotionGroupOption={promotionGroupOption}
            name={groupKey + "-" + item.productId}
            uneditable={uneditable}
            i={0}
            viewOnly={viewOnly}
          />
          {/* {!hideCheckbox && !withForm && <Text>จำนวน&nbsp;{rowsCount}&nbsp;ขั้นบันได</Text>} */}
        </Col>
      )}
      <Col span={viewOnly ? 0 : withForm ? 1 : 2}>
        <FlexCol
          align='center'
          justify='space-evenly'
          style={{
            height: "100%",
            paddingLeft: 32,
            borderLeft: `1px solid ${color.background2}`,
          }}
        >
          {!uneditable ? (
            <IconContainer onClick={onEdit}>
              <EditOutlined />
            </IconContainer>
          ) : (
            <IconContainer
              onClick={onDeleteProduct ? () => onDeleteProduct(item.productId) : undefined}
              style={{ backgroundColor: color.error }}
            >
              <DeleteOutlined />
            </IconContainer>
          )}
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
  promotionGroupOption,
  i = 0,
  onRemove,
  extra,
  name,
  hideDivider,
  uneditable,
  viewOnly,
}: {
  fieldKey: React.Key;
  restField?: any;
  form?: FormInstance;
  currentKey: string;
  fields?: any[];
  item?: ProductEntity;
  promotionType: PromotionType;
  promotionGroupOption?: PromotionGroupOption;
  i: number;
  onRemove?: (n: any) => void;
  extra?: any;
  name: React.Key;
  hideDivider?: boolean;
  uneditable?: boolean;
  viewOnly?: boolean;
}) => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const span = {
    qty: 8,
    qtyUnit: 4,
    freebieList: 10,
    discountPrice: 6,
    saleUnitDiscount: 4,
    option: 2,
  };
  if (
    PromotionGroup.MIX.includes(promotionType) &&
    promotionGroupOption === PromotionGroupOption.WEIGHT
  ) {
    span.qty = 0;
    span.qtyUnit = 0;
    span.freebieList = 24;
    span.discountPrice = 14;
    span.saleUnitDiscount = 10;
    span.option = 0;
  }
  const checkNumber = (
    e: React.ChangeEvent<HTMLInputElement>,
    group?: any,
    i?: any,
    name?: any,
  ) => {
    const { value: inputValue } = e.target;
    const convertedNumber = validateOnlyNumber(inputValue);
    const getCurrentValue = form?.getFieldValue(group || i);
    getCurrentValue[i] = {
      ...getCurrentValue[i],
      [name]: convertedNumber,
    };
    form?.setFieldValue(group || i, getCurrentValue);
  };
  return (
    <>
      {promotionType === PromotionType.OTHER ? (
        <div style={{ padding: "20px 16px" }}>
          <Form.Item
            {...restField}
            label='รายละเอียดโปรโมชัน'
            name={[name, "detail"]}
            rules={[{ required: true, message: "โปรดระบุรายละเอียดโปรโมชัน" }]}
          >
            <TextArea />
          </Form.Item>
        </div>
      ) : (
        <Row key={fieldKey} gutter={16} style={{ padding: "20px 16px" }}>
          <Col span={span.qty}>
            <Form.Item
              {...restField}
              label='จำนวนที่ซื้อครบ'
              name={[name, "quantity"]}
              rules={
                promotionGroupOption !== PromotionGroupOption.WEIGHT && [
                  { required: true, message: "โปรดระบุจำนวนที่ซื้อครบ" },
                  {
                    // message: "จำนวนที่ซื้อครบต้องมากกว่า 0 และไม่ซ้ำกัน",
                    validator(rule, value, callback) {
                      if (!value) callback();
                      if (parseInt(value) <= 0) {
                        callback("จำนวนที่ซื้อครบต้องมากกว่า 0");
                        // throw new Error();
                      }
                      const findDupplicate =
                        form?.getFieldValue(currentKey) &&
                        form
                          .getFieldValue(currentKey)
                          .reduce(
                            (acc: number, item: any) => (item?.quantity === value ? acc + 1 : acc),
                            0,
                          );
                      if (fields && fields.length > 1 && findDupplicate > 1) {
                        callback("จำนวนที่ซื้อครบต้องไม่ซ้ำกัน");
                        // throw new Error();
                      }
                      callback();
                    },
                  },
                ]
              }
            >
              <Input
                placeholder='ระบุจำนวนที่ซื้อครบ'
                onChange={(e) => checkNumber(e, currentKey, name, "quantity")}
                autoComplete='off'
              />
            </Form.Item>
          </Col>
          <Col span={span.qtyUnit}>
            <Form.Item
              {...restField}
              label='หน่วย'
              name={[name, "saleUnit"]}
              initialValue={
                PromotionGroup.MIX.includes(promotionType) &&
                promotionGroupOption === PromotionGroupOption.WEIGHT
                  ? "kg / L"
                  : company === "ICPL" && PromotionGroup.MIX.includes(promotionType)
                  ? "ลัง/กระสอบ"
                  : item?.saleUOMTH || "หน่วย"
              }
            >
              <Input disabled />
            </Form.Item>
          </Col>
          {promotionType === PromotionType.FREEBIES_NOT_MIX ||
          promotionType === PromotionType.FREEBIES_MIX ? (
            <>
              <Col
                span={span.freebieList}
                style={{
                  borderLeft:
                    promotionType === PromotionType.FREEBIES_MIX &&
                    promotionGroupOption === PromotionGroupOption.WEIGHT
                      ? ""
                      : `1px solid ${color.background2}`,
                }}
              >
                <Form.Item {...restField} noStyle name={[name, "freebies"]}>
                  <FreebieList
                    form={form}
                    productId={item?.productId || ""}
                    itemIndex={i}
                    showFullProduct={
                      promotionType === PromotionType.FREEBIES_MIX &&
                      promotionGroupOption === PromotionGroupOption.WEIGHT
                    }
                    listKey={promotionType === PromotionType.FREEBIES_MIX ? currentKey : undefined}
                    autoFilled={promotionType === PromotionType.FREEBIES_NOT_MIX ? item : undefined}
                  />
                </Form.Item>
              </Col>
              <Col span={span.option}>
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
                      onClick={onRemove ? () => onRemove(name) : undefined}
                    >
                      <DeleteOutlined style={{ fontSize: 18, color: color.error }} />
                    </FlexCol>
                  </FlexRow>
                )}
              </Col>
            </>
          ) : (
            <>
              <Col span={span.discountPrice}>
                <Form.Item
                  {...restField}
                  label='ราคาที่ต้องการลด'
                  name={[name, "discountPrice"]}
                  initialValue={item?.discountPrice}
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
                  <Input
                    placeholder='ระบุราคา'
                    suffix='บาท'
                    disabled={viewOnly}
                    onChange={(e) => checkNumber(e, currentKey, name, "discountPrice")}
                    autoComplete='off'
                  />
                </Form.Item>
              </Col>
              <Col span={span.saleUnitDiscount}>
                <Form.Item
                  {...restField}
                  label='ต่อหน่วย SKU'
                  name={[name, "saleUnitDiscount"]}
                  initialValue={
                    company === "ICPL" && PromotionGroup.MIX.includes(promotionType)
                      ? "ลัง/กระสอบ"
                      : item?.saleUOMTH || "หน่วย"
                  }
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={span.option}>
                {i > 0 && (
                  <FlexRow
                    align='center'
                    justify='center'
                    style={{ height: "100%", paddingBottom: 9 }}
                  >
                    <CloseIconContainer>
                      <CloseOutlined
                        style={{ color: "white" }}
                        onClick={onRemove ? () => onRemove(name) : undefined}
                      />
                    </CloseIconContainer>
                  </FlexRow>
                )}
              </Col>
            </>
          )}
        </Row>
      )}
      {(promotionType === PromotionType.FREEBIES_NOT_MIX ||
        promotionType === PromotionType.FREEBIES_MIX) &&
        !hideDivider && <Divider />}
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
  form?: FormInstance;
  productId: string;
  itemIndex: number;
  showFullProduct?: boolean;
  listKey?: React.Key;
  autoFilled?: ProductEntity;
}

interface Props {
  form: FormInstance;
  promotionType: PromotionType;
  isEditing?: boolean;
  company: string;
}

const FreebieList = ({
  form,
  productId,
  itemIndex,
  showFullProduct,
  listKey,
  autoFilled,
}: FreebieListProps) => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const [showModal, setModal] = useState(false);

  const [freebieUnit, setFreebieUnit] = useState<Record<string, any>>({});

  const key = listKey !== undefined ? listKey : productId ? `promotion-${productId}` : "key";

  useEffect(() => {
    if (getValue().length <= 0 && autoFilled) {
      onAdd(autoFilled);
    }
  }, []);

  const toggleModal = () => {
    setModal(!showModal);
  };

  const getValue = () => {
    // Format: {unit: 'ลัง', quantity: '10'}, { unit: 'ลัง'}
    if (form?.getFieldValue(key)) {
      return form.getFieldValue(key)[itemIndex]?.freebies || [];
    } else {
      return [];
    }
  };

  const onAdd = (product: ProductEntity) => {
    const promo = form?.getFieldValue(key) || [];
    const list = getValue() || [];
    list.push({ ...product, product, quantity: 1 });
    promo[itemIndex] = { ...promo[itemIndex], freebies: list };
    form?.setFieldValue(key, promo);
  };

  const onDelete = (i: number) => {
    const promo = form?.getFieldValue(key) || [];
    const list = getValue() || [];
    list.splice(i, 1);
    promo[itemIndex] = { ...promo[itemIndex], freebies: list };
    form?.setFieldValue(key, promo);
  };

  const onSetQuantity = (i: number, quantity: string) => {
    const promo = form?.getFieldValue(key) || [];
    const list = getValue() || [];
    list[i] = { ...list[i], quantity: parseInt(quantity) };
    promo[itemIndex] = { ...promo[itemIndex], freebies: list };
    form?.setFieldValue(key, promo);
  };

  const getOption = async (itemNo: string) => {
    await getProductUnit("ICPL", itemNo).then((res) => {
      const newFreebieUnit = { ...freebieUnit };
      newFreebieUnit[itemNo] = res?.map((u: any) => ({
        key: u.unit_desc,
        value: u.unit_desc,
        label: u.unit_desc,
      }));
      setFreebieUnit(newFreebieUnit);
    });
  };

  const onSetOption = (i: number, unit: string) => {
    const promo = form?.getFieldValue(key) || [];
    const list = getValue() || [];
    list[i] = { ...list[i], baseUnitOfMeaTh: unit };
    promo[itemIndex] = { ...promo[itemIndex], freebies: list };
    form?.setFieldValue(key, promo);
  };
  const checkNumber = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const { value: inputValue } = e.target;
    const convertedNumber = validateOnlyNumber(inputValue) || "0";
    onSetQuantity(i, convertedNumber);
    //form?.setFieldsValue({ [name]: convertedNumber });
  };

  const inputSpan = showFullProduct ? 8 : 9;
  return (
    <>
      {getValue().map((product: ProductEntity, i: number) => {
        const { quantity, baseUnitOfMeaTh } = product;
        if (
          company === "ICPL" &&
          product?.productCodeNAV &&
          !freebieUnit[product?.productCodeNAV]
        ) {
          getOption(product?.productCodeNAV);
        }
        return (
          <Row key={i} gutter={12} align='middle'>
            <Col span={showFullProduct ? 6 : undefined}>
              {showFullProduct ? (
                <ProductName product={product} />
              ) : (
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
              )}
            </Col>
            <Col span={inputSpan}>
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
                  placeholder='ระบุจำนวนของแถม'
                  onChange={(e) => {
                    checkNumber(e, i);
                    //onSetQuantity(i, e?.target?.value);
                  }}
                  onBlur={(v) => {
                    if (v.target.value === "0") {
                      onSetQuantity(i, "1");
                    }
                  }}
                  value={getValue()[i]?.quantity || quantity}
                  min={1}
                  autoComplete='off'
                />
              </Form.Item>
            </Col>
            <Col span={inputSpan}>
              <Form.Item
                label='หน่วย'
                initialValue={product?.saleUOMTH || product?.baseUnitOfMeaEn}
              >
                {company === "ICPL" ? (
                  <Select
                    value={
                      getValue()[i]?.baseUnitOfMeaTh ||
                      baseUnitOfMeaTh ||
                      product?.saleUOMTH ||
                      product?.baseUnitOfMeaEn
                    }
                    data={freebieUnit[product?.productCodeNAV || ""]}
                    onChange={(val) => onSetOption(i, val)}
                  />
                ) : (
                  <Input disabled value={product?.saleUOMTH || product?.baseUnitOfMeaEn} />
                )}
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
        );
      })}
      <AddProductContainer
        style={{ background: "white", color: color.primary, padding: "8px 24px" }}
        onClick={toggleModal}
      >
        +&nbsp;เพิ่มของแถม
      </AddProductContainer>
      {showModal && (
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
      )}
    </>
  );
};

export const PromotionCreateStep3 = ({ form, promotionType, isEditing, company }: Props) => {
  const promoStateValue = useRecoilValue(promotionState);
  const setPromoState = useSetRecoilState(promotionState);

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
  const [promotionGroupOption, setPromotionGroupOption] = useState<PromotionGroupOption>(
    PromotionGroupOption.UNIT,
  );
  const [groupKeys, setGroupKeys] = useState<number[]>(
    (form.getFieldValue("items") || [])
      .map((item: any) => item.groupKey)
      .filter((item: any, i: number, self: any) => self.indexOf(item) === i),
  );
  const [selectedGroup, setSelectedGroup] = useState<number[]>([]);
  const [editingGroup, setEditingGroup] = useState<number>();

  useEffect(() => {
    if (isEditing) {
      fetchProductData();
    }
    if (promoStateValue.promotionGroupOption) {
      setPromotionGroupOption(promoStateValue.promotionGroupOption);
    }
  }, [promoStateValue]);

  const fetchProductData = async () => {
    const newItems = [...items];
    setLoadingProduct(true);
    if (PromotionGroup.MIX.includes(promotionType)) {
      if (!promoStateValue.productGroup) {
        setPromoState({
          ...promoStateValue,
          productGroup: newItems,
        });
        return;
      }
    } else {
      const result = items.map(async (item, i) => {
        await getProductDetail(parseInt(item.productId)).then((res) => {
          newItems[i] = { ...item, ...res };
        });
      });
      await Promise.all(result);
    }
    const getBrand = await getProductBrand(company).then((res) => {
      return res;
    });
    const mapBrand = newItems.map((d: ProductEntity) => ({
      ...d,
      productBrandName: getBrand?.find((x: any) => d.productBrandId === x.productBrandId)
        .productBrandName,
    }));
    setItems(mapBrand);
    setLoadingProduct(false);
  };

  const toggleModal = () => {
    setModal(!showModal);
    setReplace(undefined);
    if (showModal) setEditingGroup(undefined);
  };

  const removeDuplicates = (arr: any, prop: string) => {
    const uniqueKeys = new Set();
    return arr.filter((obj: any) => {
      const key = obj[prop];
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        return true;
      }
      return false;
    });
  };

  const setProd = async (list: ProductEntity[]) => {
    if (PromotionGroup.MIX.includes(promotionType)) {
      let newList: ProductEntity[];
      if (list.length <= 0) {
        newList = items;
      } else if (editingGroup) {
        newList = list.map((p) => (p.groupKey ? p : { ...p, groupKey: editingGroup }));
        const mapItems = editingGroup && items.filter((x) => x.groupKey !== editingGroup);
        const newItems = [...(mapItems || items), ...newList];
        const uniqueArrayOfObjects = removeDuplicates([...newList, ...newItems], "productId");
        newList = uniqueArrayOfObjects;
        setEditingGroup(undefined);
      } else {
        const groupKey = groupKeys.length > 0 ? groupKeys[groupKeys.length - 1] + 1 : 1;
        newList = list.map((p) => (p.groupKey ? p : { ...p, groupKey }));
        const uniqueArrayOfObjects = removeDuplicates([...newList, ...items], "productId");
        newList = uniqueArrayOfObjects;
        setGroupKeys([...groupKeys, groupKey]);
      }
      setItems(newList);
      form.setFieldValue("items", newList);
      setActiveKeys(newList.map((item) => item.productId));
      setPromoState({
        ...promoStateValue,
        productGroup: newList,
      });
    } else {
      const newMap: any = [];
      if (isReplacing) {
        list.forEach((y) => {
          newMap.push(y);
        });
      } else {
        items.forEach((x) => {
          newMap.push(x);
        });
        list.forEach((y) => {
          newMap.push(y);
        });
      }
      setItems(newMap);
      form.setFieldValue("items", newMap);
      setActiveKeys(newMap.map((item: any) => item.productId));
    }
  };

  const onValuesChange = (changedFields: any, allFields: any) => {
    setItemPromo(allFields);
  };

  const onChangeActiveKeys = (keys: string | string[]) => {
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
        setPromoState({
          ...promoStateValue,
          productGroup: newList,
        });

        // check if there is an empty group
        const newGroupKeys = groupKeys.filter((key) =>
          newList.find((item) => item.groupKey === key),
        );
        setGroupKeys(newGroupKeys);
      },
    });
  };

  const onSelectAll = (e: any) => {
    const text = e.target.textContent;
    if (text === "ล้างทั้งหมด") {
      setSelectedGroup([]);
      setSelectedKeys([]);
    } else {
      if (PromotionGroup.MIX.includes(promotionType)) {
        setSelectedGroup(groupKeys);
      } else {
        const newSelectedKeys = items.map((item) => item.productId);
        setSelectedKeys(newSelectedKeys);
      }
    }
  };

  const checkSelectAll = () => {
    if (PromotionGroup.MIX.includes(promotionType)) {
      if (selectedGroup.length) {
        return selectedGroup.length === groupKeys.length ? "ล้างทั้งหมด" : "เลือกทั้งหมด";
      }
    } else {
      if (selectedKeys.length) {
        return selectedKeys.length === items.length ? "ล้างทั้งหมด" : "เลือกทั้งหมด";
      }
    }
    return "เลือกทั้งหมด";
  };

  const onDeleteSelectedProduct = () => {
    Modal.confirm({
      title: "ต้องการลบรายการสินค้าที่เลือกหรือไม่",
      content: `โปรดยืนยันการลบรายการสินค้า (${
        PromotionGroup.MIX.includes(promotionType) ? selectedGroup.length : selectedKeys.length
      } รายการ)`,
      okText: "ลบสินค้า",
      cancelText: "ยกเลิก",
      onOk: () => {
        if (PromotionGroup.MIX.includes(promotionType)) {
          const newList = items.filter(
            (item) => !item.groupKey || !selectedGroup.includes(item.groupKey),
          );
          const newGroupKeys = groupKeys.filter((key) => !selectedGroup.includes(key));
          setItems(newList);
          selectedGroup.forEach((x) => {
            form.setFieldValue(x, "");
          });
          form.setFieldValue("items", newList);
          setSelectedKeys([]);
          setGroupKeys(newGroupKeys);
          setSelectedGroup([]);
          setPromoState({
            ...promoStateValue,
            productGroup: newList,
          });
        } else {
          const newList = items.filter((item) => !selectedKeys.includes(item.productId));
          setItems(newList);
          form.setFieldValue("items", newList);
          setSelectedKeys([]);
        }
      },
    });
  };
  const checkNumber = (e: React.ChangeEvent<HTMLInputElement>, i: number, name?: string) => {
    const { value: inputValue } = e.target;
    const convertedNumber = validateOnlyNumber(inputValue) || "0";
    if (name) {
      form?.setFieldValue(name, convertedNumber);
    }
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
            {PromotionGroup.NOT_MIX.includes(promotionType) && (
              <>
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
              </>
            )}
            <Button
              title={checkSelectAll()}
              typeButton='primary-light'
              style={{ width: 96, fontSize: 14 }}
              textStyle={{ fontSize: 14 }}
              onClick={(e) => onSelectAll(e)}
            />
            &nbsp;
            <Button
              title={`ลบรายการ (${
                PromotionGroup.MIX.includes(promotionType)
                  ? selectedGroup.length
                  : selectedKeys.length
              })`}
              icon={<DeleteOutlined style={{ color: "white" }} />}
              typeButton={selectedGroup.length || selectedKeys.length ? "danger" : "disabled"}
              style={{ width: 140 }}
              textStyle={{ fontSize: 14 }}
              onClick={onDeleteSelectedProduct}
              disabled={selectedGroup.length || selectedKeys.length ? false : true}
            />
          </FlexRow>
        </Col>
      </Row>
      {(promotionType === PromotionType.DISCOUNT_MIX ||
        promotionType === PromotionType.FREEBIES_MIX) && (
        <>
          <Row align='middle' style={{ padding: "16px 0 12px" }}>
            <Text fontWeight={700}>กำหนดโปรโมชั่นสินค้าที่คละตาม&nbsp;&nbsp;</Text>
            <Tooltip
              title={`ตัวเลือกการกำหนดโปรโมชั่นสินค้าแบบคละ จำนวน คือ กำหนดโปรโมชั่นตามหน่วยจำนวนสินค้า อาทิ กระสอบ ลัง ถุง น้ำหนัก/ปริมาตร คือ กำหนดโปรโมชั่นตามหน่วยปริมาตรน้ำหนัก อาทิ กิโลโกรัม ลิตร`}
            >
              <QuestionCircleOutlined style={{ paddingTop: 4 }} />
            </Tooltip>
          </Row>
          <Row>
            <Radio.Group
              optionType='button'
              size='large'
              value={promotionGroupOption}
              onChange={({ target: { value } }) => {
                setPromotionGroupOption(value);
                setPromoState({
                  ...promoStateValue,
                  promotionGroupOption: value,
                });
              }}
            >
              <Radio
                value={PromotionGroupOption.UNIT}
                disabled={isEditing && promotionGroupOption === PromotionGroupOption.WEIGHT}
              >
                จำนวน
              </Radio>
              <Radio
                value={PromotionGroupOption.WEIGHT}
                disabled={isEditing && promotionGroupOption === PromotionGroupOption.UNIT}
              >
                น้ำหนัก/ปริมาตร
              </Radio>
            </Radio.Group>
          </Row>
        </>
      )}
      <br />
      <Form layout='vertical' form={form} onValuesChange={onValuesChange}>
        {PromotionGroup.MIX.includes(promotionType) ? (
          items.length > 0 &&
          groupKeys.map((groupKey, groupIndex) => {
            const groupItems = items.filter((item) => item.groupKey === groupKey);
            const rowsCount = form.getFieldValue(groupKey)?.length || 0;
            return (
              <GroupCardContainer key={groupKey}>
                <Card
                  title={
                    <Row align='middle'>
                      <Col span={1}>
                        <Checkbox
                          onChange={({ target: { checked } }) => {
                            if (checked) {
                              setSelectedGroup([...selectedGroup, groupKey]);
                            } else {
                              setSelectedGroup(selectedGroup.filter((key) => key !== groupKey));
                            }
                          }}
                          checked={selectedGroup.includes(groupKey)}
                        />
                      </Col>
                      <Col span={3} style={{ padding: "8px 0px" }}>
                        <Text color='white'>สินค้ากลุ่ม {groupIndex + 1}</Text>
                      </Col>
                      <Col span={3} style={{ lineHeight: "40px" }}>
                        <Text color='white' fontSize={12}>
                          สินค้าทั้งหมด {groupItems.length} รายการ
                        </Text>
                      </Col>
                      <Col
                        span={promotionGroupOption === PromotionGroupOption.WEIGHT ? 0 : 3}
                        style={{ lineHeight: "40px" }}
                      >
                        <Text color='white' fontSize={12}>
                          จำนวน {rowsCount} ขั้นบันได
                        </Text>
                      </Col>
                      <Col span={promotionGroupOption === PromotionGroupOption.WEIGHT ? 17 : 14}>
                        <Row justify='end'>
                          <Button
                            title='แก้ไขรายการสินค้า'
                            icon={<EditOutlined style={{ color: "white" }} />}
                            typeButton='border-light'
                            textStyle={{ color: "white", fontSize: 14 }}
                            style={{ width: 180 }}
                            onClick={() => {
                              setEditingGroup(groupKey);
                              toggleModal();
                            }}
                          />
                        </Row>
                      </Col>
                    </Row>
                  }
                >
                  {promotionType !== "OTHER" &&
                    promotionGroupOption === PromotionGroupOption.WEIGHT && (
                      <div
                        style={{
                          backgroundColor: "#3362AA",
                          width: "100%",
                          padding: "16px 16px 0 16px",
                        }}
                      >
                        <Row gutter={16}>
                          <Col span={5}>
                            <Form.Item
                              name={groupKey + "-weight"}
                              label={
                                <Text color='white' fontSize={14}>
                                  จำนวนน้ำหนักที่ซื้อครบ
                                </Text>
                              }
                              initialValue={items.filter((x) => x.groupKey === groupKey)[0].size}
                              rules={[
                                { required: true, message: "โปรดระบุจำนวน/นน./ปริมาตรที่ซื้อครบ" },
                                {
                                  validator: (rule, value, callback) => {
                                    if (value && isNaN(parseInt(value))) {
                                      return Promise.reject(
                                        "จำนวนน้ำหนัก/ปริมาตรที่ซื้อครบเป็นตัวเลขเท่านั้น",
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                },
                              ]}
                            >
                              <Input
                                onChange={(e) => checkNumber(e, groupKey, `${groupKey}-weight`)}
                                autoComplete='off'
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Form.Item
                              label={
                                <Text color='white' fontSize={14}>
                                  หน่วย
                                </Text>
                              }
                            >
                              <Input disabled value={"kg / L"} autoComplete='off' />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    )}
                  <div style={{ backgroundColor: color.background1 }}>
                    {groupItems.map((item, j) => {
                      return (
                        <CollapsePanelHeader
                          item={item}
                          selectedKeys={selectedKeys}
                          setSelectedKeys={setSelectedKeys}
                          loadingProduct={loadingProduct}
                          rowsCount={0}
                          onEdit={() => {
                            setReplace(item.productId);
                            setModal(true);
                          }}
                          onDeleteProduct={onDeleteProduct}
                          hideCheckbox
                          uneditable
                          withForm={
                            promotionType === PromotionType.DISCOUNT_MIX &&
                            promotionGroupOption === PromotionGroupOption.WEIGHT
                              ? form
                              : undefined
                          }
                          groupKey={groupKey}
                          promotionType={promotionType}
                          promotionGroupOption={promotionGroupOption}
                          key={j}
                        />
                      );
                    })}
                  </div>
                  {!(
                    promotionType === PromotionType.DISCOUNT_MIX &&
                    promoStateValue.promotionGroupOption === PromotionGroupOption.WEIGHT
                  ) && (
                    <Form.List name={`${groupKey}`}>
                      {(fields, { add, remove }) => {
                        const onAdd = () => add();
                        const onRemove = (name: number) => remove(name);
                        const findIsEdit = groupKey && fields.length <= 0 && isEditing;
                        if (findIsEdit) onAdd();
                        if (fields.length <= 0 && !isEditing) onAdd();
                        return (
                          <>
                            {fields.map(({ key, name, ...restField }, i) => {
                              return (
                                <CollapsePanelItem
                                  key={key}
                                  fieldKey={key}
                                  restField={restField}
                                  form={form}
                                  currentKey={`${groupKey}`}
                                  fields={fields}
                                  item={{
                                    ...items[0],
                                    marketPrice: `${items.reduce(
                                      (min, item) =>
                                        item.marketPrice && parseFloat(item.marketPrice) < min
                                          ? parseFloat(item.marketPrice)
                                          : min,
                                      Number.MAX_SAFE_INTEGER,
                                    )}`,
                                  }}
                                  promotionType={promotionType}
                                  promotionGroupOption={promotionGroupOption}
                                  i={i}
                                  onRemove={onRemove}
                                  name={name}
                                  hideDivider={fields.length - 1 === i}
                                />
                              );
                            })}
                            {promotionType === PromotionType.OTHER ||
                              (!(
                                promotionType === PromotionType.FREEBIES_MIX &&
                                promotionGroupOption === PromotionGroupOption.WEIGHT
                              ) && (
                                <Form.Item>
                                  <br />
                                  <div style={{ padding: "0px 16px" }}>
                                    <CollapsePanelAddBtn onClick={onAdd} />
                                  </div>
                                </Form.Item>
                              ))}
                          </>
                        );
                      }}
                    </Form.List>
                  )}
                </Card>
              </GroupCardContainer>
            );
          })
        ) : (
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
                    PromotionGroup.MIX.includes(promotionType) ? (
                      items.map((item2, j) => (
                        <CollapsePanelHeader
                          item={item2}
                          selectedKeys={selectedKeys}
                          setSelectedKeys={setSelectedKeys}
                          loadingProduct={loadingProduct}
                          rowsCount={rowsCount}
                          onEdit={() => {
                            setReplace(item2.productId);
                            setModal(true);
                          }}
                          promotionType={promotionType}
                          key={j}
                        />
                      ))
                    ) : (
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
                        promotionType={promotionType}
                      />
                    )
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
                                promotionGroupOption={promotionGroupOption}
                                i={i}
                                onRemove={onRemove}
                                extra={extra}
                                name={name}
                              />
                            );
                          })}
                          <Form.Item>
                            <div style={{ padding: "0px 16px" }}>
                              <CollapsePanelAddBtn onClick={onAdd} />
                            </div>
                          </Form.Item>
                        </>
                      );
                    }}
                  </Form.List>
                </Collapse.Panel>
              );
            })}
          </Collapse>
        )}
      </Form>
      <br />
      <AddProductContainer onClick={toggleModal}>
        {items.length <= 0 && <img style={{ width: 72, margin: 16 }} src={image.product_box} />}
        <Text level={items.length <= 0 ? 4 : 5} color='primary'>
          +&nbsp;เพิ่ม{PromotionGroup.MIX.includes(promotionType) ? "กลุ่ม" : ""}สินค้า
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
      {showModal && (
        <Modal open={showModal} width={1350} closable={false} footer={null}>
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
            notFilteredProductList={
              PromotionGroup.MIX.includes(promotionType) && editingGroup
                ? items
                    .filter((item) => item.groupKey === editingGroup)
                    .map((item) => item.productId)
                : []
            }
          />
        </Modal>
      )}
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
