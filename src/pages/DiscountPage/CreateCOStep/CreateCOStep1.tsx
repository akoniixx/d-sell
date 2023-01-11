import { Button, Col, Form, FormInstance, message, Row, Upload, Select as AntdSelect } from "antd";
import React, { useEffect, useState, memo, useMemo } from "react";
import { FlexCol, FlexRow } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import styled from "styled-components";
import color from "../../../resource/color";
import { UploadOutlined } from "@ant-design/icons";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import DatePicker, { TimePicker } from "../../../components/DatePicker/DatePicker";
import TextArea from "../../../components/Input/TextArea";
import dayjs, { Dayjs } from 'dayjs';
import { PromotionType, PROMOTION_TYPE_NAME } from "../../../definitions/promotion";
import { checkPromotionCode, getPromotion } from "../../../datasource/PromotionDatasource";
import ImgCrop from "../../../components/ImgCrop/ImgCrop";
import { RcFile } from "antd/lib/upload";

const UploadHorizontal = styled(Upload)`
    .ant-upload,
    .ant-upload-list-picture-card-container, 
    .ant-upload-picture-card-wrapper, 
    .ant-upload-list-picture-card .ant-upload-list-item {
        height: 120px;
        width: 160px;
    }
`;

const UploadVeritical = styled(Upload)`
    .ant-upload,
    .ant-upload-list-picture-card-container, 
    .ant-upload-picture-card-wrapper, 
    .ant-upload-list-picture-card .ant-upload-list-item {
        height: 160px;
        width: 120px;
    }
`;

const UploadArea = styled.div`
    background: ${color.background1};
    border: 1px dashed ${color.Text3};
    border-radius: 6px;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
`;

const MemoArea = styled.div`
    width: 100%;
    background: ${color.background1};
    border: 1px solid ${color.background2};
    border-radius: 8px;

    display: flex;
    align-items: center;
    padding: 16px;
`;

const UploadIcon = (
    <>
        <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle opacity="0.36" cx="32.3335" cy="32.0176" r="32" fill="#E5EAEE"/>
            <path d="M41.6667 29.3512C41.313 29.3512 40.9739 29.4917 40.7239 29.7418C40.4738 29.9918 40.3333 30.3309 40.3333 30.6846V35.1912L38.36 33.2179C37.6632 32.5266 36.7215 32.1387 35.74 32.1387C34.7585 32.1387 33.8168 32.5266 33.12 33.2179L32.1867 34.1646L28.88 30.8446C28.1832 30.1533 27.2415 29.7654 26.26 29.7654C25.2785 29.7654 24.3368 30.1533 23.64 30.8446L21.6667 32.8312V25.3512C21.6667 24.9976 21.8071 24.6585 22.0572 24.4084C22.3072 24.1584 22.6464 24.0179 23 24.0179H33.6667C34.0203 24.0179 34.3594 23.8774 34.6095 23.6274C34.8595 23.3773 35 23.0382 35 22.6846C35 22.3309 34.8595 21.9918 34.6095 21.7418C34.3594 21.4917 34.0203 21.3512 33.6667 21.3512H23C21.9391 21.3512 20.9217 21.7727 20.1716 22.5228C19.4214 23.273 19 24.2904 19 25.3512V41.6446C19.0035 42.6266 19.3952 43.5673 20.0895 44.2617C20.7839 44.9561 21.7247 45.3477 22.7067 45.3512H39.2933C39.6546 45.3484 40.0137 45.2945 40.36 45.1912V45.1912C41.1299 44.9753 41.8077 44.5127 42.2894 43.8744C42.7711 43.2362 43.0301 42.4575 43.0267 41.6579V30.6846C43.0267 30.5072 42.9914 30.3316 42.9227 30.1681C42.854 30.0046 42.7534 29.8564 42.6268 29.7322C42.5001 29.608 42.35 29.5104 42.1851 29.445C42.0202 29.3796 41.844 29.3477 41.6667 29.3512ZM23 42.6846C22.6464 42.6846 22.3072 42.5441 22.0572 42.294C21.8071 42.044 21.6667 41.7049 21.6667 41.3512V36.5912L25.52 32.7379C25.7149 32.5441 25.9785 32.4353 26.2533 32.4353C26.5282 32.4353 26.7918 32.5441 26.9867 32.7379L36.9467 42.6846H23ZM40.3333 41.3512C40.3248 41.6094 40.2414 41.8596 40.0933 42.0712L34.0667 36.0179L35.0133 35.0846C35.1089 34.987 35.223 34.9095 35.3489 34.8566C35.4749 34.8037 35.6101 34.7764 35.7467 34.7764C35.8833 34.7764 36.0185 34.8037 36.1444 34.8566C36.2703 34.9095 36.3844 34.987 36.48 35.0846L40.3333 38.9646V41.3512ZM44.3333 21.3512H43V20.0179C43 19.6643 42.8595 19.3251 42.6095 19.0751C42.3594 18.825 42.0203 18.6846 41.6667 18.6846C41.313 18.6846 40.9739 18.825 40.7239 19.0751C40.4738 19.3251 40.3333 19.6643 40.3333 20.0179V21.3512H39C38.6464 21.3512 38.3072 21.4917 38.0572 21.7418C37.8071 21.9918 37.6667 22.3309 37.6667 22.6846C37.6667 23.0382 37.8071 23.3773 38.0572 23.6274C38.3072 23.8774 38.6464 24.0179 39 24.0179H40.3333V25.3512C40.3333 25.7049 40.4738 26.044 40.7239 26.294C40.9739 26.5441 41.313 26.6846 41.6667 26.6846C42.0203 26.6846 42.3594 26.5441 42.6095 26.294C42.8595 26.044 43 25.7049 43 25.3512V24.0179H44.3333C44.687 24.0179 45.0261 23.8774 45.2761 23.6274C45.5262 23.3773 45.6667 23.0382 45.6667 22.6846C45.6667 22.3309 45.5262 21.9918 45.2761 21.7418C45.0261 21.4917 44.687 21.3512 44.3333 21.3512V21.3512Z" fill="#6B7995"/>
        </svg>
    </>
)

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

