import { Avatar, Col, Divider, Form, FormInstance, Modal, Row, Table, Tabs, Tooltip, Upload } from "antd";
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
import { PromotionType } from "../../../definitions/promotion";
import { getProductCategory, getProductGroup, getProductList } from "../../../datasource/ProductDatasource";
import { useRecoilValue, useSetRecoilState } from "recoil";
import productState from "../../../store/productList";
import { getProductFreebieGroup, getProductFreebies } from "../../../datasource/PromotionDatasource";
import { format } from "path";

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
    withFreebies?: boolean;
    isReplacing?: string;
}

interface FreebieListProps  {
    form: FormInstance;
    productId: string;
    itemIndex: number;
}  

interface Props  {
    form: FormInstance;
    promotionType?: PromotionType;
}

const ProductName = ({ product, size }: ProdNameProps) => {

    return (
        <FlexRow align='center'>
            <div style={{ marginRight: 16 }}>
                <Avatar src={product.productImage || product.productFreebiesImage} size={size || 50} shape='square' />
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

const AddProduct = ({ list, setList, onClose, withFreebies, isReplacing }: SearchProps) => {
    const userProfile = JSON.parse(localStorage.getItem("profile")!);
    const { company } = userProfile;
    const pageSize = 100;
    const isSingleItem = withFreebies || isReplacing;
    const [form] = Form.useForm()

    const productList = useRecoilValue(productState);
    const setProductList = useSetRecoilState(productState);

    const [products, setProducts] = useState<ProductEntity[]>([]);
    const [freebies, setFreebies] = useState<ProductEntity[]>([]);
    const [productCount, setProductCount] = useState(0);
    const [freebieCount, setFreebieCount] = useState(0);
    const [selectedProduct, setSelectedProd] = useState<ProductEntity[]>([]);
    const [selectedProductId, setSelectedProdId] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [productGroups, setProductGroups] = useState([]);
    const [productCategories, setProductCategories] = useState([]);
    const [productFreebieGroups, setProductFreebieGroups] = useState([]);
    const [showFreebie, setShowFreeie] = useState('false');
    const [filter, setFilter] = useState({
        productGroup: '',
        productCategory: '',
        searchText: '',
    })

    const resetPage = () => {
        setPage(1);
        setFilter({
            productGroup: '',
            productCategory: '',
            searchText: '',
        });
        form.resetFields();
    }

    useEffect(() => {
        fetchProduct();
    },[filter, showFreebie])

    useEffect(() => {
        setSelectedProdId(list.map((item) => item.productId));
    },[list])

    const fetchFreebieList = async () => {
        const { data, count } = await getProductFreebies({
            company,
            take: pageSize,
            productGroup: filter.productGroup,
            searchText: filter.searchText,
            page,
        });
        const newData = data.map((d: ProductEntity) => ({ ...d, key: d.productFreebiesId }))
        setFreebies(newData);
        setFreebieCount(count);
    }
    const fetchProductList = async () => {
        const { data, count } = await getProductList({
            company,
            take: pageSize,
            productGroup: filter.productGroup,
            searchText: filter.searchText,
            productCategoryId: filter.productCategory,
            page,
        });
        const newData = data.map((d: ProductEntity) => ({ ...d, key: d.productId }));
        setProducts(newData);
        setProductCount(count)
  
        setProductList((oldList: any) => ({ 
            page,
            pageSize,
            count,
            data,
            allData: oldList?.data?.length > 0 ? oldList.data.concat(data) : data
        }));
    }
    const fetchProduct = async () => {
        try {
            setLoading(true);
            await fetchProductList();
            await fetchFreebieList();
      
            if(!productGroups || !productGroups.length){
                const { responseData } = await getProductGroup(company);
                setProductGroups(responseData);
            }
            
            if(!productCategories || !productCategories.length){
                const categories = await getProductCategory(company);
                setProductCategories(categories);
            }

            if(!productFreebieGroups || !productFreebieGroups.length){
                const { responseData } = await getProductFreebieGroup(company);
                setProductFreebieGroups(responseData);
            }
          } catch (e) {
            console.log(e);
          } finally {
            setLoading(false);
          }
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
          title: `${showFreebie === 'true' ? freebieCount : productCount} สินค้า`,
          dataIndex: 'packSize',
          align: 'right' as AlignType,
        }
    ];

    const onRow = (record: ProductEntity) => ({
        onClick: () => {
            setSelectedProd([record]);
        }
    })

    const onSave = () => {
        if(isSingleItem){
            setList(selectedProduct[0]);
        } else {
            setList(products.filter((item) => selectedProductId.includes(item.productId)));
        }
        onClose();
    }

    const rowClassName = (r: ProductEntity) => {
        const isSelectedProduct = selectedProduct[0]?.productId && r.productId === selectedProduct[0]?.productId;
        const isSelectedFreebie = selectedProduct[0]?.productFreebiesId && r.productFreebiesId === selectedProduct[0]?.productFreebiesId;

        return isSingleItem && (isSelectedProduct || isSelectedFreebie) ? 'table-row-highlight table-row-clickable' : 'table-row-clickable';
    }

    const tabsItems = [
        { label: `สินค้าแบรนด์ตัวเอง`, key: 'false' },
        { label: `สินค้าอื่นๆ`, key: 'true' },
    ];

    return (
        <>
            <Form layout='vertical' form={form}>
                <Row gutter={8} align='bottom'>
                    <Col span={7}>
                        <Form.Item
                            label='Product Group'
                            name='productGroup'
                        >
                            <Select 
                                data={[{
                                    key: '', 
                                    value: '', 
                                    label: 'ทั้งหมด' 
                                }, ...(showFreebie === 'true' ? productFreebieGroups : productGroups).map((g: any) => ({ 
                                    key: g.product_group, 
                                    value: g.product_group, 
                                    label: g.product_group 
                                }))]}
                                onChange={(v) => setFilter({ ...filter, productGroup: v })}
                                value={filter.productGroup}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={showFreebie === 'true' ? 0 : 7}>
                        <Form.Item
                            label='Startegy Group'
                            name='productCategory'
                        >
                            <Select 
                                data={[{
                                        key: '', 
                                        value: '', 
                                        label: 'ทั้งหมด' 
                                    }, ...productCategories.map((g: any) => ({ 
                                        key: g.productCategoryId, 
                                        value: g.productCategoryId, 
                                        label: g.productCategoryName 
                                    }))
                                ]}
                                onChange={(v) => setFilter({ ...filter, productCategory: v })}
                                value={filter.productCategory}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={showFreebie === 'true' ? 14 : 7}>
                        <Form.Item
                            label='ค้นหาสินค้า'
                            name='searchText'
                        >
                            <Input 
                                suffix={<SearchOutlined/>}
                                placeholder={'ระบุชื่อสินค้า'}
                                onPressEnter={(e) => {
                                    const searchText = (e.target as HTMLTextAreaElement).value;
                                    setFilter({ ...filter, searchText })
                                }}
                                value={filter.searchText}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item
                            label=''
                            name='clear'
                        >
                            <Button
                                title="ล้างการค้นหา"
                                typeButton="primary-light"
                                onClick={() => {
                                    form.setFieldsValue({
                                        productGroup: '',
                                        productCategory: '',
                                        searchText: '',
                                    })
                                    setFilter({
                                        productGroup: '',
                                        productCategory: '',
                                        searchText: '',
                                    })
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            {withFreebies && (
                <Tabs
                    items={tabsItems}
                    onChange={(key: string) => {
                        setShowFreeie(key)
                        resetPage();
                    }}
                    defaultValue={showFreebie}
                />
            )}
            <TableContainer>
                <Table 
                    rowSelection={isSingleItem ? undefined : { type: 'checkbox', ...rowSelection }}
                    rowClassName={rowClassName}
                    onRow={onRow}
                    columns={columns}
                    dataSource={showFreebie === 'true' ? freebies : products}
                    pagination={false}
                    scroll={{ y: 360 }}
                    loading={loading}
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

const FreebieList = ({ form, productId, itemIndex }: FreebieListProps) => {
    const [showModal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!showModal);
    }

    const getValue = () => {
        // Format: {unit: 'ลัง', quantity: '10'}, { unit: 'ลัง'}
        return form.getFieldValue(`promotion-${productId}`)[itemIndex]?.freebies || [];
    }

    const onAdd = (product: ProductEntity) => {
        const promo = form.getFieldValue(`promotion-${productId}`);
        const list = getValue() || [];
        list.push({ ...product, product, quantity: 0 });
        promo[itemIndex] = { ...promo[itemIndex], freebies: list };
        form.setFieldValue(`promotion-${productId}`, promo);
        console.log('onAdd', product)
    }

    const onDelete = (i: number) => {
        const promo = form.getFieldValue(`promotion-${productId}`);
        const list = getValue() || [];
        list.splice(i,1);
        promo[itemIndex] = { ...promo[itemIndex], freebies: list };
        form.setFieldValue(`promotion-${productId}`, promo);
    }

    const onSetQuantity = (i: number, quantity: string) => {
        const promo = form.getFieldValue(`promotion-${productId}`);
        const list = getValue() || [];
        list[i] = { ...list[i], quantity: parseInt(quantity) }
        promo[itemIndex] = { ...promo[itemIndex], freebies: list };
        form.setFieldValue(`promotion-${productId}`, promo);
    }

    return (
        <>
            {getValue().map(({ product, quantity }:any, i:number) => 
                <Row key={i} gutter={12} align='middle'>
                    <Col>
                        <FlexCol align="center" style={{ width: 64, overflow: 'hidden' }}>
                            <Avatar 
                                src={product?.productImage || product?.productFreebiesImage} 
                                size={64} 
                                shape='square' 
                            />
                            <Tooltip title={product?.productName}>
                                <Text 
                                    level={6} 
                                    style={{
                                        display: 'block',
                                        width: 64, 
                                        height: 22,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        wordWrap: 'break-word',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {product?.productName}
                                </Text>
                            </Tooltip>
                        </FlexCol>
                    </Col>
                    <Col span={9}>
                        <Form.Item 
                            label='จำนวนของแถม' 
                            rules={[
                                {
                                    required: true,
                                    message: '*โปรดระบุจำนวนของแถม'
                                }
                            ]}
                            initialValue={quantity}
                        >
                            <Input 
                                type='number' 
                                placeholder="ระบุจำนวนของแถม"
                                onChange={(e) => onSetQuantity(i, e?.target?.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={9}>
                        <Form.Item label='หน่วย' initialValue={product?.saleUOM || product?.baseUnitOfMeaEn}>
                            <Input disabled value={product?.saleUOM || product?.baseUnitOfMeaEn}/>
                        </Form.Item>
                    </Col>
                    <Col>
                        <FlexCol align='center' justify='center' style={{ height: '100%', paddingBottom: 12 }}>
                            <CloseIconContainer>
                                <CloseOutlined 
                                    style={{ color: 'white' }}
                                    onClick={() => onDelete(i)}
                                />
                            </CloseIconContainer>
                    </FlexCol>
                    </Col>
                </Row>
            )}
            <AddProductContainer 
                style={{ background: 'white', color: color.primary, padding: '8px 24px' }}
                onClick={toggleModal}
            >
                +&nbsp;เพิ่มของแถม
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
                            <Text level={5} fontWeight={600}>เลือกของแถม</Text>
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
                    list={[]}
                    setList={onAdd}
                    onClose={toggleModal}
                    withFreebies
                />
            </Modal>
            
        </>
    )
}

export const PromotionCreateStep3 = ({ form, promotionType }: Props) => {

    const [items, setItems] = useState<ProductEntity[]>(form.getFieldValue('items') || []);
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
        console.log(list)
        setItems(list);
        form.setFieldValue('items', list);
        setActiveKeys(list.map((item) => item.productId))
        setItemPromo(list.map((item) => ({
            item,
            promo: [
                {
                    unit: item.packingUOM,
                    quantity: 1,
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
                        const currentKey = `promotion-${item.productId}`;
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
                                        <Col span={8} >
                                            <Text>จำนวน&nbsp;{form.getFieldValue(currentKey)?.length}&nbsp;ขั้นบันได</Text>
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
                                                <IconContainer >
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
                                <Form.List name={currentKey}>
                                    {(fields, { add, remove }) => {
                                        if(fields.length <=0){
                                            add();
                                        }
                                        return (
                                            <>
                                                {fields.map(({ key, name, ...restField }, i) => (
                                                    <>
                                                        <Row key={key} gutter={16} style={{ padding: '20px 16px' }}>
                                                            <Col span={8}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    label='จำนวนที่ซื้อครบ'
                                                                    name={[name, 'quantity']}
                                                                    rules={[{ required: true, message: 'โปรดระบุจำนวนที่ซื้อครบ' }]}
                                                                >
                                                                    <Input type='number' placeholder="ระบุจำนวนที่ซื้อครบ" />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={4}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    label='หน่วย'
                                                                    name={[name, 'saleUnit']}
                                                                    initialValue={item.saleUOM}
                                                                >
                                                                    <Input disabled />
                                                                </Form.Item>
                                                            </Col>
                                                            {promotionType === PromotionType.FREEBIES_NOT_MIX ?
                                                                (   <>
                                                                        <Col span={10} style={{ borderLeft: `1px solid ${color.background2}` }}>
                                                                            <Form.Item
                                                                                {...restField}
                                                                                noStyle
                                                                                name={[name, 'freebies']}
                                                                            >
                                                                                <FreebieList form={form} productId={item.productId} itemIndex={i}/>
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col span={2}>
                                                                            {i > 0 && (
                                                                                <FlexRow align='center' justify='end' style={{ height: '100%', padding: '0px 18px' }}>
                                                                                    <FlexCol  
                                                                                        align="center"
                                                                                        justify="center"
                                                                                        style={{ height: '100%', width: 32, background: color.background1, borderRadius: 4, padding: 8, cursor: 'pointer' }}
                                                                                        onClick={() => remove(name)} 
                                                                                    >
                                                                                        <DeleteOutlined 
                                                                                            style={{ fontSize: 18, color: color.secondary }}
                                                                                        />
                                                                                    </FlexCol>
                                                                                </FlexRow>
                                                                            )}
                                                                        </Col>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Col span={6}>
                                                                            <Form.Item
                                                                                {...restField}
                                                                                label='ราคาที่ต้องการลด'
                                                                                name={[name, 'discountPrice']}
                                                                                rules={[{ required: true, message: 'โปรดระบุราคาที่ต้องการลด' }]}
                                                                            >
                                                                                <Input 
                                                                                    placeholder="ระบุราคา" 
                                                                                    suffix='บาท'
                                                                                    type='number'
                                                                                />
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col span={4}>
                                                                            <Form.Item
                                                                                {...restField}
                                                                                label='ต่อหน่วย SKU'
                                                                                name={[name, 'saleUnitDiscount']}
                                                                                initialValue={item.saleUOM}
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
                                                                    </>
                                                                )
                                                            }
                                                        </Row>
                                                        {promotionType === PromotionType.FREEBIES_NOT_MIX && <Divider/>}
                                                    </>
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
                    setList={isReplacing ? (
                            (p: ProductEntity) => {
                                setProd(items.map((item: ProductEntity) => 
                                    item.productId === isReplacing ? p : item
                                ))
                            } 
                        ): (
                            setProd
                        )
                    }
                    onClose={toggleModal}
                    isReplacing={isReplacing}
                />
            </Modal>
        </>
    )

}