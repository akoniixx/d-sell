import React, { Fragment, useEffect } from "react";
import Switch from "../../../../components/Switch/Switch";
import Text from "../../../../components/Text/Text";
import styled from "styled-components";
import CardSection from "../../../../components/Card/CardSection";
import Input from "../../../../components/Input/Input";
import Radio from "../../../../components/Radio/Radio";
import Select from "../../../../components/Select/Select";
import { Col, Form, FormInstance, Row } from "antd";
import color from "../../../../resource/color";
import Button from "../../../../components/Button/Button";
import { getCompanyImage, getCompanyName } from "../../../../utility/CompanyName";
import { CustomerDetailEntity } from "../../../../entities/CustomerEntity";
import { shopDatasource } from "../../../../datasource/ShopDatasource";

const mappingCompany = {
  ICPL: "ICP Ladda",
  ICPF: "ICP Fertilizer",
  ICPI: "ICP International",
};
const BottomSection = styled.div`
  padding: 8px 24px 24px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;
const Footer = styled(Row)`
  border-top: 1px solid ${color.background2};
  padding-top: 16px;

  margin-top: 40px;
`;

function StepOne({
  form,
  company,
  dataDetail,
  zoneList = [],
}: {
  dataDetail: CustomerDetailEntity | null;
  zoneList?: { label: string; value: string; key: string }[];
  form: FormInstance<any>;
  company?: "ICPL" | "ICPI" | "ICPF" | "ICK";
}) {
  const [selectBrand, setSelectBrand] = React.useState<any>();
  const typeCustomer = form.getFieldValue("typeShop");

  const listSD =
    (dataDetail?.data?.customerCompany || []).filter((el) => el.company !== company) || [];

  const findCurrentCompany = (dataDetail?.data?.customerCompany || []).find(
    (el) => el.company === company,
  );

  const listRadio = [
    {
      label: "Dealer",
      value: "DL",
    },
    {
      label: "Sub Dealer",
      value: "SD",
    },
  ];

  const selectDataBrand = async () => {
    const mapBrand = await shopDatasource.getBrandList(company || "").then((res) => {
      const map = res.map((x: any) => {
        return {
          company: x.company,
          product_brand_id: x.productBrandId,
          product_brand_logo: x.productBrandLogo,
          product_brand_name: x.productBrandName,
        };
      });
      return map;
    });
    const mapValue = mapBrand.map((el: any, index: number) => {
      return {
        label: `${el.product_brand_name}`,
        value: `${el.product_brand_id}`,
        key: `${el.product_brand_id}`,
      };
    });
    setSelectBrand(mapValue);
  };

  useEffect(() => {
    selectDataBrand();
  }, [dataDetail]);

  const renderByCompany = () => {
    return (
      <Form.List name='cusList' rules={[]}>
        {(fields) => {
          return fields.map(({ name, key }) => {
            const typeShop = form.getFieldValue("cusList")?.[name]?.customerType || "";
            return (
              <>
                {typeShop === "SD" && (
                  <Form.Item name='customerType' label='ประเภทคู่ค้า*' valuePropName='checked'>
                    <Radio items={listRadio.slice(1)} value={typeShop} />
                  </Form.Item>
                )}
                <Row gutter={16} key={key}>
                  <Col span={12}>
                    <Form.Item
                      name={[name, "productBrand"]}
                      label='Product Brands*'
                      rules={[
                        {
                          required: true,
                          message: "กรุณาเลือก Product Brands",
                        },
                      ]}
                    >
                      <Select data={selectBrand} mode='multiple' disabled={company === "ICPI"} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name={[name, "customerNo"]} label='รหัสร้านค้า'>
                      <Input disabled={typeShop === "DL"} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name={[name, "zone"]}
                      label='เขต*'
                      rules={[
                        {
                          required: true,
                          message: "กรุณาเลือกเขต",
                        },
                      ]}
                    >
                      <Select data={zoneList} disabled={typeShop === "DL"} />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            );
          });
        }}
      </Form.List>
    );
  };
  return (
    <Fragment>
      <BottomSection>
        <CardSection
          leftComponent={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                paddingLeft: 16,
              }}
            >
              <div
                style={{
                  height: 24,
                  width: 58,
                  position: "relative",
                  bottom: 4,
                }}
              >
                <img
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  src={getCompanyImage(company || "ICPL")}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <Text fontWeight={700}>{getCompanyName(company?.toString() || "")}</Text>
              </div>
            </div>
          }
          extra={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {typeCustomer !== "DL" && (
                <>
                  <Text fontFamily='Sarabun' level={6}>
                    เปิดใช้งาน
                  </Text>
                  <Form.Item noStyle name='isActiveCustomer'>
                    <Switch />
                  </Form.Item>
                </>
              )}
            </div>
          }
        >
          <div
            style={{
              padding: 16,
            }}
          >
            {findCurrentCompany && (
              <Row className='pb-4'>
                <Col
                  span={22.5}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Text fontWeight={700}>{findCurrentCompany?.customerName}</Text>
                  <div style={{ display: "flex", gap: 16 }}>
                    <Text fontFamily='Sarabun'>
                      {`ประเภทคู่ค้า: `}
                      <Text color='primary' fontWeight={600}>
                        {findCurrentCompany.customerType === "DL" ? "Dealer" : "Sub Dealer"}
                      </Text>
                    </Text>
                  </div>
                </Col>
              </Row>
            )}

            {renderByCompany()}
          </div>
        </CardSection>
        {form.getFieldValue("typeShop") && listSD.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 16,
              flexDirection: "column",
            }}
          >
            <Text fontWeight={700}>คู่ค้าบริษัทในเครือ ICP Group</Text>
            {listSD.map((item, idx) => {
              return (
                <Row key={idx} gutter={16}>
                  <Col span={1.5}>
                    <div
                      style={{
                        height: 52,
                        width: 52,
                        padding: item.company === "ICPL" ? 8 : 0,
                        borderRadius: 8,
                        backgroundColor: "#F5F5F5",
                      }}
                    >
                      <img
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "contain",
                        }}
                        src={getCompanyImage(item.company)}
                      />
                    </div>
                  </Col>
                  <Col
                    span={22.5}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Text fontWeight={700}>
                      {mappingCompany[item.company as keyof typeof mappingCompany]}
                    </Text>
                    <div style={{ display: "flex", gap: 16 }}>
                      <Text fontFamily='Sarabun'>
                        {`ประเภทคู่ค้า: `}
                        <Text color='primary' fontWeight={600}>
                          {item.customerType === "DL" ? "Dealer" : "Sub Dealer"}
                        </Text>
                      </Text>
                      <Text fontFamily='Sarabun'>{`รหัสร้านค้า: ${item.customerNo}`}</Text>
                      <Text fontFamily='Sarabun'>{`เขต: ${item.zone || "-"}`}</Text>
                    </div>
                  </Col>
                </Row>
              );
            })}
          </div>
        )}
      </BottomSection>
      <div
        style={{
          padding: "16px 24px 0px",
        }}
      >
        <Footer>
          <Col span={22}>
            <Text color='Text3' level={6} fontFamily='Sarabun'>
              โปรดตรวจสอบข้อมูลพนักงานก่อนบันทึก
            </Text>
          </Col>
          <Col span={2}>
            <Button
              title='ถัดไป'
              onClick={() => {
                form.submit();
              }}
            />
          </Col>
        </Footer>
      </div>
    </Fragment>
  );
}

export default StepOne;
