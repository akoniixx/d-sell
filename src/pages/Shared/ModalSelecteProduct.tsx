import { Avatar, Checkbox, Col, Divider, Modal, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import { ProductEntity } from "../../entities/PoductEntity";
import { ProductGroupEntity } from "../../entities/ProductGroupEntity";
import image from "../../resource/image";
import Text from "../../components/Text/Text";
import { color } from "../../resource";
import { numberFormatter } from "../../utility/Formatter";
import { LOCATION_FULLNAME_MAPPING } from "../../definitions/location";
import Input from "../../components/Input/Input";
import { SearchOutlined } from "@ant-design/icons";
import Select from "../../components/Select/Select";
import Button from "../../components/Button/Button";
import TableContainer from "../../components/Table/TableContainer";
import _ from "lodash";
import { getProductList } from "../../datasource/ProductDatasource";

export const ModalSelectedProduct = ({
  company,
  showModalProd,
  onClose,
  productGroup,
  callBackProduct,
  prodSelected,
}: {
  company: string;
  showModalProd: boolean;
  onClose: () => void;
  productGroup: ProductGroupEntity[];
  callBackProduct: (item: ProductEntity[]) => void;
  prodSelected: ProductEntity[];
}) => {
  const [prodList, setProdList] = useState<ProductEntity[]>([]);
  const [selectedProd, setSelectedProd] = useState<ProductEntity[]>([]);
  const [prodGroup, setProdGroup] = useState("");
  const [keyword, setKeyword] = useState("");

  const fetchProduct = async () => {
    const getProd = await getProductList({
      company,
      take: 1000,
    });
    const dataWithIschecked = getProd.data.map((p: any) =>
      _.set(
        p,
        "isChecked",
        prodSelected.some((sp) => (sp.productId === p.productId ? !sp.isChecked : p.isChecked)),
      ),
    );
    setProdList(dataWithIschecked);
    setSelectedProd(dataWithIschecked);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleChecked = (e: any, prodId: string) => {
    const d: ProductEntity[] = prodList.map((item) =>
      _.set(item, "isChecked", item.productId === prodId ? e.target.checked : item.isChecked),
    );
    setProdList(d);
    const find = d.filter((x) => {
      const searchName = !keyword || x.productName?.includes(keyword);
      const searchGroup = !prodGroup || x.productGroup?.includes(prodGroup);
      return searchName && searchGroup;
    });
    setSelectedProd(find);
  };
  const handleAllChecked = (e: any) => {
    const d = prodList.map((p: any) => ({ ...p, isChecked: e.target.checked }));
    setProdList(d);
    const find = d.filter((x) => {
      const searchName = !keyword || x.productName?.includes(keyword);
      const searchGroup = !prodGroup || x.productGroup?.includes(prodGroup);
      return searchName && searchGroup;
    });
    setSelectedProd(find);
  };

  const handleSearchKeyword = (e: any) => {
    setKeyword(e.target.value);
    const find = prodList.filter((x) => {
      const searchName = !e.target.value || x.productName?.includes(e.target.value);
      const searchGroup = !prodGroup || x.productGroup?.includes(prodGroup);
      return searchName && searchGroup;
    });
    setSelectedProd(find);
  };
  const handleSearchProdGroup = (e: any) => {
    setProdGroup(e);
    const find = prodList.filter((x) => {
      const searchName = !keyword || x.productName?.includes(keyword);
      const searchGroup = !e || x.productGroup?.includes(e);
      return searchName && searchGroup;
    });
    setSelectedProd(find);
  };
  const handleClearSearch = () => {
    setKeyword("");
    setProdGroup("");
    setSelectedProd(prodList);
  };

  const saveProd = () => {
    setKeyword("");
    setProdGroup("");
    callBackProduct(prodList.filter((x) => x.isChecked));
    onClose();
  };

  const dataTableProd = [
    {
      title: (
        <Checkbox
          checked={selectedProd.every((x) => x.isChecked)}
          onClick={(e) => handleAllChecked(e)}
        />
      ),
      width: "5%",
      render: (text: string, value: any) => (
        <Checkbox checked={value.isChecked} onClick={(e) => handleChecked(e, value.productId)} />
      ),
    },
    {
      title: <center>ชื่อสินค้า</center>,
      dataIndex: "productName",
      width: "40%",
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
  ];

  return (
    <>
      <Modal
        open={showModalProd}
        centered={true}
        onCancel={() => onClose()}
        width={1000}
        title='เลือกสินค้าที่ต้องการ'
        footer={false}
        zIndex={300}
      >
        <Row gutter={16}>
          <Col span={5}>
            <Input
              placeholder='ค้นหาสินค้า...'
              suffix={<SearchOutlined />}
              style={{ width: "100%" }}
              onPressEnter={(e) => handleSearchKeyword(e)}
              defaultValue={keyword}
            />
          </Col>
          {company === "ICPL" && (
            <Col span={6}>
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
                onChange={(e) => handleSearchProdGroup(e)}
                placeholder='Product Group : ทั้งหมด'
                style={{ width: "100%" }}
                value={prodGroup}
              />
            </Col>
          )}
          <Col span={4}>
            <Button title='ล้างการค้นหา' typeButton='primary-light' onClick={handleClearSearch} />
          </Col>
        </Row>
        <br />
        <TableContainer>
          <Table
            columns={dataTableProd}
            dataSource={selectedProd}
            pagination={false}
            scroll={{ y: 360 }}
          />
        </TableContainer>
        <Divider style={{ margin: "12px 0px" }} />
        <Row justify='end'>
          <Button title='บันทึก' style={{ width: 136 }} onClick={saveProd} />
        </Row>
      </Modal>
    </>
  );
};