interface Props  {
    form: FormInstance;
    file1: Blob | undefined;
    file2: Blob | undefined;
    fileMemo: Blob | undefined;
    setFile1: (file: Blob | undefined) => void;
    setFile2: (file: Blob | undefined) => void;
    setFileMemo: (file: Blob | undefined) => void;
    imageUrl1: string | undefined;
    imageUrl2: string | undefined;
    fileMemoUrl?: string;
    setImgUrl1: (setImgUrl1: string) => void;
    setImgUrl2: (setImgUrl2: string) => void;
    isEditing?: boolean;
}

export const PromotionCreateStep1 = ({ 
    form,
    file1,
    file2,
    fileMemo,
    setFile1,
    setFile2,
    setFileMemo,
    imageUrl1,
    imageUrl2,
    fileMemoUrl,
    setImgUrl1,
    setImgUrl2,
    isEditing
}: Props) => {
    const userProfile = JSON.parse(localStorage.getItem("profile")!);
    const { company } = userProfile;

    const [promotions, setPromotions] = useState();

    const imgCropProps = {
        modalTitle: 'ปรับขนาดรูปภาพ',
        modalOk: 'ยืนยัน',
        modalCancel: 'ยกเลิก'
    }

    useEffect(() => {
        fetchPromotion();
    }, [])

    const fetchPromotion = async () => {
        try {
            const { data } = await getPromotion({ company });
            setPromotions(
                data.map((p: any) => ({
                    label: `${p.creditMemoName} (${p.creditMemoCode})`,
                    value: `${p.creditMemoCode}`
                }))
            );
            console.log(data)
          } catch (e) {
            console.log(e);
          }
    }

    return (
        <>
            <Text level={5} fontWeight={700}>
                รายละเอียด Credit Memo
            </Text>
            <br/>
            <br/>
            <Form
                form={form}
                layout='vertical'
            >
                <Row align='middle' gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name='creditMemoName'
                            label='ชื่อรายการ'
                            rules={[
                                {
                                    required: true,
                                    message: '*โปรดระบุชื่อรายการ*'
                                }
                            ]}
                        >
                            <Input placeholder="ระบุชื่อรายการ*"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='startDate'
                            label='วันที่เริ่ม Credit Memo'
                            rules={[
                                {
                                    required: true,
                                    message: '*โปรดเลือกวันที่เริ่ม Credit Memo'
                                }
                            ]}
                        >
                            <DatePicker style={{ width: '100%'}} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='startTime'
                            label='เวลาเริ่ม Credit Memo'
                            initialValue={dayjs('00:00', 'HH:mm')}
                            rules={[
                                {
                                    required: true,
                                    message: '*โปรดเลือกเวลาเริ่ม Credit Memo'
                                }
                            ]}
                        >
                            <TimePicker allowClear={false}/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="remark" label='หมายเหตุเพิ่มเติม'>
                            <TextArea/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    )

}