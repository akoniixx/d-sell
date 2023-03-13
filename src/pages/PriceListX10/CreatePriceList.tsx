import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Form, message, Modal, Spin } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { constSelector, useRecoilValue, useSetRecoilState } from "recoil";
import Button from "../../components/Button/Button";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import styled from "styled-components";
import { CreatePriceListStep1 } from "./CreatePriceListStep/CreatePriceListStep1";
import { CreatePriceListStep2 } from "./CreatePriceListStep/CreatePriceListStep2";
import { PromotionType } from "../../definitions/promotion";
import productState from "../../store/productList";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import { CheckCircleTwoTone } from "@ant-design/icons";
import color from "../../resource/color";
import Text from "../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import Steps from "../../components/StepAntd/steps";
import { StoreEntity } from "../../entities/StoreEntity";
import { createSpecialPrice } from "../../datasource/SpecialPriceDatasource";

export const PriceListCreatePage: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEditing = pathSplit[2] === "edit";

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [specialPriceData, setSpecialPriceData] = useState<any>({
    stores: undefined,
    items: undefined,
  });
  const [defaultData, setDefaultData] = useState<any>();
  const [showStep2Error, setStep2Error] = useState(false);

  const [isCreating, setCreating] = useState(false);
  const [isDone, setDone] = useState(false);

  const PageTitle = () => {
    return (
      <PageTitleNested
        title={isEditing ? "แก้ไขราคาเฉพาะร้าน" : "เพิ่มราคาเฉพาะร้าน"}
        showBack
        onBack={() => navigate(`/price/list`)}
        extra={
          <>
            <Steps
              current={step}
              items={[
                {
                  title: (
                    <>
                      เลือกเขต และ
                      <br />
                      ร้านค้า
                    </>
                  ),
                },
                {
                  title: (
                    <>
                      ระบุราคา
                      <br />
                      เฉพาะร้าน
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
              { text: "รายการสินค้าเฉพาะร้าน", path: "/price/list" },
              {
                text: isEditing ? "แก้ไขราคาเฉพาะร้าน" : "เพิ่มราคาเฉพาะร้าน",
                path: window.location.pathname,
              },
            ]}
          />
        }
      />
    );
  };

  const stepsComponents = [
    <CreatePriceListStep1
      form={form1}
      showError={showStep2Error}
      setError={setStep2Error}
      key={0}
    />,
    <CreatePriceListStep2 form={form2} isEditing={isEditing} key={1} />,
  ];

  const onNext = () => {
    if (step === 0) {
      form1
        .validateFields()
        .then((values) => {
          console.log("values", values);
          const stores = form1.getFieldValue("stores");
          console.log({ stores });
          if (!stores || stores.length <= 0) {
            setStep2Error(true);
          } else {
            const data = {
              ...specialPriceData,
              stores: stores?.map((s: StoreEntity) => ({
                ...s,
                receiveAmount: parseFloat(values[s.customerCompanyId]),
                usedAmount: 0,
              })),
            };
            setSpecialPriceData(data);
            setStep(step + 1);
          }
          console.log("values", values);
        })
        .catch((errInfo) => {
          console.log("errInfo", errInfo);
        });
    } else if (step === 1) {
      form2
        .validateFields()
        .then((values) => {
          const stores = form1.getFieldValue("stores");
          const priceList: { productId: number; value: number }[] = [];
          Object.keys(values).forEach((key) => {
            const [productId, type] = key.split("-");
            if (type === "price") {
              priceList.push({
                productId: parseInt(productId),
                value: parseFloat(values[key]) * values[`${productId}-type`],
              });
            }
          });
          console.log("values", values, stores);
          const data: {
            customerId: any;
            customerCompanyId: any;
            customerName: any;
            zone: any;
            productId: number;
            value: number;
            company: string;
            createBy: string;
            updateBy: string;
          }[] = [];
          const loginName = firstname + " " + lastname;
          stores.forEach(({ customerId, customerCompanyId, customerName, zone }: any) => {
            priceList.forEach((price) => {
              data.push({
                ...price,
                customerId,
                customerCompanyId,
                customerName,
                zone,
                company,
                createBy: loginName,
                updateBy: loginName,
              });
            });
          });
          onSubmit(true, data);
        })
        .catch((errInfo) => {
          console.log("errInfo", errInfo);
        });
    }
  };

  const onSubmit = async (status: boolean, data: any) => {
    setCreating(true);
    const submitData = {
      specialPriceShop: data,
      company,
      status,
    };

    const callback = (res: any) => {
      const { success, responseData, developerMessage, userMessage } = res;
      // const promotionId = responseData?.promotionId || id;
      const onDone = () => {
        setDone(true);
        setTimeout(() => {
          navigate("/price/list");
          navigate(1);
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
    console.log({ submitData });
    await createSpecialPrice(submitData)
      .then(callback)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setCreating(false);
      });
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
                สร้างราคาเฉพาะร้าน
                <br />
                สำเร็จ
              </>
            ) : (
              <>
                กำลังสร้าง
                <br />
                ราคาเฉพาะร้าน
              </>
            )}
          </Text>
        </FlexCol>
      </Modal>
    </>
  );
};
