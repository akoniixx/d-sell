import { Col, Divider,Form, Modal, Row } from "antd"
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb"
import { CardContainer } from "../../../components/Card/CardContainer"
import PageTitleNested from "../../../components/PageTitle/PageTitleNested"
import { useLocation, useNavigate } from "react-router-dom"
import  { useForm } from "antd/lib/form/Form"
import Input from "../../../components/Input/Input"
import Text from "../../../components/Text/Text";
import Button from "../../../components/Button/Button"
import { useEffect, useState } from "react"
import { color } from "../../../resource"
import { zoneDatasource } from "../../../datasource/ZoneDatasource"


export const CreateZone:React.FC = () => {
    const navigate = useNavigate();
    const [form] = useForm();
    const { pathname } = window.location;
    const pathSplit = pathname.split("/") as Array<string>;
    const isEdit = pathSplit[3] !== "create";
    const [showModal, setModal] = useState(false);
    const location = useLocation();
    const  data = location?.state?.row
    const userProfile = JSON.parse(localStorage.getItem("profile")!);

const onSubmit = async() => {
    const formValue = form.getFieldsValue(true);
   
    if(isEdit){
        const payload = {
            zoneId: data.zoneId,
            company: data.company,
            zoneName: formValue.zoneName,
            isActive: true,
            updateBy: `${userProfile.firstname} ${userProfile.lastname}`
        }
        try {
           
            const res = await zoneDatasource.patchZone(payload)
            if(res.success) {
                setModal(false);
                setTimeout(() => {
                  navigate(-1);
                }, 200);
              }
        } catch (error) {
            console.log(error)
            
        }
    }else{
        const payload = {
            company: userProfile.company,
            zoneName: formValue.zoneName,
            isActive: true,
            createBy: `${userProfile.firstname} ${userProfile.lastname}`
        }
        try {
            const res = await zoneDatasource.postZone(payload)
            if(res.success) {
                setModal(false);
                setTimeout(() => {
                  navigate(-1);
                }, 200);
              }
        } catch (error) {
            console.log(error)
        }
    }


}
const getValue = () =>{
    form.setFieldsValue({
        zoneName: data?.zoneName,
       
      });
}
useEffect(()=>{

    if(isEdit){
        getValue()
    }
    else{
        form.setFieldsValue({
            zoneName: '',
           
          });
    }
   
},[])

    return (
        <CardContainer>
        <PageTitleNested
          title={isEdit ? "แก้ไขเขต" : "เพิ่มเขต"}
          showBack
          onBack={() => navigate(`/generalSettings/zoneSetting`)}
          customBreadCrumb={
            <BreadCrumb
              data={[
                { text: "รายการเขต", path: `/generalSettings/zoneSetting` },
                {
                  text: isEdit ? "ข้อมูลเขต" : "เพิ่มเขต",
                  path: window.location.pathname,
                },
              ]}
            />
          }
        />
        <Divider />
        <Form form={form} layout='vertical' onFinish={() => setModal(true)}>
            <Col span={12}>
            <Form.Item
            name='zoneName'
            label='ชื่อเขต '
            rules={[
              {
                required: true,
                message: "*โปรดระบุชื่อยเขต",
              },
              {
                max: 50,
                message: "*ชื่อข่าวสารต้องมีความยาวไม่เกิน 50 ตัวอักษร",
              },
            ]}
          >
            <Input placeholder='ระบุชื่อเขต' autoComplete='off' />
          </Form.Item>
            </Col>
       
      
            <Divider />
        <Row justify='space-between' gutter={12}>
          <Col xl={3} sm={6}>
            <Button
              typeButton='primary-light'
              title='ยกเลิก'
              htmlType='submit'
              onClick={() => navigate(`/generalSettings/zoneSetting`)}
            />
          </Col>
          <Col xl={15} sm={6}></Col>
          <Col xl={3} sm={6}>
            <Button typeButton='primary' title='บันทึก' htmlType='submit' />
          </Col>
        </Row>
        </Form>
        {showModal && (
        <Modal
          centered
          open={showModal}
          closable={false}
          onOk={onSubmit}
          onCancel={() => setModal(false)}
          destroyOnClose
          cancelText={"ยกเลิก"}
          okText={"ยืนยัน"}
          cancelButtonProps={{ style: { color: color.primary, borderColor: color.primary } }}
        >
          <Text level={2}>{isEdit ? "ยืนยันบันทึกเขต" : "ยืนยันเพิ่มเขต"}</Text>
          <br />
          {isEdit ? (
            <>
              <Text level={5} color='Text3'>
                โปรดตรวจสอบรายละเอียดเขตอีกครั้งก่อนกดยืนยัน
              </Text>
              <br />
              <Text level={5} color='Text3'>
                เพราะอาจส่งผลต่อการแสดงผลข้อมูลในระบบ
              </Text>
            </>
          ) : (
            <Text level={5} color='Text3'>
              โปรดตรวจสอบรายละเอียดก่อนกดยืนยัน
            </Text>
          )}
        </Modal>
      )}
        </CardContainer>
    )
}