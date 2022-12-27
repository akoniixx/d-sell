import { Row } from "antd";
import React, { useMemo, useState } from "react";
import { CardContainer } from "../../../components/Card/CardContainer";
import { useQuery } from "react-query";
import PageTitle from "../../../components/PageTitle/PageTitle";
import SearchInput from "../../../components/Input/SearchInput";
import TablePagination from "../../../components/Table/TablePagination";
import Text from "../../../components/Text/Text";
import dayjs from "dayjs";
import { SaleListDatasource } from "../../../datasource/SaleListDatasource";
import styled from "styled-components";
import color from "../../../resource/color";
import Switch from "../../../components/Switch/Switch";
import MenuTable from "../../../components/MenuTable/MenuTable";
import Button from "../../../components/Button/Button";
import AntdTabs from "../../../components/AntdTabs/AntdTabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffectOnce } from "react-use";
import DetailUserModal from "../../../components/Modal/DetailUserModal";
import { SaleEntity } from "../../../entities/SaleEntity";
import useDebounce from "../../../hook/useDebounce";

import { useLocalStorage } from "../../../hook/useLocalStorage";
import { useRecoilValue } from "recoil";
import { roleAtom } from "../../../store/RoleAtom";

const NoImage = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${color.background1};
`;

function SaleManagementPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const [profile] = useLocalStorage("profile", null);

  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState("all");
  const [visible, setVisible] = useState(false);
  const [detailData, setDetailData] = useState<SaleEntity>({});
  const [debouncedValue, loadingDebouncing] = useDebounce(keyword, 500);
  const roleData = useRecoilValue(roleAtom);
  const parseRole = JSON.parse(roleData?.menus || "[]");
  const findRoleSaleManagement = parseRole.find(
    (item: { permission: string[]; menuName: string }) => {
      return item.menuName === "saleManagement";
    },
  );
  const includeCreate = findRoleSaleManagement.permission.includes("create");

  const {
    data,
    isLoading,
    error,
    refetch: getUserStaff,
  } = useQuery(["saleManagement", debouncedValue, tab, page], async () =>
    SaleListDatasource.getUserStaff({
      keyword: debouncedValue,
      page,
      take: 8,
      isActive: tab === "all" ? undefined : tab === "active" ? "ACTIVE" : "INACTIVE",
      company: profile?.company,
    }),
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChangeStatus = async (id: string, currentStatus: string) => {
    await SaleListDatasource.updateUserStaff(id, {
      status: currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });
    getUserStaff();
  };

  useEffectOnce(() => {
    searchParams.get("status") && setTab(searchParams.get("status") || "all");
  });
  const defaultTableColumns = useMemo(() => {
    const includeEdit = findRoleSaleManagement.permission.includes("edit");
    const staticData = [
      {
        title: "ลำดับ",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "ชื่อ-นามสกุล",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "ตำแหน่ง",
        dataIndex: "role",
        key: "role",
      },
      {
        title: "เขต",
        dataIndex: "zone",
        key: "zone",
      },
      {
        title: "ข้อมูลติดต่อ",
        dataIndex: "telephone",
        key: "telephone",
      },
      {
        title: "อัพเดทโดย",
        dataIndex: "updateBy",
        key: "updateBy",
      },
      {
        title: "สถานะ",
        dataIndex: "status",
        key: "status",
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
        width: item.key === "action" ? 200 : undefined,
        // sorter: item.key === "contact" ? undefined : (a: any, b: any) => a[item.key] - b[item.key],
        render: (value: any, data: any) => {
          if (item.key === "name") {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                {data.profileImage ? (
                  <img
                    src={data.profileImage}
                    alt=''
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 50,
                    }}
                  />
                ) : (
                  <NoImage>
                    <Text color='primary'>{data.firstname.split("")[0]}</Text>
                  </NoImage>
                )}
                <div>
                  <Row>
                    <Text>
                      {data.firstname} {data.lastname}
                    </Text>
                  </Row>
                  <Text level={6} color='Text3'>
                    {data.nickname}
                  </Text>
                </div>
              </div>
            );
          }
          if (item.key === "telephone") {
            return (
              <div>
                <Row>
                  <Text>{data.telephone}</Text>
                </Row>
                <Text level={6} color='Text3'>
                  {data.email}
                </Text>
              </div>
            );
          }
          if (item.key === "role") {
            return <Text>{value}</Text>;
          }
          if (item.key === "updateBy") {
            return (
              <div>
                <Row>
                  <Text>{dayjs(data.updateDate).format("DD/MM/BBBB")}</Text>
                </Row>
                <Text level={6} color='Text3'>
                  {data.updateBy}
                </Text>
              </div>
            );
          }
          if (item.key === "status") {
            return (
              <Switch
                value={value === "ACTIVE"}
                onChange={() => {
                  onChangeStatus(data.userStaffId, value);
                }}
              />
            );
          }
          if (item.key === "action") {
            return (
              <MenuTable
                hideDelete
                hideEdit={!includeEdit}
                onClickList={() => {
                  setDetailData(data);
                  setVisible(true);
                }}
                onClickEdit={() => {
                  navigate(`EditSale/${data.userStaffId}`);
                }}
              />
            );
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
  }, [findRoleSaleManagement, navigate, onChangeStatus]);
  const dataTabs = [
    {
      label: data?.counttotal ? `ทั้งหมด (${data?.counttotal})` : "ทั้งหมด",
      key: "all",
    },
    {
      label: data?.countactive ? `Active (${data?.countactive})` : "Active",
      key: "active",
    },
    {
      label: data?.countinactive ? `Inactive (${data?.countinactive})` : "Inactive",
      key: "inactive",
    },
  ];
  return (
    <>
      <CardContainer
        style={{
          padding: "16px 32px 8px",
        }}
      >
        <PageTitle
          title='รายชื่อผู้ใช้งาน'
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
                  placeholder='ค้นหาผู้ใช้งาน'
                  value={keyword}
                />
              </div>
              {includeCreate && (
                <div>
                  <Button
                    onClick={() => {
                      navigate("AddSale");
                    }}
                    title=' + เพิ่มผู้ใช้งาน'
                  />
                </div>
              )}
            </div>
          }
        />
        <AntdTabs
          data={dataTabs}
          onChange={(key) => {
            setTab(key);
            setPage(1);
            navigate(`?status=${key}`);
          }}
          defaultTab={tab}
        />
        <TablePagination
          columns={defaultTableColumns}
          data={
            (data?.data || []).map((el: any, idx: number) => {
              return {
                ...el,
                key: el.userStaffId,
                id: (page - 1) * 10 + idx + 1,
              };
            }) || []
          }
          isLoading={!!error || isLoading || !!loadingDebouncing}
          scroll={{ x: "max-content" }}
          pagination={{
            current: page,
            pageSize: 8,
            total: data?.count || 0,
            onChange: (page) => {
              setPage(page);
            },
          }}
        />
        <DetailUserModal
          visible={visible}
          data={detailData}
          onCancel={() => {
            setVisible(false);
          }}
        />
      </CardContainer>
    </>
  );
}

export default SaleManagementPage;
