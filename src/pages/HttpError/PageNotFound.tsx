import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Button from "../../components/Button/Button";
import Text from "../../components/Text/Text";
import image from "../../resource/image";
import { profileAtom } from "../../store/ProfileAtom";
import { roleAtom } from "../../store/RoleAtom";
import { redirectByRole } from "../../utility/func/RedirectByPermission";

const PageNotFound: React.FC = () => {
  const profile = useRecoilValue(profileAtom);
  const roleData = useRecoilValue(roleAtom);
  const navigate = useNavigate();
  const NoMatch = () => {
    const location = useLocation();

    return (
      <div
        style={{
          width: "100%",
        }}
      >
        <Text fontWeight={700} level={3} align='center'>
          No match for <code>{location.pathname}</code>
        </Text>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <img src={image.error404} width='264px' height='164px' />
        <Text align='center'>ขออภัย ไม่พบหน้าที่ท่านต้องการ</Text>
        {NoMatch()}
        <Text>ไม่พบ URL ที่คุณเรียกโปรดตรวจสอบ URL ให้ถูกต้อง</Text>
        <Button
          title='กลับหน้าหลัก'
          onClick={() => {
            navigate(!profile ? "/" : `${redirectByRole(roleData?.menus)}`);
          }}
        />
      </div>
    </div>
  );
};
export default PageNotFound;
