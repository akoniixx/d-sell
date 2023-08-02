import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Form, message, Modal, Spin } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Button from "../../components/Button/Button";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import { PromotionCreateStep1 } from "./createPromotionStep/PromotionCreateStep1";
import { PromotionCreateStep2 } from "./createPromotionStep/PromotionCreateStep2";
import { PromotionCreateStep3 } from "./createPromotionStep/PromotionCreateStep3";
import { PromotionGroup, PromotionGroupOption, PromotionType } from "../../definitions/promotion";
import productState from "../../store/productList";
import { ProductEntity } from "../../entities/PoductEntity";
import {
  createPromotion,
  getPromotionById,
  updatePromotion,
  updatePromotionFile,
} from "../../datasource/PromotionDatasource";
import { FlexCol } from "../../components/Container/Container";
import { CheckCircleTwoTone } from "@ant-design/icons";
import color from "../../resource/color";
import Text from "../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import promotionState from "../../store/promotion";
import { PromotionConditionGroupEntity } from "../../entities/PromotionSettingEntity";
import StepAntd from "../../components/StepAntd/StepAntd";

export const PromotionCreatePage: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEditing = pathSplit[3] === "edit";

  const productList = useRecoilValue(productState);
  const setProductList = useSetRecoilState(productState);
  const promoStateValue = useRecoilValue(promotionState);
  const setPromoState = useSetRecoilState(promotionState);

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
        setPromoState({ ...promoStateValue, promotion: res });
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
          referencePromotion: res.referencePromotion ? res.referencePromotion : [],
          memoFile: res.fileMemoPath
            ? [
                {
                  uid: "-1",
                  name: "file1.pdf",
                  status: "done",
                  url: fileMemoUrl,
                },
              ]
            : undefined,
        });
        form2.setFieldsValue({
          stores: res.promotionShop,
        });
        if (PromotionGroup.MIX.includes(res.promotionType)) {
          let newList: ProductEntity[] = [];
          let newGroupKeys: number[] = [];
          const conditionDetail: PromotionConditionGroupEntity[] = res?.conditionDetail;
          conditionDetail?.forEach(({ products, conditionDiscount, conditionFreebies }, i) => {
            if (products) {
              const groupKey = i + 1;
              const nextList = products.map((p) => (p.groupKey ? p : { ...p, groupKey }));
              newList = [...newList, ...nextList];
              newGroupKeys = [...newGroupKeys, groupKey];
            }
          });
          console.log({
            newList,
          });
          form3.setFieldValue("items", newList);
        } else {
          form3.setFieldValue("items", res.conditionDetail);
        }
        (res.conditionDetail as any[])?.forEach((p: any, i: number) => {
          if (PromotionGroup.MIX.includes(res?.promotionType)) {
            form3.setFieldValue(`${i + 1}`, p.conditionFreebies || p.conditionDiscount || []);
          } else {
            form3.setFieldValue(`promotion-${p.productId}`, p.condition || []);
          }
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
          <StepAntd
            current={step}
            items={[
              {
                title: "ข้อมูลเบื้องต้น",
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
            ]}
          />
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
      isEditing={isEditing}
      key={2}
      company={company}
    />,
  ];

  const onNext = async () => {
    if (step === 0) {
      form1
        .validateFields()
        .then((values) => {
          setStep(step + 1);
          setPromotionData({
            ...promotionData,
            ...values,
          });
        })
        .catch((errInfo) => {
          console.log("errInfo", errInfo);
        });
    } else if (step === 1) {
      const stores = form2.getFieldValue("stores");
      console.log("s", stores);
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
          if (promotionData.promotionType === PromotionType.FREEBIES_NOT_MIX) {
            const promoList = form3.getFieldsValue();
            if (!Object.entries(promoList).length) {
              Modal.error({
                title: "กรุณาระบุรายละเอียดโปรโมชัน",
              });
              return;
            }
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
          const data = {
            ...promotionData,
            items: form3.getFieldsValue(),
          };
          onSubmit(true, data);
          setPromotionData(data);
        })
        .catch((errInfo) => {
          console.log("errInfo", errInfo, form3.getFieldsValue());
        });
    }
  };

  const onSaveDraft = async () => {
    const data = {
      ...promotionData,
      ...form1.getFieldsValue(),
      stores: form2.getFieldValue("stores"),
      items: form3.getFieldsValue(),
    };
    setPromotionData(data);
    onSubmit(false, data);
  };

  const onSubmit = async (promotionStatus: boolean, promotionData: any) => {
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
      startDate:
        startDate && startTime
          ? `${startDate.format("YYYY-MM-DD")} ${startTime.format("HH:mm")}:00.000`
          : undefined,
      endDate:
        endDate && endTime
          ? `${endDate.format("YYYY-MM-DD")} ${endTime.format("HH:mm")}:00.000`
          : undefined,
      startTime: undefined,
      endTime: undefined,
      createBy: isEditing ? undefined : `${firstname} ${lastname}`,
      updateBy: isEditing ? `${firstname} ${lastname}` : undefined,
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
    } else if (promotionType === PromotionType.DISCOUNT_NOT_MIX) {
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
    } else if (promotionType === PromotionType.FREEBIES_MIX) {
      if (promoStateValue.promotionGroupOption === PromotionGroupOption.UNIT) {
        submitData.conditionDetailDiscount = undefined;
        submitData.conditionMixFreebies = Object.entries(promoList).map(
          ([key, conditionFreebies]) => {
            return {
              products: promoStateValue.productGroup
                .filter((item: ProductEntity) => item.groupKey && `${item.groupKey}` === `${key}`)
                .map((item: ProductEntity) => ({
                  ...item,
                  typeMix: promoStateValue.promotionGroupOption,
                })),
              conditionFreebies,
            };
          },
        );
      } else {
        const weightList: any = {};
        submitData.conditionDetailDiscount = undefined;
        submitData.conditionMixFreebies = Object.entries(promoList)
          .filter(([fullKey, value]) => {
            const [key, isWeight] = fullKey.split("-");
            if (isWeight) weightList[key] = value;
            return !isWeight;
          })
          .map(([key, conditionFreebies]) => {
            return {
              typeMix: promoStateValue.promotionGroupOption,
              size: weightList[key],
              products: promoStateValue.productGroup
                .filter((item: ProductEntity) => item.groupKey && `${item.groupKey}` === `${key}`)
                .map((item: ProductEntity) => ({
                  ...item,
                  typeMix: promoStateValue.promotionGroupOption,
                })),
              conditionFreebies,
            };
          });
      }
    } else if (promotionType === PromotionType.DISCOUNT_MIX) {
      submitData.conditionDetailDiscount = undefined;
      if (promoStateValue.promotionGroupOption !== PromotionGroupOption.WEIGHT) {
        submitData.conditionMixDiscount = Object.entries(promoList).map(
          ([key, conditionDiscount]) => {
            return {
              products: promoStateValue.productGroup
                .filter((item: ProductEntity) => item.groupKey && `${item.groupKey}` === `${key}`)
                .map((item: ProductEntity) => ({
                  ...item,
                  typeMix: promoStateValue.promotionGroupOption,
                })),
              conditionDiscount,
              typeMix: PromotionGroupOption.UNIT,
            };
          },
        );
      } else {
        const groups: any = {};
        Object.entries(promoList).forEach(([fullKey, val]) => {
          const [groupKey, productId] = fullKey.split("-");
          const groupVal = {
            typeMix: "Size",
            ...(groups[groupKey] || {}),
          };
          if (typeof val === "string" || val instanceof String) {
            groupVal.size = val;
          } else if (typeof val === "object") {
            groupVal.products = [...(groupVal.products || []), { ...val, productId }];
          }
          groups[groupKey] = groupVal;
        });
        submitData.conditionMixDiscount = Object.entries(groups).map(([key, conditionDiscount]) => {
          return {
            products: promoStateValue.productGroup
              .filter((item: ProductEntity) => item.groupKey && `${item.groupKey}` === `${key}`)
              .map((item: ProductEntity) => ({
                ...item,
                typeMix: promoStateValue.promotionGroupOption,
              })),
            conditionDiscount,
          };
        });
      }
    } else if (promotionType === PromotionType.OTHER) {
      submitData.conditionDetailDiscount = undefined;
      submitData.conditionOther = Object.entries(promoList).map(([key, values]) => {
        const { detail } = (values as any[])[0];
        return {
          products: promoStateValue.productGroup
            .filter((item: ProductEntity) => item.groupKey && `${item.groupKey}` === `${key}`)
            .map((item: ProductEntity) => ({
              ...item,
              typeMix: promoStateValue.promotionGroupOption,
            })),
          detail,
        };
      });
    }
    const callback = (res: any) => {
      const { success, responseData, developerMessage, userMessage } = res;
      const promotionId = responseData?.promotionId || id;
      const hasFile = file1 || file2 || fileMemo;
      const onDone = () => {
        setDone(true);
        setTimeout(() => {
          if (promotionStatus) {
            navigate("/PromotionPage/promotion");
            navigate(1);
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
          if (fileMemo) formData.append("fileMemo", fileMemo?.originFileObj);
          // TODO debug API
          updatePromotionFile(formData)
            .then((res) => {
              console.log("updatePromotionFile", res);
              onDone();
            })
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
                    onClick={onSaveDraft}
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
