import { EditOutlined } from "@ant-design/icons";
import { Avatar, Checkbox, Col, Divider, Row, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import { DetailBox, FlexCol, FlexRow } from "../../../components/Container/Container";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import TableContainer from "../../../components/Table/TableContainer";
import Text from "../../../components/Text/Text";
import { getConditionCoById } from "../../../datasource/CreditMemoDatasource";
import { LOCATION_FULLNAME_MAPPING } from "../../../definitions/location";
import { ConditionCOEntiry } from "../../../entities/ConditionCOEntiry";
import color from "../../../resource/color";
import image from "../../../resource/image";
import { numberFormatter } from "../../../utility/Formatter";

export const DetailConditionCOPage: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const conditionId = pathSplit[4];

  const [selectedTab, setSelectedTab] = useState<"product" | "shop">("product");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [data, setData] = useState<ConditionCOEntiry>();

  const getCondition = async () => {
    const getById = await getConditionCoById(conditionId);
    console.log(getById);
    setData(getById);
  };

  useEffect(() => {
    getCondition();
  }, []);

  const DetailItem = ({ label, value }: { label: string; value: string }) => {
    return (
      <Row gutter={16} style={{ margin: "4px 0px" }}>
        <Col span={6}>
          <Text>{label} :</Text>
        </Col>
        <Col span={18}>
          <Text color='Text2'>{value}</Text>
        </Col>
      </Row>
    );
  };
  const PageTitle = () => {
    return (
      <PageTitleNested
        title='รายละเอียดเงื่อนไข CO'
        showBack
        onBack={() => navigate(`/discount/conditionCo`)}
        extra={
          !isEdit && (
            <Button
              type='primary'
              icon={<EditOutlined />}
              title='แก้ไขรายละเอียด'
              height={40}
              onClick={() => setIsEdit(!isEdit)}
            />
          )
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการเงื่อนไข CO", path: "/discount/conditionCo" },
              { text: "รายละเอียดเงื่อนไข CO", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };

  const tabsItems = [
    {
      label: `รายละเอียดเขตและร้านค้า`,
      key: "product",
    },
    {
      label: `รายละเอียดสินค้า`,
      key: "shop",
    },
  ];

  const dataTableProd = [
    {
      title: isEdit && <Checkbox />,
      width: "5%",
      render: (text: string, value: any) => isEdit && <Checkbox checked={value.isChecked} />,
    },
    {
      title: <span>ชื่อสินค้า</span>,
      dataIndex: "productName",
      width: "40%",
      render: (text: string, value: any, index: any) => (
        <FlexRow align='center'>
          <div style={{ marginRight: 16 }}>
            <Avatar
              src={
                value.productImage === "No" ||
                value.productImage === "" ||
                value.productImage === null
                  ? image.product_no_image
                  : value.productImage
              }
              size={50}
              shape='square'
              onError={() => false}
            />
          </div>
          <FlexCol>
            <div style={{ height: 25 }}>
              <Text level={5}>{value.productName}</Text>
            </div>
            <div style={{ height: 25, overflow: "hidden", textOverflow: "ellipsis" }}>
              <Text level={5} style={{ color: color.Grey }}>
                {value.commonName}
              </Text>
            </div>
            <div style={{ height: 25 }}>
              <Text level={5} style={{ color: color.Grey }}>
                {value.productGroup}
              </Text>
            </div>
          </FlexCol>
        </FlexRow>
      ),
    },
    {
      title: <span>ขนาด</span>,
      dataIndex: "packSize",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: <span>ราคา/หน่วย</span>,
      dataIndex: "unitPrice",
      render: (text: string) => <span>{numberFormatter(text)}</span>,
    },
    {
      title: <span>ราคาขาย</span>,
      dataIndex: "marketPrice",
      render: (text: string) => <span>{numberFormatter(text)}</span>,
    },
    {
      title: <span>สถานที่</span>,
      dataIndex: "productLocation",
      render: (text: string) => <span>{LOCATION_FULLNAME_MAPPING[text]}</span>,
    },
  ];
  const dataTableShop = [
    {
      title: isEdit && <Checkbox />,
      width: "5%",
      render: (text: string) => isEdit && <Checkbox />,
    },
    {
      title: <span>ชื่อร้านค้า</span>,
      dataIndex: "customerName",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: <span>เขตการขาย</span>,
      dataIndex: "zone",
      render: (text: string) => <span>{text}</span>,
    },
  ];
  return (
    <CardContainer>
      <PageTitle />
      <br />
      <Text level={4} fontWeight={700}>
        รายละเอียดร้านค้า
      </Text>
      <DetailBox>
        <DetailItem label='ชื่อรายการ' value={data?.creditMemoConditionName || ""} />
        <DetailItem label='ระยะเวลา' value={data?.startDate.toString() || ""} />
      </DetailBox>
      <br />
      <Row gutter={16}>
        <Col span={9}>
          <Text level={2}>รายละเอียด</Text>
        </Col>
        <Col span={5}></Col>
        <Col span={5}></Col>
        <Col span={5}></Col>
      </Row>
      <br />
      <Tabs
        items={tabsItems}
        onChange={(key: string) => {
          setSelectedTab(key as "product" | "shop");
        }}
        defaultValue={selectedTab}
      />
      <TableContainer>
        {selectedTab === "product" ? (
          <Table
            columns={dataTableProd}
            dataSource={data?.creditMemoConditionProduct}
            pagination={false}
            scroll={{ y: 360 }}
          />
        ) : (
          <Table
            columns={dataTableShop}
            dataSource={data?.creditMemoConditionShop}
            pagination={false}
            scroll={{ y: 360 }}
          />
        )}
      </TableContainer>

      {isEdit && (
        <>
          <Divider />
          <Row justify='space-between' gutter={12}>
            <Col xl={3} sm={6}>
              <Button typeButton='primary-light' title='ยกเลิก' onClick={() => setIsEdit(false)} />
            </Col>
            <Col xl={15} sm={6}></Col>
            <Col xl={3} sm={6}>
              <Button typeButton='primary' title='บันทึก' />
            </Col>
          </Row>
        </>
      )}
    </CardContainer>
  );
};
