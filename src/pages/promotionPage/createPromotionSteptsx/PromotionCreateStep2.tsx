import { Col, DatePicker, Divider, Form, FormInstance, Modal, Row, Table, TimePicker, Upload } from "antd";
import React, { useEffect, useState, memo, useMemo } from "react";
import { FlexCol, FlexRow } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import styled from "styled-components";
import color from "../../../resource/color";
import { CloseOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { StoreEntity } from "../../../entities/StoreEntity";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import Transfer from "../../../components/Transfer/Transfer";
import type { TransferDirection } from 'antd/es/transfer';
import { AlignType } from "rc-table/lib/interface";
import TableContainer from "../../../components/Table/TableContainer";

interface SearchProps  {
    list: Array<StoreEntity>;
    setList: any;
    onClose: any;
}

interface Step2Props  {
    form: FormInstance;
    showError?: boolean;
    setError?: any;
}

const SearchStore = ({ list, setList, onClose }: SearchProps) => {

    const [data, setData] = useState<StoreEntity[]>([]);
    const [total, setTotal] = useState(0);
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        const mockData = Array.from({ length: 20 }).map((_, i) => ({
            key: i.toString(),
            storeId: i.toString(),
            storeName: `ชื่อร้านค้า ${i + 1}`,
            zone: `A01`,
        }));
        setData(mockData);
        setTotal(20);
    }

    const onClearTarget = () => {
        setTargetKeys([]);
    }

    const titles = [
        <Row align='middle' justify='space-between' key={0}>
            <Text fontWeight={700} color='white'>
                ร้านค้าทั้งหมด
            </Text>
            <Text level={6}  color='white'>
                {total - targetKeys.length}&nbsp;ร้านค้า
            </Text>
        </Row>, 
        <Row align='middle' justify='space-between' key={1}>
            <Text fontWeight={700} color='white'>
                ร้านค้าที่เลือก
            </Text>
            <div>
                <Text level={6}  color='white'>
                    {targetKeys.length}&nbsp;ร้านค้า
                </Text>
                <Divider type="vertical" style={{ borderColor: 'white'}}/>
                <Text 
                    level={6}  
                    color='white' 
                    style={{ cursor: 'pointer' }}
                    onClick={onClearTarget}
                >
                    <DeleteOutlined/>&nbsp;ลบทั้งหมด
                </Text>
            </div>
        </Row>,
    ]

    const renderItem = (item: any) => {
        return (
            <FlexCol style={{ padding: '4px 8px' }}>
                <Text level={6}>{item.storeName}</Text>
                <Text level={6} color="Text3">{item.zone}</Text>
            </FlexCol>
        )
    }

    const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
        console.log('targetKeys:', nextTargetKeys);
        console.log('direction:', direction);
        console.log('moveKeys:', moveKeys);
        setTargetKeys(nextTargetKeys);
      };
    
    const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        console.log('sourceSelectedKeys:', sourceSelectedKeys);
        console.log('targetSelectedKeys:', targetSelectedKeys);
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const onSave = () => {
        setList(data.filter((item) => targetKeys.includes(item.storeId)))
        onClose();
    }

    return (
        <>
            <Form layout='vertical'>
                <Row gutter={8} align='bottom'>
                    <Col span={10}>
                        <Form.Item
                            label='รายเขต'
                            name='zone'
                        >
                            <Select data={[]}/>
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item
                            label='ค้นหาร้านค้า'
                            name='keyword'
                        >
                            <Input 
                                suffix={<SearchOutlined/>}
                                placeholder={'ระบุชื่อร้านค้า'}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
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
            <Divider style={{ margin: '0px 0px 16px' }} />
            <Transfer
                dataSource={data}
                titles={titles}
                render={renderItem}
                listStyle={{ height: 300 }}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={onChange}
                onSelectChange={onSelectChange}
            />
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

export const PromotionCreateStep2 = ({ form, showError, setError }: Step2Props) => {

    const defaultFilter = {
        zone: null,
        keyword: null
    }
    const [filter, setFilter] = useState(defaultFilter);
    const [showSearch, setSearch] = useState(false);
    const [storeList, setStoreList] = useState<StoreEntity[]>(form.getFieldValue('stores'));
    const [selectedStoreList, setSelectedStoreList] = useState<Array<StoreEntity>>([]);
    
    const onSetStore = (stores: any) => {
        setStoreList(stores)
        form.setFieldsValue({
            ...form.getFieldsValue(),
            stores
        })
    }

    const toggleSearchWindow = () => {
        setSearch(!showSearch)
    }

    const columns = [
        {
          title: 'ชื่อร้านค้า',
          dataIndex: 'storeName',
          align: 'center' as AlignType,
          render: (text: string) => <a>{text}</a>,
        },
        {
          title: 'เขตการขาย',
          dataIndex: 'zone',
          align: 'center' as AlignType,
        }
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: StoreEntity[]) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedStoreList(selectedRows)
        },
        getCheckboxProps: (record: StoreEntity) => ({
            name: record.storeName,
        }),
    };

    return (
        <>
            <Row align='middle'>
                <Text level={5} fontWeight={700}>
                    รายละเอียดเขต และร้านค้า&nbsp;&nbsp;
                </Text>
                {showError && (
                    <Text level={6} color='error'>
                        &nbsp;โปรดระบุรายละเอียดเขต และร้านค้า*
                    </Text>
                )}
            </Row>
            <br/><br/>
            <Row>
                <Col span={14}>
                    <Row gutter={8}>
                        <Col span={10}>
                            <Select 
                                style={{ width: '100%' }}
                                data={[]}
                            />
                        </Col>
                        <Col span={10}>
                            <Input 
                                suffix={<SearchOutlined/>}
                                placeholder={'ระบุชื่อร้านค้า'}
                            />
                        </Col>
                        <Col span={4}>
                            <Button
                                title="ล้างการค้นหา"
                                typeButton="primary-light"
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={10}>
                    <Row align='middle' justify='end' gutter={22}>
                        <Col span={4}>
                            {selectedStoreList.length > 0 && (
                                <FlexRow align="center" justify="end" style={{ height: '100%' }}>
                                    <DeleteOutlined 
                                        style={{ fontSize: 20 }} 
                                        onClick={() => onSetStore(
                                            storeList.filter((s) => (
                                                !selectedStoreList.find((s2) => (
                                                    s.storeId === s2.storeId
                                                ))
                                            )))
                                        }
                                    />
                                </FlexRow>
                            )}
                        </Col>
                        <Col 
                            span={8} 
                            style={{ 
                                borderLeft: `1px solid ${color['background2']}`,
                                paddingLeft: 16
                            }}
                        >
                            <Button
                                title="+ เพิ่มร้านค้า"
                                typeButton="primary"
                                onClick={toggleSearchWindow}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <br/>
            <TableContainer>
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={storeList}
                    pagination={false}
            />
            </TableContainer>
            <Modal
                open={showSearch}
                footer={null}
                closable={false}
                width={'80vw'}
            >
                <Row align='middle' justify='space-between'>
                    <Col span={20}>
                        <FlexRow align='end'>
                            <Text level={5} fontWeight={600}>เลือกร้านค้า</Text>
                            <Text level={6} color='Text3'>&nbsp;&nbsp;สามารถเลือกได้มากกว่า 1 ร้านค้า</Text>
                        </FlexRow>
                    </Col>
                    <Col span={4}>
                        <FlexRow justify='end'>
                            <CloseOutlined onClick={toggleSearchWindow}/>
                        </FlexRow>
                    </Col>
                </Row>
                <br/>
                <SearchStore 
                    list={storeList} 
                    setList={onSetStore}
                    onClose={toggleSearchWindow}
                />
            </Modal>
        </>
    )

}