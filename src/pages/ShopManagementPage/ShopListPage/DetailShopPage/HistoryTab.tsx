import dayjs from "dayjs";
import React from "react";
import styled from "styled-components";
import TableSecondary from "../../../../components/Table/TableSecondary";
import Text from "../../../../components/Text/Text";

const Container = styled.div`
  padding: 16px;
`;
interface Props {
  historyData: {
    action: string;
    actionBy: string;
    actionDate: string;
    cusId: string;
    shopHisId: string;
    shopSecondTelephone: string | null;
    shopTelephone: string | null;
  }[];
}
function HistoryTab({ historyData }: Props): JSX.Element {
  const [page, setPage] = React.useState(1);

  const defaultColumn = React.useMemo(() => {
    const staticColumn = [
      {
        title: "วันเวลาที่อัปเดท",
        dataIndex: "actionDate",
        key: "actionDate",
      },
      {
        title: "ผู้ใช้งาน",
        dataIndex: "actionBy",
        key: "actionBy",
      },
      {
        title: "กิจกรรม",
        dataIndex: "action",
        key: "action",
      },
      {
        title: "เบอร์โทรศัพท์ (หลัก)",
        dataIndex: "shopTelephone",
        key: "shopTelephone",
      },
      {
        title: "เบอร์โทรศัพท์ (รอง)",
        dataIndex: "shopSecondTelephone",
        key: "shopSecondTelephone",
      },
      // {
      //   title: "ผู้ตรวจสอบเบอร์โทรศัพท์",
      //   dataIndex: "phoneChecker",
      //   key: "phoneChecker",
      // },
    ];
    const column = staticColumn.map((item) => {
      return {
        ...item,
        render: (value: any) => {
          if (item.dataIndex === "actionDate") {
            return <Text>{dayjs(value).locale("th").format("DD/MM/BBBB HH:mm น.")}</Text>;
          }
          return <Text>{value || "-"}</Text>;
        },
      };
    });
    return column;
  }, []);

  return (
    <Container>
      <Text fontWeight={700}>ประวัติการบันทึกข้อมูล</Text>
      <TableSecondary
        columns={defaultColumn}
        style={{
          marginTop: 32,
        }}
        data={historyData || []}
        pagination={{
          total: historyData.length,
          current: page,
          pageSize: 10,
          onChange: (page) => {
            setPage(page);
          },
        }}
      />
    </Container>
  );
}

export default HistoryTab;
