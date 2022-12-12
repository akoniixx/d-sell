import React from "react";
import styled from "styled-components";
import TablePagination from "../../../../components/Table/TablePagination";
import TableSecondary from "../../../../components/Table/TableSecondary";
import Text from "../../../../components/Text/Text";

const Container = styled.div`
  padding: 16px;
`;
function HistoryTab(): JSX.Element {
  const take = 10;
  const [page, setPage] = React.useState(1);

  const defaultColumn = React.useMemo(() => {
    const staticColumn = [
      {
        title: "วันเวลาที่อัปเดท",
        dataIndex: "updateDate",
        key: "updateDate",
      },
      {
        title: "ผู้ใช้งาน",
        dataIndex: "user",
        key: "user",
      },
      {
        title: "กิจกรรม",
        dataIndex: "action",
        key: "action",
      },
      {
        title: "เบอร์โทรศัพท์ (หลัก)",
        dataIndex: "phoneMain",
        key: "phoneMain",
      },
      {
        title: "เบอร์โทรศัพท์ (รอง)",
        dataIndex: "phoneSub",
        key: "phoneSub",
      },
      {
        title: "ผู้ตรวจสอบเบอร์โทรศัพท์",
        dataIndex: "phoneChecker",
        key: "phoneChecker",
      },
    ];
    const column = staticColumn.map((item) => {
      return {
        ...item,
        render: (value: any) => {
          return <Text>{value}</Text>;
        },
      };
    });
    return column;
  }, []);

  const data = {
    data: [
      {
        updateDate: "2021-08-01 10:00:00",
        user: "นาย ธนพล ศรีสุข",
        action: "เพิ่มข้อมูล",
        phoneMain: "0812345678",
        phoneSub: "0812345678",
        phoneChecker: "นาย ธนพล ศรีสุข",
      },
    ],
    count: 0,
  };
  return (
    <Container>
      <Text fontWeight={700}>ประวัติการบันทึกข้อมูล</Text>
      <TableSecondary
        columns={defaultColumn}
        style={{
          marginTop: 32,
        }}
        data={data?.data || []}
        pagination={{
          total: data.count,
          current: page,

          onChange: (page) => {
            setPage(page);
          },
        }}
      />
    </Container>
  );
}

export default HistoryTab;
