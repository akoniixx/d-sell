import { Divider } from "antd";
import React from "react";
import StepAntd from "../../../../components/StepAntd/StepAntd";
import { CardContainer } from "../../../../components/Card/CardContainer";
import PageTitleNested from "../../../../components/PageTitle/PageTitleNested";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";

function AddNewShopPage(): JSX.Element {
  const [current, setCurrent] = React.useState(0);
  const renderStep = () => {
    switch (current) {
      case 0: {
        return <StepOne />;
      }
      case 1: {
        return <StepTwo />;
      }
    }
  };
  return (
    <CardContainer
      style={{
        padding: "24px 0 16px",
      }}
    >
      <PageTitleNested
        style={{
          padding: "0 24px",
        }}
        title='เพิ่มร้านค้า'
        extra={
          <div>
            <StepAntd
              current={current}
              onChange={(current) => setCurrent(current)}
              items={[
                {
                  title: "ประเภทสมาชิก",
                },
                {
                  title: "ข้อมูลบุคคล / ข้อมูลร้านค้า",
                },
              ]}
            />
          </div>
        }
      />

      <Divider />
      {renderStep()}
    </CardContainer>
  );
}

export default AddNewShopPage;
