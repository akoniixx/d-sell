import React from "react";
import Modal from "./Modal";
import { useRecoilState } from "recoil";
import { permissionDenied } from "../../store/permissionDenied";
import Button from "../Button/Button";
import Text from "../Text/Text";
import { useNavigate } from "react-router-dom";

function ModalPermissionDenied() {
  const navigate = useNavigate();
  const [value, setValue] = useRecoilState(permissionDenied);
  const onCancel = () => {
    setValue((prev) => ({
      ...prev,
      visible: false,
    }));
    navigate("/");
  };
  return (
    <Modal visible={value.visible} onCancel={onCancel} maskClosable={false}>
      <div
        style={{
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text align='center' fontWeight={700}>
          บัญชีผู้ใช้ของท่าน
        </Text>
        <Text align='center' fontWeight={700}>
          ไม่สามารถเข้าถึงข้อมูลหน้านี้ได้
        </Text>
      </div>
      <Button
        title='กลับหน้าหลัก'
        onClick={() => {
          onCancel();
        }}
      />
    </Modal>
  );
}

export default ModalPermissionDenied;
