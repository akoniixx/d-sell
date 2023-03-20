import { Col, Divider, Row } from "antd";
import { useState } from "react";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import StepAntd from "../../../components/StepAntd/StepAntd";
import Text from "../../../components/Text/Text";

export const CreateConditionCOPage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const PageTitle = () => {
    return (
      <Row align='middle' gutter={12}>
        <Col className='gutter-row' xl={16} sm={6}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              เพิ่มรายการเงื่อนไข CO
            </span>
          </div>
        </Col>
        <Col className='gutter-row' xl={8} sm={6}>
          <StepAntd
            current={current}
            onChange={(current) => setCurrent(current)}
            items={[
              {
                title: "ข้อมูลเบื้องต้น",
              },
              {
                title: "ข้อมูลร้านค้า",
              },
              {
                title: "ข้อมูลสินค้า",
              },
            ]}
          />
        </Col>
        <Divider />
      </Row>
    );
  };
  const StepOne = () => {
    return (
      <>
        <Text level={5} fontWeight={700}>
          รายละเอียดข้อมูลเบื้องต้น
        </Text>
      </>
    );
  };
  const StepTwo = () => {
    return (
      <>
        <Text level={5} fontWeight={700}>
          รายละเอียดร้านค้า
        </Text>
      </>
    );
  };
  const StepThree = () => {
    return (
      <>
        <Text level={5} fontWeight={700}>
          รายละเอียดสินค้า
        </Text>
      </>
    );
  };
  const nextStep = () => {
    current === 2 && setCurrent(current);
  };
  const renderStep = () => {
    switch (current) {
      case 0: {
        return <StepOne />;
      }
      case 1: {
        return <StepTwo />;
      }
      case 2: {
        return <StepThree />;
      }
    }
  };
  return (
    <>
      <CardContainer>
        <PageTitle />
        {renderStep()}
        <Divider />
        <Row justify='space-between' gutter={12}>
          <Col xl={3} sm={6}>
            {current > 0 && (
              <Button
                typeButton='primary-light'
                title='ย้อนกลับ'
                onClick={() => setCurrent(current - 1)}
              />
            )}
          </Col>
          <Col xl={15} sm={6}></Col>
          <Col xl={3} sm={6}>
            <Button
              typeButton='primary'
              title={current === 2 ? "บันทึก" : "ถัดไป"}
              onClick={() => {
                setCurrent(current + 1), nextStep();
              }}
            />
          </Col>
        </Row>
      </CardContainer>
    </>
  );
};
