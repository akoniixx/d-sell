import React from "react";
import { Modal as AntdModal } from "antd";
interface Props {
  title?: string;
  visible?: boolean;
  onCancel?: () => void;
  bodyStyle?: React.CSSProperties;
  children?: React.ReactNode;
  width?: number | string;
}
function Modal({ visible, bodyStyle, onCancel, children, width }: Props): JSX.Element {
  return (
    <AntdModal
      open={visible}
      closable={false}
      bodyStyle={{ ...bodyStyle }}
      centered
      width={width || 400}
      footer={null}
      onCancel={onCancel}
    >
      {children}
    </AntdModal>
  );
}

export default Modal;
