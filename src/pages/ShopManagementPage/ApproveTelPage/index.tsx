import { Row } from "antd";
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { useRecoilValue } from "recoil";
import AntdTabs from "../../../components/AntdTabs/AntdTabs";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import SearchInput from "../../../components/Input/SearchInput";
import PageTitle from "../../../components/PageTitle/PageTitle";
import Select from "../../../components/Select/Select";
import TablePagination from "../../../components/Table/TablePagination";
import Text from "../../../components/Text/Text";
import { shopDatasource } from "../../../datasource/ShopDatasource";
import { zoneDatasource } from "../../../datasource/ZoneDatasource";
import useDebounce from "../../../hook/useDebounce";
import { profileAtom } from "../../../store/ProfileAtom";

const mappingType = {
  SD: "Sub Dealer",
  DL: "Dealer",
};
function ApproveTelPage(): JSX.Element {
  const [keyword, setKeyword] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [currentZone, setCurrentZone] = React.useState("all");
  const navigate = useNavigate();
  const [tab, setTab] = React.useState("WAITING");
  const profile = useRecoilValue(profileAtom);

  const [zone, setZone] = React.useState<{ label: string; value: string; key: string }[]>([]);
  const newZone = useMemo(() => {
    if (zone) {
      return [{ label: "เขต : ทั้งหมด", value: "all", key: "all" }, ...zone];
    } else {
      return [{ label: "เขต : ทั้งหมด", value: "all", key: "all" }];
    }
  }, [zone]);
  const debouncedValue = useDebounce(keyword, 500);
  const getZoneByCompany = async () => {
    const res = await zoneDatasource.getAllZoneByCompany(profile?.company);
    const data = res.map((item: any) => {
      return {
        label: item.zoneName,
        value: item.zoneName,
        key: item.zoneId,
      };
    });
    setZone(data);
  };
  useEffectOnce(() => {
    getZoneByCompany();
  });
  const { data } = useQuery(["approve", debouncedValue, page, tab, currentZone], async () => {
    const res = await shopDatasource.getApproveTel({
      company: profile?.company || "",
      text: keyword,
      page: page,
      isApprove: tab,
      zone: currentZone === "all" ? undefined : currentZone,
      take: 8,
    });
    return res;
  });

  const onClickApprove = (id: string) => {
    navigate({
      pathname: `DetailApproveTelPage`,
      search: `?id=${id}`,
    });
  };
  const dataTabs = [
    {
      label: data?.countWaiting ? `รออนุมัติ (${data?.countWaiting})` : "รออนุมัติ  (0)",
      key: "WAITING",
    },
    {
      label: data?.countApproved ? `อนุมัติแล้ว (${data?.countApproved})` : "อนุมัติแล้ว (0)",
      key: "APPROVE",
    },
    {
      label: data?.countUnapprove ? `ไม่อนุมัติ (${data?.countUnapprove})` : "ไม่อนุมัติ (0)",
      key: "UNAPPROVE",
    },
  ];

  const defaultTableColumns = useMemo(() => {
    const staticData = [
      {
        title: "Customer No.",
        dataIndex: "customerId",
        key: "customerId",
      },
      {
        title: "ชื่อร้านค้า",
        dataIndex: "customerCompany",
        key: "shopName",
      },
      {
        title: "ชื่อเจ้าของร้าน",
        dataIndex: "customerName",
        key: "customerName",
      },
      {
        title: "เบอร์โทรศัพท์",
        dataIndex: "customerTel",
        key: "contact",
      },
      {
        title:
          profile?.company === "ICPL" ? (
            <Text color='success' fontWeight={600}>
              ICPL
            </Text>
          ) : profile?.company === "ICPF" ? (
            <Text color='error' fontWeight={600}>
              ICPF
            </Text>
          ) : (
            <Text color='primary' fontWeight={600}>
              ICPI
            </Text>
          ),
        dataIndex: profile?.company || "ICK",
        key: profile?.company || "ICK",
      },

      {
        title: "การจัดการ",

        key: "action",
      },
    ];

    const columns = staticData.map((item) => {
      return {
        key: item.key,

        dataIndex: item.dataIndex,
        title: item.title,

        fixed: item.key === "action" ? "right" : undefined,
        width: item.key === "action" ? 200 : undefined,
        // sorter: item.key === "contact" ? undefined : (a: any, b: any) => a[item.key] - b[item.key],
        render: (value: any, data: any) => {
          const findCurrentCompany = data?.customer?.customerCompany.find(
            (el: any) => el.company === profile?.company,
          );
          const userShop = data?.customer?.customerToUserShops[0]?.userShop;
          if (item.key === "contact") {
            const telList = [];
            if (data.newTelephone) {
              telList.push(data.newTelephone);
            }
            if (data.newSecondTelephone) {
              telList.push(data.newSecondTelephone);
            }
            return (
              <div>
                {telList.map((tel: any, index: number) => {
                  const isLast = index === telList.length - 1;
                  return <Text key={index}>{tel ? `${tel}${isLast ? "" : " , "}` : "-"}</Text>;
                })}
              </div>
            );
          }

          if (item.key === "shopName") {
            return (
              <div>
                <Row>
                  <Text>{findCurrentCompany ? findCurrentCompany.customerName : ""}</Text>
                </Row>
                <Text level={6} color='Text3'>
                  {`จ.${data.customer.province}`}
                </Text>
              </div>
            );
          }

          if (item.key === profile?.company) {
            return (
              <div>
                <Text fontWeight={700}>{`${
                  mappingType[findCurrentCompany.customerType as keyof typeof mappingType]
                } ・ ${findCurrentCompany.zone}`}</Text>
              </div>
            );
          }
          if (item.key === "action") {
            if (tab === "WAITING") {
              return (
                <div>
                  <Button
                    title='ตรวจสอบเบอร์โทรศัพท์'
                    onClick={() => {
                      onClickApprove(data.id);
                    }}
                  />
                </div>
              );
            }
            return (
              <div>
                <Button
                  title='รายละเอียด'
                  typeButton='primary-light'
                  onClick={() => {
                    onClickApprove(data.id);
                  }}
                />
              </div>
            );
          }
          if (item.key === "customerName") {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text>
                  {userShop.firstname} {userShop.lastname}
                </Text>
              </div>
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
  }, [tab]);

  return (
    <CardContainer>
      <PageTitle
        title='ตรวจสอบเบอร์โทรศัพท์'
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
                placeholder='ค้นหาร้านค้า, รายชื่อ...'
                value={keyword}
              />
            </div>
            <div>
              <Select
                value={currentZone}
                onChange={(e) => {
                  setPage(1);
                  setCurrentZone(e);
                }}
                data={newZone}
                style={{
                  width: 180,
                  fontFamily: "Sarabun",
                }}
              />
            </div>
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
        data={data ? data.data : []}
        columns={defaultTableColumns}
        pagination={{
          current: page,
          total:
            tab === "WAITING"
              ? data?.countWaiting
              : tab === "APPROVE"
              ? data?.countApproved
              : data?.countUnapprove,
          pageSize: 8,
          onChange: (page) => {
            setPage(page);
          },
        }}
      />
    </CardContainer>
  );
}

export default ApproveTelPage;
