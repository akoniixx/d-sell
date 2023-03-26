import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Checkbox, Col, Divider, Form, Row, Table, Tabs } from "antd";
import { useForm } from "antd/lib/form/Form";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import { DetailBox, FlexCol, FlexRow } from "../../../components/Container/Container";
import Input from "../../../components/Input/Input";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Select from "../../../components/Select/Select";
import TableContainer from "../../../components/Table/TableContainer";
import Text from "../../../components/Text/Text";
import { getConditionCoById } from "../../../datasource/CreditMemoDatasource";
import { getProductGroup } from "../../../datasource/ProductDatasource";
import { LOCATION_FULLNAME_MAPPING } from "../../../definitions/location";
import { ConditionCOEntiry } from "../../../entities/ConditionCOEntiry";
import { ProductEntity } from "../../../entities/PoductEntity";
import { ProductGroupEntity } from "../../../entities/ProductGroupEntity";
import color from "../../../resource/color";
import image from "../../../resource/image";
import { dateFormatter, numberFormatter } from "../../../utility/Formatter";
import { ModalSelectedProduct } from "../../Shared/ModalSelecteProduct";

export const DetailConditionCOPage: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const conditionId = pathSplit[4];

  const [form1] = useForm();
  const [form2] = useForm();

  const [selectedTab, setSelectedTab] = useState<"product" | "shop">("shop");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [data, setData] = useState<ConditionCOEntiry>();
  const [productGroup, setProductGroup] = useState<ProductGroupEntity[]>([]);

  const [showModalProd, setShowModalProd] = useState<boolean>(false);
  const [showModalShop, setShowModalShop] = useState<boolean>(false);

  const [selectedProd, setSelectedProd] = useState<ProductEntity[]>([]);
  const [searchProd, setSearchProd] = useState<ProductEntity[]>([]);

  const [searchKeywordProd, setSearchKeywordProd] = useState("");
  const [searchProdGroup, setSearchProdGroup] = useState("");

  const getCondition = async () => {
    const getById = await getConditionCoById(conditionId);
    setData(getById);
  };
  const fetchProductGroup = async () => {
    const getProdGroup = await getProductGroup(company);
    setProductGroup(
      getProdGroup.responseData.map((d: any, index: number) => ({ ...d, key: index })),
    );
  };

  useEffect(() => {
    getCondition();
    fetchProductGroup();
  }, []);

  const onClearData = () => {
    setSelectedProd([]);
  };

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
  const PageTitle = () => {
    return (
      <PageTitleNested
        title='รายละเอียดเงื่อนไข CO'
        showBack
        onBack={() => navigate(`/discount/conditionCo`)}
        extra={
          !isEdit && (
            <Button
              type='primary'
              icon={<EditOutlined />}
              title='แก้ไขรายละเอียด'
              height={40}
              onClick={() => setIsEdit(!isEdit)}
            />
          )
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการเงื่อนไข CO", path: "/discount/conditionCo" },
              { text: "รายละเอียดเงื่อนไข CO", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };
  const tabsItems = [
    {
      label: `รายละเอียดเขตและร้านค้า`,
      key: "shop",
    },
    {
      label: `รายละเอียดสินค้า`,
      key: "product",
    },
  ];

  //#region section product
  const onSearchProd = (e: any) => {
    setSearchKeywordProd(e.target.value);
    const find = searchProd.filter((x) => {
      const searchName = !e.target.value || x.productName?.includes(e.target.value);
      const searchGroup = !searchProdGroup || x.productGroup?.includes(searchProdGroup);
      return searchName && searchGroup;
    });
    setSelectedProd(find);
  };
  const onSearchProdGroup = (e: any) => {
    console.log(e);
    setSearchProdGroup(e);
    const find = searchProd.filter((x) => {
      const searchName = !searchKeywordProd || x.productName?.includes(searchKeywordProd);
      const searchGroup = !e || x.productGroup?.includes(e);
      return searchName && searchGroup;
    });
    setSelectedProd(find);
  };
  const callBackProduct = (item: ProductEntity[]) => {
    item = item.map((p: any) => ({ ...p, isChecked: false }));
    setSelectedProd(item);
    setSearchProd(item);
  };

  const handleCheckBoxDelete = (e: any, prodId: string) => {
    const checkBoxed = selectedProd.map((item) =>
      _.set(item, "isChecked", item.productId === prodId ? e.target.checked : item.isChecked),
    );
    setSelectedProd(checkBoxed);
    setSearchProd(checkBoxed);
  };
  const handleDelete = () => {
    const deleted = selectedProd.filter((x) => !x.isChecked);
    setSelectedProd(deleted);
    setSearchProd(deleted);
  };

  const dataTableProd = [
    {
      title: isEdit && <Checkbox />,
      width: "5%",
      render: (text: string, value: any) =>
        isEdit && (
          <Checkbox
            checked={value.isChecked}
            onChange={(e) => handleCheckBoxDelete(e, value.productId)}
          />
        ),
    },
    {
      title: <center>ชื่อสินค้า</center>,
      dataIndex: "productName",
      width: "35%",
      render: (text: string, value: any, index: any) => (
        <FlexRow align='center'>
          <div style={{ marginRight: 16 }}>
            <Avatar
              src={
                value.productImage === "No" ||
                value.productImage === "" ||
                value.productImage === null
                  ? image.product_no_image
                  : value.productImage
              }
              size={50}
              shape='square'
              onError={() => false}
            />
          </div>
          <FlexCol>
            <div style={{ height: 25 }}>
              <Text level={5}>{value.productName}</Text>
            </div>
            <div style={{ height: 25, overflow: "hidden", textOverflow: "ellipsis" }}>
              <Text level={5} style={{ color: color.Grey }}>
                {value.commonName}
              </Text>
            </div>
            <div style={{ height: 25 }}>
              <Text level={5} style={{ color: color.Grey }}>
                {value.productGroup}
              </Text>
            </div>
          </FlexCol>
        </FlexRow>
      ),
    },
    {
      title: <center>ขนาด</center>,
      dataIndex: "packSize",
      render: (text: string) => <center>{text}</center>,
    },
    {
      title: <center>ราคา/หน่วย</center>,
      dataIndex: "unitPrice",
      render: (text: string) => <center>{numberFormatter(text)}</center>,
    },
    {
      title: <center>ราคาขาย</center>,
      dataIndex: "marketPrice",
      render: (text: string) => <center>{numberFormatter(text)}</center>,
    },
    {
      title: <center>สถานที่</center>,
      dataIndex: "productLocation",
      render: (text: string) => <center>{LOCATION_FULLNAME_MAPPING[text]}</center>,
    },
    {
      title: <center>ราคาลด</center>,
      dataIndex: "discountAmount",
      width: "20%",
      render: (text: string, value: any) =>
        isEdit ? (
          <Form.Item name={value.productId} noStyle={true}>
            <Input suffix={"บาท/" + value.saleUOMTH} autoComplete='off' />
          </Form.Item>
        ) : (
          <center>{numberFormatter(text)}</center>
        ),
    },
  ];
  //#endregion

  const dataTableShop = [
    {
      title: isEdit && <Checkbox />,
      width: "5%",
      render: (text: string) => isEdit && <Checkbox />,
    },
    {
      title: <center>ชื่อร้านค้า</center>,
      dataIndex: "customerName",
      render: (text: string) => <center>{text}</center>,
    },
    {
      title: <center>เขตการขาย</center>,
      dataIndex: "zone",
      render: (text: string) => <center>{text}</center>,
    },
  ];

  return (
    <>
      <CardContainer>
        <PageTitle />
        <br />
        <DetailBox>
          <DetailItem label='ชื่อรายการ' value={data?.creditMemoConditionName || ""} />
          <DetailItem
            label='ระยะเวลา'
            value={
              dateFormatter(data?.startDate || "") + " - " + dateFormatter(data?.endDate || "")
            }
          />
        </DetailBox>
        <br />
        <Row gutter={16}>
          <Col span={13}>
            <Text level={2}>รายการละเอียดเงื่อนไข</Text>
          </Col>
          {selectedTab === "product" ? (
            <>
              <Col span={6}>
                <Input
                  placeholder='ค้นหาสินค้า...'
                  suffix={<SearchOutlined />}
                  style={{ width: "100%" }}
                  allowClear
                  onPressEnter={(e) => onSearchProd(e)}
                  defaultValue={searchKeywordProd}
                />
              </Col>
              <Col span={5}>
                <Select
                  data={[
                    {
                      key: "",
                      value: "",
                      label: "Product Group : ทั้งหมด",
                    },
                    ...productGroup.map((p: any) => ({
                      key: p.product_group,
                      value: p.product_group,
                      label: p.product_group,
                    })),
                  ]}
                  placeholder='Product Group : ทั้งหมด'
                  style={{ width: "100%" }}
                  onChange={(e) => onSearchProdGroup(e)}
                  value={searchProdGroup}
                />
              </Col>
            </>
          ) : (
            <></>
          )}
        </Row>
        <br />
        <Tabs
          items={tabsItems}
          onChange={(key: string) => {
            setSelectedTab(key as "product" | "shop");
          }}
          defaultValue={selectedTab}
        />
        <Row justify='end' gutter={16}>
          <Col span={7}>
            {searchProd.filter((x) => x.isChecked).length > 0 && (
              <FlexRow align='center' justify='end' style={{ height: "100%" }}>
                <DeleteOutlined
                  style={{ fontSize: 20, color: color.error }}
                  onClick={handleDelete}
                />
              </FlexRow>
            )}
          </Col>
          <Col span={4}>
            {isEdit && selectedTab === "product" && (
              <Button
                title='+ เพิ่มรายการสินค้า'
                onClick={() => setShowModalProd(!showModalProd)}
              />
            )}
            {isEdit && selectedTab === "shop" && <Button title='+ เพิ่มร้านค้า' />}
          </Col>
        </Row>
        <br />
        <TableContainer>
          {selectedTab === "product" ? (
            <Form form={form1}>
              <Table
                columns={dataTableProd}
                dataSource={selectedProd}
                pagination={false}
                scroll={{ y: 360 }}
              />
            </Form>
          ) : (
            <Form form={form2}>
              <Table
                columns={dataTableShop}
                dataSource={data?.creditMemoConditionShop}
                pagination={false}
                scroll={{ y: 360 }}
              />
            </Form>
          )}
        </TableContainer>

        {isEdit && (
          <>
            <Divider />
            <Row justify='space-between' gutter={12}>
              <Col xl={3} sm={6}>
                <Button
                  typeButton='primary-light'
                  title='ยกเลิก'
                  onClick={() => {
                    setIsEdit(false), onClearData();
                  }}
                />
              </Col>
              <Col xl={15} sm={6}></Col>
              <Col xl={3} sm={6}>
                <Button typeButton='primary' title='บันทึก' />
              </Col>
            </Row>
          </>
        )}
      </CardContainer>
      {showModalProd && (
        <ModalSelectedProduct
          showModalProd={showModalProd}
          onClose={() => setShowModalProd(!showModalProd)}
          company={company}
          productGroup={productGroup}
          prodSelected={selectedProd}
          callBackProduct={callBackProduct}
        />
      )}
    </>
  );
};
