import { Col, ConfigProvider, Divider, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import TableContainer from "../../../components/Table/TableContainer";
import Text from "../../../components/Text/Text";
import { checkPhoneAllShop } from "../../../datasource/CustomerDatasource";
import { color } from "../../../resource";
import { profileAtom } from "../../../store/ProfileAtom";

const Header = styled(Row)`
  border-radius: 8px;
  background-color: ${color.background1};
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
`;

const HeaderGroup = styled(Col)`
  border-radius: 8px;
  background-color: ${color.background1};
  padding: 10px;
  align-items: center;
`;
const HeaderSubGroup = styled(Col)`
  border-radius: 8px;
  background-color: ${color.background2};
  padding: 10px;
  align-items: center;
`;

function SyncCustomerPage(): JSX.Element {
  const navigate = useNavigate();
  const profile = useRecoilValue(profileAtom);
  const [data, setData] = useState<any>();

  const getData = async () => {
    await checkPhoneAllShop({
      company: profile?.company || "",
      updateBy: profile?.firstname + " " + profile?.lastname,
    }).then((res) => {
      setData(res.responseData);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Tax No.",
      dataIndex: "cusTaxNo",
      key: "cusTaxNo",
      width: "12%",
      render: (value: string, row: any) => {
        return <Text fontSize={14}>{value || "-"}</Text>;
      },
    },
    {
      title: "ICP International",
      dataIndex: "ICPI",
      key: "ICPI",
      render: (value: string, row: any) => {
        const mapCom = row?.detail.filter((x) => x.company === "ICPI");
        return (
          <>
            {mapCom?.map((x, i) => (
              <>
                <HeaderGroup key={i}>
                  <Row justify={"space-between"}>
                    <Col span={7}>
                      <Text fontSize={14}>{x.cusNo}</Text>
                    </Col>
                    <Col span={17}>
                      <Text fontSize={14}>{x.cusName}</Text>
                    </Col>
                  </Row>
                  <HeaderSubGroup>
                    <Row justify={"space-between"}>
                      <Col span={24}>
                        <Text fontSize={14}>Name 1 : {x.contactName1 || "-"}</Text>
                      </Col>
                    </Row>
                    <Row justify={"space-between"}>
                      <Col span={24}>
                        <Text fontSize={14}>Phone 1 : {x.sellcodaPhone1 || "-"}</Text>
                      </Col>
                    </Row>
                  </HeaderSubGroup>
                  <div className='pt-2'></div>
                  <HeaderSubGroup>
                    <Row justify={"space-between"}>
                      <Col span={24}>
                        <Text fontSize={14}>Name 2 : {x.contactName2 || "-"}</Text>
                      </Col>
                    </Row>
                    <Row justify={"space-between"}>
                      <Col span={24}>
                        <Text fontSize={14}>Phone 2 : {x.sellcodaPhone2 || "-"}</Text>
                      </Col>
                    </Row>
                  </HeaderSubGroup>
                </HeaderGroup>
                <br />
              </>
            ))}
          </>
        );
      },
    },
    {
      title: "ICP Fertilizer",
      dataIndex: "ICPF",
      key: "ICPF",
      render: (value: string, row: any) => {
        const mapCom = row?.detail.filter((x) => x.company === "ICPF");
        return (
          <>
            {mapCom?.map((x, i) => (
              <>
                <HeaderGroup key={i}>
                  <Row justify={"space-between"}>
                    <Col span={7}>
                      <Text fontSize={14}>{x.cusNo}</Text>
                    </Col>
                    <Col span={17}>
                      <Text fontSize={14}>{x.cusName}</Text>
                    </Col>
                  </Row>
                  <HeaderSubGroup>
                    <Row justify={"space-between"}>
                      <Col span={24}>
                        <Text fontSize={14}>Name 1 : {x.contactName1 || "-"}</Text>
                      </Col>
                    </Row>
                    <Row justify={"space-between"}>
                      <Col span={24}>
                        <Text fontSize={14}>Phone 1 : {x.sellcodaPhone1 || "-"}</Text>
                      </Col>
                    </Row>
                  </HeaderSubGroup>
                  <div className='pt-2'></div>
                  <HeaderSubGroup>
                    <Row justify={"space-between"}>
                      <Col span={24}>
                        <Text fontSize={14}>Name 2 : {x.contactName2 || "-"}</Text>
                      </Col>
                    </Row>
                    <Row justify={"space-between"}>
                      <Col span={24}>
                        <Text fontSize={14}>Phone 2 : {x.sellcodaPhone2 || "-"}</Text>
                      </Col>
                    </Row>
                  </HeaderSubGroup>
                </HeaderGroup>
                <br />
              </>
            ))}
          </>
        );
      },
    },
    {
      title: "ICP Ladda",
      dataIndex: "ICPL",
      key: "ICPL",
      render: (value: string, row: any) => {
        const mapCom = row?.detail.filter((x) => x.company === "ICPL");
        return (
          <>
            {mapCom?.map((x, i) => (
              <>
                <HeaderGroup key={i}>
                  <Row justify={"space-between"}>
                    <Col span={7}>
                      <Text fontSize={14}>{x.cusNo}</Text>
                    </Col>
                    <Col span={17}>
                      <Text fontSize={14}>{x.cusName}</Text>
                    </Col>
                  </Row>
                  <HeaderSubGroup>
                    <Row justify={"space-between"}>
                      <Col span={24}>
                        <Text fontSize={14}>Name 1 : {x.contactName1 || "-"}</Text>
                      </Col>
                    </Row>
                    <Row justify={"space-between"}>
                      <Col span={24}>
                        <Text fontSize={14}>Phone 1 : {x.sellcodaPhone1 || "-"}</Text>
                      </Col>
                    </Row>
                  </HeaderSubGroup>
                  <div className='pt-2'></div>
                  <HeaderSubGroup>
                    <Row justify={"space-between"}>
                      <Col span={24}>
                        <Text fontSize={14}>Name 2 : {x.contactName2 || "-"}</Text>
                      </Col>
                    </Row>
                    <Row justify={"space-between"}>
                      <Col span={24}>
                        <Text fontSize={14}>Phone 2 : {x.sellcodaPhone2 || "-"}</Text>
                      </Col>
                    </Row>
                  </HeaderSubGroup>
                </HeaderGroup>
                <br />
              </>
            ))}
          </>
        );
      },
    },
  ];

  return (
    <CardContainer>
      <PageTitleNested title='รายละเอียดเบอร์โทรศัพท์' showBack={false} extra={<></>} />
      <Divider />
      <Header>
        <Text color='error' fontWeight={700} fontSize={18}>
          รายการข้อมูลไม่สามารถ Sync ได้ เนื่องจากข้อมูลไม่ตรงกัน
          กรุณาติดต่อเจ้าหน้าที่ที่เกี่ยวข้องเพื่อดำเนินการแก้ไข
        </Text>
      </Header>
      <br />
      <TableContainer style={{ overflow: "visible" }}>
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          scroll={{ x: "fit-content" }}
          sticky
        />
      </TableContainer>
    </CardContainer>
  );
}

export default SyncCustomerPage;
