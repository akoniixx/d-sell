import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Checkbox, Col, Divider, Form, Modal, Row } from "antd";
import Transfer, { TransferDirection } from "antd/lib/transfer";
import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import { FlexCol } from "../../components/Container/Container";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { StoreEntity, ZoneEntity } from "../../entities/StoreEntity";
import Text from "../../components/Text/Text";
import color from "../../resource/color";

export const ModalSelectedShop = ({
  zoneList,
  shopData,
  callBackShop,
  showModalShop,
  onClose,
  currentSelectShop,
}: {
  zoneList: ZoneEntity[];
  shopData: StoreEntity[];
  callBackShop: (item: StoreEntity[]) => void;
  showModalShop: boolean;
  onClose: () => void;
  currentSelectShop: StoreEntity[];
}) => {
  const [searchZone1, setSearchZone1] = useState("");
  const [keyword1, setKeyword1] = useState("");
  const [searchZone2, setSearchZone2] = useState("");
  const [keyword2, setKeyword2] = useState("");
  const [selectAllLeft, setSelectAllLeft] = useState(false);

  const [shopList, setShopList] = useState<StoreEntity[]>(shopData);

  const [targetKeys, setTargetKeys] = useState<StoreEntity[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentAllSelected, setCurrentAllSelected] = useState<StoreEntity[]>([]);

  const onTransfer = (
    nextTargetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[],
  ) => {
    if (direction == "right") {
      setSelectedKeys([]);
      const arrayObjectKey: any = nextTargetKeys
        .map((el) => {
          const matchKey = shopData.find((el2) => el2.customerCompanyId === el);
          if (matchKey) {
            return matchKey;
          }
        })
        .filter((el) => el);
      const filterDuplicate = arrayObjectKey.filter((el: { customerCompanyId: string }) => {
        return !currentAllSelected.some((el2) => el2.customerCompanyId === el.customerCompanyId);
      });

      setCurrentAllSelected((prev) => [...prev, ...filterDuplicate]);
      setShopList((prev) => {
        return prev.filter((el) => {
          return !nextTargetKeys.some((el2) => el2 === el.customerCompanyId);
        });
      });
      setTargetKeys((prev) => [...prev, ...filterDuplicate]);
    } else {
      setSelectedKeys([]);
      setCurrentAllSelected((prev) => {
        return prev.filter((el) => {
          return !moveKeys.some((el2) => el2 === el.customerCompanyId);
        });
      });
      const arrayObjectKey: any = moveKeys
        .map((el) => {
          const matchKey = shopData.find((el2) => el2.customerCompanyId === el);
          if (matchKey) {
            return matchKey;
          }
        })
        .filter((el) => {
          return el?.customerCompanyId;
        });

      setShopList((prev) => {
        return [...prev, ...arrayObjectKey];
      });
      setTargetKeys((prev) => {
        return prev.filter((el) => {
          return !moveKeys.some((el2) => el2 === el.customerCompanyId);
        });
      });
    }
    setSelectAllLeft(false);
  };
  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    if (sourceSelectedKeys.length > 0 && sourceSelectedKeys.length === shopList.length) {
      setSelectAllLeft(true);
    } else if (sourceSelectedKeys.length > 0 && sourceSelectedKeys.length < shopList.length) {
      setSelectAllLeft(false);
    }

    // if (targetSelectedKeys.length > 0 && targetSelectedKeys.length === targetKeys.length) {
    //   setSelectAllRight(true);
    // } else {
    //   setSelectAllRight(false);
    // }
  };

  const handleChangeZone1 = (value: any) => {
    setSearchZone1(value);
  };
  const handleChangeKeyword1 = (value: any) => {
    setKeyword1(value.target.value);
  };
  const handleChangeZone2 = (value: any) => {
    setSearchZone2(value);
  };
  const handleChangeKeyword2 = (value: any) => {
    setKeyword2(value.target.value);
  };

  useEffect(() => {
    if (searchZone1 && !keyword1) {
      const result = shopList.filter((x) => x.zone == searchZone1);
      setShopList(result);
    } else if (!searchZone1 && keyword1) {
      const result = shopList.filter((x) => x.customerName.includes(keyword1));
      setShopList(result);
    } else if (searchZone1 && keyword1) {
      const result = shopList.filter(
        (x) => x.customerName.includes(keyword1) && x.zone == searchZone1,
      );
      setShopList(result);
    } else {
      setShopList(
        shopData.filter(
          (x) => !targetKeys.some((y) => y.customerCompanyId === x.customerCompanyId),
        ),
      );
    }
  }, [searchZone1, keyword1]);

  useEffect(() => {
    if (searchZone2 && !keyword2) {
      const result = currentAllSelected.filter((x) => x.zone == searchZone2);
      setTargetKeys(result);
    } else if (!searchZone2 && keyword2) {
      const result = currentAllSelected.filter((x) => x.customerName.includes(keyword2));
      setTargetKeys(result);
    } else if (searchZone2 && keyword2) {
      const result = currentAllSelected.filter(
        (x) => x.customerName.includes(keyword2) && x.zone == searchZone2,
      );
      setTargetKeys(result);
    } else {
      setTargetKeys(currentAllSelected);
    }
  }, [searchZone2, keyword2]);

  useEffect(() => {
    if (currentSelectShop) {
      const s = shopData.filter(
        (x) =>
          !currentSelectShop.some((c) => `${c.customerCompanyId}` === `${x.customerCompanyId}`),
      );
      setShopList(s);
      setCurrentAllSelected(currentSelectShop);
      setTargetKeys(currentSelectShop);
    }
  }, [currentSelectShop]);

  const saveShop = () => {
    callBackShop(targetKeys);
  };
  const countLeftSelectedItems = () => {
    return selectedKeys.filter((key) => shopList.some((item) => item.customerCompanyId === key))
      .length;
  };
  return (
    <Modal
      open={showModalShop}
      centered={true}
      onCancel={() => onClose()}
      width={1000}
      title='เลือกร้านค้า'
      footer={false}
    >
      <Form layout='vertical'>
        <Row gutter={52}>
          <Col span={12}>
            <Row gutter={8}>
              <Col span={8}>
                <label>ค้นหาเขต</label>
                <Select
                  style={{ width: "100%" }}
                  value={searchZone1}
                  data={[
                    { label: "ทั้งหมด", key: "" },
                    ...zoneList.map((z) => ({ label: z.zoneName, key: z.zoneName })),
                  ]}
                  onChange={handleChangeZone1}
                />
              </Col>
              <Col span={10}>
                <label>ค้นหาชื่อร้านค้า</label>
                <Input
                  value={keyword1}
                  suffix={<SearchOutlined />}
                  placeholder={"ระบุชื่อร้านค้า"}
                  onChange={handleChangeKeyword1}
                />
              </Col>
              <Col span={6}>
                <label></label>
                <Button
                  title='ล้างการค้นหา'
                  typeButton='primary-light'
                  onClick={() => {
                    setSearchZone1("");
                    setKeyword1("");
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={8}>
              <Col span={8}>
                <label>ค้นหาเขต</label>
                <Select
                  value={searchZone2}
                  style={{ width: "100%" }}
                  data={[
                    { label: "ทั้งหมด", key: "" },
                    ...zoneList.map((z) => ({ label: z.zoneName, key: z.zoneName })),
                  ]}
                  onChange={handleChangeZone2}
                />
              </Col>
              <Col span={10}>
                <label>ค้นหาชื่อร้านค้า</label>
                <Input
                  suffix={<SearchOutlined />}
                  placeholder={"ระบุชื่อร้านค้า"}
                  onChange={handleChangeKeyword2}
                />
              </Col>
              <Col span={6}>
                <label></label>
                <Button
                  title='ล้างการค้นหา'
                  typeButton='primary-light'
                  onClick={() => {
                    setSearchZone2("");
                    setKeyword2("");
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      <br />
      <Transfer
        className='hide_header'
        onChange={onTransfer}
        selectedKeys={selectedKeys}
        onSelectChange={onSelectChange}
        targetKeys={targetKeys.map((x) => x.customerCompanyId)}
      >
        {({ direction, onItemSelect, selectedKeys }) =>
          direction === "left" ? (
            <>
              <Row
                style={{
                  backgroundColor: color.secondary,
                  minHeight: 40,
                  display: "flex",
                  padding: "0 8px",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 6,
                }}
              >
                <Col
                  style={{
                    display: "flex",
                  }}
                >
                  <Checkbox
                    indeterminate={
                      countLeftSelectedItems() > 0 && countLeftSelectedItems() < shopList.length
                    }
                    style={{ marginRight: 16, marginBottom: 4 }}
                    checked={selectAllLeft}
                    disabled={shopList.length === 0}
                    onChange={() => {
                      if (!selectAllLeft) {
                        setSelectedKeys([
                          ...shopList.map((item) => item.customerCompanyId),
                          ...selectedKeys,
                        ]);
                        setSelectAllLeft(true);
                      } else {
                        setSelectAllLeft(false);

                        setSelectedKeys(
                          selectedKeys.filter(
                            (key) => !shopList.some((item) => item.customerCompanyId === key),
                          ),
                        );
                      }
                    }}
                  />
                  <Text
                    color='white'
                    level={6}
                    fontWeight={700}
                    style={{
                      marginTop: 2,
                    }}
                  >
                    ร้านค้าทั้งหมด
                  </Text>
                </Col>
                <Text color='white' level={7}>
                  {shopList.length} ร้านค้า
                </Text>
              </Row>
              <div style={{ overflow: "auto", height: 300 }}>
                {shopList.map((item) => {
                  const isCheck = selectedKeys.includes(item.customerCompanyId);
                  return (
                    <Row key={item.customerCompanyId}>
                      <FlexCol style={{ padding: "4px 8px" }}>
                        <Checkbox
                          checked={isCheck}
                          onClick={() => onItemSelect(item.customerCompanyId, !isCheck)}
                        />
                      </FlexCol>
                      <FlexCol style={{ padding: "4px 8px" }}>
                        <Text level={5}>{item.customerName}</Text>
                        <Text level={6} color='Text3'>
                          {item.zone}
                        </Text>
                      </FlexCol>
                    </Row>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <Row
                style={{
                  backgroundColor: color.secondary,
                  minHeight: 40,
                  display: "flex",
                  padding: "0 8px",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 6,
                }}
              >
                <Text color='white' level={6} fontWeight={700}>
                  ร้านค้าที่เลือก
                </Text>
                <Col
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Text color='white' level={7}>
                    {targetKeys.length} ร้านค้า
                  </Text>

                  <Divider type='vertical' style={{ borderColor: "white" }} />
                  <Text
                    level={7}
                    color='white'
                    style={{ cursor: targetKeys?.length ? "pointer" : "default" }}
                    onClick={() => {
                      if (targetKeys.length)
                        Modal.confirm({
                          title: "ลบร้านค้าที่เลือกทั้งหมด",
                          okText: "ยืนยัน",
                          onOk: () => {
                            setCurrentAllSelected((prev) => {
                              return prev.filter((el) => {
                                return !targetKeys.some(
                                  (el2) => el2.customerCompanyId === el.customerCompanyId,
                                );
                              });
                            });
                            setTargetKeys([]);
                            const arrayObjectKey: any = targetKeys
                              .map((el) => {
                                const matchKey = shopData.find(
                                  (el2) => el2.customerCompanyId === el.customerCompanyId,
                                );
                                if (matchKey) {
                                  return matchKey;
                                }
                              })
                              .filter((el) => el);
                            setShopList((prev) => {
                              return [...prev, ...arrayObjectKey];
                            });
                          },
                        });
                    }}
                  >
                    <DeleteOutlined />
                    &nbsp;ลบทั้งหมด
                  </Text>
                </Col>
              </Row>

              <div style={{ overflow: "auto", height: 300 }}>
                {targetKeys.map((item) => {
                  const isCheck = selectedKeys.includes(item.customerCompanyId);
                  return (
                    <Row key={item.customerCompanyId}>
                      <FlexCol style={{ padding: "4px 8px" }}>
                        <Checkbox
                          checked={isCheck}
                          onClick={() => onItemSelect(item.customerCompanyId, !isCheck)}
                        />
                      </FlexCol>
                      <FlexCol style={{ padding: "4px 8px" }}>
                        <Text level={5}>{item.customerName}</Text>
                        <Text level={6} color='Text3'>
                          {item.zone}
                        </Text>
                      </FlexCol>
                    </Row>
                  );
                })}
              </div>
            </>
          )
        }
      </Transfer>
      <Divider />
      <Row justify='end'>
        <Button title='บันทึก' style={{ width: 136 }} onClick={saveShop} />
      </Row>
    </Modal>
  );
};
