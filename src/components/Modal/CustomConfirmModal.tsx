import { Col, Modal, Row } from "antd";
import React from "react";
import styled from "styled-components";
import Button from "../Button/Button";
import Text from "../Text/Text";

const ModalStyled = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
  }
  .ant-modal-body {
    padding: 0;
  }
`;
interface Props {
  title?: string;
  visible?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  desc?: string;
  bodyStyle?: React.CSSProperties;
  cancelText?: string;
  confirmText?: string;
  loading?: boolean;
  bodyComponent?: React.ReactNode;
}
function CustomConfirmModal({
  desc,
  onCancel,
  onConfirm,
  title = "ยืนยันการบันทึกข้อมูล",
  visible,
  bodyStyle,
  cancelText = "ยกเลิก",
  confirmText = "ยืนยัน",
  loading,
  bodyComponent,
}: Props) {
  return (
    <ModalStyled
      open={visible}
      closable={false}
      bodyStyle={{ padding: "16px 32px 16px", ...bodyStyle }}
      centered
      footer={null}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "16px 24px",
        }}
      >
        <Text level={2} align='center'>
          {title}
        </Text>
        <Text fontFamily='Sarabun' color='Text3' align='center'>
          {desc}
        </Text>
      </div>
      {bodyComponent}
      <div
        style={{
          display: "flex",
          gap: 32,
          padding: "16px 0px",
          flexDirection: "row",
          justifyContent: "space-between",
          borderTop: "1px solid #E5E5E5",
        }}
      >
        <Button height={40} title={cancelText} typeButton='primary-light' onClick={onCancel} />
        <Button height={40} title={confirmText} onClick={onConfirm} loading={loading} />
      </div>
    </ModalStyled>
  );
}

export default CustomConfirmModal;
