import React, { useEffect, useState, memo, useMemo } from "react";
import { CardContainer } from "../../components/Card/CardContainer";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";

const PromotionDetail: React.FC = () => {
  const PageTitle = () => {
    return <PageTitleNested title='เพิ่มโปรโมชั่น' showBack />;
  };

  return (
    <>
      <div className='container '>
        <CardContainer>
          <PageTitle />
          <br />
        </CardContainer>
      </div>
    </>
  );
};
