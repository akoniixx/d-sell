import { Avatar, Button, Col, Input, Layout, Row, Switch, Table, Tabs } from "antd";
import Search from "antd/lib/transfer/search";
import React, { memo } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UnorderedListOutlined, EditOutlined} from "@ant-design/icons";

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

function SaleManagementPage() {
  const { Search } = Input;
  const onSearch = (value: string) => console.log(value);
  
  const mystyle = {
    color: "black",
    backgroundColor: "white",
    padding: "10px",
    fontFamily: "Arial",
  };

  const colunm = [{
    title: 'ชื่อ - นามสกุล',
    dataIndex: 'name',
    key: 'name',
    width: '25%',
    render: (value: any, row: any, index: number) => {
      return {
        children: (
          <div className="d-flex flex-row align-items-baseline">
            <div className="mr-4">
              {row.image ? (
                <Avatar size={42} src={row.image} />
              ) : (
                <Avatar size={42} style={{ color: '#0068F4', backgroundColor: '#EFF2F9' }}>
                  {row.name.charAt(0)}
                </Avatar>
              )}
            </div>
            <div>
              <p>{row.name}</p>
            </div>
          </div>
        ),
      }
    }
    
    },
    {
      title: 'เขต',
      dataIndex: 'territory',
      key: 'territory',
      width: '10%',
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'position',
      key: 'position',
      width: '12%',
    },
    {
      title: 'ข้อมูลติดต่อ',
      dataIndex: 'telephone',
      key: 'telephone',
      width: '12%',
    },
    {
      title: 'อัปเดทโดย',
      dataIndex: 'updated',
      key: 'updated',
      width: '18%',
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className="test">
              <span className="text-dark-75  d-block font-size-lg">{row.updated}</span>
              <span className="text-muted ">{row.updated_by ? row.updated_by.name : null}</span>
            </div>
          ),
        }
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (value: any, row: any, index: number) => {
        return {
          children: <Switch checked={row.is_active} />,
        }
      }
    },
      {
        title: 'จัดการ',
        dataIndex: 'action',
        key: 'action',
        width: '10%',
        render: (value: any, row: any, index: number) => {
          return {
            children: (
              <>
                <div className="d-flex flex-row justify-content-between">
                  <div
                    className="btn btn-icon btn-light btn-hover-primary btn-sm"
                  >
                    <span className="svg-icon svg-icon-primary svg-icon-2x">
                    <UnorderedListOutlined />
                  </span>
                  </div>
                  <div
                    className="btn btn-icon btn-light btn-hover-primary btn-sm"
                    onClick={() => (window.location.href = '/EditSalePage?id=' + row.id)}
                  >
                    <span className="svg-icon svg-icon-primary svg-icon-2x">
                    <EditOutlined />
                  </span>
                  </div>
              </div>
            </>
          ),
        }
      },
    },
  ]
  return (
    <div>
      <Layout style={{ height: "100vh" }}>
        <div className="body-content" style={mystyle}>
          <Row>
            <Col span={6}>
              <span>
                <b>รายชื่อพนักงาน</b>
              </span>
            </Col>
            <Col span={6}></Col>
            <Col span={6}></Col>
            <Col span={6}>
              <Search
                placeholder="ค้นหาพนักงาน"
                onSearch={onSearch}
                style={{ width: 150 }}
              />
              <Link to="/AddNewSale">
              <Button type="primary">+ เพิ่มพนักงาน</Button>
              </Link>
            </Col>
          </Row>
          <TabFilter/>
          <Table
            className="rounded-lg"
            columns={colunm}
            pagination={{ position: ['bottomCenter'] }}
            size="large"
            tableLayout="fixed"
          />

           
         
        </div>
      </Layout>
    </div>
  );
}

export default SaleManagementPage;
