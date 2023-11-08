import { Col, Row } from "antd";
import dayjs from "dayjs";
import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import Text from "../../../../components/Text/Text";
import { CustomerCompanyName, CustomerEntityShopList } from "../../../../entities/CustomerEntity";
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
interface Props {
  data: {
    address: string;
    createDate: string;
    customerCompany: CustomerCompanyName[];
    customerId: string;
    customerToUserShops: CustomerEntityShopList[];
    district: string;
    lag: string | null;
    lat: string | null;
    postcode: string;
    province: string;
    subdistrict: string;
    telephone: string;
    taxNo: string;
    updateBy: string;
    updateDate: string;
    shopApproveTel: {
      action: string;
      isApprove: boolean;
      newSecondTelephone: string | null;
      newTelephone: string | null;
      oldSecondTelephone: string | null;
      oldTelephone: string | null;
    };
    isPending: boolean;
  };
}
const mappingCustomerType = {
  SD: "Sub Dealer",
  DL: "Dealer",
};
function DetailTab({ data }: Props): JSX.Element {
  const profile = useRecoilValue(profileAtom);
  const currentCompany = (data.customerCompany || []).find(
    (item) => item.company === profile?.company,
  );
  const customerCompany = data.customerCompany.length > 0 ? data.customerCompany[0] : null;
  const filterOtherCompany = (data.customerCompany || []).filter(
    (el) => el.company !== profile?.company,
  );
  // const isApproveMain =
  //   data.approveTel && !data.approveTel.isApprove && data.approveTel.newTelephone;
  // const isApproveSecond =
  //   data.approveTel && !data.approveTel.isApprove && data.approveTel.newSecondTelephone;
  const convertShopOwner = ({
    nametitle,
    firstname,
    lastname,
  }: {
    nametitle?: string;
    firstname?: string;
    lastname?: string;
  }) => {
    let nameOwner = "";
    if (nametitle) {
      nameOwner = nametitle;
    }
    if (firstname) {
      nameOwner = nameOwner + firstname;
    }
    if (lastname) {
      nameOwner = nameOwner + `  ${lastname}`;
    }
    if (nameOwner === "") {
      return "-";
    } else {
      return nameOwner;
    }
  };
  const userShop =
    data.customerToUserShops?.length > 0 ? data.customerToUserShops[0].userShop : null;

  const listData = {
    shopName: {
      label: "ชื่อร้าน",
      value: currentCompany?.customerName || customerCompany?.customerName || "-",
      isApproving: false,
      isActive: true,
    },
    shopOwner: {
      label: "เจ้าของร้าน",
      value: convertShopOwner({
        nametitle: userShop?.nametitle,
        firstname: userShop?.firstname,
        lastname: userShop?.lastname,
      }),
      isApproving: false,
      isActive: true,
    },
    zone: {
      label: "เขต",
      value: currentCompany?.zone || "-",
      isApproving: false,
      isActive: true,
    },
    addressShop: {
      label: "ที่อยู่ร้านค้า",
      value: data.address || "-",
      isApproving: false,
      isActive: true,
    },
    addressLatLong: {
      label: "ตำแหน่ง ละติจูด / ลองจิจูด",
      value: `${data.lat || "-"} / ${data.lag || "-"}`,
      isApproving: false,
      isActive: true,
    },
    personalShopId: {
      label: "หมายเลขนิติบุคคล",
      value: data.taxNo || "-",
      isApproving: false,
      isActive: true,
    },
    personalId: {
      label: "หมายเลขบัตรประชาชน",
      value: userShop?.idCard || "-",
      isApproving: false,
      isActive: true,
    },
    dateStartMember: {
      label: "วันที่เริ่มเป็นสมาชิก",
      value: currentCompany
        ? dayjs(currentCompany?.createDate)
            .locale("th")
            .format("D MMM BBBB")
        : "-",
      isApproving: false,
      isActive: true,
    },
    email: {
      label: "อีเมล",
      value: userShop?.email || "-",
      isApproving: false,
      isActive: true,
    },
    telMain: {
      label: "เบอร์โทรศัพท์ (หลัก)",
      value: userShop?.telephone ? userShop?.telephone : "-",
      isApproving: data.isPending && data?.shopApproveTel?.newTelephone,
      isActive: userShop?.isActive,
    },
    telSub: {
      label: "เบอร์โทรศัพท์ (รอง)",
      value: userShop?.secondtelephone ? userShop.secondtelephone : "-",
      isApproving: data.isPending && data?.shopApproveTel?.newSecondTelephone,
      isActive: userShop?.isPrimary,
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
                <Text
                  level={6}
                  color='primary'
                  fontFamily='Sarabun'
                  style={{
                    marginLeft: 4,
                  }}
                >
                  {mappingCustomerType[
                    currentCompany?.customerType as keyof typeof mappingCustomerType
                  ] || "-"}
                </Text>
              </Text>
            </Col>
            <Col>
              <Text level={6} fontFamily='Sarabun'>
                รหัสร้านค้า : {currentCompany?.customerNo || "-"}
              </Text>
            </Col>
            <Col>
              <Text level={6} fontFamily='Sarabun'>
                เขต : {currentCompany?.zone || "-"}
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
            <Row
              key={el}
              style={{
                marginBottom: 8,
                padding: "8px 0",
              }}
            >
              <Col span={4}>
                <Text color='Text3'>{listData[el as keyof typeof listData].label}</Text>
              </Col>
              <Col span={20} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <Text>{listData[el as keyof typeof listData].value}</Text>
                {listData[el as keyof typeof listData].isApproving && (
                  <div
                    style={{
                      marginLeft: 24,
                      backgroundColor: color.warning,
                      borderRadius: 8,
                      padding: "0 10px",
                    }}
                  >
                    <Text fontSize={14} color='white'>
                      รออนุมัติ
                    </Text>
                  </div>
                )}
                {!listData[el as keyof typeof listData].isActive && (
                  <div
                    style={{
                      marginLeft: 24,
                      backgroundColor: color.placeholder,
                      borderRadius: 8,
                      padding: "0 10px",
                    }}
                  >
                    <Text fontSize={14} color='white'>
                      ปิดการใช้งาน
                    </Text>
                  </div>
                )}
              </Col>
            </Row>
          );
        })}
      </div>
      {filterOtherCompany.length > 0 && (
        <div
          style={{
            marginTop: 32,
            paddingBottom: 16,
          }}
        >
          <Text fontWeight={700}>คู่ค้าบริษัทในเครือ ICP Group</Text>
          <div
            style={{
              padding: "0 16px",
            }}
          >
            {filterOtherCompany.map((el, idx) => {
              return (
                <Row
                  key={idx}
                  gutter={16}
                  style={{
                    marginTop: 24,
                  }}
                >
                  <Col span={2}>
                    <div
                      style={{
                        backgroundColor: color.background2,
                        borderRadius: 8,
                        width: 54,
                        height: 50,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        alt='img_company'
                        src={getCompanyImage(el.company)}
                        style={{
                          maxWidth: 40,
                          maxHeight: 40,
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={22}>
                    <Text level={6} fontWeight={700}>
                      {getCompanyName(el.company || "")}
                    </Text>
                    <Row gutter={16}>
                      <Col>
                        <Text level={6} fontFamily='Sarabun'>
                          ประเภทคู่ค้า :
                          <Text
                            level={6}
                            color='primary'
                            fontFamily='Sarabun'
                            style={{
                              marginLeft: 4,
                            }}
                          >
                            {mappingCustomerType[
                              el.customerType as keyof typeof mappingCustomerType
                            ] || "-"}
                          </Text>
                        </Text>
                      </Col>
                      <Col>
                        <Text level={6} fontFamily='Sarabun'>
                          รหัสร้านค้า : {el.customerNo}
                        </Text>
                      </Col>
                      <Col>
                        <Text level={6} fontFamily='Sarabun'>
                          เขต : {el.zone}
                        </Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              );
            })}
          </div>
        </div>
      )}
    </Container>
  );
}

export default DetailTab;
