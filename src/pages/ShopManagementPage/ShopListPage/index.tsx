import { CheckCircleTwoTone, SyncOutlined } from "@ant-design/icons";
import { Form, Row, Modal, message } from "antd";
import React, { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { useRecoilValue } from "recoil";
import Swal from "sweetalert2";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import { FlexCol } from "../../../components/Container/Container";
import Input from "../../../components/Input/Input";
import SearchInput from "../../../components/Input/SearchInput";
import MenuTable from "../../../components/MenuTable/MenuTable";
import PageTitle from "../../../components/PageTitle/PageTitle";
import Select from "../../../components/Select/Select";
import TablePagination from "../../../components/Table/TablePagination";
import Text from "../../../components/Text/Text";
import { shopDatasource } from "../../../datasource/ShopDatasource";
import { zoneDatasource } from "../../../datasource/ZoneDatasource";
import { CustomerEntityShopListIndex } from "../../../entities/CustomerEntity";
import useDebounce from "../../../hook/useDebounce";
import { color } from "../../../resource";
import { profileAtom } from "../../../store/ProfileAtom";

function ShopListPage(): JSX.Element {
  const [visibleCreate, setVisibleCreate] = React.useState(false);
  const [visibleEdit, setVisibleEdit] = React.useState(false);
  const [cusId, setCusId] = React.useState("");
  const [zone, setZone] = React.useState<{ label: string; value: string; key: string }[]>([]);
  const [currentZone, setCurrentZone] = React.useState<string>("all");
  const profile = useRecoilValue(profileAtom);

  const [keyword, setKeyword] = React.useState<string>("");
  const [page, setPage] = React.useState(1);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [debouncedValueSearch, loadingDebouncing] = useDebounce(keyword, 500);
  const [isCreating, setIsCreating] = React.useState(false);

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

  const { data, isLoading, error, refetch } = useQuery(
    ["shopList", page, debouncedValueSearch, currentZone],
    async () => {
      return await shopDatasource.getAllCustomer({
        page,
        take: 8,
        searchText: debouncedValueSearch,
        zone: currentZone === "all" ? undefined : currentZone,
      });
    },
  );
  const convertShopOwner = ({
    nametitle,
    firstname,
    lastname,
  }: {
    nametitle?: string;
    firstname?: string;
    lastname?: string;
  }) => {
    let nameOwner = "";
    if (nametitle) {
      nameOwner = nametitle;
    }
    if (firstname) {
      nameOwner = nameOwner + firstname;
    }
    if (lastname) {
      nameOwner = nameOwner + `  ${lastname}`;
    }
    if (nameOwner === "") {
      return "-";
    } else {
      return nameOwner;
    }
  };
  const onFinish = async (values: { taxId: string }) => {
    try {
      const res = await shopDatasource.getCustomerByTaxId({
        taxNo: values.taxId,
        company: profile?.company || "",
      });

      setVisible(false);

      if (res && res?.action === "Create") {
        setVisibleCreate(true);
        return null;
      }

      if (res && res?.action === "Edit") {
        const { customerId } = res.data;
        setVisibleEdit(true);
        setCusId(customerId);
        return null;
      }
      if (res && res?.action === "Waiting") {
        return Swal.fire({
          title: "ร้านค้านี้ยังไม่ถูกยืนยันเบอร์โทรศัพท์ กรุณายืนยันเบอร์โทรศัพท์ให้เรียบร้อย",
          text: "",
          width: 350,
          icon: "error",
          customClass: {
            title: "custom-title",
          },
          timer: 2000,

          showConfirmButton: false,
        });
      }

      if (res && !res.success) {
        return Swal.fire({
          title: res.userMessage || "บันทึกข้อมูลไม่สำเร็จ",
          text: "",
          width: 250,
          icon: "error",
          customClass: {
            title: "custom-title",
          },
          timer: 2000,

          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onClickDetail = useCallback(
    (id: string) => {
      navigate(`DetailPage/${id}`);
    },
    [navigate],
  );
  const syncByCustomerCode = async (value: string) => {
    await shopDatasource.syncCustomerTel(value, profile?.company).then((res) => {
      if (res.success) {
        setTimeout(() => {
          setIsCreating(false);
          refetch();
        }, 2000);
      } else {
        setIsCreating(false);
      }
    });
  };

  const newZone = useMemo(() => {
    if (zone) {
      return [{ label: "เขต : ทั้งหมด", value: "all", key: "all" }, ...zone];
    } else {
      return [{ label: "เขต : ทั้งหมด", value: "all", key: "all" }];
    }
  }, [zone]);

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
        title: "Tax No.",
        dataIndex: "taxNo",
        key: "taxNo",
      },
      {
        title: "ชื่อเจ้าของร้าน",
        dataIndex: "zone",
        key: "zone",
      },
      {
        title: "เบอร์โทร",
        dataIndex: "telephone",
        key: "telephone",
      },
      {
        title: (
          <Text color='success' fontWeight={600}>
            ICPL
          </Text>
        ),
        dataIndex: "ICPL",
        key: "ICPL",
      },
      {
        title: (
          <Text color='error' fontWeight={600}>
            ICPF
          </Text>
        ),
        dataIndex: "ICPF",
        key: "ICPF",
      },
      {
        title: (
          <Text color='primary' fontWeight={600}>
            ICPI
          </Text>
        ),
        dataIndex: "ICPI",
        key: "ICPI",
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
        key: item.key,

        dataIndex: item.dataIndex,
        title: item.title,

        fixed: item.key === "action" ? "right" : undefined,
        // sorter: item.key === "contact" ? undefined : (a: any, b: any) => a[item.key] - b[item.key],
        render: (value: any, data: CustomerEntityShopListIndex) => {
          const userShop = data?.customerToUserShops[0]?.userShop || {
            nametitle: "",
            firstname: "",
            lastname: "",
          };
          const telephone = data?.customerToUserShops[0]?.userShop;
          const isActive = data.customerCompany?.find((el) => el.isActive);
          const ICPL = data.customerCompany?.find((el) => el.company === "ICPL");
          const ICPF = data.customerCompany?.find((el) => el.company === "ICPF");
          const ICPI = data.customerCompany?.find((el) => el.company === "ICPI");
          const customerName = isActive ? isActive : data.customerCompany[0];
          const convertStatus = (status: boolean) => {
            return status ? (
              <Text fontWeight={600} color='success'>
                Active
              </Text>
            ) : (
              <Text color='error' fontWeight={600}>
                In Active
              </Text>
            );
          };

          if (item.key === "action") {
            const findCusCode = data.customerCompany?.find((el) => el.company === profile?.company);
            return (
              <>
                <MenuTable
                  hideDelete
                  hideEdit
                  onClickList={() => {
                    onClickDetail(data?.customerId || "");
                  }}
                  onClickSync={() => {
                    syncByCustomerCode(findCusCode?.customerNo || "");
                    setIsCreating(!isCreating);
                  }}
                />
              </>
            );
          }
          if (item.key === "shopName") {
            return (
              <div>
                <Row>
                  <Text>{customerName?.customerName || "-"}</Text>
                </Row>
                <Text level={6} color='Text3'>
                  {`จ.${data.province}`}
                </Text>
              </div>
            );
          }
          if (item.key === "ICPL") {
            return (
              <div>
                <Row>{ICPL ? convertStatus(ICPL.isActive) : <Text>-</Text>}</Row>
                {ICPL ? (
                  <Text level={7} color='Text3' fontFamily='Sarabun'>
                    {`${ICPL.customerType === "DL" ? "Dealer" : "SubDealer"} ・ ${ICPL.zone}`}
                  </Text>
                ) : (
                  <Text level={7} color='Text3'>
                    -
                  </Text>
                )}
              </div>
            );
          }
          if (item.key === "ICPF") {
            return (
              <div>
                <Row>{ICPF ? convertStatus(ICPF.isActive) : <Text>-</Text>}</Row>
                {ICPF ? (
                  <Text level={7} color='Text3' fontFamily='Sarabun'>
                    {`${ICPF.customerType === "DL" ? "Dealer" : "SubDealer"} ・ ${ICPF.zone}`}
                  </Text>
                ) : (
                  <Text level={7} color='Text3'>
                    -
                  </Text>
                )}
              </div>
            );
          }
          if (item.key === "ICPI") {
            return (
              <div>
                <Row>{ICPI ? convertStatus(ICPI.isActive) : <Text>-</Text>}</Row>
                {ICPI ? (
                  <Text level={7} color='Text3' fontFamily='Sarabun'>
                    {`${ICPI.customerType === "DL" ? "Dealer" : "SubDealer"} ・ ${ICPI.zone}`}
                  </Text>
                ) : (
                  <Text level={7} color='Text3'>
                    -
                  </Text>
                )}
              </div>
            );
          }
          if (item.key === "zone") {
            const isHasValue = Object.values(userShop).some((el) => el);
            //const isHasSecondTel = Object.values(telephone).some((el) => el);
            if (!isHasValue) return <Text>-</Text>;
            return (
              <div>
                <Text>{`${userShop.nametitle || ""} ${userShop.firstname || ""} ${
                  userShop.lastname || ""
                }`}</Text>
              </div>
            );
          }
          if (item.key === "telephone") {
            const isHasValueTel = telephone?.telephone;
            const isHasValueSec = telephone?.secondtelephone;
            return (
              <div>
                <Text>{isHasValueTel ? `${telephone?.telephone}` : "-"}</Text>
                <Text>{isHasValueSec && ","}</Text>
                <br />
                {isHasValueSec && <Text>{`${telephone?.secondtelephone}`}</Text>}
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
  }, [onClickDetail]);

  const onSyncCustomer = async () => {
    Modal.confirm({
      title: "ยืนยันการเชื่อมต่อ Navision",
      onOk: async () => {
        await shopDatasource
          .syncAllCustomer(profile?.company, `${profile?.firstname} ${profile?.lastname}`)
          .then((res) => {
            setIsCreating(true);
            const { success } = res;
            if (success) {
              setTimeout(() => {
                setIsCreating(false);
                refetch();
              }, 1000);
            } else {
              message.error("เชื่อมต่อ Navision ไม่สำเร็จ");
            }
          })
          .catch((err) => console.log("err", err))
          .finally(() => console.log("sync customer done"));
      },
    });
  };

  return (
    <CardContainer>
      <PageTitle
        title='รายชื่อร้านค้า'
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
                  setPage(1);
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
            <div>
              <Button
                onClick={() => {
                  setVisible(true);
                }}
                title=' + เพิ่มร้านค้า'
              />
            </div>
            <div>
              <Button
                title='เชื่อมต่อ Navision'
                icon={<SyncOutlined style={{ color: "white" }} />}
                onClick={onSyncCustomer}
              />
            </div>
          </div>
        }
      />
      <div
        style={{
          marginTop: 16,
        }}
      >
        <TablePagination
          scroll={{
            x: "max-content",
          }}
          data={data?.data || []}
          columns={defaultTableColumns}
          isLoading={!!loadingDebouncing || !!error || isLoading}
          pagination={{
            current: page,
            total: data?.count_total || 0,
            pageSize: 8,
            onChange: (page) => {
              setPage(page);
            },
          }}
        />
      </div>
      <Modal
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        bodyStyle={{
          minHeight: 150,
          padding: 32,
        }}
      >
        <Form form={form} onFinish={onFinish}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              gap: 8,
            }}
          >
            <Row>
              <Text fontWeight={700} fontSize={16}>
                เลขประจำตัวผู้เสียภาษี (ของร้าน)
              </Text>
            </Row>
            <Form.Item
              name='taxId'
              style={{
                width: "100%",
                marginBottom: 0,
              }}
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกเลขประจำตัวผู้เสียภาษี",
                },
                {
                  pattern: /^[0-9]{13}$/,
                  message: "กรุณากรอกเลขประจำตัวผู้เสียภาษีให้ถูกต้อง",
                },
              ]}
            >
              <Input
                align='center'
                placeholder='ระบุหมายเลขเลขประจำตัวผู้เสียภาษี'
                style={{
                  height: 38,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                maxLength={13}
              />
            </Form.Item>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <Button
              typeButton='primary-light'
              title='ยกเลิก'
              onClick={() => {
                setVisible(false);
              }}
            />
            <Button
              title='ตกลง'
              onClick={() => {
                form.submit();
              }}
            />
          </div>
        </Form>
      </Modal>
      <Modal
        visible={visibleCreate}
        onCancel={() => {
          setVisibleCreate(false);
        }}
        bodyStyle={{
          minHeight: 150,
          padding: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 24,
            paddingTop: 24,
          }}
        >
          <Text fontWeight={700} align='center' fontSize={20}>
            ไม่พบหมายเลขประจำตัวผู้เสียภาษีนี้ คุณต้องการสร้างร้านค้าใหม่หรือไม่
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Button
            typeButton='primary-light'
            title='ยกเลิก'
            onClick={() => {
              setVisibleCreate(false);
            }}
          />
          <Button
            title='สร้างร้านค้าใหม่'
            onClick={() => {
              const { taxId } = form.getFieldsValue();
              setVisibleCreate(false);
              navigate({
                pathname: "AddNewShop",
                search: createSearchParams({
                  taxId,
                }).toString(),
              });
            }}
          />
        </div>
      </Modal>
      <Modal
        visible={visibleEdit}
        onCancel={() => {
          setVisibleEdit(false);
        }}
        bodyStyle={{
          minHeight: 150,
          padding: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 24,
            paddingTop: 24,
          }}
        >
          <Text fontWeight={700} align='center' fontSize={20}>
            เลขประจำตัวผู้เสียภาษีนี้มีข้อมูลร้านคู่ค้าของท่านอยู่แล้ว
            ท่านต้องการแก้ไขข้อมูลหรือไม่?
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Button
            typeButton='primary-light'
            title='แก้ไขข้อมูล'
            onClick={() => {
              const { taxId } = form.getFieldsValue();
              setVisibleEdit(false);
              return navigate({
                pathname: `DetailPage/${cusId}/EditShopPage`,
                search: createSearchParams({
                  taxId,
                }).toString(),
              });
            }}
          />
          <Button
            title='ยกเลิก'
            onClick={() => {
              setVisibleEdit(false);
            }}
          />
        </div>
      </Modal>
      <Modal open={isCreating} footer={null} width={220} closable={false}>
        <FlexCol align='space-around' justify='center' style={{ width: 172, height: 172 }}>
          <CheckCircleTwoTone twoToneColor={color.success} style={{ fontSize: 36 }} />
          <br />
          <Text level={4} align='center'>
            Sync ข้อมูลสำเร็จ
          </Text>
        </FlexCol>
      </Modal>
    </CardContainer>
  );
}

export default ShopListPage;
