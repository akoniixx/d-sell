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

export const ModalSelectedProduct = ({
  masterDataProd,
  company,
  showModalProd,
  onClose,
  productGroup,
  callBackProduct,
  prodSelected,
}: {
  masterDataProd: ProductEntity[];
  company: string;
  showModalProd: boolean;
  onClose: () => void;
  productGroup: ProductGroupEntity[];
  callBackProduct: (item: ProductEntity[]) => void;
  prodSelected: ProductEntity[];
}) => {
  const [selectedProd, setSelectedProd] = useState<ProductEntity[]>(prodSelected);
  const [prodGroup, setProdGroup] = useState("");
  const [keyword, setKeyword] = useState("");
  const [checkSave, setCheckSave] = useState(false);

  useEffect(() => {
    let result: ProductEntity[] = [];
    if (keyword && !prodGroup) {
      result = masterDataProd.filter((p: any) => p.productName.includes(keyword));
    } else if (!keyword && prodGroup) {
      result = masterDataProd.filter((p: any) => p.productGroup.includes(prodGroup));
    } else if (keyword && prodGroup) {
      result = masterDataProd.filter(
        (p: any) => p.productGroup.includes(prodGroup) && p.productName.includes(keyword),
      );
    } else {
      result = masterDataProd.map((p) =>
        _.set(
          p,
          "isChecked",
          selectedProd.some((sp) => (sp.productId === p.productId ? sp.isChecked : p.isChecked)),
        ),
      );
      checkSave && (callBackProduct(result.filter((x) => x.isChecked)), onClose());
    }
    setSelectedProd(result);
  }, [keyword, prodGroup, checkSave]);

  const handleChecked = (e: any, prodId: string) => {
    const d: ProductEntity[] = selectedProd.map((item) =>
      _.set(item, "isChecked", item.productId === prodId ? e.target.checked : item.isChecked),
    );
    setSelectedProd(d);
  };
  const handleAllChecked = (e: any) => {
    const d = masterDataProd.map((p: any) => ({ ...p, isChecked: e.target.checked }));
    setSelectedProd(d);
  };

  const handleSearchKeyword = (e: any) => {
    setKeyword(e.target.value);
  };
  const handleSearchProdGroup = (e: any) => {
    setProdGroup(e);
  };
  const handleClearSearch = () => {
    setKeyword("");
    setProdGroup("");
  };

  const saveProd = () => {
    setKeyword("");
    setProdGroup("");
    setCheckSave(true);
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
            onChange={(e) => handleSearchKeyword(e)}
            value={keyword}
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
  );
};
