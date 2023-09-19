import { Row } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useMemo } from "react";
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
import { roleAtom } from "../../../store/RoleAtom";

export default function RolesManagementPage(): JSX.Element {
  const profile = useRecoilValue(profileAtom);
  const [page, setPage] = React.useState(1);
  const [keyword, setKeyword] = React.useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const roleData = useRecoilValue(roleAtom);
  const parseRole =
    typeof roleData?.menus === "string" ? JSON.parse(roleData?.menus || "[]") : roleData?.menus;
  const findRoleManagement = parseRole.find((item: { permission: string[]; menuName: string }) => {
    return item.menuName === "roleManagement";
  });
  const includeCreate = findRoleManagement.permission.includes("create");
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

  const onClickEdit = useCallback(
    (id: string) => {
      navigate(`EditRole/${id}`);
    },
    [navigate],
  );
  const onClickDelete = useCallback(
    async (id: string) => {
      try {
        const res = await roleDatasource.deleteRole(id);
        if (res && res.success) {
          await Swal.fire({
            title: "ลบข้อมูลสำเร็จ",
            text: "",
            width: 250,
            timer: 2000,
            icon: "success",
            customClass: {
              title: "custom-title",
            },
            showConfirmButton: false,
          }).then(() => {
            getAllRoles();
          });
        } else {
          await Swal.fire({
            title: res.userMessage,
            text: "",
            width: 250,
            timer: 2000,
            icon: "error",
            customClass: {
              title: "custom-title",
            },
            showConfirmButton: false,
          }).then(() => {
            getAllRoles();
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    [getAllRoles],
  );
  const defaultTableColumns = useMemo(() => {
    const includeEdit = findRoleManagement?.permission.includes("edit");
    const includeDelete = findRoleManagement?.permission.includes("delete");
    const includeView = findRoleManagement?.permission.includes("view");
    const staticData = [
      {
        title: "ลำดับ",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "ชื่อบทบาท",
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
                  {data.updateBy ? data.updateBy : "-"}
                </Text>
              </div>
            );
          }

          if (item.key === "action") {
            return (
              <MenuTable
                onClickList={() => {
                  navigate(`DetailRole/${data.roleId}`);
                }}
                hideDelete={!includeDelete}
                hideList={!includeView}
                hideEdit={!includeEdit}
                hindSync
                titleModalWarning='ต้องการลบข้อมูลบทบาทผู้ใช้งานนี้'
                descriptionModalWarning='โปรดยืนยันการลบข้อมูลบทบาทผู้ใช้งาน'
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
  }, [findRoleManagement?.permission, navigate, onClickDelete, onClickEdit]);
  return (
    <>
      <CardContainer
        style={{
          padding: "16px 32px 8px",
        }}
      >
        <PageTitle
          title='จัดการสิทธิบทบาทผู้ใช้งาน'
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
                    setPage(1);
                    setKeyword(e.target.value);
                  }}
                  placeholder='ค้นหาบทบาท'
                  value={keyword}
                />
              </div>
              {includeCreate && (
                <div>
                  <Button
                    title='+ เพิ่มบทบาท'
                    onClick={() => {
                      navigate("AddNewRole");
                    }}
                  />
                </div>
              )}
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
              current: page,
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
