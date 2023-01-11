import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Form, message, Modal, Spin } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Button from "../../components/Button/Button";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import styled from "styled-components";
import { PromotionCreateStep1 } from "./CreateCOStep/CreateCOStep1";
import { PromotionCreateStep2 } from "./CreateCOStep/CreateCOStep2";
import { PromotionType } from "../../definitions/promotion";
import productState from "../../store/productList";
import { ProductEntity } from "../../entities/PoductEntity";
import { createCreditMemo, getCreditMemoById, updateCreditMemo } from "../../datasource/CreditMemoDatasource";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import { CheckCircleTwoTone, EditOutlined } from "@ant-design/icons";
import color from "../../resource/color";
import Text from "../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Steps from "../../components/StepAntd/steps";
import { StoreEntity } from "../../entities/StoreEntity";

export const CreditMemoDetail: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;

  const [loading, setLoading] = useState(false)
  const [defaultData, setDefaultData] = useState<any>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const id = pathSplit[4];
    await getCreditMemoById(id)
      .then((res) => {
        console.log('promo', res);
        setDefaultData(res);

      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  const PageTitle = () => {
    return (
      <PageTitleNested
        title='รายละเอียด Credit Memo'
        showBack
        extra={
            <Button
                type='primary'
                icon={<EditOutlined/>}
                title='แก้ไขรายละเอียด'
                height={40}
                onClick={() => navigate(`/discount/edit/${pathSplit[3]}`)}
            />
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการ เพิ่ม/ลด Credit Memo", path: "/discount/list" },
              { text: "รายละเอียด Credit Memo", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };

  const tabsItems = [
    { label: `รายละเอียด Credit Memo`, key: '1' },
    { label: `ประวัติการสร้าง Credit Memo`, key: '2' },
  ];

  return (
    <>
      <div className='container '>
        <CardContainer>
            <PageTitle />
            <Divider />
        </CardContainer>    
      </div>
    </>
  );
};
