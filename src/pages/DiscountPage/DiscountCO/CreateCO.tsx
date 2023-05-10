import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Form, message, Modal, Spin } from "antd";
import { CardContainer } from "../../../components/Card/CardContainer";
import { constSelector, useRecoilValue, useSetRecoilState } from "recoil";
import Button from "../../../components/Button/Button";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import styled from "styled-components";
import { CreateCOStep1 } from "./CreateCOStep/CreateCOStep1";
import { PromotionType } from "../../../definitions/promotion";
import productState from "../../../store/productList";
import { ProductEntity } from "../../../entities/PoductEntity";
import {
  createCreditMemo,
  getCreditMemoById,
  updateCreditMemo,
} from "../../../datasource/CreditMemoDatasource";
import { FlexCol, FlexRow } from "../../../components/Container/Container";
import { CheckCircleTwoTone } from "@ant-design/icons";
import color from "../../../resource/color";
import Text from "../../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Steps from "../../../components/StepAntd/steps";
import { StoreEntity } from "../../../entities/StoreEntity";
import { CreateCOStep2 } from "./CreateCOStep/CreateCOStep2";
import { CreditMemoShopEntity } from "../../../entities/CreditMemoEntity";

export const DiscountCreatePage: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEditing = pathSplit[2] === "edit";
  const id = pathSplit[3];

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [creditMemoData, setCreditMemoData] = useState<any>({
    stores: undefined,
    items: undefined,
  });
  const [fileMemo, setFileMemo] = useState<any>();
  const [fileMemoUrl, setFileMemoUrl] = useState<any>();
  const [defaultData, setDefaultData] = useState<any>();
  const [showStep2Error, setStep2Error] = useState(false);

  const [isCreating, setCreating] = useState(false);
  const [isDone, setDone] = useState(false);

  useEffect(() => {
    if (isEditing && !loading) fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await getCreditMemoById(id)
      .then((res: any) => {
        console.log("creditMemo", res);
        setDefaultData(res);
        form1.setFieldsValue({
          ...res,
        });
        form2.setFieldsValue({
          stores: res.creditMemoShop,
        });
        res?.creditMemoShop?.forEach((s: CreditMemoShopEntity) => {
          form2.setFieldValue(s.customerCompanyId, s.receiveAmount);
        });
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const PageTitle = () => {
    return (
      <PageTitleNested
        title={isEditing ? "แก้ไข ส่วนลดดูแลราคา" : "สร้าง ส่วนลดดูแลราคา"}
        showBack
        extra={
          <>
            <Steps
              current={step}
              items={[
                {
                  title: (
                    <>
                      รายละเอียด
                      <br />
                      เบื้องต้น
                    </>
                  ),
                },
                {
                  title: (
                    <>
                      เลือกร้านค้า
                      <br />
                      และระบุส่วนลด
                    </>
                  ),
                },
              ]}
            />
          </>
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการ เพิ่ม/ลด ส่วนลดดูแลราคา", path: "/discount/list" },
              {
                text: isEditing ? "แก้ไข ส่วนลดดูแลราคา" : "สร้าง ส่วนลดดูแลราคา",
                path: window.location.pathname,
              },
            ]}
          />
        }
      />
    );
  };

  const stepsComponents = [
    <CreateCOStep1
      form={form1}
      isEditing={isEditing}
      fileMemo={fileMemo}
      setFileMemo={setFileMemo}
      fileUrl={""}
      key={0}
    />,
    <CreateCOStep2 form={form2} showError={showStep2Error} setError={setStep2Error} key={1} />,
  ];

  const onNext = () => {
    console.log("onNext", step);
    if (step === 0) {
      form1
        .validateFields()
        .then((values) => {
          setStep(step + 1);
          setCreditMemoData({
            ...creditMemoData,
            ...values,
          });
          console.log("values", values);
        })
        .catch((errInfo) => {
          console.log("errInfo", errInfo);
        });
    } else if (step === 1) {
      console.log("onNext s1", form2.getFieldsValue());
      form2
        .validateFields()
        .then((values) => {
          console.log("values", values);
          const stores = form2.getFieldValue("stores");
          console.log({ stores });
          if (!stores || stores.length <= 0) {
            setStep2Error(true);
          } else {
            const data = {
              ...creditMemoData,
              creditMemoShop: stores?.map((s: StoreEntity) => ({
                ...s,
                creditMemoId: isEditing ? id : undefined,
                receiveAmount: parseFloat(values[s.customerCompanyId]),
                usedAmount: 0,
                creditMemoShopStatus: true,
              })),
            };
            setCreditMemoData(data);
            onSubmit(true, data);
          }
        })
        .catch((errInfo) => {
          console.log("errInfo", errInfo);
        });
    }
  };

  const onSubmit = async (creditMemoStatus: boolean, data: any) => {
    setCreating(true);
    const { startDate, startTime } = creditMemoData;
    const id = isEditing ? pathSplit[3] : undefined;
    const username = `${firstname} ${lastname}`;
    const submitDataObj = {
      ...data,
      creditMemoId: id,
      company,
      creditMemoStatus,
      createBy: isEditing ? undefined : username,
      updateBy: isEditing ? username : undefined,
    };
    const submitData = new FormData();
    Object.entries(submitDataObj).forEach(([key, value]) => {
      if (!["file", "creditMemoShop"].includes(key) && value) submitData.append(key, `${value}`);
    });
    submitDataObj?.creditMemoShop?.forEach((shop: CreditMemoShopEntity) => {
      const str = JSON.stringify(shop);
      submitData.append("creditMemoShop", str);
    });
    submitData.append("file", fileMemo?.originFileObj);
    const callback = (res: any) => {
      const { success, responseData, developerMessage, userMessage } = res;
      // const promotionId = responseData?.promotionId || id;
      const onDone = () => {
        setDone(true);
        setTimeout(() => {
          navigate("/discount/list");
        }, 2000);
        setTimeout(() => {
          setDone(false);
        }, 2000);
      };

      if (success) {
        onDone();
      } else {
        message.error(userMessage || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        console.log(developerMessage);
      }
    };
    // console.log({ submitDataObj, fileMemo });
    // return;

    if (!isEditing) {
      await createCreditMemo(submitData)
        .then(callback)
        .catch((err: any) => {
          console.log(err);
        })
        .finally(() => {
          setCreating(false);
        });
    } else {
      await updateCreditMemo(submitData)
        .then(callback)
        .catch((err: any) => {
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
            <Col xl={18} sm={12}></Col>
            <Col xl={3} sm={6}>
              <Button
                typeButton='primary'
                title={step === 1 ? "บันทึก" : "ถัดไป"}
                onClick={onNext}
                disabled={isCreating}
              />
            </Col>
          </Row>
        </CardContainer>
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
                {isEditing ? "แก้ไข" : "สร้าง"} ส่วนลดดูแลราคา
                <br />
                สำเร็จ
              </>
            ) : (
              <>
                กำลัง{isEditing ? "แก้ไข" : "สร้าง"}
                <br />
                ส่วนลดดูแลราคา
              </>
            )}
          </Text>
        </FlexCol>
      </Modal>
    </>
  );
};
