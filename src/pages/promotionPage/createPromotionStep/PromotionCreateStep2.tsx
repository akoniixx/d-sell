import { Col, Divider, FormInstance, Modal, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { FlexCol, FlexRow } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import color from "../../../resource/color";
import {
  CloseOutlined,
  DeleteFilled,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { StoreEntity, ZoneEntity } from "../../../entities/StoreEntity";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import { AlignType } from "rc-table/lib/interface";
import TableContainer from "../../../components/Table/TableContainer";
import { getZones } from "../../../datasource/CustomerDatasource";
import { ModalSelectStore } from "../../Shared/ModalSelectStore";

interface Step2Props {
  form: FormInstance;
  showError?: boolean;
  setError?: any;
}

export const PromotionCreateStep2 = ({ form, showError, setError }: Step2Props) => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const defaultFilter = {
    zone: "",
    keyword: "",
  };
  const [filter, setFilter] = useState(defaultFilter);
  const [showSearch, setSearch] = useState(false);
  const [storeList, setStoreList] = useState<StoreEntity[]>(form.getFieldValue("stores") || []);
  const [storeListFiltered, setStoreListFiltered] = useState<StoreEntity[]>(
    form.getFieldValue("stores"),
  );
  const [selectedStoreKeys, setSelectedStoreKeys] = useState<React.Key[]>([]);
  const [selectedStoreList, setSelectedStoreList] = useState<StoreEntity[]>([]);
  const [zones, setZones] = useState<ZoneEntity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const data = await getZones(company);
      setZones(data.map((d: StoreEntity, i: number) => ({ ...d, key: d.customerCompanyId })));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onSetStore = (stores: any) => {
    const newStores = [...storeList, ...stores];
    setStoreList(newStores);
    setStoreListFiltered(newStores);
    setFilter(defaultFilter);
    form.setFieldsValue({
      ...form.getFieldsValue(),
      stores: newStores,
    });
    setError(false);
    setSearch(false);
  };

  const toggleSearchWindow = () => {
    setSearch(!showSearch);
  };

  const columns = [
    {
      title: "รหัสร้านค้า",
      dataIndex: "customerNo",
      align: "center" as AlignType,
    },
    {
      title: "ชื่อร้านค้า",
      dataIndex: "customerName",
      align: "center" as AlignType,
    },
    {
      title: "เขตการขาย",
      dataIndex: "zone",
      align: "center" as AlignType,
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedStoreKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: StoreEntity[]) => {
      setSelectedStoreList(selectedRows);
      setSelectedStoreKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: StoreEntity) => ({
      name: record.customerName,
    }),
  };

  const onFilter = ({ zone, keyword }: any) => {
    setFilter({ zone, keyword });
    setStoreListFiltered(
      storeList.filter((store) => {
        const isInZone = !zone || store.zone === zone;
        const hasKeyword =
          !keyword ||
          store?.customerName?.includes(keyword) ||
          store?.customerNo?.includes(keyword);
        return isInZone && hasKeyword;
      }),
    );
  };

  return (
    <>
      <Row align='middle'>
        <Text level={5} fontWeight={700}>
          รายละเอียดเขต และร้านค้า&nbsp;&nbsp;
        </Text>
        {showError && (
          <Text level={6} color='error'>
            &nbsp;โปรดระบุรายละเอียดเขต และร้านค้า*
          </Text>
        )}
      </Row>
      <br />
      <br />
      <Row>
        <Col span={14}>
          {storeList?.length > 0 && (
            <Row gutter={8}>
              <Col span={10}>
                <Select
                  style={{ width: "100%" }}
                  data={[
                    { label: "ทั้งหมด", key: "" },
                    ...zones.map((z) => ({ label: z.zoneName, key: z.zoneName })),
                  ]}
                  onChange={(val) => onFilter({ ...filter, zone: val })}
                  value={filter.zone}
                />
              </Col>
              <Col span={10}>
                <Input
                  suffix={<SearchOutlined />}
                  placeholder={"ระบุชื่อร้านค้าหรือรหัสร้านค้า"}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    onFilter({
                      ...filter,
                      keyword: e.target.value,
                    });
                  }}
                  value={filter.keyword}
                />
              </Col>
              <Col span={4}>
                <Button
                  title='ล้างการค้นหา'
                  typeButton='primary-light'
                  onClick={() => onFilter(defaultFilter)}
                />
              </Col>
            </Row>
          )}
        </Col>
        <Col span={10}>
          <Row align='middle' justify='end' gutter={22}>
            <Col span={4}>
              {selectedStoreList.length > 0 && (
                <FlexRow align='center' justify='end' style={{ height: "100%" }}>
                  <DeleteFilled
                    style={{ fontSize: 20, color: color.error }}
                    onClick={() => {
                      Modal.confirm({
                        title: (
                          <Text level={3} fontWeight={700}>
                            ลบร้านค้าที่เลือกทั้งหมด
                          </Text>
                        ),
                        icon: "",
                        content: <Text color='Text3'>โปรดยืนยันการลบร้านค้า</Text>,
                        okText: "ยืนยัน",
                        onOk: () => {
                          const newStores = storeList.filter(
                            (s) =>
                              !selectedStoreList.find(
                                (s2) => s.customerCompanyId === s2.customerCompanyId,
                              ),
                          );
                          setStoreList(newStores);
                          setStoreListFiltered(newStores);
                          setFilter(defaultFilter);
                          form.setFieldsValue({
                            ...form.getFieldsValue(),
                            stores: newStores,
                          });
                          setError(false);
                          setSearch(false);
                          setSelectedStoreList([]);
                          setSelectedStoreKeys([]);
                        },
                      });
                    }}
                  />
                </FlexRow>
              )}
            </Col>
            <Col
              span={8}
              style={{
                borderLeft: `1px solid ${color["background2"]}`,
                paddingLeft: 16,
              }}
            >
              <Button title='+ เพิ่มร้านค้า' typeButton='primary' onClick={toggleSearchWindow} />
            </Col>
          </Row>
        </Col>
      </Row>
      <br />
      <Row justify='end'>
        <Text>จำนวนที่เลือก {storeList?.length || 0} ร้าน</Text>
      </Row>
      <br />
      <TableContainer>
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          scroll={{ y: 480 }}
          columns={columns}
          dataSource={storeListFiltered?.map((s, i) => ({ ...s, key: i }))}
          pagination={false}
        />
      </TableContainer>
      {showSearch && (
        <ModalSelectStore
          callBackShop={onSetStore}
          showModalShop={showSearch}
          currentSelectShop={storeList || []}
          company={company}
          onClose={toggleSearchWindow}
        />
      )}
    </>
  );
};
