import { Avatar, Button, Col, Input, Pagination, Row, Switch, Table, Tabs } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UnorderedListOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { CardContainer } from '../../components/Card/CardContainer';
import { Container } from 'react-bootstrap';
import { SaleListDatasource } from '../../datasource/SaleListDatasource';
import { profileAtom } from '../../store/ProfileAtom';
import { useRecoilValue } from 'recoil';
import Layout from '../../components/Layout/Layout';
import { ProfileEntity } from '../../entities/ProfileEntity';
import { useLocalStorage } from '../../hook/useLocalStorage';
import Text from '../../components/Text/Text';

const style: React.CSSProperties = {
  width: '180px',
};

const { TabPane } = Tabs;
const TabFilter = memo(({ staffOnClick, all, active, inactive }: any) => {
  return (
    <Tabs onChange={staffOnClick}>
      <TabPane tab={'ทั้งหมด (' + all + ')'} key=''></TabPane>
      <TabPane tab={'Active (' + active + ')'} key='active'></TabPane>
      <TabPane tab={'Inctive (' + inactive + ')'} key='inactive'></TabPane>
    </Tabs>
  );
});

function SaleManagementPage() {
  const { Search } = Input;
  const onSearch = (value: string) => console.log(value);
  const [saleList, setSaleList] = useState([]);
  const [meta, setMeta] = useState();
  const [keyword, setKeyword] = useState<string>('');

  const [persistedProfile, setPersistedProfile] = useLocalStorage('profile', []);
  const fetchSaleList = async (
    pageNum: number,
    pageSize: number,
    companyId: number,
    status: string,
    search?: string,
  ) => {
    await SaleListDatasource.getSaleList(pageNum, pageSize, companyId, status, search).then(
      (res) => {
        setSaleList(res.data);
      },
    );
  };

  useEffect(() => {
    fetchSaleList(1, 10, persistedProfile.companyId, 'all');
  }, []);

  const sorter = (a: any, b: any) => {
    if (a === b) return 0;
    else if (a === null) return 1;
    else if (b === null) return -1;
    else return a.localeCompare(b);
  };
  const PageTitle = () => {
    return (
      <Container>
        <Row>
          <Col className='gutter-row' span={16}>
            <div>
              <Text strong>รายชื่อพนักงาน</Text>
            </div>
          </Col>
          <Col className='gutter-row' span={4}>
            <div style={style}>
              <Input placeholder='ค้นหาพนักงาน' prefix={<SearchOutlined />} value={keyword} />
            </div>
          </Col>
          <Col className='gutter-row' span={4}>
            <div>
              <Button type='primary' onClick={() => (window.location.href = '/AddNewSale')}>
                + เพิ่มพนักงาน
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  };
  const colunm = [
    {
      title: 'ลำดับ',
      dataIndex: 'index',
      key: 'rowNum',
      width: '8%',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className='test'>
              <span className='text-dark-75  d-block font-size-lg'>{index + 1}</span>
            </div>
          ),
        };
      },
    },
    {
      title: 'ชื่อ - นามสกุล',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className='d-flex flex-row align-items-baseline'>
              <div className='me-4'>
                {row.image ? (
                  <Avatar size={42} src={row.image} />
                ) : (
                  <Avatar size={42} style={{ color: '#0068F4', backgroundColor: '#EFF2F9' }}>
                    {row.firstname.charAt(0)}
                  </Avatar>
                )}
              </div>
              <div>
                <p>{row.firstname + ' ' + row.lastname}</p>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: 'เขต',
      dataIndex: 'territory',
      key: 'territory',
      width: '10%',
      sorter: (a: any, b: any) => sorter(a.territory, b.territory),
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'position',
      key: 'position',
      width: '12%',
      sorter: (a: any, b: any) => sorter(a.position, b.position),
    },
    {
      title: 'ข้อมูลติดต่อ',
      dataIndex: 'telephone',
      key: 'telephone',
      width: '12%',
    },
    {
      title: 'อัปเดทโดย',
      dataIndex: 'updateBy',
      key: 'updateBy',
      width: '18%',
      sorter: (a: any, b: any) => a.updated.localeCompare(b.updated),
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className='test'>
              <span className='text-dark-75  d-block font-size-lg'>{row.updateDate}</span>
              <span className='text-muted '>{row.updateBy}</span>
            </div>
          ),
        };
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (value: any, row: any, index: number) => {
        return {
          children: <Switch checked={row.isActive} />,
        };
      },
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
              <div className='d-flex flex-row justify-content-between'>
                <div className='btn btn-icon btn-light btn-hover-primary btn-sm'>
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <UnorderedListOutlined />
                  </span>
                </div>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() => (window.location.href = '/EditSalePage?id=' + row.id)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
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
    <>
      <CardContainer>
        <PageTitle />
        {/*  <TabFilter /> */}
        <Table
          className='rounded-lg'
          columns={colunm}
          dataSource={saleList}
          pagination={{ position: ['bottomCenter'] }}
          size='large'
          tableLayout='fixed'
          style={{
            marginTop: '16px',
          }}
        />
        <br />
      </CardContainer>
    </>
  );
}

TabFilter.displayName;
export default SaleManagementPage;
