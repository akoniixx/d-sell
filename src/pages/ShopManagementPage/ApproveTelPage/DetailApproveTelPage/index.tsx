import { Col, Row, Spin } from "antd";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import Swal from "sweetalert2";
import Button from "../../../../components/Button/Button";
import { CardContainer } from "../../../../components/Card/CardContainer";
import ConfirmModal from "../../../../components/Modal/ConfirmModal";
import PageTitle from "../../../../components/PageTitle/PageTitle";
import PageTitleNested from "../../../../components/PageTitle/PageTitleNested";
import Text from "../../../../components/Text/Text";
import { shopDatasource } from "../../../../datasource/ShopDatasource";
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
const Bottom = styled(Row)`
  border-top: 1px solid ${color.background2};
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
`;
const mappingCustomerType = {
  SD: "Sub Dealer",
  DL: "Dealer",
};
function DetailApproveTelPage() {
  const [searchValue] = useSearchParams();
  const navigate = useNavigate();
  const id = searchValue.get("id");
  const { data, isLoading } = useQuery(["detailApproveTel", id], async () => {
    return await shopDatasource.getApproveTelById(id || "");
  });

  const onUpdateApprove = async (isApprove: boolean) => {
    try {
      const res = await shopDatasource.updateApproveTel({
        id: id || "",
        isApprove,
        approveBy: `${profile?.firstname} ${profile?.lastname}`,
      });
      if (res && res.success) {
        Swal.fire({
          title: isApprove ? "อนุมัติเบอร์โทรศัพท์สำเร็จ" : "ไม่อนุมัติเบอร์โทรศัพท์สำเร็จ",
          text: "",
          width: 300,
          timer: 2000,
          icon: "success",
          customClass: {
            title: "custom-title",
          },
          showConfirmButton: false,
        }).then(() => {
          navigate(-1);
        });
      } else {
        Swal.fire({
          title: "ไม่สามารถอนุมัติเบอร์โทรศัพท์ได้",
          text: "",
          width: 300,
          timer: 2000,
          icon: "error",
          customClass: {
            title: "custom-title",
          },
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [visibleApprove, setVisibleApprove] = React.useState(false);
  const [visibleReject, setVisibleReject] = React.useState(false);
  const profile = useRecoilValue(profileAtom);
  const isApproveMain = data && !data?.isApprove && data?.newTelephone;
  const isApproveSecond = data && !data?.isApprove && data?.newSecondTelephone;

  const isApprovedMain = data && data?.newTelephone;
  const isApprovedSecond = data && data?.newSecondTelephone;
  const { listApprove, textModal, listApproved } = useMemo(() => {
    const listApprove = [];
    const listApproved = [];
    const userShop = data?.customer.customerToUserShops[0].userShop;
    const updateBy = `${data?.createBy} , ${dayjs(data?.createDate).format(
      "DD/MM/BBBB , HH:mm น.",
    )}`;
    let textModal = "เบอร์โทรศัพท์ ";

    if (isApproveMain) {
      listApprove.push({
        label: "เบอร์โทรศัพท์ (หลัก)",
        newTelephone: data?.newTelephone,
        oldTelephone: data?.oldTelephone || "",
        updateBy,
      });
      textModal += " (หลัก)";
    }
    if (isApproveSecond) {
      listApprove.push({
        label: "เบอร์โทรศัพท์ (รอง)",
        oldTelephone: data?.oldSecondTelephone || "",
        newTelephone: data?.newSecondTelephone,
        updateBy,
      });
      textModal += " (รอง)";
    }
    if (isApprovedMain && !!data.approveBy) {
      listApproved.push({
        label: "เบอร์โทรศัพท์ (หลัก)",
        newTelephone: data?.newTelephone,
        oldTelephone: data?.oldTelephone,
        updateBy,

        statusApprove: data?.isApprove,
        approveBy: data?.approveBy,
      });
    }
    if (isApprovedSecond && !!data.approveBy) {
      listApproved.push({
        label: "เบอร์โทรศัพท์ (รอง)",
        oldTelephone: data?.oldSecondTelephone || "",
        newTelephone: data?.newSecondTelephone,
        updateBy,

        statusApprove: data?.isApprove,
        approveBy: data?.approveBy,
      });
    }

    return { listApprove, textModal, listApproved };
  }, [isApproveMain, isApproveSecond, data, isApprovedMain, isApprovedSecond]);
  if (isLoading || !data) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Spin size='large' />
      </div>
    );
  }

  const currentCompany = (data.customer.customerCompany || []).find(
    (item: any) => item.company === profile?.company,
  );
  const filterOtherCompany = (data.customer.customerCompany || []).filter(
    (el: any) => el.company !== profile?.company,
  );
  const userShop =
    data.customer.customerToUserShops?.length > 0
      ? data.customer.customerToUserShops[0].userShop
      : null;
  const listData = {
    shopName: {
      label: "ชื่อร้าน",
      value: currentCompany?.customerName || "-",
    },
    shopOwner: {
      label: "เจ้าของร้าน",
      value: `${userShop?.nametitle || "-"} ${userShop?.firstname || "-"} ${
        userShop?.lastname || "-"
      } `,
    },
    zone: {
      label: "พื้นที่",
      value: currentCompany?.zone || "-",
    },
    addressShop: {
      label: "ที่อยู่ร้านค้า",
      value: data.customer.address || "-",
    },
    addressLatLong: {
      label: "ตำแหน่ง ละติจูด / ลองจิจูด",
      value: `${data.customer.lat || "-"} / ${data.customer.lag || "-"}`,
    },
    personalShopId: {
      label: "หมายเลขนิติบุคคล",
      value: data.customer.taxNo || "-",
    },
    personalId: {
      label: "หมายเลขบัตรประชาชน",
      value: userShop?.idCard || "-",
    },
    dateStartMember: {
      label: "วันที่เริ่มเป็นสมาชิก",
      value: currentCompany
        ? dayjs(currentCompany?.createDate).locale("th").format("D MMM BBBB")
        : "-",
    },
    email: {
      label: "อีเมล",
      value: userShop?.email || "-",
    },
    telMain: {
      label: "เบอร์โทรศัพท์ (หลัก)",
      value: data?.oldTelephone || "-",
    },
    telSub: {
      label: "เบอร์โทรศัพท์ (รอง)",
      value: data?.oldSecondTelephone || "-",
    },
  };
  const listDataKey = Object.keys(listData);

  return (
    <>
      <CardContainer>
        <PageTitleNested
          title='รายละเอียดร้านค้า'
          description={
            <Text
              fontWeight={500}
              level={6}
              style={{
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              รหัสสมาชิก: {data?.customer.taxNo}
            </Text>
          }
        />
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
                    เขต : {currentCompany?.zone}
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
                  }}
                >
                  <Col span={4}>
                    <Text color='Text3'>{listData[el as keyof typeof listData].label}</Text>
                  </Col>
                  <Col span={20} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <Text>{listData[el as keyof typeof listData].value}</Text>
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
                {filterOtherCompany.map((el: any, idx: number) => {
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
      </CardContainer>

      {data && !data.isApprove && (
        <CardContainer
          style={{
            marginTop: 16,
          }}
        >
          <PageTitle title='เบอร์โทรศัพท์ที่ต้องการเปลี่ยน' />
          <div style={{ margin: "24px 0" }}>
            {listApprove.map((el) => {
              return (
                <div
                  key={el.label}
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <Row
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      backgroundColor: color.background1,
                    }}
                  >
                    <Col span={4}>
                      <Text>ต้องการเปลี่ยนเป็นเบอร์</Text>
                    </Col>
                    <Col span={20}>
                      <Text color='primary'>{el.newTelephone}</Text>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      padding: "8px 16px",
                      marginTop: 16,
                    }}
                  >
                    <Col span={4}>
                      <Text color='Text3'>ประเภท</Text>
                    </Col>
                    <Col span={20}>
                      <Text>{el.label}</Text>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      padding: "8px 16px",
                    }}
                  >
                    <Col span={4}>
                      <Text color='Text3'>เบอร์โทรศัพท์เดิม</Text>
                    </Col>
                    <Col span={20}>
                      <Text>{el.oldTelephone ? el.oldTelephone : "-"}</Text>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      padding: "8px 16px",
                    }}
                  >
                    <Col span={4}>
                      <Text color='Text3'>อัปเดทโดย</Text>
                    </Col>
                    <Col span={20}>
                      <Text>{el.updateBy}</Text>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>
          <Bottom>
            <Col>
              <Text color='Text3' level={6} fontFamily='Sarabun'>
                โปรดตรวจสอบข้อมูลให้ครบถ้วนก่อนอนุมัติ
              </Text>
            </Col>
            <Col
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
              }}
            >
              <Button
                typeButton='danger'
                title='ไม่อนุมัติ'
                onClick={() => {
                  setVisibleReject(true);
                }}
              />
              <Button
                title='อนุมัติ'
                onClick={() => {
                  setVisibleApprove(true);
                }}
              />
            </Col>
          </Bottom>
        </CardContainer>
      )}
      {data && !!data.approveBy && (
        <CardContainer
          style={{
            marginTop: 16,
          }}
        >
          <PageTitle title='เบอร์โทรศัพท์ที่ต้องการเปลี่ยน' />
          <div style={{ margin: "24px 0" }}>
            {listApproved.map((el) => {
              return (
                <div
                  key={el.label}
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <Row
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      backgroundColor: color.background1,
                    }}
                  >
                    <Col span={4}>
                      <Text>ต้องการเปลี่ยนเป็นเบอร์</Text>
                    </Col>
                    <Col span={20}>
                      <Text color='primary'>{el.newTelephone}</Text>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      padding: "8px 16px",
                      marginTop: 16,
                    }}
                  >
                    <Col span={4}>
                      <Text color='Text3'>ประเภท</Text>
                    </Col>
                    <Col span={20}>
                      <Text>{el.label}</Text>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      padding: "8px 16px",
                    }}
                  >
                    <Col span={4}>
                      <Text color='Text3'>เบอร์โทรศัพท์เดิม</Text>
                    </Col>
                    <Col span={20}>
                      <Text>{el.oldTelephone ? el.oldTelephone : "-"}</Text>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      padding: "8px 16px",
                    }}
                  >
                    <Col span={4}>
                      <Text color='Text3'>อัปเดทโดย</Text>
                    </Col>
                    <Col span={20}>
                      <Text>{el.updateBy}</Text>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      padding: "8px 16px",
                    }}
                  >
                    <Col span={4}>
                      <Text color='Text3'>สถานะการตรวจสอบ</Text>
                    </Col>
                    <Col span={20}>
                      <Text color={el.statusApprove ? "success" : "error"}>
                        {el.statusApprove ? "อนุมัติ" : "ไม่อนุมัติ"}
                      </Text>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      padding: "8px 16px",
                    }}
                  >
                    <Col span={4}>
                      <Text color='Text3'>สถานะการตรวจสอบโดย</Text>
                    </Col>
                    <Col span={20}>
                      <Text>{el.approveBy}</Text>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>
        </CardContainer>
      )}
      <ConfirmModal
        visible={visibleApprove}
        onConfirm={async () => {
          setVisibleApprove(false);
          await onUpdateApprove(true);
        }}
        onCancel={() => {
          setVisibleApprove(false);
        }}
        title='ยืนยันการอนุมัติ'
        desc={`โปรดยืนยันการอนุมัติ${textModal}`}
      />
      <ConfirmModal
        visible={visibleReject}
        onConfirm={async () => {
          setVisibleReject(false);
          await onUpdateApprove(false);
        }}
        onCancel={() => {
          setVisibleReject(false);
        }}
        title='ยืนยันการไม่อนุมัติ'
        desc={`โปรดยืนยันการไม่อนุมัติ${textModal}`}
      />
    </>
  );
}

export default DetailApproveTelPage;
