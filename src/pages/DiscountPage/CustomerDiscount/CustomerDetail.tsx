import React, { useEffect, useState } from "react";
import { Row, Col, Form, message, Modal, Tabs, Table, Button as AntdButton } from "antd";
import { CardContainer } from "../../../components/Card/CardContainer";
import Button from "../../../components/Button/Button";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import {
  getCustomerCreditMemo,
  getCustomerCreditMemoHistory,
  getOrderHistory,
  updateCoManual,
} from "../../../datasource/CreditMemoDatasource";
import { DetailBox, FlexCol } from "../../../components/Container/Container";
import { EyeOutlined } from "@ant-design/icons";
import color from "../../../resource/color";
import Text from "../../../components/Text/Text";
import { Link } from "react-router-dom";
import TableContainer from "../../../components/Table/TableContainer";
import { AlignType } from "rc-table/lib/interface";
import PageSpin from "../../../components/Spin/pageSpin";
import { dateFormatter, priceFormatter } from "../../../utility/Formatter";
import { useForm } from "antd/lib/form/Form";
import Input from "../../../components/Input/Input";
import DatePicker from "../../../components/DatePicker/DatePicker";
import TextArea from "../../../components/Input/TextArea";
import "moment/locale/th";
import Permission from "../../../components/Permission/Permission";

type factorType = -1 | 0 | 1;

