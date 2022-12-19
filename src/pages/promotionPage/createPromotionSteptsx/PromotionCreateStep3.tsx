import { Avatar, Col, Divider, Form, FormInstance, Modal, Row, Table, Upload } from "antd";
import React, { useEffect, useState, memo, useMemo } from "react";
import { FlexCol, FlexRow } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import styled from "styled-components";
import color from "../../../resource/color";
import image from "../../../resource/image";
import TableContainer from "../../../components/Table/TableContainer";
import { ProductEntity } from "../../../entities/PoductEntity";
import { AlignType } from "rc-table/lib/interface";
import { CloseOutlined, DeleteOutlined, DownOutlined, EditOutlined, MinusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Select from "../../../components/Select/Select";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import Collapse from "../../../components/Collapse/collapse";
import { PromotionEntity } from "../../../entities/PromotionEntity";

const AddProductContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
    padding: 16px 50px;

    cursor: pointer;

    background: ${color['background1']};
    border: 1px dashed ${color['primary']};
    border-radius: 12px;

`; 

const IconContainer = styled.div`
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    color: white;
    background: ${color.primary};
    border-radius: 4px;
    cursor: pointer;
`;

const CloseIconContainer = styled(IconContainer)`
    background: #6B7995;
    border-radius: 16px;
`;

interface ProdNameProps  {
    product: ProductEntity;
    size?: number;
}

interface SearchProps  {
    list: ProductEntity[],
    setList: any;
    onClose: any;
    isReplacing?: string;
}

interface Props  {
    form: FormInstance;
}

const ProductName = ({ product, size }: ProdNameProps) => {

    return (
        <FlexRow align='center'>
            <div style={{ marginRight: 16 }}>
                <Avatar src={product.productImage} size={size || 50} shape='square' />
            </div>
            <FlexCol>
                <Text level={5}>
                    {product.productName}
                </Text>
                <Text level={5} color='Text3'>
                    {product.commonName}
                </Text>
                <Text level={5} color='Text3'>
                    {product.productGroup}
                </Text>
            </FlexCol>
        </FlexRow>
    )
}

const AddProduct = ({ list, setList, onClose, isReplacing }: SearchProps) => {
    const [products, setProducts] = useState<ProductEntity[]>([]);
    const [selectedProduct, setSelectedProd] = useState<ProductEntity[]>([]);
    const [selectedProductId, setSelectedProdId] = useState<string[]>([]);

    useEffect(() => {
        fetchProduct();
    },[])

    useEffect(() => {
        setSelectedProdId(list.map((item) => item.productId));
    },[list])

    const fetchProduct = () => {
        const mockData = Array.from({ length: 20 }).map((_, i) => ({
            key: i.toString(),
            productId: i.toString(),
            productName: `ชื่อสินค้า ${i + 1}`,
            packSize: '15 kg',
            commonName: 'This is common name',
            productGroup: 'productGroup',
            packingUOM: 'ลัง',
        }));
        setProducts(mockData);
    }

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: ProductEntity[]) => {
            setSelectedProdId(selectedRowKeys as string[]);
            setSelectedProd(selectedRows);
            setList(products.filter((item) => selectedRowKeys.includes(item.productId)));
        },
        getCheckboxProps: (record: ProductEntity) => ({
            name: record.productName,
        }),
        selectedRowKeys: selectedProductId
    };

    const columns = [
        {
          title: 'สินค้าทั้งหมด',
          dataIndex: 'productName',
          render: (value: string, row: ProductEntity) => (
            <ProductName product={row}/>
          ),
        },
        {
          title: `${20} สินค้า`,
          dataIndex: 'packSize',
          align: 'right' as AlignType,
        }
    ];

    const onSave = () => {
        setList(products.filter((item) => selectedProductId.includes(item.productId)))
        onClose();
    }

    return (
        <>
            <Form layout='vertical'>
                <Row gutter={8} align='bottom'>
                    <Col span={7}>
                        <Form.Item
                            label='Product Group'
                            name='productGroup'
                        >
                            <Select data={[]}/>
                        </Form.Item>
                    </Col>
                    <Col span={7}>
                        <Form.Item
                            label='Startegy Group'
                            name='strategyGroup'
                        >
                            <Select data={[]}/>
                        </Form.Item>
                    </Col>
                    <Col span={7}>
                        <Form.Item
                            label='ค้นหาสินค้า'
                            name='keyword'
                        >
                            <Input 
                                suffix={<SearchOutlined/>}
                                placeholder={'ระบุชื่อสินค้า'}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item
                            label=''
                            name='keyword'
                        >
                            <Button
                                title="ล้างการค้นหา"
                                typeButton="primary-light"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <TableContainer>
                <Table 
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={products}
                    pagination={false}
                    scroll={{ y: 360 }}
            />
            </TableContainer>
            <Divider style={{ margin: '12px 0px' }} />
            <Row justify='end'>
                <Button
                    title="บันทึก"
                    style={{ width: 136 }}
                    onClick={onSave}
                />
            </Row>
        </>
    )
}

export const PromotionCreateStep3 = ({ form }: Props) => {

    const [items, setItems] = useState<ProductEntity[]>([]);
    const [itemPromo, setItemPromo] = useState<any[]>([]);
    const [showModal, setModal] = useState(false);
    const [isReplacing, setReplace] = useState<string | undefined>(undefined);
    const [activeKeys, setActiveKeys] = useState<string | string[]>([]);

    const toggleModal = () => {
        setModal(!showModal);
        setReplace(undefined);
    }

    const onAddProduct = () => {
        if(items.length > 0){
            Modal.confirm({
                title: 'ต้องการเพิ่มหรือเปลี่ยนสินค้าใช่หรือไม่',
                content: 'โปรดยืนยันการเพิ่มหรือเปลี่ยนสินค้า และโปรดตรวจสอบรายละเอียดโปรโมชันสินค้าอีกครั้ง',
                okText: 'ยืนยัน',
                cancelText: 'ยกเลิก',
                onOk: () => toggleModal()
            })
        } else {
            toggleModal();
        }
    }

    const setProd = (list: ProductEntity[]) => {
        setItems(list);
        setActiveKeys(list.map((item) => item.productId))
        setItemPromo(list.map((item) => ({
            item,
            promo: [
                {
                    unit: item.packingUOM,
                    qty: 1,
                    discountAmount: 0
                }
            ]
        })))
    }

    const onChangeActiveKeys = (keys: string | string[]) => {
        console.log(keys)
        setActiveKeys(keys)
    }

    const onDeleteProduct = (id: string) => {
        Modal.confirm({
            title: 'ต้องการลบสินค้าใช่หรือไม่',
            content: 'โปรดยืนยันการลบสินค้า และโปรดตรวจสอบรายละเอียดโปรโมชันสินค้าอีกครั้ง',
            okText: 'ลบสินค้า',
            cancelText: 'ยกเลิก',
            onOk: () => {
                setItems(items.filter((item) => item.productId !== id ))
            }
        })
    }

    return (
        <>
            <Row>
                <Col span={16}>
                    <Row align='middle'>
                        <Text level={2} fontWeight={700}>
                            รายละเอียดรายการ&nbsp;&nbsp;
                        </Text>
                        <Text level={5} color='Text3'>
                            โปรดระบุรายละเอียดโปรโมชัน
                        </Text>
                    </Row>
                </Col>
                <Col span={8}>
                    <FlexRow align='center' justify='end' style={{ height: '100%' }}>
                        <Text level={5} color='secondary'>
                            ทั้งหมด&nbsp;{items.length}&nbsp;รายการ
                        </Text>
                    </FlexRow>
                </Col>
            </Row>
            <br/>
            <Form
                layout='vertical'
                form={form}
            >
                <Collapse
                    defaultActiveKey={items.map((item) => item.productId)}
                    activeKey={activeKeys}
                    collapsible='icon'
                    onChange={onChangeActiveKeys}
                    expandIconPosition='end'
                    expandIcon={({ isActive }) => (
                        <DownOutlined 
                            rotate={isActive ? 180 : 0} 
                        />
                    )}
                >
                    {items.map((item, i) => {
                        return (
                            <Collapse.Panel
                                header={
                                    <Row style={{ padding: '24px 32px'}}>
                                        <Col span={9}>
                                            <ProductName product={item} size={84}/>
                                        </Col>
                                        <Col span={5}>
                                            <Text>{item.packSize}</Text>
                                        </Col>
                                        <Col span={8}>
                                            <Text>จำนวน&nbsp;{0}&nbsp;ขั้นบันได</Text>
                                        </Col>
                                        <Col span={2}>
                                            <FlexCol 
                                                align='center'
                                                justify='space-evenly'
                                                style={{ 
                                                    height: '100%',
                                                    paddingLeft: 32,
                                                    borderLeft: `1px solid ${color.background2}`
                                                }}
                                            >
                                                <IconContainer>
                                                    <EditOutlined
                                                        onClick={() => {
                                                            setReplace(item.productId);
                                                            setModal(true);
                                                        }}
                                                    />
                                                </IconContainer>
                                                <IconContainer>
                                                    <DeleteOutlined 
                                                        onClick={() => onDeleteProduct(item.productId)}
                                                    />
                                                </IconContainer>
                                            </FlexCol>
                                        </Col>
                                    </Row>
                                }
                                key={item.productId}
                            >
                                <Form.List name={`${item.productId}-qty`}>
                                    {(fields, { add, remove }) => {
                                        if(fields.length <=0){
                                            add();
                                        }
                                        return (
                                            <>
                                                {fields.map(({ key, name, ...restField }, i) => (
                                                    <Row key={key} gutter={16} style={{ padding: '20px 16px' }}>
                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...restField}
                                                                label='จำนวนที่ซื้อครบ'
                                                                name={[name, 'qty']}
                                                                rules={[{ required: true, message: 'Missing qty' }]}
                                                            >
                                                                <Input placeholder="ระบุจำนวนที่ซื้อครบ" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={4}>
                                                            <Form.Item
                                                                {...restField}
                                                                label='หน่วย'
                                                                name={[name, 'unit']}
                                                                initialValue={item.packingUOM}
                                                            >
                                                                <Input disabled />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Form.Item
                                                                {...restField}
                                                                label='ราคาที่ต้องการลด'
                                                                name={[name, 'discountAmount']}
                                                                rules={[{ required: true, message: 'Missing discount amount' }]}
                                                            >
                                                                <Input 
                                                                    placeholder="ระบุราคา" 
                                                                    suffix='บาท'
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={4}>
                                                            <Form.Item
                                                                {...restField}
                                                                label='ต่อหน่วย SKU'
                                                                name={[name, 'perUnit']}
                                                                initialValue={item.packingUOM}
                                                            >
                                                                <Input disabled />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={2}>
                                                            {i > 0 && (
                                                                <FlexRow align='center' justify='center' style={{ height: '100%', paddingBottom: 9 }}>
                                                                    <CloseIconContainer>
                                                                        <CloseOutlined 
                                                                            style={{ color: 'white' }}
                                                                            onClick={() => remove(name)} 
                                                                        />
                                                                    </CloseIconContainer>
                                                                </FlexRow>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                ))}
                                                <Form.Item>
                                                    <AddProductContainer onClick={() => add()} style={{ background: 'white' }}>
                                                        <Text level={5} color='primary'>+&nbsp;เพิ่มขั้นบันได</Text>
                                                    </AddProductContainer>
                                                </Form.Item>
                                            </>
                                        )
                                    }}
                                </Form.List>
                            </Collapse.Panel>
                        )
                    })}
                </Collapse>
            </Form>
            <br/>
            <AddProductContainer onClick={onAddProduct}>
                {items.length <= 0 && <img 
                    style={{ width: 72, margin: 16 }}
                    src={image.product_box}
                />}
                <Text level={items.length <= 0 ? 4 : 5} color='primary'>+&nbsp;เพิ่มสินค้า</Text>
                {items.length <= 0 && <>
                    <Text level={6} color='Text1'>กรุณาเพิ่มรายการสินค้าที่ต้องการทำโปรโมชัน</Text>
                    <br/>
                </>}
            </AddProductContainer>
            <Modal 
                visible={showModal}
                width={'80vw'}
                closable={false}
                footer={null}
            >
                <Row align='middle' justify='space-between'>
                    <Col span={20}>
                        <FlexRow align='end'>
                            <Text level={5} fontWeight={600}>เลือกสินค้า</Text>
                            <Text level={6} color='Text3'>&nbsp;&nbsp;สามารถเลือกได้มากกว่า 1 สินค้า</Text>
                        </FlexRow>
                    </Col>
                    <Col span={4}>
                        <FlexRow justify='end'>
                            <CloseOutlined onClick={toggleModal}/>
                        </FlexRow>
                    </Col>
                </Row>
                <br/>
                <AddProduct
                    list={items}
                    setList={setProd}
                    onClose={toggleModal}
                    isReplacing={isReplacing}
                />
            </Modal>
        </>
    )

}