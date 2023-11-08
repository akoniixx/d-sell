import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Steps as AntdStep, Form, message, Modal, Spin } from "antd";
import { CardContainer } from "../../../components/Card/CardContainer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Button from "../../../components/Button/Button";
import color from "../../../resource/color";
import Text from "../../../components/Text/Text";
import { useNavigate } from "react-router-dom";

export const AddDiscountCOPage = () => {
  const [form] = Form.useForm();

  useEffect(() => {}, []);

  return <></>;
};
