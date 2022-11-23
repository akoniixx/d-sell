import { Row } from "antd";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import SearchInput from "../../../components/Input/SearchInput";
import MenuTable from "../../../components/MenuTable/MenuTable";
import PageTitle from "../../../components/PageTitle/PageTitle";
import TablePagination from "../../../components/Table/TablePagination";
import Text from "../../../components/Text/Text";

export default function RolesManagementPage(): JSX.Element {
  const data = {
    count: 0,
  };
  const [page, setPage] = React.useState(1);
  const [keyword, setKeyword] = React.useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const defaultTableColumns = useMemo(() => {
    const staticData = [
      {
        title: "ลำดับ",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "ชื่อตำแหน่ง",
        dataIndex: "role",
        key: "role",
      },

      {
        title: "คำอธิบาย",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "จำนวนสมาชิก",
        dataIndex: "members",
        key: "members",
      },

      {
        title: "อัพเดทโดย",
        dataIndex: "updateBy",
        key: "updateBy",
      },

      {
        title: "การจัดการ",
        dataIndex: "action",
        key: "action",
      },
    ];
    const columns = staticData.map((item) => {
      return {
        ...item,
        fixed: item.key === "action" ? "right" : undefined,
        width: item.key === "action" ? 200 : item.key === "members" ? 200 : undefined,

        // sorter: item.key === "contact" ? undefined : (a: any, b: any) => a[item.key] - b[item.key],
        render: (value: any, data: any) => {
          if (item.key === "updateBy") {
            return (
              <div>
                <Row>
                  <Text>{data.updateDate ? dayjs(data.updateDate).format("DD/MM/BBBB") : "-"}</Text>
                </Row>
                <Text level={6} color='Text3'>
                  {data.updateBy}
                </Text>
              </div>
            );
          }

          if (item.key === "action") {
            return <MenuTable />;
          }

          return (
            <div style={{ padding: 4 }}>
              <Text>{value ? `${value}` : "-"}</Text>
            </div>
          );
        },
      };
    });
    return columns;
  }, []);
  return (
    <>
      <CardContainer
        style={{
          padding: "16px 32px 8px",
        }}
      >
        <PageTitle
          title='จัดการสิทธิตำแหน่งผู้ใช้งาน'
          extra={
            <div
              style={{
                display: "flex",
                gap: 16,
              }}
            >
              <div>
                <SearchInput
                  onChange={(e) => {
                    setKeyword(e.target.value);
                  }}
                  placeholder='ค้นหาตำแหน่ง'
                  value={keyword}
                />
              </div>
              <div>
                <Button
                  title='+ เพิ่มตำแหน่ง'
                  onClick={() => {
                    navigate("AddNewRole");
                  }}
                />
              </div>
            </div>
          }
        />
        <div
          style={{
            marginTop: 24,
          }}
        >
          <TablePagination
            columns={defaultTableColumns}
            data={[]}
            isLoading={false}
            scroll={{ x: "max-content" }}
            pagination={{
              current: 1,
              pageSize: 10,
              total: data?.count || 0,
              onChange: (page) => {
                setPage(page);
              },
            }}
          />
        </div>
      </CardContainer>
    </>
  );
}
