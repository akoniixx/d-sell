import React from "react";
import { Modal as AntdModal } from "antd";
interface Props {
  title?: string;
  visible?: boolean;
  onCancel?: () => void;
  bodyStyle?: React.CSSProperties;
  children?: React.ReactNode;
  width?: number | string;
  maskClosable?: boolean;
}
function Modal({ visible, bodyStyle, onCancel, children, width, ...props }: Props): JSX.Element {
  return (
    <AntdModal
      open={visible}
      closable={false}
      bodyStyle={{ ...bodyStyle }}
      centered
      width={width || 400}
      footer={null}
      onCancel={onCancel}
      {...props}
    >
      {children}
    </AntdModal>
  );
}

export default Modal;
