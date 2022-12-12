import { Col, Row } from "antd";
import dayjs from "dayjs";
import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import Text from "../../../../components/Text/Text";
import color from "../../../../resource/color";
import { profileAtom } from "../../../../store/ProfileAtom";
import { getCompanyImage, getCompanyName } from "../../../../utility/CompanyName";

const Container = styled.div``;
const Header = styled(Row)`
  border-radius: 8px;
  background-color: ${color.background1};
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
`;
const Image = styled.img`
  height: 52px;
  padding: 16px 8px;
  background-color: white;
  border-radius: 8px;
`;
function DetailTab(): JSX.Element {
  const profile = useRecoilValue(profileAtom);

  const listData = {
    shopName: {
      label: "ชื่อร้าน",
      value: "หจก.พืชสิน",
    },
    shopOwner: {
      label: "เจ้าของร้าน",
      value: "นาย พิชญ์ พิชญ์",
    },
    zone: {
      label: "พื้นที่",
      value: "C01",
    },
    addressShop: {
      label: "ที่อยู่ร้านค้า",
      value: "123/456 ถนน สุขุมวิท แขวง บางกอกใหญ่ เขต บางกอกใหญ่ กรุงเทพมหานคร 10700",
    },
    addressLatLong: {
      label: "ตำแหน่ง ละติจูด / ลองจิจูด",
      value: "13.736717 / 100.523186",
    },
    personalShopId: {
      label: "หมายเลขนิติบุคคล",
      value: Math.random().toString(36).substring(7),
    },
    personalId: {
      label: "หมายเลขบัตรประชาชน",
      value: Math.random().toString(36).substring(7),
    },
    dateStartMember: {
      label: "วันที่เริ่มเป็นสมาชิก",
      value: dayjs().format("D/MMM/BBBB"),
    },
    email: {
      label: "อีเมล",
      value: "mockingJ@iconkaset.com",
    },
    telMain: {
      label: "เบอร์โทรศัพท์ (หลัก)",
      value: "0812345678",
    },
    telSub: {
      label: "เบอร์โทรศัพท์ (รอง)",
      value: "0812345679",
    },
  };
  const listDataKey = Object.keys(listData);
  return (
    <Container>
      <Header>
        <Image src={getCompanyImage(profile?.company || "")} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <Text level={6} fontWeight={700}>
            {getCompanyName(profile?.company || "")}
          </Text>
          <Row gutter={16}>
            <Col>
              <Text level={6} fontFamily='Sarabun'>
                ประเภทคู่ค้า :
                <Text level={6} color='primary' fontFamily='Sarabun'>
                  Dealer
                </Text>
              </Text>
            </Col>
            <Col>
              <Text level={6} fontFamily='Sarabun'>
                รหัสร้านค้า : ICPL000002
              </Text>
            </Col>
            <Col>
              <Text level={6} fontFamily='Sarabun'>
                เขต : C01
              </Text>
            </Col>
          </Row>
        </div>
      </Header>
      <div
        style={{
          marginTop: 16,
        }}
      >
        {listDataKey.map((el) => {
          return (
            <Row key={el}>
              <Col span={8}>
                <Text color='Text3'>{listData[el as keyof typeof listData].label}</Text>
              </Col>
            </Row>
          );
        })}
      </div>
    </Container>
  );
}

export default DetailTab;
