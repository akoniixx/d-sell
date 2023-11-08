import { Col, Modal, Row, Skeleton } from "antd";
import dayjs from "dayjs";
import React from "react";
import styled from "styled-components";
import { SaleEntity } from "../../entities/SaleEntity";
import color from "../../resource/color";
import icon from "../../resource/icon";
import Text from "../Text/Text";

const ModalStyled = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
  }
  .ant-modal-body {
    padding: 0;
  }
`;
const CloseIconStyled = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: absolute;
  right: 8px;
  top: 4px;
`;
const NoImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${color.background1};
`;
const StatusCircle = styled.div<{ status: boolean }>`
  width: 19px;
  height: 19px;
  background-color: ${({ status }) => {
    if (status) {
      return color.success;
    }
    return color.background1;
  }};
  border: 2px solid ${color.white};
  position: absolute;
  top: 8px;
  right: 36%;
  border-radius: 50%;
`;
interface Props {
  title?: string;
  visible?: boolean;
  onCancel?: () => void;
  bodyStyle?: React.CSSProperties;
  data: SaleEntity;
}
function DetailUserModal({ visible, bodyStyle, data, onCancel }: Props) {
  return (
    <ModalStyled
      open={visible}
      closable={false}
      bodyStyle={{ ...bodyStyle }}
      centered
      width={400}
      footer={null}
      onCancel={onCancel}
    >
      <div
        style={{
          padding: "16px 24px 24px",
        }}
      >
        <CloseIconStyled src={icon.iconClose} onClick={onCancel} />
        {data ? (
          <div
            style={{
              marginTop: "16px",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {data?.profileImage ? (
                <>
                  <StatusCircle status={data.status === "ACTIVE"} />
                  <img
                    src={data?.profileImage}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                    }}
                  />
                </>
              ) : (
                <NoImage>
                  <StatusCircle status={data.status === "ACTIVE"} />
                  <Text color='primary' fontSize={50} fontWeight={600}>
                    {data?.firstname?.split("")[0]}
                  </Text>
                </NoImage>
              )}
            </div>
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <Row gutter={16}>
                <Col span={10}>
                  <Text color='Text3' fontFamily='Sarabun'>
                    ชื่อ-นามสกุล
                  </Text>
                </Col>
                <Col span={14}>
                  <Text fontFamily='Sarabun'>{`${data?.firstname} ${data?.lastname}`}</Text>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={10}>
                  <Text color='Text3' fontFamily='Sarabun'>
                    ชื่อเล่น
                  </Text>
                </Col>
                <Col span={14}>
                  <Text fontFamily='Sarabun'>{data?.nickname ? `${data?.nickname}` : "-"}</Text>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={10}>
                  <Text color='Text3' fontFamily='Sarabun'>
                    เขต
                  </Text>
                </Col>
                <Col span={14}>
                  <Text fontFamily='Sarabun'>{data?.zone ? `${data.zone}` : "-"}</Text>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={10}>
                  <Text color='Text3' fontFamily='Sarabun'>
                    ตำแหน่ง
                  </Text>
                </Col>
                <Col span={14}>
                  <Text fontFamily='Sarabun'>{data?.role ? data.role : "-"}</Text>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={10}>
                  <Text color='Text3' fontFamily='Sarabun'>
                    เบอร์โทรศัพท์
                  </Text>
                </Col>
                <Col span={14}>
                  <Text fontFamily='Sarabun'>{data?.telephone ? `${data.telephone}` : "-"}</Text>
                </Col>
              </Row>
              <Row
                gutter={16}
                style={{
                  borderBottom: ` 1px solid ${color.background2}`,
                  paddingBottom: 10,
                }}
              >
                <Col span={10}>
                  <Text color='Text3' fontFamily='Sarabun'>
                    อีเมล
                  </Text>
                </Col>
                <Col span={14}>
                  <Text fontFamily='Sarabun'>{data?.email ? `${data.email}` : "-"}</Text>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={10}>
                  <Text color='Text3' fontFamily='Sarabun'>
                    วันที่อัปเดทล่าสุด
                  </Text>
                </Col>
                <Col span={14}>
                  <Text fontFamily='Sarabun'>
                    {data?.updateDate ? `${dayjs(data.updateDate).format("DD/MM/BBBB")}` : "-"}
                  </Text>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={10}>
                  <Text color='Text3' fontFamily='Sarabun'>
                    ชื่อผู้อัปเดทล่าสุด
                  </Text>
                </Col>
                <Col span={14}>
                  <Text fontFamily='Sarabun'>{data?.updateBy ? `${data?.updateBy}` : "-"}</Text>
                </Col>
              </Row>
            </div>
          </div>
        ) : (
          <div
            style={{
              marginTop: "16px",
            }}
          >
            <Row justify={"center"}>
              <Skeleton.Image
                active
                style={{
                  borderRadius: "50%",
                }}
              />
            </Row>
            <Skeleton
              active
              style={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              paragraph={{
                rows: 10,
              }}
            />
          </div>
        )}
      </div>
    </ModalStyled>
  );
}

export default DetailUserModal;
