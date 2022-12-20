import { Col, Row } from "antd";
import React from "react";

import icon from "../../resource/icon";
import Button from "../Button/Button";
import ConfirmModal from "../Modal/ConfirmModal";

interface Props {
  onClickEdit?: () => void;
  onClickList?: () => void;
  onClickDelete?: () => void;
  hideEdit?: boolean;
  hideDelete?: boolean;
  hideList?: boolean;
  disableEdit?: boolean;
  disableDelete?: boolean;
  disableList?: boolean;
  titleModalWarning?: string;
  descriptionModalWarning?: string;
}

export default function MenuTable({
  onClickEdit,
  hideDelete,
  hideEdit,
  hideList,
  onClickDelete,
  onClickList,
  disableEdit,
  disableDelete,
  disableList,
  descriptionModalWarning,
  titleModalWarning,
}: Props) {
  const [visible, setVisible] = React.useState(false);
  const Lists = [
    {
      onClick: onClickList,
      icon: icon.listIcon,
      isHide: hideList,
      disable: disableList,
      name: "list",
      width: 22,
      height: 22,
    },
    {
      onClick: onClickEdit,
      icon: icon.writeIcon,
      isHide: hideEdit,
      disable: disableEdit,
      name: "edit",
      width: 20,
      height: 20,
    },
    {
      onClick: () => setVisible(true),
      icon: icon.trashIcon,
      disable: disableDelete,
      isHide: hideDelete,
      name: "delete",
      width: 20,
      height: 20,
    },
  ];
  return (
    <Row gutter={10}>
      {Lists.map((list, idx) => {
        return (
          <Col key={idx}>
            <Button
              height={35}
              style={{
                display: list.isHide ? "none" : "flex",
                padding: "8px",
              }}
              disabled={list.disable}
              onClick={list.onClick}
              typeButton='secondary'
              icon={
                <img
                  style={{
                    width: list.width,
                    height: list.height,
                  }}
                  src={list.icon}
                />
              }
            />
          </Col>
        );
      })}
      <ConfirmModal
        title={titleModalWarning || "ยืนยันการลบข้อมูล"}
        desc={descriptionModalWarning || "คุณต้องการลบข้อมูลนี้ใช่หรือไม่"}
        visible={visible}
        onConfirm={() => {
          onClickDelete?.();
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      />
    </Row>
  );
}
