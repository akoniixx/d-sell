import { Divider, Form } from "antd";
import React from "react";
import { useRecoilValue } from "recoil";
import Swal from "sweetalert2";
import { CardContainer } from "../../../../components/Card/CardContainer";
import PageTitleNested from "../../../../components/PageTitle/PageTitleNested";
import StepAntd from "../../../../components/StepAntd/StepAntd";
import { profileAtom } from "../../../../store/ProfileAtom";
import { defaultPropsForm } from "../../../../utility/DefaultProps";
import StepOne from "../AddNewShopPage/StepOne";
import StepTwo from "../AddNewShopPage/StepTwo";

export default function EditShopPage() {
  const [current, setCurrent] = React.useState(0);
  const profile = useRecoilValue(profileAtom);

  const [form] = Form.useForm();
  const onClickNextStep = () => {
    setCurrent(current + 1);
  };
  const onClickPrevStep = () => {
    setCurrent(current - 1);
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

  return (
    <CardContainer>
      <PageTitleNested
        title='แก้ไขร้านค้า'
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
