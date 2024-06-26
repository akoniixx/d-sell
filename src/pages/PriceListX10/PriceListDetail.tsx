import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Divider,
  Form,
  message,
  Modal,
  Spin,
  Tabs,
  Tag,
  Table,
  Avatar,
  Radio,
  Space,
} from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import Button from "../../components/Button/Button";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import styled from "styled-components";
import { ProductEntity } from "../../entities/PoductEntity";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import {
  CheckCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import color from "../../resource/color";
import image from "../../resource/image";
import Text from "../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import TableContainer from "../../components/Table/TableContainer";
import { AlignType } from "rc-table/lib/interface";
import PageSpin from "../../components/Spin/pageSpin";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { getCustomersById } from "../../datasource/CustomerDatasource";
import {
  getSpecialPriceByCustomerId,
  updateSpecialPrice,
} from "../../datasource/SpecialPriceDatasource";
import { priceFormatter } from "../../utility/Formatter";
import { getProductGroup } from "../../datasource/ProductDatasource";
import { ProductGroupEntity } from "../../entities/ProductGroupEntity";
import AddProduct from "../Shared/AddProduct";
import { LOCATION_FULLNAME_MAPPING } from "../../definitions/location";

const DetailBox = styled.div`
  padding: 32px;
  margin-top: 12px;

  background: ${color.background1};
  border: 1px solid ${color.background2};
  border-radius: 16px;
`;
const DetailItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <Row gutter={16} style={{ margin: "4px 0px" }}>
      <Col span={6}>
        <Text>{label} :</Text>
      </Col>
      <Col span={18}>
        <Text color='Text2'>{value}</Text>
      </Col>
    </Row>
  );
};

