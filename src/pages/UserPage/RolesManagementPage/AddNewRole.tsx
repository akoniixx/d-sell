import { Form, Row } from "antd";
import React from "react";
import styled from "styled-components";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import Input from "../../../components/Input/Input";
import TextArea from "../../../components/Input/TextArea";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Text from "../../../components/Text/Text";
import color from "../../../resource/color";
import { defaultPropsForm } from "../../../utility/DefaultProps";

const CardRole = styled.div`
  border: 1px solid ${color.background1};
  border-radius: 8px;
`;
export default function AddNewRole(): JSX.Element {
  return (
    <CardContainer>
      <PageTitleNested title='เพิ่มชื่อตำแหน่ง' />
      <Form
        {...defaultPropsForm}
        style={{
          marginTop: 32,
        }}
      >
        <Form.Item label='ชื่อตำแหน่ง' name='name'>
          <Input placeholder='ระบุชื่อตำแหน่ง' />
        </Form.Item>
        <Form.Item
          label='อธิบายชื่อตำแหน่ง'
          name='description'
          style={{
            marginBottom: 0,
          }}
          className='ant-form-no-margin-bottom'
        >
          <TextArea placeholder='ระบุคำอธิบาย' />
        </Form.Item>
        <Row style={{ padding: " 16px 0" }}>
          <Text fontWeight={700}>ตั้งค่าสิทธิการใช้งานแพลตฟอร์มต่างๆ ของ Sellcoda</Text>
        </Row>
        <CardRole>
          <Row
            style={{
              justifyContent: "space-between",
              padding: 16,
              alignItems: "center",
              backgroundColor: color.background1,
            }}
          >
            <Text fontWeight={700}>Website Backoffice</Text>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
              }}
            >
              <Button
                title='เลือกทั้งหมด'
                style={{
                  width: 96,
                  padding: "2px 4px",
                }}
                height={32}
              />
              <Button
                title='ล้าง'
                typeButton='primary-light'
                style={{
                  width: 96,
                  padding: "4px 8px",
                }}
                height={32}
              />
            </div>
          </Row>
        </CardRole>
      </Form>
    </CardContainer>
  );
}
