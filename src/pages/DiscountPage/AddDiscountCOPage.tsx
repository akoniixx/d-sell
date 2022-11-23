import UploadOutlined from "@ant-design/icons/lib/icons/UploadOutlined";
import { Button, DatePicker, Form, Input, Radio, Select, TimePicker, Upload } from "antd";
import React, { useEffect } from "react";
import { CardContainer } from "../../components/Card/CardContainer";
import moment from "moment";
export const AddDiscountCOPage = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      startTime: moment("00.00", "HH:mm"),
      endTime: moment("23.59", "HH:mm"),
    });
  }, []);

  const onChangeSubmit = async (v: any) => {
    const formData = new FormData();
    formData.append("title", v.title);
    formData.append(
      "start_datetime",
      v.startDate.format("YYYY-MM-DD") + " " + v.startTime.format("HH:mm:ss"),
    );
    formData.append(
      "end_datetime",
      v.endDate.format("YYYY-MM-DD") + " " + v.endTime.format("HH:mm:ss"),
    );
    const remark = v.remark === "undefined" || v.remark === undefined ? "" : v.remark;
    formData.append("remark", remark);
    formData.append("file", v.file.file.originFileObj);
  };

  return <></>;
};