export const SpecialPriceDetail: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEditing = pathSplit[2] === "edit";
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [priceListLoading, setPriceListLoading] = useState(false);
  const [priceList, setPriceList] = useState({
    all: [] as any[],
    up: [] as any[],
    down: [] as any[],
  });
  const [productGroups, setProductGroup] = useState<any>();
  const [productGroupLoading, setProductGroupLoading] = useState(false);
  const [productFilter, setProductFilter] = useState({
    keyword: "",
    group: null,
  });
  const [selectedTab, setSelectedTab] = useState<"all" | "up" | "down">("all");
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<any[]>([]);
  const [deletedItems, setDeletedItems] = useState<any[]>([]);
  const [showModal, setModal] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const [isDone, setDone] = useState(false);

  const toggleModal = () => {
    setModal(!showModal);
  };

  const setProd = (list: ProductEntity[]) => {
    const loginName = firstname + " " + lastname;
    const { customerId, customerCompanyId, customerName, zone } = data;
    let newItems = list
      .filter((item) => !items.find((p) => p.productId === item.productId))
      .map((p) => ({
        customerId,
        customerCompanyId,
        customerName,
        zone,
        company,
        createBy: loginName,
        updateBy: loginName,
        value: 0,
        productId: p.productId,
        product: p,
      }));

    newItems = [...items, ...newItems];
    setItems(newItems);
    setPriceList({
      all: newItems,
      up: newItems.filter((d) => d.value >= 0),
      down: newItems.filter((d) => d.value < 0),
    });

    // setDeletedItems(
    //   deletedItems.filter((item) => !list.find((p) => p.productId === item.productId)),
    // );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const { keyword, group } = productFilter;
    const newItems = items.filter((item: any) => {
      if (keyword && !item?.product?.productName?.includes(keyword)) {
        return false;
      }
      if (group && item?.product?.productGroup !== group) {
        return false;
      }
      return true;
    });
    setPriceList({
      all: newItems,
      up: newItems.filter((d) => d.value >= 0),
      down: newItems.filter((d) => d.value < 0),
    });
  }, [productFilter]);

  const fetchData = async () => {
    setLoading(true);
    const id = pathSplit[3];
    await getCustomersById(id)
      .then((res: any) => {
        setData(res);
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
    await getSpecialPriceByCustomerId(id)
      .then((res: { responseData: any[] }) => {
        setPriceList({
          all: res?.responseData,
          up: res?.responseData?.filter((d) => d.value >= 0),
          down: res?.responseData?.filter((d) => d.value < 0),
        });
        setItems(res?.responseData);
        res?.responseData?.forEach((item: any) => {
          form.setFieldValue(`${item.productId}-type`, item.value < 0 ? -1 : 1);
          form.setFieldValue(`${item.productId}-price`, Math.abs(item.value));
        });
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setPriceListLoading(false);
      });

    setProductGroupLoading(true);
    await getProductGroup(company)
      .then((res: { responseData: ProductGroupEntity[] }) => {
        setProductGroup(
          res?.responseData.map((group: ProductGroupEntity) => ({
            key: group.product_group,
            label: group.product_group,
            value: group.product_group,
          })),
        );
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setProductGroupLoading(false);
      });
  };

  const PageTitle = () => {
    // TODO: isEditing
    return (
      <PageTitleNested
        title='รายละเอียดราคาเฉพาะร้าน'
        showBack
        onBack={() => navigate(`/price/list`)}
        extra={
          !isEditing && (
            <Button
              type='primary'
              icon={<EditOutlined />}
              title='แก้ไขรายละเอียด'
              height={40}
              onClick={() => navigate(`/price/edit/${pathSplit[3]}`)}
            />
          )
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "ราคาสินค้าเฉพาะร้าน", path: "/price/list" },
              { text: "รายละเอียดราคาเฉพาะร้าน", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };

  const tabsItems = [
    {
      label: `ทั้งหมด (${priceList.all.length})`,
      key: "all",
    },
    {
      label: `เพิ่มราคาทุกสินค้า (${priceList.up.length})`,
      key: "up",
    },
    {
      label: `ลดราคาทุกสินค้า (${priceList.down.length})`,
      key: "down",
    },
  ];

  const detailColumns = isEditing
    ? [
        {
          title: "ประเภท",
          dataIndex: "product",
          key: "type",
          width: 126,
          render: (product: ProductEntity, row: any, index: number) => {
            return (
              <Form.Item
                name={`${row.productId}-type`}
                initialValue={row.value < 0 ? -1 : 1}
                noStyle
              >
                <Radio.Group
                  onChange={(e) => {
                    setItems(
                      items.map((item) =>
                        item.productId === product.productId
                          ? { ...item, value: Math.abs(item.value) * parseInt(e.target.value) }
                          : item,
                      ),
                    );
                  }}
                >
                  <Space direction='vertical'>
                    <Radio value={1}>เพิ่มราคา</Radio>
                    <Radio value={-1}>ลดราคา</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            );
          },
        },
        {
          title: "ราคาพิเศษ / หน่วยขาย",
          dataIndex: "product",
          key: "specialPrice",
          render: (product: ProductEntity, row: any, index: number) => {
            return (
              <Form.Item
                name={`${row.productId}-price`}
                initialValue={Math.abs(row.value)}
                // noStyle
                rules={[
                  {
                    validator: (rule, value, callback) => {
                      if (!Number.isInteger(parseFloat(value))) {
                        return Promise.reject("โปรดระบุเป็นจำนวนเต็มเท่านั้น");
                      }
                      if (parseFloat(value) <= 0) {
                        return Promise.reject("ราคาต้องมากกว่า 0 โปรดระบุใหม่");
                      }
                      const type = form.getFieldValue(`${row.productId}-type`);
                      if (
                        type === -1 &&
                        parseFloat(value) > parseFloat(product.marketPrice || "")
                      ) {
                        return Promise.reject("ส่วนลดมากกว่าราคาขาย โปรดระบุใหม่");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  placeholder='ระบุราคา'
                  suffix='บาท'
                  style={{ width: 160 }}
                  onChange={(e) => {
                    if (parseFloat(e.target.value) + row.value > 0) {
                      setItems(
                        items.map((item) =>
                          item.productId === product.productId
                            ? { ...item, value: (item.val < 0 ? -1 : 1) * Math.abs(e.target.value) }
                            : item,
                        ),
                      );
                    }
                  }}
                />
              </Form.Item>
            );
          },
        },
        {
          title: "จัดการ",
          width: 80,
          align: "center" as AlignType,
          dataIndex: "product",
          key: "delete",
          render: (product: ProductEntity, row: any, index: number) => {
            return (
              <div
                className='btn btn-icon btn-light btn-hover-primary btn-sm'
                onClick={() =>
                  Modal.confirm({
                    title: "ต้องการลบราคาสินค้าพิเศษนี้",
                    okText: "ยืนยัน",
                    cancelText: "ยกเลิก",
                    onOk: () => {
                      setItems(items.filter((e) => e.productId !== row.productId));
                      setPriceList({
                        ...priceList,
                        all: priceList.all.filter((e) => e.productId !== row.productId),
                      });
                      setDeletedItems([...deletedItems, row]);
                    },
                  })
                }
              >
                <span className='svg-icon svg-icon-primary svg-icon-2x'>
                  <DeleteOutlined style={{ color: color["primary"] }} />
                </span>
              </div>
            );
          },
        },
      ]
    : [
        {
          title: "ราคาพิเศษ / หน่วยขาย",
          dataIndex: "product",
          key: "specialPrice",
          render: (product: ProductEntity, row: any, index: number) => {
            const { value } = row;
            return {
              children: (
                <FlexCol>
                  <Text level={5} color={value > 0 ? "success" : "error"}>
                    {priceFormatter(value || "", undefined, false, true)}
                  </Text>
                  <Text level={6} color='Text3'>
                    {" บาท / " + product?.saleUOMTH || product?.saleUOM}
                  </Text>
                </FlexCol>
              ),
            };
          },
        },
      ];

  const columns = [
    {
      title: "ชื่อสินค้า",
      dataIndex: "product",
      key: "product",
      render: (product: ProductEntity, row: any, index: number) => {
        return {
          children: (
            <FlexRow align='center'>
              <div style={{ marginRight: 16 }}>
                <Avatar
                  src={product?.productImage || image.product_no_image}
                  size={50}
                  shape='square'
                />
              </div>
              <FlexCol>
                <Text level={5}>{product?.productName}</Text>
                <Text level={6} color='Text3'>
                  {product?.commonName}
                </Text>
                <Text level={6} color='Text3'>
                  {LOCATION_FULLNAME_MAPPING[product?.productLocation || "-"]}
                </Text>
              </FlexCol>
            </FlexRow>
          ),
        };
      },
    },
    {
      title: "ขนาด",
      dataIndex: "product",
      key: "packSize",
      render: (product: ProductEntity, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{product?.packSize}</Text>
              <Text level={6} color='Text3'>
                {product?.productCodeNAV}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "ราคา / หน่วย",
      dataIndex: "product",
      key: "unitPrice",
      render: (product: ProductEntity, row: any, index: number) => {
        const unitPerPack =
          parseInt(product?.marketPrice || "1") / parseInt(product?.unitPrice || "1");
        const newMarketPrice = parseFloat(product?.marketPrice || "") + row.value;
        const newUnitPrice = newMarketPrice / unitPerPack;
        return {
          children: (
            <FlexCol>
              <Text level={5} color='Text3' style={{ textDecoration: "line-through" }}>
                {priceFormatter(product?.unitPrice || "", undefined, false, true)}
              </Text>
              <Text level={5}>
                {newUnitPrice
                  ? priceFormatter(newUnitPrice, undefined, false, true)
                  : priceFormatter(product?.marketPrice || "", undefined, false, true)}
              </Text>
              <Text level={6} color='Text3'>
                {" บาท / "} {product?.baseUOM || "Unit"}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "ราคา / หน่วยขาย",
      dataIndex: "product",
      key: "packPrice",
      render: (product: ProductEntity, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5} color='Text3' style={{ textDecoration: "line-through" }}>
                {priceFormatter(product?.marketPrice || "", undefined, false, true)}
              </Text>
              <Text level={5}>
                {row.value && product.marketPrice
                  ? priceFormatter(
                      parseFloat(product.marketPrice) + row.value,
                      undefined,
                      false,
                      true,
                    )
                  : priceFormatter(product?.marketPrice || "", undefined, false, true)}
              </Text>
              <Text level={6} color='Text3'>
                {" บาท / " + product?.saleUOMTH || product?.saleUOM}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    ...detailColumns,
  ];

  const onSubmit = async () => {
    // set deleted
    const data = [...items].map((item) => {
      const type = form.getFieldValue(`${item.productId}-type`);
      const val = form.getFieldValue(`${item.productId}-price`);
      return {
        ...item,
        value: type * parseInt(val),
      };
    });
    deletedItems.forEach((item) => {
      data.push({ ...item, isDeleted: true });
    });
    const submitData = {
      specialPriceShop: data,
      company,
    };

    const callback = (res: any) => {
      const { success, responseData, developerMessage, userMessage } = res;
      // const promotionId = responseData?.promotionId || id;
      const onDone = () => {
        setDone(true);
        setTimeout(() => {
          fetchData();
          form.resetFields();
          navigate(`/price/detail/${pathSplit[3]}`);
          navigate(1);
        }, 2000);
        setTimeout(() => {
          setDone(false);
        }, 2000);
      };

      if (success) {
        onDone();
      } else {
        message.error(userMessage || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        console.log(developerMessage);
      }
    };
    form
      .validateFields()
      .then(async (values) => {
        setCreating(true);
        await updateSpecialPrice(submitData)
          .then(callback)
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setCreating(false);
          });
      })
      .catch((errInfo) => {
        console.log("errInfo", errInfo);
      });
  };

  return (
    <>
      <div className='container '>
        <CardContainer>{loading ? <PageSpin /> : <PageTitle />}</CardContainer>
        {!loading && (
          <>
            <br />
            <CardContainer>
              <Text level={4} fontWeight={700}>
                รายละเอียดร้านค้า
              </Text>
              <DetailBox>
                <DetailItem label='ชื่อร้านค้า' value={data?.customerName} />
                <DetailItem label='Customer No.' value={data?.customerNo} />
                <DetailItem label='เขต' value={data?.zone} />
              </DetailBox>
            </CardContainer>
            <br />
            <CardContainer>
              <Row gutter={16}>
                <Col span={isEditing ? 9 : 14}>
                  <Text level={2}>รายการสินค้าราคาพิเศษ</Text>
                </Col>
                <Col span={5}>
                  <Input
                    placeholder='ค้นหาสินค้า...'
                    suffix={<SearchOutlined />}
                    style={{ width: "100%" }}
                    allowClear
                    onPressEnter={(e: any) => {
                      const value = (e.target as HTMLTextAreaElement).value;
                      setProductFilter({
                        ...productFilter,
                        keyword: value,
                      });
                    }}
                    onChange={(e: any) => {
                      const value = (e.target as HTMLInputElement).value;
                      if (!value) {
                        setProductFilter({
                          ...productFilter,
                          keyword: "",
                        });
                      }
                    }}
                  />
                </Col>
                <Col span={5}>
                  <Select
                    data={productGroups}
                    placeholder='Product Group : ทั้งหมด'
                    style={{ width: "100%" }}
                    disabled={productGroupLoading}
                    allowClear
                    onChange={(value) => {
                      setProductFilter({
                        ...productFilter,
                        group: value,
                      });
                    }}
                  />
                </Col>
                <Col span={isEditing ? 5 : 0}>
                  {isEditing && (
                    <Button title='+ เพิ่มรายการสินค้าราคาพิเศษ' onClick={toggleModal} />
                  )}
                </Col>
              </Row>
              <br />
              {!isEditing && (
                <Tabs
                  items={tabsItems}
                  onChange={(key: string) => {
                    setSelectedTab(key as "all" | "up" | "down");
                    setPage(1);
                  }}
                  defaultValue={selectedTab}
                />
              )}
              <TableContainer>
                <Form form={form}>
                  <Table
                    columns={columns}
                    dataSource={isEditing ? priceList.all : priceList[selectedTab]}
                    loading={priceListLoading}
                    pagination={{
                      pageSize: 8,
                      current: page,
                      onChange: (page) => setPage(page),
                      position: ["bottomCenter"],
                    }}
                  />
                </Form>
              </TableContainer>
            </CardContainer>
            {isEditing && (
              <>
                <br />
                <CardContainer>
                  <Row justify='space-between'>
                    <Col span={6}>
                      <Button
                        title='ยกเลิก'
                        typeButton='primary-light'
                        onClick={() => {
                          fetchData();
                          form.resetFields();
                          setSelectedTab("all");
                          setPage(1);
                          setDeletedItems([]);
                          navigate(`/price/detail/${pathSplit[3]}`);
                        }}
                      />
                    </Col>
                    <Col span={6}>
                      <Button title='บันทึก' onClick={onSubmit} />
                    </Col>
                  </Row>
                </CardContainer>
              </>
            )}
          </>
        )}

        <br />
        <Modal open={showModal} width={"80vw"} closable={false} footer={null}>
          {showModal && <AddProduct list={priceList.all} setList={setProd} onClose={toggleModal} />}
        </Modal>
      </div>
      <Modal open={isCreating || isDone} footer={null} width={220} closable={false}>
        <FlexCol align='space-around' justify='center' style={{ width: 172, height: 172 }}>
          {isDone ? (
            <CheckCircleTwoTone twoToneColor={color.success} style={{ fontSize: 36 }} />
          ) : (
            <Spin size='large' />
          )}
          <br />
          <Text level={4} align='center'>
            {isDone ? (
              <>
                สร้างราคาเฉพาะร้าน
                <br />
                สำเร็จ
              </>
            ) : (
              <>
                กำลังสร้าง
                <br />
                ราคาเฉพาะร้าน
              </>
            )}
          </Text>
        </FlexCol>
      </Modal>
    </>
  );
};
