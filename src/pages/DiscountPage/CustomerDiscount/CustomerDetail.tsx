import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Form, message, Modal, Spin, Tabs, Tag, Table } from "antd";
import { CardContainer } from "../../../components/Card/CardContainer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Button from "../../../components/Button/Button";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import styled from "styled-components";
import { PromotionType } from "../../../definitions/promotion";
import productState from "../../../store/productList";
import { ProductEntity } from "../../../entities/PoductEntity";
import {
  createCreditMemo,
  getCreditHistory,
  getCreditMemoById,
  getCustomerCreditMemo,
  getCustomerCreditMemoHistory,
  getOrderHistory,
  updateCreditMemo,
} from "../../../datasource/CreditMemoDatasource";
import { DetailBox, FlexCol, FlexRow } from "../../../components/Container/Container";
import { CheckCircleTwoTone, EditOutlined } from "@ant-design/icons";
import color from "../../../resource/color";
import Text from "../../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Steps from "../../../components/StepAntd/steps";
import { StoreEntity } from "../../../entities/StoreEntity";
import { CreditMemoEntity } from "../../../entities/CreditMemoEntity";
import TableContainer from "../../../components/Table/TableContainer";
import { AlignType } from "rc-table/lib/interface";
import PageSpin from "../../../components/Spin/pageSpin";
import { dateFormatter, priceFormatter } from "../../../utility/Formatter";
import { useForm } from "antd/lib/form/Form";
import Input from "../../../components/Input/Input";
import DatePicker from "../../../components/DatePicker/DatePicker";
import TextArea from "../../../components/Input/TextArea";
import { isNumeric } from "../../../utility/validator";

type factorType = -1 | 0 | 1;

