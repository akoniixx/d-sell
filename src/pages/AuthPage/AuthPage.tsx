import { Button } from "antd";
import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import MicrosoftLogin from "react-microsoft-login";

import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { msal } from "../../atom/Msal";
import { profileAtom } from "../../atom/ProfileAtom";
import { AuthDatasource } from "../../datasource/AuthDatasource";

import color from "../../resource/color";
import icon from "../../resource/icon";
import image from "../../resource/image";

export const AuthPage: React.FC = () => {
  const [profile, setProfile] = useRecoilState(profileAtom);

  let navigate = useNavigate();
  let token = localStorage.getItem("token");
  const authHandler = (err: any, data: any) => {
    /* localStorage.setItem('token','usertoken')
    setProfile('tokenxxx');
    navigate("OrderPage"); */
    AuthDatasource.login(data.mail).then((res: any) => {
      if (res) {
        setProfile(res.user_detail);
        localStorage.setItem("token", JSON.stringify(res.token_bearer));
        return navigate("OrderPage");
      } else {
        return navigate("ErrorLoginPage");
      }
    });
  };

  

  return (
    <Container fluid className="px-0 vh-100 overflow-hidden ">
      <Row xs={1} md={1} lg={2} className="h-100">
        <Col lg={{ span: 5 }} className="height-res d-flex align-item-between">
          <div
            className="d-flex flex-column h-100 justify-content-center"
            style={{ background: color.primary }}
          >
            <div className="d-flex justify-content-center ">
              <img alt="logo" src={icon.logoSellcoda} width={"30%"} />
            </div>
            <div className="d-flex justify-content-center">
              <img alt="imageLogin" src={image.login} width={"80%"} />
            </div>
          </div>
        </Col>

        <Col className="d-flex align-item-center justify-content-center height-res">
          <div className="login-content flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
            <div className="d-flex flex-column-fluid flex-center">
              <div className="form fv-plugins-bootstrap fv-plugins-framework">
                <div className="pb-5 pt-lg-0 pt-5">
                  <h3 className="font-weight-bolder text-dark font-size-h4 font-size-h1-lg text-center">
                    กรุณาเข้าสู่ระบบ
                  </h3>
                  <h5 className="text-muted font-weight-bold font-size-h4 text-center">
                    สามารถเข้าสู่ระบบด้วย บัญชี Microsoft 365
                  </h5>
                </div>
                <div className="text-center">
                 {/*  <Button onClick={()=>authHandler()}> login </Button> */}
                  <MicrosoftLogin
                    clientId="87575c83-d0d9-4544-93e5-7cd61636b45c"
                    authCallback={authHandler}
                    
                    buttonTheme="dark"
                  />
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
