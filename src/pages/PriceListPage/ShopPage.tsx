import React from "react";
import Text from "../../components/Text/Text";

const ShopPage: React.FC = () => {
  // const columns = [
  //   {
  //     title: "อัพเดตล่าสุด",
  //     dataIndex: "date",
  //     key: "date",
  //     width: "15%",
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
  //     title: "ชื่อร้านค้า",
  //     dataIndex: "title",
  //     key: "title",
  //     width: "25%",
  //   },
  //   {
  //     title: "รหัสบริษัท",
  //     dataIndex: "number",
  //     key: "number",
  //   },
  //   {
  //     title: " เขต",
  //     dataIndex: "title",
  //     key: "title",
  //     width: "10%",
  //   },
  //   {
  //     title: "ประเภทราคา",
  //     dataIndex: "title",
  //     key: "title",
  //     width: "15%",
  //   },
  //   {
  //     title: "",
  //     dataIndex: "action",
  //     key: "action",
  //     width: "10%",
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
    <>
      <div style={{ display: "flex", marginTop: 12, marginBottom: 24 }}>
        <Text>กำลังจะอัพเดทเร็วๆนี้</Text>
      </div>
    </>
  );
};

export default ShopPage;