export const CustomerCreditMemoDetail: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>();
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState();

  // Manual CO
  const [showConfirmModal, setConfirmModal] = useState(false);
  const [showFormModal, setFormModal] = useState(false);
  const [factor, setFactor] = useState<factorType>(0);
  const [submiting, setSubmit] = useState(false);
  const [form] = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoadingProfile(true);
    const id = pathSplit[3];
    await getCustomerCreditMemo(id)
      .then(async (res: any) => {
        console.log("profile", res);
        setProfile(res);
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setLoadingProfile(false);
      });

    setLoading(true);
    await getOrderHistory({ customerCompanyId: id })
      .then((res: any) => {
        console.log(res.data);
        setData(res?.data);
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    const id = pathSplit[3];
    // แก้ API
    console.log("getCreditHistory", id);
    await getCustomerCreditMemoHistory(id)
      .then((res: any) => {
        console.log("getCreditHistory", res);
        setHistory(
          res
            ?.filter((h: any) => h?.action === "สร้าง Credit Memo")
            .map((h: any, i: number) => ({ ...h, key: i })),
        );
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const PageTitle = () => {
    return (
      <PageTitleNested
        title='รายละเอียดร้านค้า'
        showBack
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "Discount CO รายร้าน", path: "/discount/customerList" },
              { text: "รายละเอียดร้านค้า", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };

  const creditMemoColumn = [
    {
      title: "วันที่ใช้งาน",
      dataIndex: "updateAt",
      key: "updateAt",
      align: "center" as AlignType,
      render: (value: string) => {
        return dateFormatter(value);
      },
    },
    {
      title: "รายละเอียดออเดอร์",
      dataIndex: "orderId",
      key: "orderId",
      align: "center" as AlignType,
      render: (value: string) => {
        return <Button title='ดูรายละเอียด' onClick={() => navigate(`/view-order/${value}`)} />;
      },
    },
    {
      title: "จำนวนยอดสั่งซื้อ",
      dataIndex: "orderTotalPrice",
      key: "orderTotalPrice",
      align: "center" as AlignType,
      render: (value: string) => {
        return priceFormatter(value, 2, true);
      },
    },
    {
      title: "ยอดก่อนใช้ส่วนลดดูแลราคา",
      dataIndex: "balanceBefore",
      key: "balanceBefore",
      align: "center" as AlignType,
      render: (value: string) => {
        return priceFormatter(value, 2, true);
      },
    },
    {
      title: "รวมส่วนลดดูแลราคาที่ใช้",
      dataIndex: "usedAmount",
      key: "usedAmount",
      align: "center" as AlignType,
      render: (value: string) => {
        return <Text color='error'>{priceFormatter(value, 2, true)}</Text>;
      },
    },
    {
      title: "คงเหลือส่วนลดดูแลราคา",
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      align: "center" as AlignType,
      render: (value: string) => {
        return priceFormatter(value, 2, true);
      },
    },
  ];

  const historyColumns = [
    {
      title: "วันเวลาที่อัปเดท",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center" as AlignType,
      width: "20%",
      render: (value: string) => {
        return dateFormatter(value);
      },
    },
    {
      title: "ผู้อัปเดท",
      dataIndex: "createBy",
      key: "createBy",
      align: "center" as AlignType,
      width: "20%",
      render: (value: string) => {
        return value || "-";
      },
    },
    {
      title: "ชื่อรายการ Credit Memo",
      dataIndex: "action",
      key: "action",
      align: "center" as AlignType,
      width: "40%",
    },
    {
      title: "จำนวนส่วนลดดูแลราคา",
      dataIndex: "afterValue",
      key: "afterValue",
      align: "center" as AlignType,
      width: "20%",
      render: (value: string) => {
        return priceFormatter(value, 2, true);
      },
    },
  ];

  const tabsItems = [
    {
      label: `ประวัติการใช้งาน Credit Memo`,
      key: "1",
      children: (
        <>
          <TableContainer>
            <Table
              columns={creditMemoColumn}
              dataSource={data?.map((s: any, i: any) => ({ ...s, key: i }))}
              pagination={{
                pageSize: 8,
                position: ["bottomCenter"],
              }}
            />
          </TableContainer>
        </>
      ),
    },
    {
      label: `ประวัติได้รับ Credit memo`,
      key: "2",
      children: (
        <>
          <TableContainer>
            <Table
              dataSource={history}
              columns={historyColumns}
              pagination={{
                pageSize: 8,
                position: ["bottomCenter"],
              }}
            />
          </TableContainer>
        </>
      ),
    },
  ];

  const profileList = [
    {
      title: "ชื่อร้านค้า",
      value: profile?.customer_name,
    },
    {
      title: "จังหวัด",
      value: profile?.province,
    },
    {
      title: "ชื่อเจ้าของร้าน",
      value: `${profile?.firstname || "-"} ${profile?.lastname || ""}`,
    },
    {
      title: "เขต",
      value: profile?.zone,
    },
  ];

  const toggleConfirmModal = () => {
    setConfirmModal(!showConfirmModal);
  };

  const toggleFormModal = (f: factorType) => {
    setFormModal(!showFormModal);
    setConfirmModal(false);
    setFactor(f);
  };

  const onSubmitManualCO = () => {
    const onFinish = () => {
      form.resetFields();
      setConfirmModal(false);
      setFormModal(false);
      setFactor(0);
      setSubmit(false);
    };
    form
      .validateFields()
      .then((values) => {
        Modal.confirm({
          title: (
            <Text level={2} fontWeight={700}>
              ยืนยันการบันทึกข้อมูล
            </Text>
          ),
          icon: <></>,
          content: (
            <Text>
              โปรดตรวจสอบ{" "}
              <span style={{ fontWeight: 700, color: factor ? color.success : color.error }}>
                การ{factor > 0 ? "เพิ่ม" : "ลด"}ยอด
              </span>{" "}
              CO ส่วนลดดูแลราคา ก่อนกดยืนยัน เพราะอาจส่งผลต่อยอดส่วนลดดูแลราคาคงเหลือในระบบ
            </Text>
          ),
          onOk: () => {
            setSubmit(true);
            console.log("form values", values);
            //TODO: call api
            onFinish();
          },
        });
      })
      .catch((err) => {
        console.log("form errors: ", err);
      });
  };

  return (
    <>
      {loading ? (
        <PageSpin />
      ) : (
        <div className='container '>
          <CardContainer>
            <Row gutter={16}>
              <Col span={12}>
                <PageTitle />
              </Col>
              <Col span={12}>
                <Row justify='end'>
                  <DetailBox style={{ padding: "20px 32px" }}>
                    <Text fontWeight={700} level={4}>
                      ส่วนลดดูแลราคาคงเหลือ :
                    </Text>
                    &nbsp;&nbsp;&nbsp;
                    <Text fontWeight={700} fontSize={32} color='primary'>
                      {priceFormatter(profile?.balance, 0, true)}
                    </Text>
                  </DetailBox>
                </Row>
              </Col>
            </Row>
            <br />
            <Row>
              {profileList.map(({ title, value }, i) => (
                <Col span={12} key={i} style={{ margin: "8px 0px" }}>
                  <Row>
                    <Col span={10}>
                      <Text color='Text3'>{title}</Text>
                    </Col>
                    <Col span={14}>
                      <Text>{value || "-"}</Text>
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
            <br />
          </CardContainer>
          <br />
          <CardContainer>
            <Row style={{ margin: "16px 0px" }}>
              <Col span={18}>
                <Text fontWeight={700} level={4}>
                  รายการประวัติ Credit memo
                </Text>
              </Col>
              <Col span={6}>
                <Button title='+ เพิ่ม CO ดูแลราคาแบบ Manual' onClick={toggleConfirmModal} />
                <Modal
                  open={showConfirmModal}
                  onCancel={toggleConfirmModal}
                  footer={null}
                  width={440}
                >
                  <div style={{ padding: 8 }}>
                    <Row justify='center'>
                      <Text level={3} fontWeight={700} align='center'>
                        คุณต้องการ เพิ่มยอด หรือ ลดยอด <br />
                        CO ดูแลราคาแบบ Manual
                      </Text>
                    </Row>
                    <br />
                    <Row justify='center'>
                      <Text align='center'>
                        การเพิ่มยอด หรือ ลดยอด
                        <br />
                        ส่งผลต่อส่วนลดดูแลราคาคงเหลือในระบบ
                        <br />
                        โปรดตรวจสอบความถูกต้องก่อนการเลือก
                      </Text>
                    </Row>
                    <br />
                    <Row gutter={16}>
                      <Col span={12}>
                        <Button
                          title='เพิ่ม'
                          typeButton='success'
                          onClick={() => toggleFormModal(1)}
                        />
                      </Col>
                      <Col span={12}>
                        <Button
                          title='ลด'
                          typeButton='danger'
                          onClick={() => toggleFormModal(-1)}
                        />
                      </Col>
                    </Row>
                  </div>
                </Modal>
                <Modal
                  open={showFormModal}
                  onCancel={() => toggleFormModal(0)}
                  footer={
                    <Row justify='end'>
                      <Col span={6}>
                        <Button title='บันทึก' onClick={onSubmitManualCO} loading={submiting} />
                      </Col>
                    </Row>
                  }
                >
                  <Text level={4} fontWeight={700}>
                    <span style={{ color: factor > 0 ? color.success : color.error }}>
                      {factor > 0 ? "เพิ่ม" : "ลด"}ยอด
                    </span>
                    &nbsp;CO ดูแลราคาแบบ Manual
                  </Text>
                  <br />
                  <br />
                  <Form form={form} layout='vertical'>
                    <Form.Item
                      name='date'
                      label='วันที่ใช้งาน'
                      rules={[{ required: true, message: "*โปรดเลือกวันที่ใช้งาน" }]}
                    >
                      <DatePicker />
                    </Form.Item>
                    <Form.Item
                      name='total'
                      label='จำนวนยอดสั่งซื้อ'
                      rules={[
                        { required: true, message: "*โปรดระบุจำนวนยอดสั่งซื้อ" },
                        {
                          validator: (rule, value, callback) => {
                            if (value && (!isNumeric(value) || parseFloat(value) <= 0)) {
                              return Promise.reject("จำนวนยอดสั่งซื้อต้องเป็นตัวเลขมากกว่า 0");
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name='coAmount'
                      label='ส่วนลดดูแลราคาที่ใช้'
                      rules={[
                        {
                          required: true,
                          message: "*โปรดระบุส่วนลดดูแลราคาที่ใช้",
                        },
                        {
                          validator: (rule, value, callback) => {
                            // console.log("validator", factor);
                            if (factor < 0 && parseFloat(value) > parseFloat(profile?.balance)) {
                              return Promise.reject("*ยอดลดที่ใช้ เกินส่วนลดดูแลราคาคงเหลือในระบบ");
                            }
                            if (value && (!isNumeric(value) || parseFloat(value) <= 0)) {
                              return Promise.reject("ส่วนลดดูแลราคาที่ใช้ต้องเป็นตัวเลขมากกว่า 0");
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name='soNo'
                      label='Sale Order Number'
                      rules={[{ required: true, message: "*โปรดระบุเลข SO No." }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item name='cnNo' label='Credit Note Number'>
                      <Input />
                    </Form.Item>
                    <Form.Item name='remark' label='หมายเหตุ'>
                      <TextArea autoSize={{ maxRows: 4, minRows: 4 }} />
                    </Form.Item>
                  </Form>
                </Modal>
              </Col>
            </Row>
            <Tabs
              items={tabsItems}
              onChange={(key: string) => {
                console.log("onChance tab", key, history);
                if (!history) {
                  fetchHistory();
                }
              }}
            />
          </CardContainer>
        </div>
      )}
    </>
  );
};
