import React, { useEffect, useState, memo } from "react";
import { Table, Tabs, Modal, DatePicker, Switch } from "antd";
import moment from "moment";
import { CardContainer } from "../../components/Card/CardContainer";
import { DeleteOutlined, FormOutlined, UnorderedListOutlined } from "@ant-design/icons";
import * as _ from "lodash";
const { RangePicker } = DatePicker;
const SLASH_DMY = "DD/MM/YYYY";
const { TabPane } = Tabs;
const TabFilter = memo(({ staffOnClick, all, active, inactive }: any) => {
  return (
    <Tabs onChange={staffOnClick}>
      <TabPane tab={"ทั้งหมด (" + all + ")"} key='all'></TabPane>
      <TabPane tab={"Active (" + active + ")"} key='active'></TabPane>
      <TabPane tab={"Inctive (" + inactive + ")"} key='inactive'></TabPane>
    </Tabs>
  );
});

export const DiscountCOPage: React.FC = () => {
  const [memoList, setMemoList] = useState([]);
  const [memoListData, setMemoListData] = useState([]);
  const [meta, setMeta] = useState();

  const [keyword, setKeyword] = useState("");

  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState<boolean>(false);

  const PageTitle = () => {
    return (
      <div className='d-flex flex-row justify-content-between my-4'>
        <div>
          <span className='card-label font-weight-bolder text-dark' style={{ fontSize: 20 }}>
            รายการ เพิ่ม/ลด Credit Memo
          </span>
        </div>

        <div className='d-flex flex-row'>
          <form>
            <div className='input-group'>
              <input
                type='text'
                id='keyword-input'
                className='form-control'
                placeholder='ค้นหา Credit Memo'
                value={keyword}
              />
              <div className='input-group-append'>
                <button className='btn ' type='submit'>
                  <i className='flaticon-search icon-md' />
                </button>
              </div>
            </div>
          </form>

          <div style={{ borderLeft: "1px solid #E5EAEE" }} className='mr-8 ml-10' />
        </div>
      </div>
    );
  };

  const sorter = (a: any, b: any) => {
    if (a === b) return 0;
    else if (a === null) return 1;
    else if (b === null) return -1;
    else return a.localeCompare(b);
  };

  const columns = [
    {
      title: "Referance",
      dataIndex: "title",
      key: "title",
      /* width: '10%', */
      sorter: (a: any, b: any) => sorter(a.name, b.name),
    },
    {
      title: "ชื่อรายการ",
      dataIndex: "title",
      key: "title",
      /* width: '10%', */
      sorter: (a: any, b: any) => sorter(a.name, b.name),
    },
    {
      title: "ระยะเวลา",
      dataIndex: "date",
      key: "date",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className='test'>
              <span className='text-dark-75 font-size-lg'>
                {moment(row.start_datetime).format(SLASH_DMY)} -{" "}
              </span>
              <span className='text-dark-75 font-size-lg '>
                {moment(row.end_datetime).format(SLASH_DMY)}
              </span>
            </div>
          ),
        };
      },
    },
    {
      title: "อัปเดทโดย",
      dataIndex: "updated",
      key: "updated",
      width: "18%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className='test'>
              <span className='text-dark-75  d-block font-size-lg'>
                {moment(row.updated).format(SLASH_DMY)}
              </span>
              <span className='text-muted '>{row.updated_by}</span>
            </div>
          ),
        };
      },
      sorter: (a: any, b: any) => a.updated.localeCompare(b.updated),
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Switch checked={row.is_active} />,
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
              <div className='d-flex flex-row justify-content-between'>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() => (window.location.href = "/ViewCreditMemoPage?id=" + row.id)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <UnorderedListOutlined />
                  </span>
                </div>

                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() => (window.location.href = "/EditCreditMemoPage?id=" + row.id)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <FormOutlined />
                  </span>
                </div>
                <div className='btn btn-icon btn-light btn-hover-primary btn-sm'>
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <DeleteOutlined />{" "}
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
      <div className='container '>
        <CardContainer>
          <PageTitle />
          <div className='d-flex justify-content-between'>
            <TabFilter
              all={memoListData ? memoListData.length : 0}
              // active={memoListData ? memoListData.filter()}
              // inactive={memoListData ? memoListData.filter()}
            />
            <div className='mr-10 d-flex align-items-center'>
              <div className='d-flex align-items-center'>
                <span>ระยะเวลา : </span>
              </div>
              <RangePicker
                picker='date'
                bordered={false}
                format={"DD-MM-YYYY"}
                onChange={(v) => {
                  console.log(v);
                }}
              />
            </div>
          </div>

          <Table
            className='rounded-lg'
            columns={columns}
            dataSource={memoList}
            pagination={{ position: ["bottomCenter"] }}
            size='large'
            tableLayout='fixed'
          />
          {/* <div className="d-flex justify-content-center pt-10">
            <Pagination
              defaultCurrent={1}
              total={meta?.totalItem}

              current={Number(meta?.currentPage)}
              onChange={(p) => fetchCreditMemoList(p)}
            />
          </div> */}
        </CardContainer>
      </div>

      <Modal open={isModalDeleteVisible} onCancel={() => setIsModalDeleteVisible(false)}>
        <p style={{ color: "#464E5F", fontSize: 24 }}>ต้องการลบข้อมูลตำแหน่งผู้ใช้งานนี้</p>
        <p style={{ color: "#BABCBE", fontSize: 16 }}>โปรดยืนยันการลบข้อมูลรายการ Credit Memo</p>
      </Modal>
    </>
  );
};

TabFilter.displayName = "TabFilter";
