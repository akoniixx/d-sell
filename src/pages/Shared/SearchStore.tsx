import { Col, Divider, Form, Modal, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import Text from "../../components/Text/Text";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { StoreEntity, ZoneEntity } from "../../entities/StoreEntity";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Transfer from "../../components/Transfer/Transfer";
import type { TransferDirection } from "antd/es/transfer";
import { getCustomers, getZones } from "../../datasource/CustomerDatasource";
import { arrayToSet, objArrayToObjArrayWithKey, setToArray } from "../../utility/converter";

interface SearchProps {
  list: StoreEntity[];
  setList: any;
  onClose: any;
  zones: ZoneEntity[];
}

export const SearchStore = ({ list, setList, onClose, zones }: SearchProps) => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const [form] = Form.useForm();

  const defaultFilter = {
    zone: "",
    searchText: "",
  };
  const [filter, setFilter] = useState(defaultFilter);
  const [filterSelection, setFilterSelection] = useState(defaultFilter);

  const [data, setData] = useState<StoreEntity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectionData, setSelectionData] = useState<StoreEntity[]>([]);

  const [filteredData, setFilteredData] = useState<StoreEntity[]>([]);
  const [filteredSelection, setFilteredSelection] = useState<StoreEntity[]>([]);

  const [selectedTargetKeys, setSelectedTargetKeys] = useState<Set<string>>(
    [] as unknown as Set<string>,
  );
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    onFilterAll();
    // fetchData();
  }, [filter]);

  useEffect(() => {
    onFilterSelected();
  }, [filterSelection]);

  const applyFilter = (
    source: StoreEntity[],
    onSetData: any,
    zone: string,
    searchText: string,
    oldKeys?: string[],
    setKey?: any,
  ) => {
    const nextData = source.filter((s: StoreEntity) => {
      if (zone && s.zone !== zone) return false;
      if (searchText && !s.customerName.includes(searchText)) return false;
      return true;
    });
    onSetData(nextData);
    if (setKey && oldKeys) {
      const nextKeys = setToArray(arrayToSet(nextData.map((s) => s.customerCompanyId)));
      setKey(nextData.map((s) => s.customerCompanyId));
    }
  };

  const onFilterAll = () => {
    console.log("onFilterAll");
    applyFilter(data, setFilteredData, filter.zone, filter.searchText);
  };

  const onFilterSelected = () => {
    console.log("onFilterSelected");
    applyFilter(
      selectionData,
      setFilteredSelection,
      filterSelection.zone,
      filterSelection.searchText,
      targetKeys,
      setTargetKeys,
    );
  };

  const fetchData = async () => {
    console.log("fetchData");
    try {
      setLoading(true);
      const { count_total, data } = await getCustomers({
        // ...filter,
        company,
      });
      const dataWithKey = data?.map((d: StoreEntity, i: number) => ({
        ...d,
        key: d.customerCompanyId,
      }));
      setData(dataWithKey);
      setFilteredData(dataWithKey);
      setTotal(count_total || 0);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onClearTarget = () => {
    if (targetKeys.length)
      Modal.confirm({
        title: "ลบร้านค้าที่เลือกทั้งหมด",
        okText: "ยืนยัน",
        onOk: () => {
          setSelectionData([]);
          setFilteredSelection([]);
          setSelectedTargetKeys(new Set<string>());
          setTargetKeys([]);
        },
      });
  };

  const titles = [
    <Row align='middle' justify='space-between' key={0}>
      <Text fontWeight={700} color='white'>
        ร้านค้าทั้งหมด
      </Text>
      <Text level={6} color='white'>
        {filteredData.length - targetKeys.length}/{total}&nbsp;ร้านค้า
      </Text>
    </Row>,
    <Row align='middle' justify='space-between' key={1}>
      <Text fontWeight={700} color='white'>
        ร้านค้าที่เลือก
      </Text>
      <div>
        <Text level={6} color='white'>
          {targetKeys.length}/{selectedTargetKeys.size || 0}&nbsp;ร้านค้า
        </Text>
        <Divider type='vertical' style={{ borderColor: "white" }} />
        <Text
          level={6}
          color='white'
          style={{ cursor: targetKeys.length ? "pointer" : "default" }}
          onClick={onClearTarget}
        >
          <DeleteOutlined />
          &nbsp;ลบทั้งหมด
        </Text>
      </div>
    </Row>,
  ];

  const renderItem = (item: any) => {
    return (
      <FlexCol style={{ padding: "4px 8px" }}>
        <Text level={6}>{item.customerName}</Text>
        <Text level={6} color='Text3'>
          {item.zone}
        </Text>
      </FlexCol>
    );
  };

  const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    console.log("targetKeys:", nextTargetKeys);
    console.log("direction:", direction);
    console.log("moveKeys:", moveKeys);
    if (direction === "left") {
      // data <- selected = remove
      const newSelectedTargetKeys = new Set(selectedTargetKeys);
      moveKeys.forEach((key) => newSelectedTargetKeys.delete(key));
      setSelectedTargetKeys(newSelectedTargetKeys);

      const newSelection = selectionData.filter((e: any) => !moveKeys.includes(e.key));
      setSelectionData(newSelection);
    } else {
      // direction === 'right'
      // data -> selected = add
      const newSelectedTargetKeys = new Set(selectedTargetKeys);
      moveKeys.forEach((key) => newSelectedTargetKeys.add(key));
      setSelectedTargetKeys(newSelectedTargetKeys);

      const newSelection = [...selectionData];
      moveKeys.forEach((key) => {
        const newData = data.find((d: any) => d.key === key);
        if (newData) newSelection.push(newData);
      });
      setSelectionData(newSelection);
    }
    setTargetKeys(nextTargetKeys);
    setFilterSelection(filterSelection);
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onSave = () => {
    setList([...list, ...data.filter((item) => targetKeys.includes(item.customerCompanyId))]);

    // clear state
    setFilter(defaultFilter);
    setFilterSelection(defaultFilter);
    setFilteredData(data);
    setFilteredSelection([]);
    setTargetKeys([]);
    setSelectedKeys([]);

    onClose();
  };

  const FilterGroup = ({
    filter,
    setFilter,
    keyname,
  }: {
    filter: any;
    setFilter: any;
    keyname: string;
  }) => {
    const zoneKeyNeme = keyname + "-zone";
    const keywordKeyName = keyname + "-keyword";
    const onClear = () => {
      setFilter(defaultFilter);
      form.setFieldValue(zoneKeyNeme, "");
      form.setFieldValue(keywordKeyName, "");
    };
    return (
      <Row gutter={8} align='bottom'>
        <Col span={8}>
          <Form.Item label='รายเขต' name={zoneKeyNeme}>
            <Select
              data={[
                { label: "ทั้งหมด", key: "" },
                ...zones.map((z) => ({ label: z.zoneName, key: z.zoneName })),
              ]}
              onChange={(val) => setFilter({ ...filter, zone: val })}
              value={filter.zone}
            />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item label='ค้นหาร้านค้า' name={keywordKeyName}>
            <Input
              suffix={<SearchOutlined />}
              placeholder={"ระบุชื่อร้านค้า"}
              onPressEnter={(e) => {
                const value = (e.target as HTMLTextAreaElement).value;
                setFilter({
                  ...filter,
                  searchText: value,
                });
              }}
              onChange={(e) => {
                const value = (e.target as HTMLInputElement).value;
                if (!value) {
                  setFilter({
                    ...filter,
                    searchText: "",
                  });
                }
              }}
              value={filter.searchText}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label='' name='clear'>
            <Button title='ล้างการค้นหา' typeButton='primary-light' onClick={onClear} />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  const getDataSource = () => {
    // filteredData + targetData - dupplicate
    const allData = [
      ...filteredData,
      ...filteredSelection.filter(
        (s: any) =>
          !filteredData.find((d: any) => d.key === s.key) &&
          targetKeys.find((t: string) => t === s.key),
      ),
    ];

    return allData;
  };

  return (
    <>
      <Divider style={{ margin: "0px 0px 16px" }} />
      <Form layout='vertical' form={form}>
        <Row gutter={52}>
          <Col span={12}>
            <FilterGroup filter={filter} setFilter={setFilter} keyname='search' />
          </Col>
          <Col span={12}>
            <FilterGroup
              filter={filterSelection}
              setFilter={setFilterSelection}
              keyname='selected'
            />
          </Col>
        </Row>
      </Form>
      {loading ? (
        <FlexRow align='center' justify='center' style={{ width: "100%", minHeight: 300 }}>
          <Spin size='large' />
        </FlexRow>
      ) : (
        <Transfer
          dataSource={getDataSource()}
          titles={titles}
          render={renderItem}
          listStyle={{ height: 300 }}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
        />
      )}
      <Divider style={{ margin: "12px 0px" }} />
      <Row justify='end'>
        <Button title='บันทึก' style={{ width: 136 }} onClick={onSave} />
      </Row>
    </>
  );
};
