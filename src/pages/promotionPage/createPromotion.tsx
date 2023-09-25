import React, { useEffect, useMemo, useState } from "react";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import promotionState from "../../store/promotion";
import { PromotionConditionGroupEntity } from "../../entities/PromotionSettingEntity";
import StepAntd from "../../components/StepAntd/StepAntd";
import moment from "moment";

export const PromotionCreatePage: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEditing = pathSplit[3] === "edit";
  const [searchParams, setSearchParams] = useSearchParams();
  const { copyId } = useMemo(() => {
    return { copyId: searchParams.get("copy_id") };
  }, [searchParams]);

  const productList = useRecoilValue(productState);
  const setProductList = useSetRecoilState(productState);
  const promoStateValue = useRecoilValue(promotionState);
  const setPromoState = useSetRecoilState(promotionState);

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();

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

  const [file1, _setFile1] = useState<any>();
  const [file2, _setFile2] = useState<any>();
  const [fileMemo, _setFileMemo] = useState<any>();
  const [imageUrl1, _setImgUrl1] = useState<string>();
  const [imageUrl2, _setImgUrl2] = useState<string>();
  const [fileMemoUrl, _setFileMemoUrl] = useState<any>();
  const [fileEditHistory, setFileEditHistoy] = useState(new Set());

  const fileKeys = {
    IMAGE1: "img1",
    IMAGE2: "img2",
    MEMO: "memo",
  };
  const addFileEditHistory = (s: string) => {
    const set = new Set(fileEditHistory);
    set.add(s);
    setFileEditHistoy(set);
  };
  const setFile1 = (file: any) => {
    _setFile1(file);
    addFileEditHistory(fileKeys.IMAGE1);
  };
  const setImgUrl1 = (file: any) => {
    _setImgUrl1(file);
    addFileEditHistory(fileKeys.IMAGE1);
  };
  const setFile2 = (file: any) => {
    _setFile2(file);
    addFileEditHistory(fileKeys.IMAGE2);
  };
  const setImgUrl2 = (file: any) => {
    _setImgUrl2(file);
    addFileEditHistory(fileKeys.IMAGE2);
  };
  const setFileMemo = (file: any) => {
    _setFileMemo(file);
    addFileEditHistory(fileKeys.MEMO);
  };
  const setFileMemoUrl = (file: any) => {
    _setFileMemoUrl(file);
    addFileEditHistory(fileKeys.MEMO);
  };

  useEffect(() => {
    if ((isEditing || copyId) && !loading) fetchPromotion();
  }, []);

  const fetchPromotion = async () => {
    setLoading(true);
    const id = isEditing || !copyId ? pathSplit[4] : copyId;
    await getPromotionById(id)
      .then((res) => {
        if (copyId) {
          res.promotionCode = res.promotionCode + "_copy";
          res.promotionName = res.promotionName + " (copy)";
          res.startDate = null;
          res.endDate = null;
        }
        setDefaultData(res);
        let promotionGroupOption;
        if (res?.conditionDetail) {
          if (res.promotionType === PromotionType.DISCOUNT_MIX) {
            promotionGroupOption = res.conditionDetail[0]?.conditionDiscount?.typeMix;
          } else if (res.promotionType === PromotionType.FREEBIES_MIX) {
            promotionGroupOption = res.conditionDetail[0]?.typeMix;
          }
        }
        setPromoState({ ...promoStateValue, promotion: res, promotionGroupOption });
        if (res.promotionImageFirst) {
          _setImgUrl1(res.promotionImageFirst);
        }
        if (res.promotionImageSecond) {
          _setImgUrl2(res.promotionImageSecond);
        }
        if (res.fileMemoPath) {
          _setFileMemoUrl(res.fileMemoPath);
        }
        form1.setFieldsValue({
          ...res,
          startDate: copyId ? undefined : dayjs(res.startDate),
          endDate: copyId ? undefined : dayjs(res.endDate),
          startTime: copyId ? undefined : dayjs(res.startDate),
          endTime: copyId ? undefined : dayjs(res.endDate),
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
          firstDateNoti: copyId ? undefined : dayjs(res.notiFirstDate),
          notiSecondDate: copyId ? undefined : dayjs(res.notiSecondDate),
          firstTimeNoti: copyId ? undefined : dayjs(res.notiFirstDate),
          secondTimeNoti: copyId ? undefined : dayjs(res.notiSecondDate),
        });
        form2.setFieldsValue({
          stores: res.promotionShop,
        });
        if (PromotionGroup.MIX.includes(res.promotionType)) {
          let newList: ProductEntity[] = [];
          let newGroupKeys: number[] = [];
          const conditionDetail: PromotionConditionGroupEntity[] = res?.conditionDetail;
          conditionDetail?.forEach(({ products, conditionDiscount, conditionFreebies }, i) => {
            if (res.promotionType !== "OTHER") {
              const getType =
                res?.conditionDetail[i].typeMix ||
                res?.conditionDetail[i].conditionDiscount.typeMix ||
                "";
              if (getType === PromotionGroupOption.UNIT) {
                const groupKey = i + 1;
                const nextList = products?.map((p) => (p.groupKey ? p : { ...p, groupKey })) || [];
                newList = [...newList, ...nextList];
                newGroupKeys = [...newGroupKeys, groupKey];
              } else {
                const groupKey = i + 1;
                const nextList = products?.map((p) => (p.groupKey ? p : { ...p, groupKey })) || [];
                newList = [...newList, ...nextList];
                if (conditionDiscount) {
                  newList = newList.map((x) => {
                    const findDiscountPrice = conditionDiscount.products.find(
                      (y: any) => y.productId === x.productId,
                    );
                    if (findDiscountPrice) {
                      return {
                        ...x,
                        discountPrice: findDiscountPrice.discountPrice,
                        size: res?.conditionDetail[i].conditionDiscount.size,
                      };
                    } else {
                      return { ...x };
                    }
                  });
                } else {
                  newList = newList.map((x) => {
                    return { ...x, size: res?.conditionDetail[i].size };
                  });
                }
                newGroupKeys = [...newGroupKeys, groupKey];
              }
            } else {
              const groupKey = i + 1;
              const nextList = products?.map((p) => (p.groupKey ? p : { ...p, groupKey })) || [];
              newList = [...newList, ...nextList];
              newGroupKeys = [...newGroupKeys, groupKey];
            }
          });
          form3.setFieldValue("items", newList);
        } else {
          form3.setFieldValue("items", res.conditionDetail);
        }
        (res.conditionDetail as any[])?.forEach((p: any, i: number) => {
          if (PromotionGroup.MIX.includes(res?.promotionType)) {
            form3.setFieldValue(
              `${i + 1}`,
              p.conditionFreebies || p.conditionDiscount || [{ detail: p.detail }] || [],
            );
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
      setFileMemoUrl={setFileMemoUrl}
      setImgUrl1={setImgUrl1}
      setImgUrl2={setImgUrl2}
      isEditing={isEditing}
      isCopying={!!copyId}
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
      isCopying={!!copyId}
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
          if (
            promotionData.promotionType === PromotionType.FREEBIES_NOT_MIX ||
            promotionData.promotionType === PromotionType.FREEBIES_MIX
          ) {
            const promoList = form3.getFieldsValue();
            if (!Object.entries(promoList).length) {
              Modal.error({
                title: "กรุณาระบุรายละเอียดโปรโมชัน",
              });
              return;
            }
            const pass = Object.entries(promoList).every(([key, value]) => {
              if (
                promotionData.promotionType === PromotionType.FREEBIES_MIX &&
                key.split("-")[1] === "weight"
              ) {
                return true;
              }
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
          onSubmit(false, data);
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
    const {
      promotionType,
      items,
      stores,
      startDate,
      endDate,
      startTime,
      endTime,
      firstDateNoti,
      firstTimeNoti,
      secondTimeNoti,
    } = promotionData;
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
      conditionDetailDiscount: undefined,
      conditionDetailFreebies: undefined,
      startDate:
        startDate && startTime
          ? dayjs(
              `${startDate.format("YYYY-MM-DD")} ${startTime.format("HH:mm")}:00.000`,
            ).toISOString()
          : undefined,
      endDate:
        endDate && endTime
          ? dayjs(`${endDate.format("YYYY-MM-DD")} ${endTime.format("HH:mm")}:00.000`).toISOString()
          : undefined,
      startTime: undefined,
      endTime: undefined,
      notiFirstDate:
        firstDateNoti && firstTimeNoti
          ? dayjs(
              `${firstDateNoti.format("YYYY-MM-DD")} ${firstTimeNoti.format("HH:mm")}:00.000`,
            ).toISOString()
          : undefined,
      notiSecondDate:
        startDate && secondTimeNoti
          ? dayjs(
              `${startDate.format("YYYY-MM-DD")} ${secondTimeNoti.format("HH:mm")}:00.000`,
            ).toISOString()
          : undefined,
      createBy: isEditing ? undefined : `${firstname} ${lastname}`,
      updateBy: isEditing ? `${firstname} ${lastname}` : undefined,
    };
    const promoList = form3.getFieldsValue();
    if (promotionType === PromotionType.FREEBIES_NOT_MIX) {
      submitData.conditionDetailDiscount = undefined;
      submitData.conditionDetailFreebies = Object.entries(promoList).map(([key, value]: any[]) => {
        const [pKey, productId] = key.split("-");
        const { productName, productCategory, productImage, packSize } =
          productList?.allData?.find((p: ProductEntity) => p.productId === productId) ||
          ({} as ProductEntity);
        const condition = value.map((v: any) => {
          return {
            ...v,
            freebies: v.freebies?.map((fb: any) => ({ ...fb, product: undefined })),
          };
        });
        return {
          productId,
          productName,
          productCategory,
          productImage,
          packsize: packSize,
          condition,
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
          ([key, condition]: any[]) => {
            const conditionFreebies = condition.map((v: any) => {
              return {
                ...v,
                freebies: v.freebies?.map((fb: any) => ({ ...fb, product: undefined })),
              };
            });
            return {
              products: promoStateValue.productGroup
                .filter((item: ProductEntity) => item.groupKey && `${item.groupKey}` === `${key}`)
                .map((item: ProductEntity) => ({
                  ...item,
                })),
              typeMix: promoStateValue.promotionGroupOption
                ? promoStateValue.promotionGroupOption
                : PromotionGroupOption.UNIT,
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
          .map(([key, condition]: any[]) => {
            const conditionFreebies = condition.map((v: any) => {
              return {
                ...v,
                freebies: v.freebies?.map((fb: any) => ({ ...fb, product: undefined })),
              };
            });
            return {
              typeMix: promoStateValue.promotionGroupOption
                ? promoStateValue.promotionGroupOption
                : PromotionGroupOption.UNIT,
              size: weightList[key],
              products: promoStateValue.productGroup
                .filter((item: ProductEntity) => item.groupKey && `${item.groupKey}` === `${key}`)
                .map((item: ProductEntity) => ({
                  ...item,
                  typeMix: promoStateValue.promotionGroupOption
                    ? promoStateValue.promotionGroupOption
                    : PromotionGroupOption.UNIT,
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
                  typeMix: promoStateValue.promotionGroupOption
                    ? promoStateValue.promotionGroupOption
                    : PromotionGroupOption.UNIT,
                })),
              conditionDiscount,
              typeMix: promoStateValue.promotionGroupOption
                ? promoStateValue.promotionGroupOption
                : PromotionGroupOption.UNIT,
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
                typeMix: promoStateValue.promotionGroupOption
                  ? promoStateValue.promotionGroupOption
                  : PromotionGroupOption.UNIT,
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
              typeMix: promoStateValue.promotionGroupOption
                ? promoStateValue.promotionGroupOption
                : PromotionGroupOption.UNIT,
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
          navigate("/PromotionPage/promotion");
          navigate(1);
        }, 2000);
        setTimeout(() => {
          setDone(false);
        }, 2000);
      };

      if (success) {
        if (!hasFile && fileEditHistory.size <= 0) {
          onDone();
        } else {
          const formData = new FormData();
          formData.append("promotionId", promotionId);
          if (fileEditHistory.has(fileKeys.IMAGE1)) {
            formData.append("promotionImageFirstCheck", "true");
            formData.append("promotionImageFirst", file1);
          }
          if (fileEditHistory.has(fileKeys.IMAGE2)) {
            formData.append("promotionImageSecondCheck", "true");
            formData.append("promotionImageSecond", file2);
          }
          if (fileEditHistory.has(fileKeys.MEMO)) {
            formData.append("fileMemoCheck", "true");
            formData.append("fileMemo", fileMemo?.originFileObj);
          }
          // if (file1) formData.append("promotionImageFirst", file1);
          // if (file2) formData.append("promotionImageSecond", file2);
          // if (fileMemo) formData.append("fileMemo", fileMemo?.originFileObj);

          // for (const pair of formData.entries()) {
          //   console.log(pair[0] + ", " + pair[1]);
          // }
          updatePromotionFile(formData)
            .then((res) => {
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

    console.log("submitData", submitData);

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
              {/* <Col xl={3} sm={6}>
                {(!isEditing || defaultData?.isDraft) && (
                  <Button
                    typeButton='primary-light'
                    title='บันทึกแบบร่าง'
                    disabled={isCreating}
                    onClick={onSaveDraft}
                  />
                )}
              </Col> */}
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
