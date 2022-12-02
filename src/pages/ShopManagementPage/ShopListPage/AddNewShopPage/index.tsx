import { Divider, Form } from "antd";
import React from "react";
import StepAntd from "../../../../components/StepAntd/StepAntd";
import { CardContainer } from "../../../../components/Card/CardContainer";
import PageTitleNested from "../../../../components/PageTitle/PageTitleNested";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { defaultPropsForm } from "../../../../utility/DefaultProps";
import { useRecoilValue } from "recoil";
import { profileAtom } from "../../../../store/ProfileAtom";
import Swal from "sweetalert2";

function AddNewShopPage(): JSX.Element {
  const [current, setCurrent] = React.useState(0);
  const profile = useRecoilValue(profileAtom);

  const [form] = Form.useForm();
  const onClickNextStep = () => {
    setCurrent(current + 1);
  };
  const onClickPrevStep = () => {
    setCurrent(current - 1);
  };
  const renderStep = () => {
    switch (current) {
      case 0: {
        return <StepOne form={form} company={profile?.company} />;
      }
      case 1: {
        return <StepTwo form={form} onClickBack={onClickPrevStep} />;
      }
    }
  };

  const onFinish = async (values: any) => {
    if (current === 0) {
      onClickNextStep();
      return form.setFieldsValue({
        ...values,
      });
    } else {
      console.log(form.getFieldsValue(true));
    }
    Swal.fire({
      title: "บันทึกข้อมูลสำเร็จ",
      text: "",
      width: 250,
      icon: "success",
      customClass: {
        title: "custom-title",
      },
      showConfirmButton: false,
    });
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
      <Form
        {...defaultPropsForm}
        form={form}
        onFinish={onFinish}
        initialValues={{ isActive: true }}
      >
        {renderStep()}
      </Form>
    </CardContainer>
  );
}

export default AddNewShopPage;
