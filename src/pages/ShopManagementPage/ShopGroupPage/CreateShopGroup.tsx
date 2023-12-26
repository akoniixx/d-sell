import { Checkbox, Col, Divider, Form, Modal, Radio, Row, Table } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import { CardContainer } from "../../../components/Card/CardContainer";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import { color } from "../../../resource";
import Text from "../../../components/Text/Text";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import Button from "../../../components/Button/Button";
import { ModalSelectStore } from "../../Shared/ModalSelectStore";
import { StoreEntity, ZoneEntity } from "../../../entities/StoreEntity";
import TableContainer from "../../../components/Table/TableContainer";
import {
  createShopGroup,
  getShopGroupById,
  updateShopGroup,
} from "../../../datasource/ShopGroupDatasoure";
import _ from "lodash";
import { FlexRow } from "../../../components/Container/Container";
import { getZones } from "../../../datasource/CustomerDatasource";

export function CreateShopGroup() {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const navigate = useNavigate();
  const [form] = useForm();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEdit = pathSplit[3] !== "create";
  const id = pathSplit[3];

  const [zoneList, setZoneList] = useState<ZoneEntity[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [showModalShop, setShowModalShop] = useState<boolean>(false);
  const [selectedShop, setSelectedShop] = useState<any>([]);
  const [searchShop, setSearchShop] = useState<any>([]);
  const [searchKeywordShop, setSearchKeywordShop] = useState("");
  const [searchShopZone, setSearchShopZone] = useState("");

  const getShopById = async () => {
    await getShopGroupById(id).then((res) => {
      form.setFieldsValue({
        customerGroupId: res.responseData.customerGroupId,
        customerGroupName: res.responseData.customerGroupName,
        isActive: res.responseData.isActive,
      });
      const mapShop = res.responseData.customerGroupShop.map((x) => {
        return {
          customerGroupId: res.responseData.customerGroupId,
          customerCompanyId: x.customerCompanyId,
          customerName: x.customerName,
          customerNo: x.customerNo,
          zone: x.zone,
        };
      });
      setSelectedShop(mapShop);
      setSearchShop(mapShop);
    });
  };
  const fetchZone = async () => {
    const getZone = await getZones(company);
    setZoneList(getZone.map((d: StoreEntity, i: number) => ({ ...d, key: d.customerCompanyId })));
  };

  useEffect(() => {
    if (isEdit) {
      getShopById();
    } else {
      form.setFieldsValue({
        isActive: true,
      });
    }
    fetchZone();
  }, []);

  const callBackShop = (item: StoreEntity[]) => {
    item = item.map((p: any) => ({ ...p, isChecked: false }));
    setSelectedShop([...selectedShop, ...item]);
    setSearchShop([...selectedShop, ...item]);
    setShowModalShop(!showModalShop);
  };
  const handleCheckBox = (e: any, cusId: string) => {
    const checkBoxed = selectedShop.map((item) =>
      _.set(
        item,
        "isChecked",
        item.customerCompanyId === cusId ? e.target.checked : item.isChecked,
      ),
    );
    setSelectedShop(checkBoxed);
    setSearchShop(checkBoxed);
  };
  const handleAllCheckBox = (e: any) => {
    const checkBoxed = selectedShop.map((item) => ({ ...item, isChecked: e.target.checked }));
    const mapData = searchShop.map((item) => {
      const findObj = checkBoxed.find((el) => el.customerCompanyId === item.customerCompanyId);
      if (findObj) {
        return { ...item, isChecked: true };
      }
      return { ...item, isChecked: false };
    });
    setSelectedShop(checkBoxed);
    setSearchShop(mapData);
  };
  const handleDelete = () => {
    const deleted = selectedShop.filter((x) => !x.isChecked);
    setSelectedShop(deleted);
    setSearchShop(deleted);
  };
  const onClearSearchShop = () => {
    setSearchShopZone("");
    setSearchKeywordShop("");
    setSelectedShop(searchShop);
  };
  const onSearchShop = (e: any) => {
    setSearchKeywordShop(e.target.value);
    const valueUpperCase: string = e.target.value;
    const find = searchShop.filter((x) => {
      const searchName =
        !e.target.value ||
        x.customerName?.includes(e.target.value) ||
        x.customerNo?.includes(valueUpperCase.toUpperCase());
      const searchZone = !searchShopZone || x.zone?.includes(searchShopZone);
      return searchName && searchZone;
    });
    setSelectedShop(find);
  };
  const onSearchZone = (e: any) => {
    setSearchShopZone(e);
    const find = searchShop.filter((x) => {
      const searchName = !searchKeywordShop || x.customerName?.includes(searchKeywordShop);
      const searchZone = !e || x.zone?.includes(e);
      return searchName && searchZone;
    });
    setSelectedShop(find);
  };

  const columns: any = [
    {
      title: (
        <Checkbox
          onClick={(e) => handleAllCheckBox(e)}
          checked={
            selectedShop.length > 0 || searchShop.length > 0
              ? selectedShop.every((x) => x.isChecked) || searchShop.every((x) => x.isChecked)
              : false
          }
        />
      ),
      width: "5%",
      dataIndex: "index",
      render: (text: string, value: any) => (
        <Checkbox
          checked={value.isChecked}
          onClick={(e) => handleCheckBox(e, value.customerCompanyId)}
        />
      ),
    },
    {
      title: "รหัสร้านค้า",
      dataIndex: "customerNo",
      key: "customerNo",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row gutter={8}>
              <Text>{value}</Text>
            </Row>
          ),
        };
      },
    },
    {
      title: "ชื่อร้านค้า",
      dataIndex: "customerName",
      key: "customerName",
      width: "50%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row gutter={8}>
              <Text>{value}</Text>
            </Row>
          ),
        };
      },
    },
    {
      title: "เขตการขาย",
      dataIndex: "zone",
      key: "zone",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row>
              <Text level={5}>{value}</Text>
            </Row>
          ),
        };
      },
    },
  ];

  const saveShopGroup = async () => {
    await form
      .validateFields()
      .then(async (value) => {
        let customerGroupShops: any = [];
        customerGroupShops = selectedShop
          .filter((a) => !a.isChecked)
          .map((x) => {
            if (x.customerGroupId) {
              return {
                customerGroupId: x.customerGroupId,
                customerCompanyId: x.customerCompanyId,
                customerNo: x.customerNo,
                customerName: x.customerName,
                zone: x.zone,
              };
            } else {
              return {
                customerCompanyId: x.customerCompanyId,
                customerNo: x.customerNo,
                customerName: x.customerName,
                zone: x.zone,
              };
            }
          });
        form.setFieldsValue({
          createBy: userProfile.firstname + " " + userProfile.lastname,
          comapny: company,
          customerGroupShops: customerGroupShops,
        });

        const getForm = form.getFieldsValue(true);
        if (isEdit) {
          await updateShopGroup(getForm).then((res) => {
            if (res.success) {
              if (res.success) {
                setShowModal(false);
                setTimeout(() => {
                  navigate(-1);
                }, 200);
              }
            }
          });
        } else {
          await createShopGroup(getForm).then((res) => {
            if (res.success) {
              if (res.success) {
                setShowModal(false);
                setTimeout(() => {
                  navigate(-1);
                }, 200);
              }
            }
          });
        }
      })
      .catch((errInfo) => {
        setShowModal(false);
      });
  };

  return (
    <CardContainer>
      <PageTitleNested
        title={isEdit ? "รายการกลุ่มร้านค้า" : "เพิ่มกลุ่มร้านค้า"}
        showBack
        onBack={() => navigate(`/ShopManagementPage/ShopGroupPage`)}
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการกลุ่มร้านค้า", path: `/ShopManagementPage/ShopGroupPage` },
              {
                text: isEdit ? "รายการกลุ่มร้านค้า" : "เพิ่มกลุ่มร้านค้า",
                path: window.location.pathname,
              },
            ]}
          />
        }
      />
      <Divider />
      <Form form={form} layout='vertical'>
        <Row>
          <Col span={10}>
            <Form.Item
              name='customerGroupName'
              label={<Text fontWeight={600}>ชื่อกลุ่มร้านค้า</Text>}
              rules={[
                {
                  required: true,
                  message: "*โปรดระบุชื่อกลุ่มสินค้า",
                },
              ]}
            >
              <Input placeholder='ระบุชื่อกลุ่มสินค้า' autoComplete='off' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          {isEdit && (
            <Col span={10}>
              <Form.Item
                name='isActive'
                label='สถานะกลุ่มร้านค้า'
                rules={[
                  {
                    required: true,
                    message: "*โปรดระบุสถานะ",
                  },
                ]}
              >
                <Radio.Group style={{ width: "100%" }}>
                  <Radio value={true}>ใช้งาน</Radio>
                  <Radio value={false}>ปิดใช้งาน</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
      <Divider />
      <Row>
        <Col span={10}>
          <Text fontWeight={600}>เพิ่มร้านค้าเข้ากลุ่ม</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        {searchShop.length > 0 && (
          <>
            <Col span={4}>
              <Select
                allowClear
                placeholder='เขตทั้งหมด'
                data={[
                  { label: "ทั้งหมด", key: "" },
                  ...zoneList.map((z) => ({ label: z.zoneName, key: z.zoneName })),
                ]}
                style={{ width: "100%" }}
                onChange={(e) => onSearchZone(e)}
                value={searchShopZone}
              />
            </Col>
            <Col span={6}>
              <Input
                placeholder='ค้นหาชื่อร้านค้า'
                prefix={<SearchOutlined style={{ color: "grey" }} />}
                onPressEnter={(e) => onSearchShop(e)}
                defaultValue={searchKeywordShop}
                autoComplete='off'
              />
            </Col>
            <Col span={3}>
              <Button title='ล้างการค้นหา' typeButton='primary-light' onClick={onClearSearchShop} />
            </Col>
          </>
        )}
        <Col span={searchShop?.length > 0 ? 6 : 19}></Col>
        <Col span={2} style={{ paddingRight: "6px" }}>
          {selectedShop.filter((x) => x.isChecked).length > 0 && (
            <FlexRow align='center' justify='end' style={{ height: "100%" }}>
              <DeleteOutlined style={{ fontSize: 20, color: color.error }} onClick={handleDelete} />
            </FlexRow>
          )}
        </Col>
        <Col span={3}>
          <Button title='+ เพิ่มร้านค้า' onClick={() => setShowModalShop(!showModalShop)} />
        </Col>
      </Row>
      <br />
      <Row justify={"end"} gutter={8}>
        <Col span={20}></Col>
        <Col span={4} style={{ paddingLeft: "50px" }}>
          <Text>จำนวนร้านค้า {selectedShop.length} ร้าน</Text>
        </Col>
      </Row>
      <br />
      <TableContainer>
        <Table
          scroll={{ y: 450 }}
          columns={columns}
          dataSource={selectedShop}
          pagination={false}
          style={{ height: "450px" }}
        />
      </TableContainer>
      <Divider />
      <Row justify='space-between' gutter={12}>
        <Col xl={3} sm={6}>
          <Button
            typeButton='primary-light'
            title='ยกเลิก'
            htmlType='submit'
            onClick={() => navigate(`/ShopManagementPage/ShopGroupPage`)}
          />
        </Col>
        <Col xl={15} sm={6}></Col>
        <Col xl={3} sm={6}>
          <Button typeButton='primary' title='บันทึก' onClick={() => setShowModal(true)} />
        </Col>
      </Row>
      {showModal && (
        <Modal
          centered
          open={showModal}
          closable={false}
          onOk={saveShopGroup}
          onCancel={() => setShowModal(false)}
          destroyOnClose
          okText={"ยืนยัน"}
          cancelButtonProps={{ style: { color: color.primary, borderColor: color.primary } }}
        >
          <Text level={2}>
            {isEdit ? "ยืนยันบันทึกกลุ่มร้านค้า" : "ยืนยันการเพิ่มกลุ่มร้านค้า"}
          </Text>
          <br />
          {isEdit ? (
            <>
              <Text level={5} color='Text3'>
                โปรดตรวจสอบรายละเอียดกลุ่มสินค้าอีกครั้งก่อนกดยืนยัน
              </Text>
              <br />
              <Text level={5} color='Text3'>
                เพราะอาจส่งผลต่อการแสดงผลข้อมูลในระบบ
              </Text>
            </>
          ) : (
            <Text level={5} color='Text3'>
              โปรดตรวจสอบรายละเอียดก่อนกดยืนยัน
            </Text>
          )}
        </Modal>
      )}
      {showModalShop && (
        <ModalSelectStore
          company={company}
          callBackShop={callBackShop}
          showModalShop={showModalShop}
          onClose={() => setShowModalShop(!setShowModalShop)}
          currentSelectShop={selectedShop}
        />
      )}
    </CardContainer>
  );
}
