import { Row } from "antd";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Swal from "sweetalert2";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import SearchInput from "../../../components/Input/SearchInput";
import MenuTable from "../../../components/MenuTable/MenuTable";
import PageTitle from "../../../components/PageTitle/PageTitle";
import TablePagination from "../../../components/Table/TablePagination";
import Text from "../../../components/Text/Text";
import { roleDatasource } from "../../../datasource/RoleDatasource";
import useDebounce from "../../../hook/useDebounce";
import { profileAtom } from "../../../store/ProfileAtom";

export default function RolesManagementPage(): JSX.Element {
  const profile = useRecoilValue(profileAtom);
  const [page, setPage] = React.useState(1);
  const [keyword, setKeyword] = React.useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const [debouncedValue, loading] = useDebounce(keyword, 500);
  const {
    data: awaitData,
    isLoading,
    refetch: getAllRoles,
  } = useQuery(["rolesManagement", debouncedValue, page, profile?.company], async () => {
    return await roleDatasource.getAllRoles({
      text: debouncedValue,
      page,
      take: 8,
      company: profile?.company,
    });
  });
  const data = useMemo(() => {
    return awaitData?.data;
  }, [awaitData]);

  const onClickEdit = (id: string) => {
    navigate(`EditRole/${id}`);
  };
  const onClickDelete = async (id: string) => {
    try {
      await roleDatasource.deleteRole(id);
      getAllRoles();
      Swal.fire({
        title: "ลบข้อมูลสำเร็จ",
        text: "",
        width: 250,
        icon: "success",
        customClass: {
          title: "custom-title",
        },
        showConfirmButton: false,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const defaultTableColumns = useMemo(() => {
    const staticData = [
      {
        title: "ลำดับ",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "ชื่อตำแหน่ง",
        dataIndex: "rolename",
        key: "rolename",
      },

      {
        title: "คำอธิบาย",
        dataIndex: "roledescription",
        key: "roledescription",
      },
      {
        title: "จำนวนสมาชิก",
        dataIndex: "countmember",
        key: "countmember",
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
            return (
              <MenuTable
                hideList
                onClickDelete={() => onClickDelete(data.roleId)}
                onClickEdit={() => {
                  onClickEdit(data.roleId);
                }}
              />
            );
          }

          return (
            <div style={{ padding: 4 }}>
              <Text>{value || value === 0 ? `${value}` : "-"}</Text>
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
            data={(data?.data || []).map((item: any, index: number) => {
              return {
                ...item,
                id: index + 1,
              };
            })}
            isLoading={!!loading || isLoading}
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
