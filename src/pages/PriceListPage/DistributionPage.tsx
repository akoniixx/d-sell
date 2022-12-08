import React, { useState } from "react";
import { Table, Modal, Switch, Row, Col, Select, Pagination } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { FormOutlined } from "@ant-design/icons";
import moment from "moment";
import { Option } from "antd/lib/mentions";
import * as _ from "lodash";
import Text from "../../components/Text/Text";
const SLASH_DMY = "DD/MM/YYYY";

export const DistributionPage: React.FC = () => {
  // const columns = [
  //   {
  //     title: "อัพเดตล่าสุด",
  //     dataIndex: "date",
  //     key: "date",
  //     width: "12%",
  //     sorter: (a: any, b: any) => sorter(a.name, b.name),
  //     render: (value: any, row: any, index: number) => {
  //       return {
  //         children: (
  //           <div className='test'>
  //             <span className='text-dark-75 font-size-lg'>
  //               {moment(row.start_datetime).format(SLASH_DMY)} -{" "}
  //             </span>
  //             <span className='text-dark-75 font-size-lg '>
  //               {moment(row.end_datetime).format(SLASH_DMY)}
  //             </span>
  //           </div>
  //         ),
  //       };
  //     },
  //   },
  //   {
  //     title: "ชื่อสินค้า",
  //     dataIndex: "title",
  //     key: "title",
  //     width: "18%",
  //     sorter: (a: any, b: any) => sorter(a.name, b.name),
  //   },
  //   {
  //     title: "ขนาด",
  //     dataIndex: "number",
  //     key: "number",
  //   },
  //   {
  //     title: " กลุ่มสินค้า",
  //     dataIndex: "title",
  //     key: "title",
  //     width: "10%",
  //     sorter: (a: any, b: any) => sorter(a.name, b.name),
  //   },
  //   {
  //     title: "Strategy Group",
  //     dataIndex: "title",
  //     key: "title",
  //     width: "15%",
  //     sorter: (a: any, b: any) => sorter(a.name, b.name),
  //   },
  //   {
  //     title: "ราคาต่อหน่วย",
  //     dataIndex: "title",
  //     key: "title",
  //     width: "13%",
  //     sorter: (a: any, b: any) => sorter(a.name, b.name),
  //   },
  //   {
  //     title: "ราคาตลาด",
  //     dataIndex: "title",
  //     key: "title",
  //     width: "10%",
  //     sorter: (a: any, b: any) => sorter(a.name, b.name),
  //   },
  //   {
  //     title: "สถานะ",
  //     dataIndex: "status",
  //     key: "status",
  //     width: "10%",
  //     sorter: (a: any, b: any) => sorter(a.name, b.name),
  //     render: (value: any, row: any, index: number) => {
  //       return {
  //         children: <Switch checked={row.is_active} />,
  //       };
  //     },
  //   },
  //   {
  //     title: "",
  //     dataIndex: "action",
  //     key: "action",
  //     width: "5%",
  //     render: (value: any, row: any, index: number) => {
  //       return {
  //         children: (
  //           <>
  //             <div className='d-flex flex-row justify-content-between'>
  //               <div
  //                 className='btn btn-icon btn-light btn-hover-primary btn-sm'
  //                 onClick={() => (window.location.href = "/EditCreditMemoPage?id=" + row.id)}
  //               >
  //                 <span className='svg-icon svg-icon-primary svg-icon-2x'>
  //                   <FormOutlined />
  //                 </span>
  //               </div>
  //             </div>
  //           </>
  //         ),
  //       };
  //     },
  //   },
  // ];

  return (
    <div>
      <CardContainer>
        <Text>อัพเดทเร็วๆนี้</Text>
      </CardContainer>
    </div>
  );
};
