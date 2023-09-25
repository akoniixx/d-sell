import {
  DownOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import React, { ReactNode, useEffect, useState } from "react";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import Button from "../../components/Button/Button";
import Tabs from "../../components/AntdTabs/AntdTabs";
import { CardContainer, GroupCardContainer } from "../../components/Card/CardContainer";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import Text from "../../components/Text/Text";
import { Avatar, Card, Col, Collapse, Divider, Form, Image, Row, Table, Tooltip } from "antd";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import TextArea from "../../components/Input/TextArea";
import styled from "styled-components";
import color from "../../resource/color";
import Tag from "../../components/Tag/Tag";
import {
  getPromotionById,
  getPromotionLog,
  getReportExcel,
} from "../../datasource/PromotionDatasource";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import promotionState from "../../store/promotion";
import Descriptions from "../../components/Description/Descriptions";
import TableContainer from "../../components/Table/TableContainer";
import {
  PROMOTION_TYPE_NAME,
  PromotionGroup,
  PromotionGroupOption,
  PromotionType,
} from "../../definitions/promotion";
import { AlignType } from "rc-table/lib/interface";
import moment from "moment";
import "moment/locale/th";
import { priceFormatter } from "../../utility/Formatter";
import { ProductName } from "../Shared/AddProduct";
import { ProductEntity } from "../../entities/PoductEntity";
import { getProductDetail } from "../../datasource/ProductDatasource";
import {
  PromotionConditionEntity,
  PromotionConditionGroupEntity,
  PromotionSettingHistory,
} from "../../entities/PromotionSettingEntity";
import image from "../../resource/image";
import Input from "../../components/Input/Input";
import { CollapsePanelHeader } from "./createPromotionStep/PromotionCreateStep3";
import { useForm } from "antd/lib/form/Form";
import { BASE_URL } from "../../config/develop-config";
import axios, { AxiosRequestConfig } from "axios";
import Permission from "../../components/Permission/Permission";

const MemoArea = styled.div`
  width: 100%;
  background: ${color.background1};
  border: 1px solid ${color.background2};
  border-radius: 8px;

  display: flex;
  align-items: center;
  padding: 16px;
`;

const DetailTab: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;

  const promoStateValue = useRecoilValue(promotionState);
  const setPromoState = useSetRecoilState(promotionState);
  const { promotion } = promoStateValue;

  const [showPromotion, setShowPromotion] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [items, setItems] = useState<PromotionConditionGroupEntity[]>();

  const [form] = useForm();

  const imageSizeLong = "160px";
  const imageSizeShort = "120px";

  useEffect(() => {
    if (!loading) fetchPromotion();
  }, []);

  const fetchPromotion = async () => {
    setLoading(true);
    const id = pathSplit[4];
    await getPromotionById(id)
      .then((res) => {
        setPromoState({ ...promoStateValue, promotion: res });
        fetchProductData(res.conditionDetail);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchProductData = async (items: PromotionConditionGroupEntity[]) => {
    const newItems = [...items];
    setLoadingProduct(true);
    const result =
      items.map(async (item, i) => {
        await getProductDetail(parseInt(item.productId)).then((res) => {
          newItems[i] = { ...item, ...res };
          setItems(newItems);
          return true;
        });
      }) || [];
    await Promise.all(result);
    setLoadingProduct(false);
  };

  const columns = [
    {
      title: "รหัสร้านค้า",
      dataIndex: "customerNo",
      align: "center" as AlignType,
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "ชื่อร้านค้า",
      dataIndex: "customerName",
      align: "center" as AlignType,
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "เขตการขาย",
      dataIndex: "zone",
      align: "center" as AlignType,
    },
  ];

  const ToggleButton = ({ title, isSelected }: { title: string; isSelected: boolean }) => {
    return (
      <Button
        title={title}
        typeButton={isSelected ? "primary" : "primary-light"}
        style={{
          width: 168,
        }}
        onClick={!isSelected ? () => setShowPromotion(!showPromotion) : undefined}
      />
    );
  };

  const DetailRow = ({ content }: { content: string }) => {
    return (
      <Row justify='end' style={{ padding: "0 12px 16px" }}>
        <Text level={5} color='primary'>
          {content}
        </Text>
      </Row>
    );
  };

  const onDownloadExcel = async () => {
    const headers = { "Content-Type": "blob" };
    const config: AxiosRequestConfig = {
      method: "POST",
      url: `${BASE_URL}/master/report/report-excel/${promotion?.promotionId}/${company}`,
      responseType: "arraybuffer",
      headers,
    };
    const response = await axios(config);

    const file = new Blob([response.data], {
      type: "application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${promotion?.promotionCode}.xlsx`);

    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  return (
    <>
      <FlexRow justify='start' style={{ padding: "20px 0" }}>
        <FlexCol style={{ marginRight: 16 }}>
          {promotion?.promotionImageFirst ? (
            <Image
              style={{
                width: imageSizeShort,
                height: imageSizeLong,
                borderRadius: 4,
                objectFit: "contain",
              }}
              src={promotion?.promotionImageFirst}
            />
          ) : (
            <img
              style={{
                width: imageSizeShort,
                height: imageSizeLong,
                borderRadius: 4,
                border: "1px solid #eee",
                objectFit: "contain",
              }}
              src={image.emptyPromotion}
            />
          )}
        </FlexCol>
        <FlexCol style={{ marginRight: 16 }}>
          {promotion?.promotionImageSecond ? (
            <Image
              style={{
                width: imageSizeLong,
                height: imageSizeShort,
                borderRadius: 4,
                objectFit: "contain",
              }}
              src={promotion?.promotionImageSecond}
            />
          ) : (
            <img
              style={{
                width: imageSizeLong,
                height: imageSizeShort,
                borderRadius: 4,
                border: "1px solid #eee",
                objectFit: "contain",
              }}
              src={image.emptyPromotion}
            />
          )}
        </FlexCol>
      </FlexRow>
      <Row gutter={16}>
        <Col span={12}>
          <Descriptions
            label='สถานะ'
            value={
              <Tag color={promotion?.promotionStatus ? color.success : color.placeholder}>
                {promotion?.promotionStatus ? "Active" : "Inactive"}
              </Tag>
            }
          />
        </Col>
        <Col span={12}></Col>
        <Col span={12}>
          <Descriptions label='ชื่อโปรโมชัน' value={promotion?.promotionName} />
        </Col>
        <Col span={12}>
          <Descriptions
            label='ประเภทโปรโมชัน'
            value={
              promotion?.promotionType ? PROMOTION_TYPE_NAME[promotion?.promotionType] : undefined
            }
          />
        </Col>
        <Col span={12}>
          <Descriptions label='รหัสโปรโมชัน' value={promotion?.promotionCode} />
        </Col>
        <Col span={12}>
          <Descriptions
            label='อ้างอิงโปรโมชันที่เกี่ยวข้อง'
            value={promotion?.referencePromotion?.join(", ")}
          />
        </Col>
        <Col span={12}>
          <Descriptions
            label='ระยะเวลาใช้โปรโมชัน'
            value={
              moment(promotion?.startDate).locale("th").format("LLL") +
              " - " +
              moment(promotion?.endDate).locale("th").format("LLL")
            }
          />
        </Col>
      </Row>
      <Permission permission={["promotionSetting", "document"]}>
        <div>
          <br />
          <Row align='middle' gutter={16}>
            <Col span={12}>
              <Text level={5} fontWeight={700}>
                ไฟล์ Memo Promotion
              </Text>
            </Col>
            <Col span={12}>
              <Text level={5} fontWeight={700}>
                ไฟล์ Excel
              </Text>
            </Col>
          </Row>
          <br />
          <Row align='middle' gutter={16}>
            <Col span={12}>
              <MemoArea>
                <Row align='middle' justify='space-between' style={{ width: "100%" }}>
                  <Col span={16}>
                    <FlexRow align='center' style={{ height: "100%" }}>
                      &nbsp;&nbsp;&nbsp;
                      <svg
                        width='24'
                        height='31'
                        viewBox='0 0 24 31'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M20.0596 0.0175781L24 3.84855V5.85091V27.5176C24 28.8983 22.8487 30.0176 21.4286 30.0176H2.57143C1.15127 30.0176 0 28.8983 0 27.5176V2.51758C0 1.13687 1.15127 0.0175781 2.57143 0.0175781H18H20.0596ZM18 1.18424H2.57143C1.85609 1.18424 1.26867 1.71671 1.2056 2.39622L1.2 2.51758V27.5176C1.2 28.213 1.74768 28.7842 2.4466 28.8455L2.57143 28.8509H21.4286C22.1439 28.8509 22.7313 28.3184 22.7944 27.6389L22.8 27.5176V5.85091H18V1.18424ZM22.8 4.68424L22.8 4.33174L19.5626 1.18424H19.2V4.68424H22.8Z'
                          fill='#464E5F'
                        />
                        <path d='M4 15.6846H5.83333V17.5179H4V15.6846Z' fill='#464E5F' />
                        <path
                          d='M6.75 12.0176H8.98014C9.41286 12.0176 9.74294 12.0895 9.97039 12.2334C10.2034 12.372 10.3587 12.5718 10.4364 12.833C10.5196 13.0888 10.5612 13.4246 10.5612 13.8403C10.5612 14.24 10.5224 14.5704 10.4447 14.8315C10.367 15.0873 10.2117 15.2925 9.97871 15.4471C9.74571 15.5963 9.40731 15.6709 8.9635 15.6709H7.80682V17.5176H6.75V12.0176ZM8.614 14.7916C8.89138 14.7916 9.08832 14.7676 9.20482 14.7196C9.32687 14.6663 9.40454 14.5784 9.43782 14.4558C9.47665 14.3279 9.49607 14.1227 9.49607 13.8403C9.49607 13.5578 9.47665 13.3553 9.43782 13.2327C9.40454 13.1048 9.32964 13.0169 9.21314 12.9689C9.09664 12.9209 8.90248 12.8969 8.63064 12.8969H7.80682V14.7916H8.614Z'
                          fill='#464E5F'
                        />
                        <path
                          d='M11.4471 12.0176H13.1696C13.8741 12.0176 14.3734 12.0949 14.6674 12.2494C14.967 12.3986 15.1529 12.6491 15.225 13.0009C15.3027 13.3473 15.3415 13.9362 15.3415 14.7676C15.3415 15.599 15.3027 16.1905 15.225 16.5423C15.1529 16.8887 14.967 17.1392 14.6674 17.2937C14.3734 17.443 13.8741 17.5176 13.1696 17.5176H11.4471V12.0176ZM13.1197 16.6382C13.5246 16.6382 13.7965 16.6089 13.9352 16.5503C14.0794 16.4917 14.1709 16.3451 14.2098 16.1106C14.2542 15.8761 14.2763 15.4284 14.2763 14.7676C14.2763 14.1067 14.2542 13.6591 14.2098 13.4246C14.1709 13.1901 14.0794 13.0435 13.9352 12.9849C13.7965 12.9263 13.5246 12.8969 13.1197 12.8969H12.5039V16.6382H13.1197Z'
                          fill='#464E5F'
                        />
                        <path
                          d='M16.3879 17.5176V12.0176H19.5833V12.8969H17.4447V14.4318H19.3337V15.3192H17.4447V17.5176H16.3879Z'
                          fill='#464E5F'
                        />
                      </svg>
                      &nbsp;&nbsp;&nbsp;
                      <Text level={6} color='Text3'>
                        {promotion?.fileMemoPath
                          ? `${promotion.fileMemoPath.substring(0, 40)}...`
                          : "ไม่มีไฟล์แนบ"}
                      </Text>
                    </FlexRow>
                  </Col>
                  <Col span={8}>
                    <Button
                      title='ดูรายละเอียด'
                      icon={<EyeOutlined />}
                      onClick={() => {
                        const pdfWindow = window.open();
                        if (pdfWindow) pdfWindow.location.href = promotion?.fileMemoPath || "";
                      }}
                      disabled={!promotion?.fileMemoPath}
                      typeButton={promotion?.fileMemoPath ? "primary" : "disabled"}
                    />
                  </Col>
                </Row>
              </MemoArea>
            </Col>
            <Col span={12}>
              <MemoArea>
                <Row align='middle' justify='space-between' style={{ width: "100%" }}>
                  <Col span={16}>
                    <FlexRow align='center' style={{ height: "100%" }}>
                      &nbsp;&nbsp;&nbsp;
                      <FileExcelOutlined style={{ fontSize: 28 }} />
                      &nbsp;&nbsp;&nbsp;
                      <Text level={6} color='Text3'>
                        {`${promotion?.promotionCode}.xlsx`}
                      </Text>
                    </FlexRow>
                  </Col>
                  <Col span={8}>
                    <Button
                      title='ดาวน์โหลด'
                      icon={<DownloadOutlined style={{ color: "white" }} />}
                      onClick={onDownloadExcel}
                    />
                  </Col>
                </Row>
              </MemoArea>
            </Col>
          </Row>
          <br />
          <br />
        </div>
      </Permission>

      <Divider />
      <Text level={2}>รายละเอียดรายการ</Text>
      <br />
      <br />
      <Row>
        <ToggleButton title='รายละเอียดโปรโมชัน' isSelected={showPromotion} />
        &nbsp;&nbsp;
        <ToggleButton title='เขตและร้านค้า' isSelected={!showPromotion} />
      </Row>
      <br />
      <br />
      {!showPromotion ? (
        <>
          <DetailRow content={`จำนวนร้านค้าทั้งหมด ${promotion?.promotionShop?.length} ร้าน`} />
          <TableContainer>
            <Table
              columns={columns}
              dataSource={promotion?.promotionShop?.map((s) => ({ ...s, key: s.promotionShopId }))}
              pagination={false}
              scroll={{ y: 600 }}
            />
          </TableContainer>
        </>
      ) : (
        <>
          {promotion?.promotionType && (
            <DetailRow
              content={
                PromotionGroup.NOT_MIX.includes(promotion.promotionType)
                  ? `จำนวนสินค้าทั้งหมด ${promotion?.conditionDetail?.length} รายการ`
                  : `จำนวนกลุ่มสินค้า ${
                      promotion?.conditionDetail?.length || "-"
                    } กลุ่ม, จำนวนสินค้า ${promotion?.conditionDetail?.reduce(
                      (sum, current) => sum + (current?.products?.length || 0),
                      0,
                    )} รายการ`
              }
            />
          )}
          <Form layout='vertical'>
            {promotion && PromotionGroup.MIX.includes(promotion?.promotionType) ? (
              promotion.conditionDetail &&
              Object.values(promotion.conditionDetail).map(
                ({ products, conditionDiscount, conditionFreebies, detail }, i) => {
                  const getType = promotion?.promotionType;
                  const typeMix =
                    getType === PromotionType.DISCOUNT_MIX
                      ? promotion.conditionDetail &&
                        promotion?.conditionDetail[0].conditionDiscount.typeMix
                      : promotion.conditionDetail && promotion?.conditionDetail[0]?.typeMix;
                  const size =
                    getType === PromotionType.DISCOUNT_MIX
                      ? promotion.conditionDetail &&
                        promotion?.conditionDetail[i].conditionDiscount.size
                      : promotion.conditionDetail && promotion?.conditionDetail[i]?.size;
                  return (
                    <GroupCardContainer key={i}>
                      <Card
                        title={
                          <Row align='middle'>
                            <Col span={3} style={{ padding: "8px 0px" }}>
                              <Text color='white'>สินค้ากลุ่ม {i + 1}</Text>
                            </Col>
                            <Col span={3} style={{ lineHeight: "40px" }}>
                              <Text color='white' fontSize={12}>
                                สินค้าทั้งหมด {products?.length} รายการ
                              </Text>
                            </Col>
                            <Col span={3} style={{ lineHeight: "40px" }}>
                              <Text color='white' fontSize={12}>
                                จำนวน 1 ขั้นบันได
                              </Text>
                            </Col>
                          </Row>
                        }
                      >
                        {typeMix === PromotionGroupOption.WEIGHT && size && (
                          <div
                            style={{
                              backgroundColor: "#3362AA",
                              width: "100%",
                              padding: "16px 16px 0 16px",
                            }}
                          >
                            <Form>
                              <Row gutter={16}>
                                <Col span={5}>
                                  <Form.Item
                                    label={
                                      <Text color='white' fontSize={14}>
                                        จำนวนน้ำหนักที่ซื้อครบ
                                      </Text>
                                    }
                                    initialValue={size}
                                  >
                                    <Input value={size} disabled />
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
                                    <Input disabled value={"kg / L"} />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Form>
                          </div>
                        )}
                        <div style={{ backgroundColor: color.background1 }}>
                          {products?.map((item: ProductEntity, j: number) => {
                            const data = { ...item };
                            if (
                              promotion.promotionType === PromotionType.DISCOUNT_MIX &&
                              typeMix === PromotionGroupOption.WEIGHT
                            ) {
                              const discountPrice = conditionDiscount.products.find(
                                (x: any) => x.productId === data.productId,
                              ).discountPrice;
                              data.discountPrice = discountPrice;
                            }
                            return (
                              <CollapsePanelHeader
                                item={data}
                                selectedKeys={[]}
                                setSelectedKeys={() => ""}
                                loadingProduct={loadingProduct}
                                rowsCount={0}
                                hideCheckbox
                                uneditable
                                viewOnly
                                promotionType={promotion?.promotionType}
                                key={j}
                                withForm={
                                  promotion.promotionType === PromotionType.DISCOUNT_MIX &&
                                  typeMix === PromotionGroupOption.WEIGHT
                                    ? form
                                    : undefined
                                }
                                promotionGroupOption={typeMix}
                                groupKey={`${item.groupKey}`}
                              />
                            );
                          })}
                        </div>
                        {Array.isArray(conditionDiscount || conditionFreebies) &&
                          (conditionDiscount || conditionFreebies)?.map(
                            (
                              {
                                quantity,
                                saleUnit,
                                saleUnitDiscount,
                                discountPrice,
                                freebies,
                              }: PromotionConditionEntity,
                              j: number,
                            ) => {
                              const renderType = (typeMix: string) => {
                                if (typeMix === "Size") {
                                  return (
                                    <Row key={j} gutter={16} style={{ padding: "20px 16px" }}>
                                      {freebies ? (
                                        <>
                                          <Col span={24}>
                                            {freebies?.map((f, k) => {
                                              return (
                                                <Row
                                                  key={`${i}-${j}-${k}`}
                                                  gutter={12}
                                                  align='middle'
                                                >
                                                  <Col span={2}>
                                                    <FlexCol
                                                      align='center'
                                                      style={{ width: 64, overflow: "hidden" }}
                                                    >
                                                      <Avatar
                                                        src={
                                                          f.productImage === "No"
                                                            ? image.product_no_image
                                                            : f?.productImage ||
                                                              f?.productFreebiesImage ||
                                                              image.product_no_image
                                                        }
                                                        size={64}
                                                        shape='square'
                                                      />
                                                    </FlexCol>
                                                  </Col>
                                                  <Col span={6}>
                                                    <Text>{f?.productName}</Text>
                                                    <br />
                                                    {f?.commonName && (
                                                      <Text level={6} color={"Text3"}>
                                                        {f?.commonName}
                                                      </Text>
                                                    )}
                                                    <Text level={6} color={"Text3"}>
                                                      Product Group : {f?.productGroup}
                                                    </Text>
                                                    <br />
                                                    {f.productStrategy && (
                                                      <Text level={6} color={"Text3"}>
                                                        Startegy Group : {f?.productStrategy}
                                                      </Text>
                                                    )}
                                                  </Col>
                                                  <Col span={8}>
                                                    <Form.Item
                                                      label='จำนวนของแถม'
                                                      initialValue={quantity || 1}
                                                    >
                                                      <Input
                                                        type='number'
                                                        placeholder='ระบุจำนวนของแถม'
                                                        value={f.quantity}
                                                        min={1}
                                                        disabled
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={8}>
                                                    <Form.Item
                                                      label='หน่วย'
                                                      initialValue={
                                                        f?.baseUnitOfMeaTh ||
                                                        f?.saleUOMTH ||
                                                        f?.baseUnitOfMeaEn
                                                      }
                                                    >
                                                      <Input
                                                        disabled
                                                        value={
                                                          f?.baseUnitOfMeaTh ||
                                                          f?.saleUOMTH ||
                                                          f?.baseUnitOfMeaEn
                                                        }
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                </Row>
                                              );
                                            })}
                                          </Col>
                                        </>
                                      ) : (
                                        <>
                                          <Col span={6}>
                                            <Form.Item
                                              label='ราคาที่ต้องการลด'
                                              name={[`${i}-${j}`, "discountPrice"]}
                                              initialValue={discountPrice}
                                            >
                                              <Input
                                                placeholder='-'
                                                suffix='บาท'
                                                type='number'
                                                disabled
                                              />
                                            </Form.Item>
                                          </Col>
                                          <Col span={6}>
                                            <Form.Item
                                              label='ต่อหน่วย SKU'
                                              name={[`${i}-${j}`, "saleUnitDiscount"]}
                                              initialValue={
                                                saleUnitDiscount ||
                                                (products && products[0].saleUOMTH)
                                              }
                                            >
                                              <Input disabled />
                                            </Form.Item>
                                          </Col>
                                        </>
                                      )}
                                    </Row>
                                  );
                                } else {
                                  return (
                                    <Row key={j} gutter={16} style={{ padding: "20px 16px" }}>
                                      <Col span={8}>
                                        <Form.Item
                                          label='จำนวนที่ซื้อครบ'
                                          name={[`${i}-${j}`, "quantity"]}
                                          initialValue={quantity}
                                        >
                                          <Input
                                            type='number'
                                            placeholder='ระบุจำนวนที่ซื้อครบ'
                                            min={0}
                                            disabled
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col span={4}>
                                        <Form.Item
                                          label='หน่วย'
                                          name={[`${i}-${j}`, "saleUnit"]}
                                          initialValue={
                                            saleUnit || (products && products[0].saleUOMTH)
                                          }
                                        >
                                          <Input disabled />
                                        </Form.Item>
                                      </Col>

                                      {freebies ? (
                                        <>
                                          <Col
                                            span={12}
                                            style={{ borderLeft: `1px solid ${color.background2}` }}
                                          >
                                            {freebies?.map((f, k) => {
                                              return (
                                                <Row
                                                  key={`${i}-${j}-${k}`}
                                                  gutter={12}
                                                  align='middle'
                                                >
                                                  <Col>
                                                    <FlexCol
                                                      align='center'
                                                      style={{ width: 64, overflow: "hidden" }}
                                                    >
                                                      <Avatar
                                                        src={
                                                          f.productImage === "No"
                                                            ? image.product_no_image
                                                            : f?.productImage ||
                                                              f?.productFreebiesImage ||
                                                              image.product_no_image
                                                        }
                                                        size={64}
                                                        shape='square'
                                                      />
                                                      <Tooltip title={f?.productName}>
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
                                                          {f?.productName}
                                                        </Text>
                                                      </Tooltip>
                                                    </FlexCol>
                                                  </Col>
                                                  <Col span={9}>
                                                    <Form.Item
                                                      // name={`${productId}-${product?.productId || product?.productFreebiesId}-quantity`}
                                                      label='จำนวนของแถม'
                                                      initialValue={quantity || 1}
                                                    >
                                                      <Input
                                                        type='number'
                                                        placeholder='ระบุจำนวนของแถม'
                                                        value={f.quantity}
                                                        min={1}
                                                        disabled
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col span={9}>
                                                    <Form.Item
                                                      label='หน่วย'
                                                      initialValue={
                                                        f?.baseUnitOfMeaTh ||
                                                        f?.saleUOMTH ||
                                                        f?.baseUnitOfMeaEn
                                                      }
                                                    >
                                                      <Input
                                                        disabled
                                                        value={
                                                          f?.baseUnitOfMeaTh ||
                                                          f?.saleUOMTH ||
                                                          f?.baseUnitOfMeaEn
                                                        }
                                                      />
                                                    </Form.Item>
                                                  </Col>
                                                </Row>
                                              );
                                            })}
                                          </Col>
                                        </>
                                      ) : (
                                        <>
                                          <Col span={6}>
                                            <Form.Item
                                              label='ราคาที่ต้องการลด'
                                              name={[`${i}-${j}`, "discountPrice"]}
                                              initialValue={discountPrice}
                                            >
                                              <Input
                                                placeholder='-'
                                                suffix='บาท'
                                                type='number'
                                                disabled
                                              />
                                            </Form.Item>
                                          </Col>
                                          <Col span={6}>
                                            <Form.Item
                                              label='ต่อหน่วย SKU'
                                              name={[`${i}-${j}`, "saleUnitDiscount"]}
                                              initialValue={
                                                saleUnitDiscount ||
                                                (products && products[0].saleUOMTH)
                                              }
                                            >
                                              <Input disabled />
                                            </Form.Item>
                                          </Col>
                                        </>
                                      )}
                                    </Row>
                                  );
                                }
                              };
                              return renderType(typeMix);
                            },
                          )}
                        {detail && (
                          <div style={{ padding: "20px 16px" }}>
                            <Form.Item label='รายละเอียดโปรโมชัน'>
                              <TextArea
                                disabled
                                value={detail}
                                readOnly
                                style={{ height: 120, resize: "none" }}
                              />
                            </Form.Item>
                          </div>
                        )}
                      </Card>
                    </GroupCardContainer>
                  );
                },
              )
            ) : (
              <Collapse
                collapsible='icon'
                expandIconPosition='end'
                expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
              >
                {items?.map((item, i) => {
                  const { condition } = item;
                  return (
                    <Collapse.Panel
                      header={
                        <Row style={{ padding: "24px 32px" }}>
                          <Col span={10}>
                            <ProductName product={item as ProductEntity} size={84} />
                          </Col>
                          <Col span={5}>
                            <Text>{item.packSize}</Text>
                            <br />
                            <Text color='Text3'>
                              {!loadingProduct
                                ? priceFormatter(item.unitPrice || "", 2, false, true)
                                : "..."}
                            </Text>
                            <Text color='Text3'>&nbsp;บาท/หน่วย</Text>
                            <br />
                            <Text color='Text3'>
                              {!loadingProduct
                                ? priceFormatter(item.marketPrice || "", 2, false, true)
                                : "..."}
                            </Text>
                            <Text color='Text3'>&nbsp;บาท/{item.saleUOMTH}</Text>
                          </Col>
                          <Col span={8}>
                            <Text>จำนวน&nbsp;{item?.condition?.length}&nbsp;ขั้นบันได</Text>
                          </Col>
                        </Row>
                      }
                      key={i}
                    >
                      {condition?.map(
                        ({ quantity, saleUnit, saleUnitDiscount, discountPrice, freebies }, j) => {
                          return (
                            <Row key={j} gutter={16} style={{ padding: "20px 16px" }}>
                              <Col span={8}>
                                <Form.Item
                                  label='จำนวนที่ซื้อครบ'
                                  name={[`${i}-${j}`, "quantity"]}
                                  initialValue={quantity}
                                >
                                  <Input
                                    type='number'
                                    placeholder='ระบุจำนวนที่ซื้อครบ'
                                    min={0}
                                    disabled
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item
                                  label='หน่วย'
                                  name={[`${i}-${j}`, "saleUnit"]}
                                  initialValue={item.saleUOMTH}
                                >
                                  <Input disabled />
                                </Form.Item>
                              </Col>
                              {freebies ? (
                                <>
                                  <Col
                                    span={12}
                                    style={{ borderLeft: `1px solid ${color.background2}` }}
                                  >
                                    {freebies?.map((f, k) => {
                                      return (
                                        <Row key={`${i}-${j}-${k}`} gutter={12} align='middle'>
                                          <Col>
                                            <FlexCol
                                              align='center'
                                              style={{ width: 64, overflow: "hidden" }}
                                            >
                                              <Avatar
                                                src={
                                                  f.productImage === "No"
                                                    ? image.product_no_image
                                                    : f?.productImage ||
                                                      f?.productFreebiesImage ||
                                                      image.product_no_image
                                                }
                                                size={64}
                                                shape='square'
                                              />
                                              <Tooltip title={f?.productName}>
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
                                                  {f?.productName}
                                                </Text>
                                              </Tooltip>
                                            </FlexCol>
                                          </Col>
                                          <Col span={9}>
                                            <Form.Item
                                              // name={`${productId}-${product?.productId || product?.productFreebiesId}-quantity`}
                                              label='จำนวนของแถม'
                                              initialValue={quantity || 1}
                                            >
                                              <Input
                                                type='number'
                                                placeholder='ระบุจำนวนของแถม'
                                                value={f.quantity}
                                                min={1}
                                                disabled
                                              />
                                            </Form.Item>
                                          </Col>
                                          <Col span={9}>
                                            <Form.Item
                                              label='หน่วย'
                                              initialValue={
                                                f?.baseUnitOfMeaTh ||
                                                f?.saleUOMTH ||
                                                f?.baseUnitOfMeaEn
                                              }
                                            >
                                              <Input
                                                disabled
                                                value={
                                                  f?.baseUnitOfMeaTh ||
                                                  f?.saleUOMTH ||
                                                  f?.baseUnitOfMeaEn
                                                }
                                              />
                                            </Form.Item>
                                          </Col>
                                        </Row>
                                      );
                                    })}
                                  </Col>
                                </>
                              ) : (
                                <>
                                  <Col span={6}>
                                    <Form.Item
                                      label='ราคาที่ต้องการลด'
                                      name={[`${i}-${j}`, "discountPrice"]}
                                      extra={`ราคาขายหลังหักส่วนลด ${
                                        parseFloat(item.marketPrice || "") -
                                        parseFloat(`${discountPrice || 0}`)
                                      } บาท / ${item.saleUOMTH}`}
                                      initialValue={discountPrice}
                                    >
                                      <Input placeholder='-' suffix='บาท' type='number' disabled />
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item
                                      label='ต่อหน่วย SKU'
                                      name={[`${i}-${j}`, "saleUnitDiscount"]}
                                      initialValue={item.saleUOMTH}
                                    >
                                      <Input disabled />
                                    </Form.Item>
                                  </Col>
                                </>
                              )}
                            </Row>
                          );
                        },
                      )}
                    </Collapse.Panel>
                  );
                })}
              </Collapse>
            )}
          </Form>
        </>
      )}
    </>
  );
};

const HistoryTab: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;

  const [loading, setLoading] = useState(false);
  const [histories, setHistories] = useState<PromotionSettingHistory[]>();

  useEffect(() => {
    if (!loading) fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const id = pathSplit[4];
    await getPromotionLog(id)
      .then((res) => {
        setHistories(res?.map((h: any, i: number) => ({ ...h, key: i })));
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "วันเวลาที่อัปเดท",
      dataIndex: "createdAt",
      align: "center" as AlignType,
      render: (createdAt: string) => moment(createdAt).format("DD/MM/YYYY HH:mm น."),
    },
    {
      title: "กิจกรรม",
      dataIndex: "action",
      align: "center" as AlignType,
      render: (action: string) => {
        const mapValue: any = {
          CreatePromotion: "สร้างโปรโมชัน",
          Changedata: "แก้ไขโปรโมชัน",
          Changestatus: "เปลี่ยนสถานะ",
        };
        const value = action?.replaceAll(" ", "");
        return <Text level={6}>{mapValue[value]}</Text>;
      },
    },
    {
      title: "ก่อนแก้ไข",
      dataIndex: "beforeValue",
      align: "center" as AlignType,
      render: (value: string, row: any) => {
        const action = row.action?.replaceAll(" ", "");
        return (
          <>
            {action === "Changestatus" ? (
              <Tag color={value === "true" ? color.success : color.warning}>
                {value === "true" ? "ACTIVE" : "INACTIVE"}
              </Tag>
            ) : (
              <Text level={6}>{value || "-"}</Text>
            )}
          </>
        );
      },
    },
    {
      title: "หลังแก้ไข",
      dataIndex: "afterValue",
      align: "center" as AlignType,
      render: (value: string, row: any) => {
        const action = row.action?.replaceAll(" ", "");
        return (
          <>
            {action === "Changestatus" ? (
              <Tag color={value === "true" ? color.success : color.warning}>
                {value === "true" ? "ACTIVE" : "INACTIVE"}
              </Tag>
            ) : (
              <Text level={6}>{value || "-"}</Text>
            )}
          </>
        );
      },
    },
    {
      title: "ผู้ใช้งาน",
      dataIndex: "createBy",
      align: "center" as AlignType,
      render: (createBy: string) => createBy || "-",
    },
  ];

  return (
    <>
      <br />
      <Text fontWeight={700}>รายการประวัติการสร้างโปรโมชัน</Text>
      <br />
      <br />
      <TableContainer>
        <Table columns={columns} dataSource={histories} pagination={false} />
      </TableContainer>
    </>
  );
};

export const PromotionDetail: React.FC = () => {
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const navigate = useNavigate();

  const promoStateValue = useRecoilValue(promotionState);

  const isInvalid =
    !promoStateValue.promotion || moment(promoStateValue.promotion?.endDate).isBefore(moment());

  const PageTitle = () => {
    return (
      <PageTitleNested
        title={"รายละเอียดโปรโมชัน"}
        showBack
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการโปรโมชั่น", path: "/PromotionPage/promotion" },
              {
                text: "รายละเอียดโปรโมชัน",
                path: window.location.pathname,
              },
            ]}
          />
        }
        extra={
          !isInvalid && (
            <Button
              title='แก้ไขโปรโมชัน'
              icon={<EditOutlined />}
              onClick={() => navigate(`/PromotionPage/promotion/edit/${pathSplit[4]}`)}
            />
          )
        }
      />
    );
  };

  const tabsItems = [
    {
      key: "1",
      label: "รายละเอียดโปรโมชัน",
      children: <DetailTab />,
    },
    {
      key: "2",
      label: "ประวัติการสร้างโปรโมชัน",
      children: <HistoryTab />,
    },
  ];

  return (
    <>
      <div className='container '>
        <CardContainer>
          <PageTitle />
          <br />
          <Tabs data={tabsItems} />
        </CardContainer>
      </div>
    </>
  );
};
