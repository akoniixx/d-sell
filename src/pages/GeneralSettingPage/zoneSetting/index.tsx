import { Badge, Col, Dropdown, Modal, Row, Table } from "antd";
import React, { useEffect, useState } from "react";

import {
  CaretDownOutlined,
  ExperimentOutlined,
  SearchOutlined,
  ShopOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { color } from "../../../resource";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import { CardContainer } from "../../../components/Card/CardContainer";

import Text from "../../../components/Text/Text";
import Button from "../../../components/Button/Button";
import { dateFormatter } from "../../../utility/Formatter";
import { zoneDatasource } from "../../../datasource/ZoneDatasource";
import { zoneEntity } from "../../../entities/ZoneEntity";
const Header = styled(Col)`
  border-radius: 8px;
  background-color: ${color.background1};
  padding: 20px;
  //display: flex;
  //gap: 16px;
  align-items: center;
  width: "100%";
`;

export const ZoneSettingPage: React.FC = () => {
  const navigate = useNavigate();
  
  
  
  
  const [search, setSearch] = useState<string>("");
  
  const [status, setStatus] = useState<boolean|null|undefined>();
  const [zoneList,setZoneList] = useState<zoneEntity[]>([])

  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const getZone = async( searchZoneName?: string | null, filterIsActive?: boolean|null|undefined): Promise<zoneEntity[]> => {
    try {
      const res = await zoneDatasource.getAllZoneByCompany(company)
      return searchZone(res, searchZoneName, filterIsActive);
    } catch (error) {
      console.error("Error fetching zone data:", error);
      throw error; // or handle the error as needed
    }
  } 

  function searchZone(zones: zoneEntity[], searchZoneName?: string | null, filterIsActive?: string|boolean|null|undefined): zoneEntity[] {
    return zones.filter(zone => { 
      const matchesZoneName = searchZoneName===''|| searchZoneName === undefined || searchZoneName === null || zone.zoneName.toLowerCase().includes(searchZoneName.toLowerCase());
      const matchesIsActive =  filterIsActive === 'all' ||filterIsActive === undefined || filterIsActive === null || zone.isActive === filterIsActive;
      return matchesZoneName && matchesIsActive;
  });
}

useEffect(() => {
  const fetchZones = async () => {
      try {
          const filteredZones = await getZone(search, status);
          setZoneList(filteredZones);
      } catch (error) {
          console.error("Error fetching zones:", error);
          throw(error);
      }
  };

  fetchZones();
}, [search, status]); 



const ActionBtn = ({ onClick, icon }: any) => {
    return (
      <Col span={6}>
        <div className='btn btn-icon btn-light btn-hover-primary btn-sm' onClick={onClick}>
          <span
            className='svg-icon svg-icon-primary svg-icon-2x'
            style={{ color: color["primary"] }}
          >
            {icon}
          </span>
        </div>
      </Col>
    );
  };


  const columns: any = [
    {
      title: "ชื่อเขต",
      dataIndex: "shopNo",
      key: "shopNo",
       width: "50%",
      render: (value: any , row: zoneEntity, index: number) => {
        return {
          children: (
            <>
              <Text level={5}>{row.zoneName}</Text>
              
            </>
          ),
        };
      },
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"start"} gutter={8}>
              <Badge
                count={row.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                style={{ backgroundColor: row.isActive ? color.success : color.Disable }}
              />
            </Row>
          ),
        };
      },
    },
    {
        title: "อัพเดทโดย",
        dataIndex: "shopName",
        key: "shopName",
        render: (value: any, row: any, index: number) => {
          return {
            children: (
              <>
               <Text level={5}  fontSize={14}>
                  {dateFormatter(row.updatedAt, false)}
                </Text>
               
                <br />
                <Text level={5} color='Text3'>{row.updateBy?row.updateBy:row.createBy}</Text>
              </>
            ),
          };
        },
      },
      
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"start"} gutter={8}>
            <ActionBtn
              onClick={() => {
                
                navigate(`/generalSettings/createZoneSetting/${row.zoneId}`,{state:{row}});
              }}
              icon={<UnorderedListOutlined />}
            />
          </Row>
          ),
        };
      },
    },
  ];

  const PageTitle = (
    <>
      <Row align='middle' gutter={16}>
        <Col span={20}>
          <Text level={3} fontWeight={700}>
            รายการเขต
          </Text>
        </Col>
        <Col className='gutter-row' span={4}>
          
            <Button
              title='+ เพิ่มเขต'
              onClick={() => navigate("/generalSettings/createZoneSetting/create")}
            />
          
        </Col>
      </Row>
      <br />
      <Row align='middle' gutter={16}>
        <Col span={18}>
          <Input
            allowClear
            placeholder='ค้นหาชื่อเขต'
            prefix={<SearchOutlined style={{ color: "grey" }} />}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
       
        <Col span={6}>
          <Select
            allowClear
            placeholder='เลือกสถานะ'
            data={[
              { key: 'all', value: null, label: "สถานะทั้งหมด" },
              { key: 'active', value: true, label: "เปิดใช้งาน" },
              { key: 'inactive', value:false, label: "ปิดใช้งาน" },
            ]}
            style={{ width: "100%" }}
            onChange={(e) => {
              setStatus(e);
            }}
          />
        </Col>
      </Row>
    </>
  );

  return (
    <>
      <CardContainer>
        {PageTitle}
        <br />
        <Table
          columns={columns}
          dataSource={zoneList || []}
         pagination={false}
        />
      </CardContainer>
     
    </>
  );
};
