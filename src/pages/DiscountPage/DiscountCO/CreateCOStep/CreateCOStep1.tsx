import { Col, Form, FormInstance, message, Row, Upload, Select as AntdSelect, Radio } from "antd";
import React, { useEffect, useState } from "react";
import Text from "../../../../components/Text/Text";
import styled from "styled-components";
import color from "../../../../resource/color";
import Input from "../../../../components/Input/Input";
import TextArea from "../../../../components/Input/TextArea";
import { getPromotion } from "../../../../datasource/PromotionDatasource";
import Button from "../../../../components/Button/Button";

interface Props {
  form: FormInstance;
  isEditing?: boolean;
  fileMemo: any;
  setFileMemo: any;
  fileUrl?: string;
}

const MemoArea = styled.div`
  width: 100%;
  background: ${color.background1};
  border: 1px solid ${color.background2};
  border-radius: 8px;

  display: flex;
  align-items: center;
  padding: 16px;
`;

export const CreateCOStep1 = ({ form, fileMemo, setFileMemo, fileUrl, isEditing }: Props) => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const [promotions, setPromotions] = useState();
  const [isEdit, setEdit] = useState(isEditing);

  useEffect(() => {
    fetchPromotion();
  }, []);

  const fetchPromotion = async () => {
    try {
      const { data } = await getPromotion({ company });
      setPromotions(
        data.map((p: any) => ({
          label: `${p.creditMemoName} (${p.creditMemoCode})`,
          value: `${p.creditMemoCode}`,
        })),
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Text level={5} fontWeight={700}>
        รายละเอียด ส่วนลดดูแลราคา
      </Text>
      <br />
      <br />
      <Form form={form} layout='vertical'>
        <Row align='middle' gutter={16}>
          <Col span={24}>
            <Form.Item
              name='creditMemoName'
              label='ชื่อรายการ'
              rules={[
                {
                  required: true,
                  message: "*โปรดระบุชื่อรายการ",
                },
              ]}
            >
              <Input placeholder='ระบุชื่อรายการ*' autoComplete='off' />
            </Form.Item>
          </Col>
          {company === "ICPL" && (
            <Col span={24}>
              <Form.Item
                name='creditMemoType'
                label='ประเภท ส่วนลดดูแลราคา'
                initialValue={"CO"}
                rules={[
                  {
                    required: true,
                    message: "โปรดเลือก ส่วนลดดูแลราคา",
                  },
                ]}
              >
                <Radio.Group optionType='default'>
                  {[
                    {
                      label: "CO",
                      value: "CO",
                    },
                    {
                      label: "CN",
                      value: "CN",
                    },
                  ].map(({ label, value }) => (
                    <Radio value={value} key={value} disabled={isEdit}>
                      {label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item name='file' label='ไฟล์ ส่วนลดดูแลราคา'>
              <MemoArea>
                <Upload
                  beforeUpload={(file) => {
                    const isPDF = file.type === "application/pdf";
                    if (!isPDF) {
                      message.error(`อัปโหลดเฉพาะไฟล์ .PDF เท่านั้น`);
                      return false;
                    }
                    return isPDF || Upload.LIST_IGNORE;
                  }}
                  customRequest={({ file, onSuccess }) => {
                    if (onSuccess) {
                      onSuccess(file);
                    }
                  }}
                  onChange={({ file }: any) => {
                    if (file.status === "uploading") {
                      setFileMemo(file);
                      file.status = "done";
                    }
                    if (file.status === "done") {
                      setFileMemo(file);
                    }
                    return "success";
                  }}
                  onRemove={() => {
                    setFileMemo(undefined);
                  }}
                  maxCount={1}
                  showUploadList={false}
                >
                  <Button title='เลือกไฟล์' style={{ width: 128, marginRight: 18 }} />
                </Upload>
                <Text
                  color='Text3'
                  level={6}
                  onClick={async () => {
                    try {
                      if (fileMemo && (fileMemo as any)?.originFileObj) {
                        const file = new Blob([(fileMemo as any)?.originFileObj], {
                          type: "application/pdf",
                        });
                        const fileURL = URL.createObjectURL(file);
                        const pdfWindow = window.open();
                        if (pdfWindow) pdfWindow.location.href = fileURL || "";
                      } else if (fileUrl) {
                        const pdfWindow = window.open();
                        if (pdfWindow) pdfWindow.location.href = fileUrl || "";
                      }
                    } catch (error) {
                      return { error };
                    }
                  }}
                  style={{ cursor: fileMemo || fileUrl ? "pointer" : "default" }}
                >
                  {(fileMemo as any)?.originFileObj?.name ||
                    (fileUrl && `${fileUrl?.substring(0, 20)}...`) ||
                    "โปรดเลือกไฟล์ .PDF"}
                </Text>
              </MemoArea>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name='remark' label='หมายเหตุเพิ่มเติม'>
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
