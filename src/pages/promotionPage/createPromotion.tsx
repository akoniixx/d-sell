import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Form, message, Modal, Spin } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Button from "../../components/Button/Button";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import styled from "styled-components";
import { PromotionCreateStep1 } from "./createPromotionSteptsx/PromotionCreateStep1";
import { PromotionCreateStep2 } from "./createPromotionSteptsx/PromotionCreateStep2";
import { PromotionCreateStep3 } from "./createPromotionSteptsx/PromotionCreateStep3";
import { PromotionType } from "../../definitions/promotion";
import productState from "../../store/productList";
import { ProductEntity } from "../../entities/PoductEntity";
import {
  createPromotion,
  getPromotionById,
  updatePromotion,
  updatePromotionFile,
} from "../../datasource/PromotionDatasource";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import { CheckCircleTwoTone } from "@ant-design/icons";
import color from "../../resource/color";
import Text from "../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Steps from "../../components/StepAntd/steps";
import dayjs, { Dayjs } from "dayjs";

export const PromotionCreatePage: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEditing = pathSplit[3] === "edit";

  const productList = useRecoilValue(productState);
  const setProductList = useSetRecoilState(productState);

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();

  const [file1, setFile1] = useState<any>();
  const [file2, setFile2] = useState<any>();
  const [fileMemo, setFileMemo] = useState<any>();
  const [imageUrl1, setImgUrl1] = useState<string>();
  const [imageUrl2, setImgUrl2] = useState<string>();
  const [fileMemoUrl, setFileMemoUrl] = useState<any>();

  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [promotionData, setPromotionData] = useState<any>({
    promotionType: undefined,
    stores: undefined,
    items: undefined,
  });
  const [defaultData, setDefaultData] = useState<any>();
  const [showStep2Error, setStep2Error] = useState(false);

  const [isCreating, setCreating] = useState(false);
  const [isDone, setDone] = useState(false);

  useEffect(() => {
    if (isEditing && !loading) fetchPromotion();
  }, []);

  const fetchPromotion = async () => {
    setLoading(true);
    const id = pathSplit[4];
    await getPromotionById(id)
      .then((res) => {
        console.log("promo", res);
        setDefaultData(res);
        if (res.promotionImageFirst) {
          setImgUrl1(res.promotionImageFirst);
        }
        if (res.promotionImageSecond) {
          setImgUrl2(res.promotionImageSecond);
        }
        if (res.fileMemoPath) {
          setFileMemoUrl(res.fileMemoPath);
        }
        form1.setFieldsValue({
          ...res,
          startDate: dayjs(res.startDate),
          endDate: dayjs(res.endDate),
        });
        form2.setFieldsValue({
          stores: res.promotionShop,
        });
        form3.setFieldValue("items", res.conditionDetail);
        (res.conditionDetail as any[])?.forEach((p: any) => {
          form3.setFieldValue(`promotion-${p.productId}`, p.condition || []);
        });
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const PageTitle = () => {
    return (
      <PageTitleNested
        title={isEditing ? "แก้ไขโปรโมชั่น" : "เพิ่มโปรโมชั่น"}
        showBack
        extra={
          <>
            <Steps
              // progressDot
              current={step}
              items={[
                {
                  title: <>ข้อมูลเบื้องต้น</>,
                },
                {
                  title: (
                    <>
                      เลือกเขต
                      <br />
                      และร้านค้า
                    </>
                  ),
                },
                {
                  title: (
                    <>
                      รายละเอียด
                      <br />
                      โปรโมชั่น
                    </>
                  ),
                },
                // {
                //     title: <>เงื่อนไข&nbsp;/<br/>สิทธิประโยชน์</>,
                // },
              ]}
            />
          </>
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการโปรโมชั่น", path: "/PromotionPage/promotion" },
              {
                text: isEditing ? "แก้ไขโปรโมชั่น" : "เพิ่มโปรโมชั่น",
                path: window.location.pathname,
              },
            ]}
          />
        }
      />
    );
  };

  const stepsComponents = [
    <PromotionCreateStep1
      form={form1}
      file1={file1}
      file2={file2}
      fileMemo={fileMemo}
      setFile1={setFile1}
      setFile2={setFile2}
      setFileMemo={setFileMemo}
      imageUrl1={imageUrl1}
      imageUrl2={imageUrl2}
      fileMemoUrl={fileMemoUrl}
      setImgUrl1={setImgUrl1}
      setImgUrl2={setImgUrl2}
      isEditing={isEditing}
      key={0}
    />,
    <PromotionCreateStep2
      form={form2}
      showError={showStep2Error}
      setError={setStep2Error}
      key={1}
    />,
    <PromotionCreateStep3
      form={form3}
      promotionType={form1.getFieldValue("promotionType")}
      key={2}
    />,
  ];

  const onNext = () => {
    if (step === 0) {
      form1
        .validateFields()
        .then((values) => {
          setStep(step + 1);
          setPromotionData({
            ...promotionData,
            ...values,
          });
          console.log("values", values);
        })
        .catch((errInfo) => {
          console.log("errInfo", errInfo);
        });
    } else if (step === 1) {
      const stores = form2.getFieldValue("stores");
      console.log(stores);
      if (!stores || stores.length <= 0) {
        setStep2Error(true);
      } else {
        setPromotionData({
          ...promotionData,
          stores,
        });
        setStep(step + 1);
      }
    } else if (step === 2) {
      form3
        .validateFields()
        .then((values) => {
          console.log(values);
          if (promotionData.promotionType === PromotionType.FREEBIES_NOT_MIX) {
            const promoList = form3.getFieldsValue();
            const pass = Object.entries(promoList).every(([key, value]) => {
              return (value as any[]).every(
                (val: any) =>
                  val?.freebies &&
                  val?.freebies?.length > 0 &&
                  (val?.freebies as any[]).every(
                    (freebie: any) => freebie?.quantity && freebie?.quantity > 0,
                  ),
              );
            });
            if (!pass) {
              Modal.error({
                title: "กรุณาระบุจำนวนของแถมให้ครบถ้วน",
              });
              return;
            }
          }
          onSubmit(true);
          setPromotionData({
            ...promotionData,
            items: form3.getFieldsValue(),
          });
        })
        .catch((errInfo) => {
          console.log("errInfo", errInfo, form3.getFieldsValue());
        });
    }
  };

  const onSubmit = async (promotionStatus: boolean) => {
    setCreating(true);
    const { promotionType, items, stores, startDate, endDate, startTime, endTime } = promotionData;
    const id = isEditing ? pathSplit[4] : undefined;
    const submitData = {
      ...promotionData,
      promotionId: id,
      promotionStatus,
      isDraft: promotionStatus,
      company,
      stores: undefined,
      items: undefined,
      memoFile: undefined,
      horizontalImage: undefined,
      verticalImage: undefined,
      promotionShop: stores,
      conditionDetailDiscount: [{}],
      conditionDetailFreebies: undefined,
      startDate: `${startDate.format("YYYY-MM-DD")}T${startTime.format("HH:mm")}:00.000Z`,
      endDate: `${endDate.format("YYYY-MM-DD")}T${endTime.format("HH:mm")}:00.000Z`,
      startTime: undefined,
      endTime: undefined,
    };
    const promoList = form3.getFieldsValue();
    if (promotionType === PromotionType.FREEBIES_NOT_MIX) {
      submitData.conditionDetailDiscount = undefined;
      submitData.conditionDetailFreebies = Object.entries(promoList).map(([key, value]) => {
        const [pKey, productId] = key.split("-");
        const { productName, productCategory, productImage, packSize } =
          productList?.allData?.find((p: ProductEntity) => p.productId === productId) ||
          ({} as ProductEntity);
        return {
          productId,
          productName,
          productCategory,
          productImage,
          packsize: packSize,
          condition: value,
        };
      });
    } else {
      submitData.conditionDetailDiscount = Object.entries(promoList).map(([key, value]) => {
        const [pKey, productId] = key.split("-");
        const { productName, productCategory, productImage, packSize } =
          productList?.allData?.find((p: ProductEntity) => p.productId === productId) ||
          defaultData?.conditionDetail?.find((p: any) => p.productId === productId) ||
          ({} as ProductEntity);
        return {
          productId,
          productName,
          productCategory,
          productImage,
          packsize: packSize,
          condition: value,
        };
      });
    }

    // console.log({ promoList, submitData, file1, file2, fileMemo });
    // return;
    const callback = (res: any) => {
      const { success, responseData, developerMessage, userMessage } = res;
      const promotionId = responseData?.promotionId || id;
      const hasFile = file1 || file2 || fileMemo;
      const onDone = () => {
        setDone(true);
        setTimeout(() => {
          if (promotionStatus) {
            navigate("/PromotionPage/promotion");
          } else {
            navigate(`/PromotionPage/promotion/edit/${promotionId}`);
          }
        }, 2000);
        setTimeout(() => {
          setDone(false);
        }, 2000);
      };

      if (success) {
        if (!hasFile) {
          onDone();
        } else {
          const formData = new FormData();
          formData.append("promotionId", promotionId);
          if (file1) formData.append("promotionImageFirst", file1);
          if (file2) formData.append("promotionImageSecond", file2);
          if (fileMemo) formData.append("fileMemo", fileMemo);
          updatePromotionFile(formData)
            .then((res) => onDone())
            .catch((err) => {
              console.log("updatePromotionFile", err);
              throw err;
            });
        }
      } else {
        message.error(userMessage || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        console.log(developerMessage);
      }
    };
    if (!isEditing) {
      await createPromotion(submitData)
        .then(callback)
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setCreating(false);
        });
    } else {
      await updatePromotion(submitData)
        .then(callback)
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setCreating(false);
        });
    }
  };

  return (
    <>
      <div className='container '>
        {
          <CardContainer>
            <PageTitle />
            <Divider />
            {stepsComponents[step]}
            <Divider />
            <Row justify='space-between' gutter={12}>
              <Col xl={3} sm={6}>
                {step > 0 && (
                  <Button
                    typeButton='primary-light'
                    title='ย้อนกลับ'
                    onClick={() => setStep(step - 1)}
                  />
                )}
              </Col>
              <Col xl={15} sm={6}></Col>
              <Col xl={3} sm={6}>
                {(!isEditing || defaultData?.isDraft) && (
                  <Button
                    typeButton='primary-light'
                    title='บันทึกแบบร่าง'
                    disabled={isCreating}
                    onClick={() => onSubmit(false)}
                  />
                )}
              </Col>
              <Col xl={3} sm={6}>
                <Button
                  typeButton='primary'
                  title={step === 2 ? "บันทึก" : "ถัดไป"}
                  onClick={onNext}
                  disabled={isCreating}
                />
              </Col>
            </Row>
          </CardContainer>
        }
      </div>
      <Modal open={isCreating || isDone} footer={null} width={220} closable={false}>
        <FlexCol align='space-around' justify='center' style={{ width: 172, height: 172 }}>
          {isDone ? (
            <CheckCircleTwoTone twoToneColor={color.success} style={{ fontSize: 36 }} />
          ) : (
            <Spin size='large' />
          )}
          <br />
          <Text level={4} align='center'>
            {isDone ? (
              <>
                {isEditing ? "แก้ไข" : "สร้าง"}โปรโมชั่น
                <br />
                สำเร็จ
              </>
            ) : (
              <>
                กำลัง{isEditing ? "แก้ไข" : "สร้าง"}
                <br />
                โปรโมชั่น
              </>
            )}
          </Text>
        </FlexCol>
      </Modal>
    </>
  );
};
