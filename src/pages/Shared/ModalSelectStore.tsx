import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Col, Divider, Form, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import { FlexCol } from "../../components/Container/Container";
import { getCustomers, getZones } from "../../datasource/CustomerDatasource";
import { StoreEntity, ZoneEntity } from "../../entities/StoreEntity";
import color from "../../resource/color";
import Text from "../../components/Text/Text";
import Select from "../../components/Select/Select";
import Input from "../../components/Input/Input";
import image from "../../resource/image";
import _ from "lodash";

export const ModalSelectStore = ({
  callBackShop,
  showModalShop,
  onClose,
  currentSelectShop,
  company,
}: {
  callBackShop: (item: StoreEntity[]) => void;
  showModalShop: boolean;
  onClose: () => void;
  currentSelectShop: StoreEntity[];
  company: string;
}) => {
  console.log("currentSelectShop", currentSelectShop);
  const [zoneList, setZoneList] = useState<ZoneEntity[]>([]);

  const [storeList, setStoreList] = useState<StoreEntity[]>([]);
  const [searchStoreList, setSearchStoreList] = useState<StoreEntity[]>([]);

  const [storeSelected, setStoreSelected] = useState<StoreEntity[]>([]);
  const [searchStoreSelected, setSearchStoreSelected] = useState<StoreEntity[]>([]);

  const [searchZone1, setSearchZone1] = useState("");
  const [searchKeyWord1, setSearchKeyWord1] = useState("");
  const [searchZone2, setSearchZone2] = useState("");
  const [searchKeyWord2, setSearchKeyWord2] = useState("");

  const fetchStore = async () => {
    const getShop = await getCustomers({
      company,
      customerType: "DL",
    });
    console.log("fetchStore", {
      showModalShop,
      currentSelectShop,
      company,
    });
    currentSelectShop = currentSelectShop.map((item) => ({ ...item, isChecked: false }));
    const dataWithIschecked = getShop.data
      .map((p: any) => {
        const matching = currentSelectShop.find(
          (i) => `${i.customerCompanyId}` === `${p.customerCompanyId}`,
        );
        if (matching) {
          return { ...matching, isChecked: true };
        }
        return {
          ...p,
          isChecked: p.isChecked,
        };
      })
      .filter((x: any) => !x.isChecked);

    setSearchStoreList(dataWithIschecked);
    setStoreList(dataWithIschecked);
  };
  const fetchZone = async () => {
    const getZone = await getZones(company);
    setZoneList(getZone);
  };

  useEffect(() => {
    fetchZone();
    fetchStore();
    console.log("useEffect", {
      showModalShop,
      currentSelectShop,
      company,
    });
  }, []);

  const handleSearchZone = (e: any, section: number) => {
    const zone = e;
    const db = section === 1 ? storeList : storeSelected;
    const dbkeyword = section === 1 ? searchKeyWord1 : searchKeyWord2;
    const find = db.filter((x: any) => {
      const searchZone = !zone || x.zone?.includes(zone);
      const searchKeyword =
        !dbkeyword ||
        x.customerName?.includes(dbkeyword) ||
        x.customerNo?.includes(dbkeyword.toUpperCase());
      return searchZone && searchKeyword;
    });
    if (section === 1) {
      setSearchZone1(zone);
      setSearchStoreList(find);
    } else {
      setSearchZone2(zone);
      setSearchStoreSelected(find);
    }
  };
  const handleSearchKeyword = (e: any, section: number) => {
    const keywork = e.target.value;
    const db = section === 1 ? storeList : storeSelected;
    const dbzone = section === 1 ? searchZone1 : searchZone2;
    const find = db.filter((x: any) => {
      const searchZone = !dbzone || x.zone?.includes(dbzone);
      const searchKeyword =
        !keywork ||
        x.customerName?.includes(keywork) ||
        x.customerNo?.includes(keywork.toUpperCase());
      return searchZone && searchKeyword;
    });
    if (section === 1) {
      setSearchKeyWord1(keywork);
      setSearchStoreList(find);
    } else {
      setSearchKeyWord2(keywork);
      setSearchStoreSelected(find);
    }
  };

  const storeLeft = () => {
    const handleSelectStore = (shop: StoreEntity) => {
      const d: StoreEntity[] = storeList.map((item) =>
        _.set(
          item,
          "isChecked",
          item.customerCompanyId === shop.customerCompanyId ? true : item.isChecked,
        ),
      );
      setSearchZone2("");
      setSearchKeyWord2("");
      setStoreSelected(d.filter((x) => x.isChecked));
      setSearchStoreSelected(d.filter((x) => x.isChecked));
      setStoreList(d);
    };
    const handleSelectAllStore = () => {
      setSearchZone2("");
      setSearchKeyWord2("");
      let d: StoreEntity[] = [];
      if (searchZone1 || searchKeyWord1) {
        const mapData = storeList.filter((x: any) => {
          const searchZone = !searchZone1 || x.zone?.includes(searchZone1);
          const searchKeyword =
            !searchKeyWord1 ||
            x.customerName?.includes(searchKeyWord1) ||
            x.customerNo?.includes(searchKeyWord1.toUpperCase());
          return searchZone && searchKeyword;
        });
        d = storeList.map((el: any) => {
          const matching = mapData.find((i) => i.customerCompanyId === el.customerCompanyId);
          if (matching) {
            return { ...matching, isChecked: true };
          }
          return {
            ...el,
            isChecked: el.isChecked,
          };
        });
      } else {
        d = storeList.map((p: any) => ({ ...p, isChecked: true }));
      }
      setStoreSelected(d.filter((x) => x.isChecked));
      setSearchStoreSelected(d.filter((x) => x.isChecked));
      setStoreList(d);
      setSearchStoreList(
        d.filter((x: any) => {
          const searchZone = !searchZone1 || x.zone?.includes(searchZone1);
          const searchKeyword =
            !searchKeyWord1 ||
            x.customerName?.includes(searchKeyWord1) ||
            x.customerNo?.includes(searchKeyWord1.toUpperCase());
          return searchZone && searchKeyword;
        }),
      );
    };

    return (
      <Col span={11} style={{ borderColor: color.Grey, paddingLeft: "0px", paddingRight: "0px" }}>
        <Row
          style={{
            padding: "8px",
            background: "#6B7995",
            borderRadius: "4px",
          }}
        >
          <Col span={18} style={{ color: "white" }}>
            {searchStoreList.filter((x) => !x.isChecked).length} ร้าน
          </Col>
          {searchStoreList.some((x) => !x.isChecked) && (
            <Col
              span={6}
              style={{ color: "white", cursor: "pointer" }}
              onClick={() => handleSelectAllStore()}
            >
              <PlusCircleOutlined /> เลือกทั้งหมด
            </Col>
          )}
        </Row>
        {searchStoreList.filter((x) => !x.isChecked).length !== 0 ? (
          <Col
            style={{
              overflow: "scroll",
              minHeight: "300px",
              maxHeight: "300px",
              border: "solid",
              borderColor: "#F3F6F9",
              borderRadius: "4px",
            }}
          >
            {searchStoreList
              .filter((x) => !x.isChecked)
              ?.map((shop) => (
                <Row
                  key={shop.customerCompanyId}
                  justify={"space-between"}
                  style={{ alignItems: "center" }}
                >
                  <FlexCol style={{ padding: "4px 8px" }}>
                    <Text level={5}>{shop.customerName}</Text>
                    <Text level={6} color='Text3'>
                      {shop.customerNo} - {shop.zone}
                    </Text>
                  </FlexCol>
                  <FlexCol style={{ padding: "4px 18px" }}>
                    <PlusCircleOutlined
                      style={{ fontSize: "20px", color: "#0068F4", cursor: "pointer" }}
                      onClick={() => handleSelectStore(shop)}
                    />
                  </FlexCol>
                </Row>
              ))}
          </Col>
        ) : (
          <Row
            style={{
              overflow: "scroll",
              minHeight: "300px",
              border: "solid",
              borderColor: "#F3F6F9",
              borderRadius: "4px",
              padding: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <img
              src={image.empty_shop}
              style={{
                width: 48,
                height: 48,
              }}
            />
            <br />
            <Text level={6} align={"center"} style={{ color: "#BABCBE" }}>
              ไม่มีร้านค้า
            </Text>
          </Row>
        )}
      </Col>
    );
  };
  const storeRight = () => {
    const handleRemoveStore = (shop: StoreEntity) => {
      const d: StoreEntity[] = storeList.map((item) =>
        _.set(
          item,
          "isChecked",
          item.customerCompanyId === shop.customerCompanyId ? false : item.isChecked,
        ),
      );
      setSearchZone1("");
      setSearchKeyWord1("");
      setStoreSelected(d.filter((x) => x.isChecked));
      setSearchStoreSelected(
        d.filter((x: any) => {
          const checked = x.isChecked;
          const searchZone = !searchZone2 || x.zone?.includes(searchZone2);
          const searchKeyword =
            !searchKeyWord2 ||
            x.customerName?.includes(searchKeyWord2) ||
            x.customerNo?.includes(searchKeyWord2.toUpperCase());
          return searchZone && searchKeyword && checked;
        }),
      );
      setSearchStoreList(d);
    };

    const handleRemoveAllStore = () => {
      setSearchZone1("");
      setSearchKeyWord1("");
      let d: StoreEntity[] = [];
      if (searchZone2 || searchKeyWord2) {
        const mapData = storeSelected.filter((x: any) => {
          const searchZone = !searchZone2 || x.zone?.includes(searchZone2);
          const searchKeyword =
            !searchKeyWord2 ||
            x.customerName?.includes(searchKeyWord2) ||
            x.customerNo?.includes(searchKeyWord2.toUpperCase());
          return searchZone && searchKeyword;
        });
        d = storeSelected.map((el: any) => {
          const matching = mapData.find((i) => i.customerCompanyId === el.customerCompanyId);
          if (matching) {
            return { ...matching, isChecked: false };
          }
          return {
            ...el,
            isChecked: el.isChecked,
          };
        });
      } else {
        d = storeList.map((p: any) => ({ ...p, isChecked: false }));
      }
      setStoreSelected(d.filter((x) => x.isChecked));
      setSearchStoreSelected(
        d.filter((x: any) => {
          const checked = x.isChecked;
          const searchZone = !searchZone2 || x.zone?.includes(searchZone2);
          const searchKeyword =
            !searchKeyWord2 ||
            x.customerName?.includes(searchKeyWord2) ||
            x.customerNo?.includes(searchKeyWord2.toUpperCase());
          return searchZone && searchKeyword && checked;
        }),
      );
      setStoreList(d);
      setSearchStoreList(d);
    };
    return (
      <Col span={11} style={{ borderColor: color.Grey, paddingLeft: "0px", paddingRight: "0px" }}>
        <Row
          style={{
            padding: "8px",
            background: "#464E5F",
            borderRadius: "4px",
          }}
        >
          <Col span={19} style={{ color: "white" }}>
            {searchStoreSelected.length !== 0
              ? searchStoreSelected.length + " ร้าน"
              : "ไม่มีร้านค้าที่เลือก"}
          </Col>
          {searchStoreSelected.some((x) => x.isChecked) && (
            <Col
              span={5}
              style={{ color: "white", cursor: "pointer" }}
              onClick={() => handleRemoveAllStore()}
            >
              <MinusCircleOutlined /> ลบทั้งหมด
            </Col>
          )}
        </Row>
        {searchStoreSelected.length !== 0 ? (
          <Col
            style={{
              overflow: "scroll",
              minHeight: "300px",
              maxHeight: "300px",
              border: "solid",
              borderColor: "#F3F6F9",
              borderRadius: "4px",
            }}
          >
            {searchStoreSelected?.map((shop) => (
              <Row
                key={shop.customerCompanyId}
                justify={"space-between"}
                style={{ alignItems: "center" }}
              >
                <FlexCol style={{ padding: "4px 8px" }}>
                  <Text level={5}>{shop.customerName}</Text>
                  <Text level={6} color='Text3'>
                    {shop.customerNo} - {shop.zone}
                  </Text>
                </FlexCol>
                <FlexCol style={{ padding: "4px 18px" }}>
                  <MinusCircleOutlined
                    style={{ fontSize: "20px", color: color.error, cursor: "pointer" }}
                    onClick={() => handleRemoveStore(shop)}
                  />
                </FlexCol>
              </Row>
            ))}
          </Col>
        ) : (
          <Row
            style={{
              overflow: "scroll",
              minHeight: "300px",
              border: "solid",
              borderColor: "#F3F6F9",
              borderRadius: "4px",
              padding: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <img
              src={image.empty_shop}
              style={{
                width: 48,
                height: 48,
              }}
            />
            <br />
            <Text level={6} align={"center"} style={{ color: "#BABCBE" }}>
              {storeSelected.length === 0 ? "โปรดเลือกร้านค้า" : "ไม่มีร้านค้า"}
            </Text>
          </Row>
        )}
      </Col>
    );
  };

  return (
    <Modal
      open={showModalShop}
      centered={true}
      onCancel={() => onClose()}
      width={1000}
      title={
        <>
          <Text style={{ fontSize: "20px" }} fontWeight={700}>
            เพิ่มร้านค้า
          </Text>
          <span style={{ fontSize: "15px", color: "#BABCBE" }}>
            {" "}
            สามารถเลือกได้มากกว่า 1 ร้านค้า
          </span>
        </>
      }
      footer={false}
    >
      <Form layout='vertical'>
        <Row gutter={24} justify={"space-between"}>
          <Col span={11} style={{ padding: "10px", background: "#1B4586", borderRadius: "5px" }}>
            <Text style={{ color: "white", fontSize: "15px" }} fontWeight={600}>
              เลือกร้านค้า
            </Text>
            <Divider style={{ backgroundColor: "white", margin: "10px 0" }} />
            <Row gutter={8}>
              <Col span={12}>
                <Text style={{ color: "white" }}>ค้นหารายเขต</Text>
                <Select
                  style={{ width: "100%" }}
                  data={[
                    { label: "ทั้งหมด", key: "" },
                    ...zoneList.map((z) => ({ label: z.zoneName, key: z.zoneName })),
                  ]}
                  onChange={(e) => handleSearchZone(e, 1)}
                  allowClear
                  value={searchZone1}
                />
              </Col>
              <Col span={12}>
                <Text style={{ color: "white" }}>ค้นหาร้านค้า</Text>
                <Input
                  suffix={<SearchOutlined color={color.Grey} />}
                  placeholder={"ระบุชื่อหรือรหัสร้านค้า"}
                  allowClear
                  onChange={(e) => handleSearchKeyword(e, 1)}
                  value={searchKeyWord1}
                />
              </Col>
            </Row>
          </Col>
          <Col span={11} style={{ padding: "10px", background: "#1B4586", borderRadius: "5px" }}>
            <Row gutter={8} justify={"space-between"}>
              <Col span={15}>
                <Text style={{ color: "white", fontSize: "15px" }} fontWeight={600}>
                  ร้านค้าที่เลือก
                </Text>
              </Col>
              {storeSelected.length != 0 && (
                <Col span={9}>
                  <Text style={{ color: "white", fontSize: "15px" }}>
                    เลือกแล้ว {storeSelected.length} ร้านค้า
                  </Text>
                </Col>
              )}
            </Row>
            <Divider style={{ backgroundColor: "white", margin: "10px 0" }} />
            <Row gutter={8}>
              <Col span={12}>
                <Text style={{ color: "white" }}>ค้นหารายเขต</Text>
                <Select
                  style={{ width: "100%" }}
                  data={[
                    { label: "ทั้งหมด", key: "" },
                    ...zoneList.map((z) => ({ label: z.zoneName, key: z.zoneName })),
                  ]}
                  onChange={(e) => handleSearchZone(e, 2)}
                  value={searchZone2}
                  allowClear
                />
              </Col>
              <Col span={12}>
                <Text style={{ color: "white" }}>ค้นหาร้านค้า</Text>
                <Input
                  suffix={<SearchOutlined color={color.Grey} />}
                  placeholder={"ระบุชื่อหรือรหัสร้านค้า"}
                  allowClear
                  onChange={(e) => handleSearchKeyword(e, 2)}
                  value={searchKeyWord2}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      <Row gutter={24} justify={"space-between"} className='pt-2'>
        {storeLeft()}
        <Col span={1}>
          <SwapOutlined style={{ fontSize: "20px", marginTop: "150px", color: "#6B7995" }} />
        </Col>
        {storeRight()}
      </Row>
      <Divider />
      <Row justify='end'>
        <Button title='บันทึก' style={{ width: 136 }} onClick={() => callBackShop(storeSelected)} />
      </Row>
    </Modal>
  );
};
