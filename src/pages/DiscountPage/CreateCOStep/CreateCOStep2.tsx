import { Col, DatePicker, Divider, Form, FormInstance, Modal, Row, Spin, Table, TimePicker, Upload } from "antd";
import React, { useEffect, useState, memo, useMemo } from "react";
import { FlexCol, FlexRow } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import styled from "styled-components";
import color from "../../../resource/color";
import { CloseOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { StoreEntity, ZoneEntity } from "../../../entities/StoreEntity";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import Transfer from "../../../components/Transfer/Transfer";
import type { TransferDirection } from 'antd/es/transfer';
import { AlignType } from "rc-table/lib/interface";
import TableContainer from "../../../components/Table/TableContainer";
import { getCustomers, getZones } from "../../../datasource/CustomerDatasource";

interface SearchProps  {
    list: StoreEntity[];
    setList: any;
    onClose: any;
    zones: ZoneEntity[];
}

interface Step2Props  {
    form: FormInstance;
    showError?: boolean;
    setError?: any;
}

const SearchStore = ({ list, setList, onClose, zones }: SearchProps) => {
    const userProfile = JSON.parse(localStorage.getItem("profile")!);
    const { company } = userProfile;

    const [data, setData] = useState<StoreEntity[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [filter, setFilter] = useState({
        zone: '',
        searchText: ''
    })

    useEffect(() => {
        fetchData();
    }, [filter])

    const fetchData = async () => {
        console.log('fetchData')
        try {
            setLoading(true);
            const { count_total, data } = await getCustomers({
                ...filter,
                company,
            })
            setData(data?.map((d: StoreEntity, i: number) => ({...d, key: d.customerCompanyId })));
            setTotal(count_total || 0);
        }catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
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
                <Text level={6}>{item.customerName}</Text>
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
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const onSave = () => {
        setList(data.filter((item) => targetKeys.includes(item.customerCompanyId)))
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
                            <Select 
                                data={[
                                    { label: 'ทั้งหมด', key: '' }, 
                                    ...zones.map((z) => ({ label: z.zoneName, key: z.zoneName }))
                                ]}
                                onChange={(val) => setFilter({ ...filter, zone: val })}
                                value={filter.zone}
                            />
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
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    setFilter({
                                        ...filter,
                                        searchText: e.target.value
                                    })
                                }}
                                value={filter.searchText}
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
                                onClick={() => setFilter({
                                    zone: '',
                                    searchText: ''
                                })}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Divider style={{ margin: '0px 0px 16px' }} />
            {
                loading ?  (
                    <FlexRow 
                        align='center'
                        justify='center'
                        style={{ width: '100%', minHeight: 300 }}
                    >
                        <Spin size='large'/>
                    </FlexRow>
                ) : (
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
                )
            }
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
    const userProfile = JSON.parse(localStorage.getItem("profile")!);
    const { company } = userProfile;

    const defaultFilter = {
        zone: '',
        keyword: ''
    }
    const [filter, setFilter] = useState(defaultFilter);
    const [showSearch, setSearch] = useState(false);
    const [storeList, setStoreList] = useState<StoreEntity[]>(form.getFieldValue('stores'));
    const [storeListFiltered, setStoreListFiltered] = useState<StoreEntity[]>(form.getFieldValue('stores'));
    const [selectedStoreList, setSelectedStoreList] = useState<StoreEntity[]>([]);
    const [zones, setZones] = useState<ZoneEntity[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchZones();
    }, [])

    const fetchZones = async () => {
        try {
            setLoading(true);
            const data = await getZones(company);
            setZones(data.map((d: StoreEntity, i: number) => ({...d, key: d.customerCompanyId })));
        }catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }
    
    const onSetStore = (stores: any) => {
        setStoreList(stores);
        setStoreListFiltered(stores);
        setFilter(defaultFilter);
        form.setFieldsValue({
            ...form.getFieldsValue(),
            stores
        });
        setError(false)
    }

    const toggleSearchWindow = () => {
        setSearch(!showSearch)
    }

    const columns = [
        {
            title: 'ชื่อร้านค้า',
            dataIndex: 'customerName',
            align: 'center' as AlignType,
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: 'เขตการขาย',
            dataIndex: 'zone',
            align: 'center' as AlignType,
            width: '25%'
        },
        {
            title: 'ส่วนลดดูแลราคา',
            dataIndex: 'zone',
            align: 'center' as AlignType,
            width: '25%',
            render: () => <Input style={{ width: '100%' }}/>
        }
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: StoreEntity[]) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedStoreList(selectedRows)
        },
        getCheckboxProps: (record: StoreEntity) => ({
            name: record.customerName,
        }),
    };

    const onFilter = ({ zone, keyword }: any) => {
        setFilter({ zone, keyword });
        setStoreListFiltered(
            storeList.filter((store) => {
                const isInZone = !zone || store.zone === zone;
                const hasKeyword = !keyword || store.customerName.includes(keyword)
                return isInZone && hasKeyword;
            })
        )
    }

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
                                data={[
                                    { label: 'ทั้งหมด', key: '' }, 
                                    ...zones.map((z) => ({ label: z.zoneName, key: z.zoneName }))
                                ]}
                                onChange={(val) => onFilter({ ...filter, zone: val })}
                                value={filter.zone}
                            />
                        </Col>
                        <Col span={10}>
                            <Input 
                                suffix={<SearchOutlined/>}
                                placeholder={'ระบุชื่อร้านค้า'}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    onFilter({
                                        ...filter,
                                        keyword: e.target.value
                                    })
                                }}
                                value={filter.keyword}
                            />
                        </Col>
                        <Col span={4}>
                            <Button
                                title="ล้างการค้นหา"
                                typeButton="primary-light"
                                onClick={() => onFilter(defaultFilter)}
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
                                                    s.customerCompanyId === s2.customerCompanyId
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
                    dataSource={storeListFiltered?.map((s, i) => ({ ...s, key: i }))}
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
                    zones={zones}
                />
            </Modal>
        </>
    )

}