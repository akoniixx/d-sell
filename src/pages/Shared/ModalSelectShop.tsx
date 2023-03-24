import { SearchOutlined } from "@ant-design/icons";
import { Checkbox, Col, Divider, Form, Modal, Row } from "antd";
import Transfer, { TransferDirection } from "antd/lib/transfer";
import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import { FlexCol } from "../../components/Container/Container";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { StoreEntity, ZoneEntity } from "../../entities/StoreEntity";
import Text from "../../components/Text/Text";

export const ModalSelectedShop = ({
    zoneList,
    shopData,
    callBackShop,
    showModalShop,
    onClose,
  }: {
    zoneList: ZoneEntity[];
    shopData: StoreEntity[];
    callBackShop: (item: StoreEntity[]) => void;
    showModalShop: boolean;
    onClose: () => void;
  }) => {
    const [searchZone1, setSearchZone1] = useState("");
    const [keyword1, setKeyword1] = useState("");
    const [searchZone2, setSearchZone2] = useState("");
    const [keyword2, setKeyword2] = useState("");
  
    const [shopList, setShopList] = useState<StoreEntity[]>(shopData);
  
    const [targetKeys, setTargetKeys] = useState<StoreEntity[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  
    const onTransfer = (
      nextTargetKeys: string[],
      direction: TransferDirection,
      moveKeys: string[],
    ) => {
      if (direction == "right") {
        const arrayObjectKey: any = nextTargetKeys.map((el) => {
          const matchKey = shopList.find((el2) => el2.customerCompanyId === el);
          if (matchKey) {
            return matchKey;
          }
        });
        setShopList((prev) => {
          return prev.filter((el) => {
            return !nextTargetKeys.some((el2) => el2 === el.customerCompanyId);
          });
        });
        setTargetKeys((prev) => [...prev, ...arrayObjectKey]);
      } else {
        const arrayObjectKey: any = moveKeys.map((el) => {
          const matchKey = shopData.find((el2) => el2.customerCompanyId === el);
          if (matchKey) {
            return matchKey;
          }
        });
        setTargetKeys((prev) => {
          return prev.filter((el) => {
            return !moveKeys.some((el2) => el2 === el.customerCompanyId);
          });
        });
        setShopList((prev) => {
          return [...prev, ...arrayObjectKey];
        });
      }
    };
    const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
      //console.log(sourceSelectedKeys, targetSelectedKeys);
      // if (sourceSelectedKeys.length === 0) {
      //   return setSelectedKeys(shopList.map((el) => el.customerCompanyId));
      // }
      setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
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
        const result = targetKeys.filter((x) => x.zone == searchZone2);
        setTargetKeys(result);
      } else if (!searchZone2 && keyword2) {
        const result = targetKeys.filter((x) => x.customerName.includes(keyword2));
        setTargetKeys(result);
      } else if (searchZone2 && keyword2) {
        const result = targetKeys.filter(
          (x) => x.customerName.includes(keyword2) && x.zone == searchZone2,
        );
        setTargetKeys(result);
      } else {
        setTargetKeys(
          shopData.filter((x) => !shopList.some((y) => y.customerCompanyId === x.customerCompanyId)),
        );
      }
    }, [searchZone2, keyword2]);
  
    const saveShop = () => {
      callBackShop(targetKeys);
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
                    suffix={<SearchOutlined />}
                    placeholder={"ระบุชื่อร้านค้า"}
                    onChange={handleChangeKeyword1}
                  />
                </Col>
                <Col span={6}>
                  <label></label>
                  <Button title='ล้างการค้นหา' typeButton='primary-light' />
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row gutter={8}>
                <Col span={8}>
                  <label>ค้นหาเขต</label>
                  <Select
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
                  <Button title='ล้างการค้นหา' typeButton='primary-light' />
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
        <br />
        <Transfer
          titles={["ร้านค้าทั้งหมด", "ร้านค้าที่เลือกทั้งหมด"]}
          onChange={onTransfer}
          selectedKeys={selectedKeys}
          targetKeys={targetKeys.map((x) => x.customerCompanyId)}
          onSelectChange={onSelectChange}
        >
          {({ direction, onItemSelect, selectedKeys }) =>
            direction === "left" ? (
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
            ) : (
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