export const CustomerCreditMemoDetail: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;
  const pageSize = 10;

  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>();
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  // Manual CO
  const [showConfirmModal, setConfirmModal] = useState(false);
  const [showFormModal, setFormModal] = useState(false);
  const [factor, setFactor] = useState<factorType>(0);
  const [submiting, setSubmit] = useState(false);
  const [form] = useForm();

  const [showManualCoDetail, setShowManualCoDetail] = useState<any>(null);

  useEffect(() => {
    if (page < 2) {
      fetchData();
    }
    fetchOrder();
  }, [page]);

  const fetchData = async () => {
    setLoadingProfile(true);
    const id = pathSplit[3];
    await getCustomerCreditMemo(id)
      .then(async (res: any) => {
        setProfile(res);
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setLoadingProfile(false);
      });
    setLoading(true);
    fetchOrder();
  };
  const fetchOrder = async () => {
    const id = pathSplit[3];
    await getOrderHistory({ customerCompanyId: id, page: page, take: pageSize })
      .then((res: any) => {
        setCount(res.count);
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
    await getCustomerCreditMemoHistory(id)
      .then((res: any) => {
        res?.map((h: any, i: number) => ({ ...h, key: i }));
        const sorting = res.sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1));
        setHistory(sorting);
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
              { text: "ส่วนลดดูแลรายร้าน", path: "/discount/customerList" },
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
      width: "10%",
      align: "center" as AlignType,
      render: (value: string) => {
        return dateFormatter(value, true);
      },
    },
    {
      title: "รายละเอียดออเดอร์",
      dataIndex: "orderId",
      key: "orderId",
      align: "center" as AlignType,
      render: (value: string, row: any) => {
        return value ? (
          <Link to={`/view-order/${value}`} rel='noopener noreferrer' target='_blank'>
            <Button title='ดูรายละเอียด' />
          </Link>
        ) : (
          <FlexCol align='center'>
            <AntdButton
              icon={<EyeOutlined />}
              style={{
                backgroundColor: "#2A76A0",
                borderColor: "#2A76A0",
                color: "white",
                height: 40,
                width: "100%",
              }}
              onClick={() => setShowManualCoDetail(row)}
            >
              ดูรายละเอียด
            </AntdButton>
            <Text level={6} color='secondary'>
              CO แบบ Manual
            </Text>
          </FlexCol>
        );
      },
    },
    {
      title: "SO No.",
      dataIndex: "soNo",
      key: "soNo",
      align: "center" as AlignType,
      render: (value: string, row: any) => {
        return (row.orderId ? row.order?.soNo : value) || "-";
      },
    },
    {
      title: "จำนวนยอดสั่งซื้อ",
      dataIndex: "orderTotalPrice",
      key: "orderTotalPrice",
      align: "right" as AlignType,
      render: (value: string) => {
        return priceFormatter(value, 2, true);
      },
    },
    {
      title: "ยอดก่อนใช้ส่วนลดดูแลราคา",
      dataIndex: "balanceBefore",
      key: "balanceBefore",
      align: "right" as AlignType,
      render: (value: string) => {
        return priceFormatter(value, 2, true);
      },
    },
    {
      title: "รวมส่วนลดดูแลราคาที่ใช้",
      dataIndex: "usedAmount",
      key: "usedAmount",
      align: "right" as AlignType,
      render: (value: string, row: any) => {
        return (
          <Text color={row.action === "increase" ? "success" : "error"}>
            {row.action === "increase" ? "+ " : "- "}
            {priceFormatter(value, 2, true)}
          </Text>
        );
      },
    },
    {
      title: "คงเหลือส่วนลดดูแลราคา",
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      align: "right" as AlignType,
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
        return dateFormatter(value, true);
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
      title: "ชื่อรายการ ส่วนลดดูแลราคา",
      dataIndex: "action",
      key: "action",
      align: "center" as AlignType,
      width: "40%",
    },
    {
      title: "จำนวน ส่วนลดดูแลราคา",
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
      label: `ประวัติการใช้งาน ส่วนลดดูแลราคา`,
      key: "1",
      children: (
        <>
          <TableContainer>
            <Table
              columns={creditMemoColumn}
              dataSource={data?.map((s: any, i: any) => ({ ...s, key: i }))}
              scroll={{ y: 500 }}
              pagination={{
                pageSize,
                current: page,
                total: count,
                showSizeChanger: false,
                position: ["bottomCenter"],
                onChange: (page) => setPage(page),
              }}
            />
          </TableContainer>
          <Modal
            title={<Text fontWeight={700}>ดูรายละเอียด</Text>}
            open={showManualCoDetail}
            onCancel={() => setShowManualCoDetail(null)}
            footer={null}
          >
            {showManualCoDetail &&
              [
                {
                  label: "วันที่ใช้งาน",
                  key: "updateAt",
                  val:
                    showManualCoDetail.updateAt && dateFormatter(showManualCoDetail.updateAt, true),
                },
                {
                  label: "จำนวนยอดสั่งซื้อ",
                  key: "orderTotalPrice",
                  val:
                    showManualCoDetail.orderTotalPrice &&
                    priceFormatter(showManualCoDetail.orderTotalPrice, 2, true),
                },
                {
                  label: "ส่วนลดดูแลราคาที่ใช้",
                  key: "usedAmount",
                  val:
                    showManualCoDetail.usedAmount &&
                    priceFormatter(showManualCoDetail.usedAmount, 2, true),
                  action: showManualCoDetail.action,
                },
                { label: "Sale Order Number", key: "soNo" },
                { label: "Credit Note Number", key: "cnNo" },
                { label: "หมายเหตุ", key: "remark" },
              ].map(({ label, key, val, action }) => (
                <Row key={key} style={{ padding: "8px 0px" }}>
                  <Col span={10}>
                    <Text>{label}</Text>
                  </Col>
                  <Col span={14}>
                    <Text
                      color={
                        action === "increase"
                          ? "success"
                          : action === "decrease"
                          ? "error"
                          : undefined
                      }
                    >
                      {action === "increase" ? "+ " : action === "decrease" ? "- " : ""}
                      {val ? val : (showManualCoDetail && showManualCoDetail[key]) || "-"}
                    </Text>
                  </Col>
                </Row>
              ))}
          </Modal>
        </>
      ),
    },
    {
      label: `ประวัติ ส่วนลดดูแลราคา`,
      key: "2",
      children: (
        <>
          <TableContainer>
            <Table
              dataSource={history}
              columns={historyColumns}
              pagination={false}
              scroll={{ y: 500 }}
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
    form.resetFields();
  };

  const saveManualCo = async (val: any) => {
    setSubmit(true);
    await updateCoManual(val)
      .then(async (res: any) => {
        if (res?.success) {
          form.resetFields();
          setConfirmModal(false);
          setFormModal(false);
          toggleFormModal(0);
          message.success(res?.userMessage || "บันทึกสำเร็จ");
          fetchData();
        } else {
          message.success("เกิดข้อผิดพลาด");
        }
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setSubmit(false);
      });
  };

  const onSubmitManualCO = () => {
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
              <span style={{ fontWeight: 700, color: factor > 0 ? color.success : color.error }}>
                การ{factor > 0 ? "เพิ่ม" : "ลด"}ยอด
              </span>{" "}
              CO ส่วนลดดูแลราคา ก่อนกดยืนยัน เพราะอาจส่งผลต่อยอด ส่วนลดดูแลราคาคงเหลือในระบบ
            </Text>
          ),
          onOk: () => {
            const { cnNo, coAmount, date, remark, soNo, total } = values;
            //TODO: call api
            const id = pathSplit[3];
            const submitData = {
              company,
              customerCompanyId: id,
              orderDate: date,
              orderAmount: total,
              coAmount,
              soNo,
              cnNo,
              remark,
              updateBy: `${firstname} ${lastname}`,
              action: factor > 0 ? "increase" : "decrease",
            };
            saveManualCo(submitData);
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
                      {priceFormatter(profile?.balance, 2, true)}
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
                  รายการประวัติ ส่วนลดดูแลราคา
                </Text>
              </Col>
              <Col span={6}>
                <Permission permission={["manageConditionStore", "edit"]}>
                  <Button title='+ เพิ่มส่วนลดดูแลราคาแบบ Manual' onClick={toggleConfirmModal} />
                </Permission>
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
                        ส่งผลต่อ ส่วนลดดูแลราคาคงเหลือในระบบ
                        <br />
                        โปรดตรวจสอบความถูกต้องก่อนการเลือก
                      </Text>
                    </Row>
                    <br />
                    <Row gutter={16}>
                      <Col span={12}>
                        <Button
                          title='+ เพิ่มยอด'
                          typeButton='success'
                          onClick={() => toggleFormModal(1)}
                        />
                      </Col>
                      <Col span={12}>
                        <Button
                          title='- ลดยอด'
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
                      <DatePicker enablePast />
                    </Form.Item>
                    <Form.Item
                      name='total'
                      label='จำนวนยอดสั่งซื้อ'
                      rules={[
                        { required: true, message: "*โปรดระบุจำนวนยอดสั่งซื้อ" },
                        {
                          validator: (rule, value, callback) => {
                            if (value && (isNaN(value) || parseFloat(value) <= 0)) {
                              return Promise.reject("จำนวนยอดสั่งซื้อต้องเป็นตัวเลขมากกว่า 0");
                            }
                            if (value && value.split(".")[1] && value.split(".")[1].length > 2) {
                              return Promise.reject("ทศนิยมต้องไม่เกิน 2 ตำแหน่ง");
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
                      label=' ส่วนลดดูแลราคาที่ใช้'
                      rules={[
                        {
                          required: true,
                          message: "*โปรดระบุ ส่วนลดดูแลราคาที่ใช้",
                        },
                        {
                          validator: (rule, value, callback) => {
                            if (factor < 0 && parseFloat(value) > parseFloat(profile?.balance)) {
                              return Promise.reject("*ยอดลดที่ใช้ เกินส่วนลดดูแลราคาคงเหลือในระบบ");
                            }
                            if (value && (isNaN(value) || parseFloat(value) <= 0)) {
                              return Promise.reject(" ส่วนลดดูแลราคาที่ใช้ต้องเป็นตัวเลขมากกว่า 0");
                            }
                            if (value && value.split(".")[1] && value.split(".")[1].length > 2) {
                              return Promise.reject("ทศนิยมต้องไม่เกิน 2 ตำแหน่ง");
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
                      // rules={[{ required: true, message: "*โปรดระบุเลข SO No." }]}
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
