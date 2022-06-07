import {
  Avatar,
  Button,
  Col,
  Input,
  Layout,
  Row,
  Switch,
  Table,
  Tabs,
} from "antd";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { UnorderedListOutlined, EditOutlined } from "@ant-design/icons";
import { CardContainer } from "../../components/Card/CardContainer";
import { AddRoleManage } from "./AddRoleManage";
const { TabPane } = Tabs;
const TabFilter = memo(({ staffOnClick, all, active, inactive }: any) => {
  return (
    <Tabs onChange={staffOnClick}>
      <TabPane tab={"ทั้งหมด (" + all + ")"} key=""></TabPane>
      <TabPane tab={"Active (" + active + ")"} key="active"></TabPane>
      <TabPane tab={"Inctive (" + inactive + ")"} key="inactive"></TabPane>
    </Tabs>
  );
});

function RoleManagementPage() {
  const { Search } = Input;
  const onSearch = (value: string) => console.log(value);

  const sorter = (a: any, b: any) => {
    if (a === b) return 0;
    else if (a === null) return 1;
    else if (b === null) return -1;
    else return a.localeCompare(b);
  };

  
  const colunm = [
    {
      title: "ลำดับ",
      dataIndex: "ืnumber",
      key: "number",
      width: "10%",
      sorter: (a: any, b: any) => sorter(a.number, b.number),
    },
    {
      title: "ชื่อตำแหน่ง",
      dataIndex: "name",
      key: "name",
      width: "15%",
      sorter: (a: any, b: any) => sorter(a.name, b.name),

      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className="d-flex flex-row align-items-baseline">
              <div className="mr-4">
                {row.image ? (
                  <Avatar size={42} src={row.image} />
                ) : (
                  <Avatar
                    size={42}
                    style={{ color: "#0068F4", backgroundColor: "#EFF2F9" }}
                  >
                    {row.name.charAt(0)}
                  </Avatar>
                )}
              </div>
              <div>
                <p>{row.name}</p>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: "คำอธิบาย",
      dataIndex: "territory",
      key: "territory",
      width: "25%",
    },
    {
      title: "จำนวนสมาชิก",
      dataIndex: "position",
      key: "position",
      width: "12%",
      sorter: (a: any, b: any) => sorter(a.number, b.number),
    },
    {
      title: "อัปเดทโดย",
      dataIndex: "updated",
      key: "updated",
      width: "18%",
      sorter: (a: any, b: any) => sorter(a.name, b.name),
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className="test">
              <span className="text-dark-75  d-block font-size-lg">
                {row.updated}
              </span>
              <span className="text-muted ">
                {row.updated_by ? row.updated_by.name : null}
              </span>
            </div>
          ),
        };
      },
    },
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <div className="d-flex flex-row justify-content-between">
                <div className="btn btn-icon btn-light btn-hover-primary btn-sm">
                  <span className="svg-icon svg-icon-primary svg-icon-2x">
                    <UnorderedListOutlined />
                  </span>
                </div>
                <div
                  className="btn btn-icon btn-light btn-hover-primary btn-sm"
                  onClick={() =>
                    (window.location.href = "/EditSalePage?id=" + row.id)
                  }
                >
                  <span className="svg-icon svg-icon-primary svg-icon-2x">
                    <EditOutlined />
                  </span>
                </div>
              </div>
            </>
          ),
        };
      },
    },
  ];
  return (
    <div>
      <Layout style={{ height: "100vh" }}>
        <div className="container">
          <CardContainer>
            <Row>
              <Col span={6}>
                <span>
                  <b>จัดการสิทธิ์ตำแหน่งงานผู้ใช้</b>
                </span>
              </Col>
              <Col offset={18} style={{ paddingRight: "5px" }}>
                <Search
                  placeholder="ค้นหาตำแหน่ง"
                  onSearch={onSearch}
                  style={{ width: 150 }}
                />
              </Col>
              <Col>
                <Link to="/AddRoleManage">
                  <Button type="primary">+ เพิ่มตำแหน่ง</Button>
                </Link>
              </Col>
            </Row>
            <TabFilter />
            <Table
              className="rounded-lg"
              columns={colunm}
              pagination={{ position: ["bottomCenter"] }}
              size="large"
              tableLayout="fixed"
            />
          </CardContainer>
        </div>
      </Layout>
    </div>
  );
}

export default RoleManagementPage;
