import React from "react";
import MicrosoftLogin from "react-microsoft-login";

import { useNavigate } from "react-router-dom";

import { AuthDatasource } from "../../datasource/AuthDatasource";

import color from "../../resource/color";
import icon from "../../resource/icon";
import image from "../../resource/image";
import { useLocalStorage } from "../../hook/useLocalStorage";
import Text from "../../components/Text/Text";
import { Col, Row } from "antd";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { profileAtom } from "../../store/ProfileAtom";

const Container = styled.div``;
export const AuthPage: React.FC = () => {
  const [persistedProfile, setPersistedProfile] = useLocalStorage("profile", []);
  const [token, setToken] = useLocalStorage("token", []);
  const setProfile = useSetRecoilState(profileAtom);

  const navigate = useNavigate();
  const authHandler = (err: any, data: any) => {
    AuthDatasource.login(data.account.userName).then((res: any) => {
      if (res) {
        setPersistedProfile(res.data);
        setToken(res.accessToken);
        setProfile(res.data);
        return navigate("OrderPage");
      } else {
        return navigate("ErrorLoginPage");
      }
    });
  };

  return (
    <Container>
      <Row justify={"space-between"}>
        <Col span={12}>
          <div
            style={{
              background: color.primary,
              minHeight: "100vh",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "column",
              paddingTop: "10%",
            }}
          >
            <div>
              <img
                alt='logo'
                src={icon.logoSellcoda}
                style={{
                  width: "350px",
                  height: "350px",
                }}
              />
            </div>
            <div>
              <img alt='imageLogin' src={image.login} />
            </div>
          </div>
        </Col>
        <Col
          span={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div>
              <Text fontSize={40} color='primary' fontWeight={700}>
                กรุณาเข้าสู่ระบบ
              </Text>
            </div>
            <Text color='Text2'>สามารถเข้าสู่ระบบด้วย บัญชี Microsoft 365</Text>
            <div
              style={{
                marginTop: 8,
              }}
            >
              <MicrosoftLogin
                clientId='87575c83-d0d9-4544-93e5-7cd61636b45c'
                authCallback={authHandler}
                buttonTheme='dark'
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
