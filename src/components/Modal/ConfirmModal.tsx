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
}
function ConfirmModal({
  desc,
  onCancel,
  onConfirm,
  title = "ยืนยันการบันทึกข้อมูล",
  visible,
  bodyStyle,
  cancelText = "ยกเลิก",
  confirmText = "ยืนยัน",
  loading,
}: Props) {
  return (
    <ModalStyled
      open={visible}
      closable={false}
      bodyStyle={{ ...bodyStyle }}
      centered
      footer={null}
    >
      <div
        style={{
          padding: "16px 24px",
        }}
      >
        <Text level={2}>{title}</Text>
        <div>
          <Text fontFamily='Sarabun' color='Text3'>
            {desc}
          </Text>
        </div>
      </div>
      <Row
        style={{
          padding: " 8px 16px",
          display: "flex",
          justifyContent: "flex-end",
          borderTop: "1px solid #E5E5E5",
        }}
      >
        <Col
          style={{
            gap: 8,
            display: "flex",
          }}
        >
          <Button height={32} title={cancelText} typeButton='primary-light' onClick={onCancel} />
          <Button height={32} title={confirmText} onClick={onConfirm} loading={loading} />
        </Col>
      </Row>
    </ModalStyled>
  );
}

export default ConfirmModal;
