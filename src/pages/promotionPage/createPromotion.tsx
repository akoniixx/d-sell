import React, { useEffect, useState, memo, useMemo } from "react";
import { Table, Tabs, Row, Col, Input, Select, Avatar, Tag, Switch, DatePicker, Divider, Steps as AntdStep, Form } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { UnorderedListOutlined, SearchOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import { getProductList } from "../../datasource/ProductDatasource";
import { nameFormatter, priceFormatter } from "../../utility/Formatter";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import Text from "../../components/Text/Text";
import { BrandEntity } from "../../entities/BrandEntity";
import { useRecoilValue } from "recoil";
import { profileAtom } from "../../store/ProfileAtom";
import { ProductGroupEntity } from "../../entities/ProductGroupEntity";
import color from "../../resource/color";
import * as _ from "lodash";
import Button from "../../components/Button/Button";
import moment from "moment";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import styled from "styled-components";
import { PromotionCreateStep1 } from "./createPromotionSteptsx/PromotionCreateStep1";
import { PromotionCreateStep2 } from "./createPromotionSteptsx/PromotionCreateStep2";
import { PromotionCreateStep3 } from "./createPromotionSteptsx/PromotionCreateStep3";
import { PromotionType } from "../../definitions/promotion";

const { RangePicker } = DatePicker;

type FixedType = "left" | "right" | boolean;
const SLASH_DMY = "DD/MM/YYYY";

const Steps = styled(AntdStep)`
    .ant-steps-item-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .ant-steps-item-title {
      height: 48px;
      width: 96px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
    }
    .ant-steps-item-title::after {
      position: absolute;
      top: 16px;
      left: 100%;
      display: block;
      width: 100px;
    } 
`;

export const PromotionCreatePage: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };

  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [form4] = Form.useForm();

  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState({
    count: 0,
    count_location: [],
    data: [],
    groups: [],
    categories: [],
    brands: [],
  });
  const [promotionData, setPromotionData] = useState({
    promotionType: undefined,
    stores: undefined,
    items: undefined,
  });
  const [showStep2Error, setStep2Error] = useState(false);

  useEffect(() => {
    if (!loading) fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const PageTitle = () => {
    return (
      <PageTitleNested
        title='เพิ่มโปรโมชั่น'
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
                            title: <>เลือกเขต<br/>และร้านค้า</>,
                        },
                        {
                            title: <>รายละเอียด<br/>โปรโมชั่น</>,
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
              { text: "เพิ่มโปรโมชั่น", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };

  const stepsComponents = [
    <PromotionCreateStep1 form={form1} key={0}/>,
    <PromotionCreateStep2 
      form={form2} 
      showError={showStep2Error}
      setError={setStep2Error}
      key={1}
    />,
    <PromotionCreateStep3 
      form={form3} 
      promotionType={form1.getFieldValue('promotionType')}
      key={2}
    />,
  ]

  const onNext = () => {
    if(step === 0){
      form1.validateFields()
      .then((values) => {
          setStep(step+1);
          setPromotionData({
            ...promotionData,
            ...values
          });
          console.log('values', values);
      })
      .catch((errInfo) => {
        console.log('errInfo', errInfo);
      })
    } else if (step === 1) {
      const stores = form2.getFieldValue('store')
      if(!stores || stores.length <= 0){
        console.log('test')
      }else{
        setPromotionData({
          ...promotionData,
          stores
        })
      }
      setStep(step+1);
    } else if (step === 2) {
        onSubmit(true);
    }
  }

  const onSubmit = async (promotionStatus: boolean) => {
    const { promotionType, items } = promotionData;
    const submitData = {
      ...promotionData,
      conditionDetailDiscount: undefined,
      conditionDetailFreebies: undefined
    };
    if(promotionType === PromotionType.FREEBIES_NOT_MIX){
      submitData.conditionDetailDiscount = items;
    } else {
      submitData.conditionDetailFreebies = items;
    }
    
    console.log({ promotionData, submitData });
  }

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
              {step > 0 && <Button 
                typeButton='primary-light'
                title="ย้อนกลับ"
                onClick={() => setStep(step-1)}
              />}
            </Col>
            <Col xl={15} sm={6}></Col>
            <Col xl={3} sm={6}>
              <Button 
                typeButton='primary-light'
                title="บันทึกแบบร่าง"
              />
            </Col>
            <Col xl={3} sm={6}>
              <Button 
                typeButton='primary'
                title={step===2 ? "บันทึก" : "ถัดไป"}
                onClick={onNext}
              />
            </Col> 
          </Row>
        </CardContainer>
      </div>
    </>
  );
};
