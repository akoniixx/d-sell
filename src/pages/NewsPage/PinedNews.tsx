import React, { useState, useRef, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Card, Form, Divider, Table as AntdTable, Modal } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { useEffectOnce } from "react-use";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import styled from "styled-components";
import Text from "../../components/Text/Text";
// import type { DragEndEvent } from "@dnd-kit/core";
import { type DragEndEvent, DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ColumnsType } from "antd/es/table";
import { MenuOutlined, MinusCircleOutlined, PushpinFilled } from "@ant-design/icons";
import color from "../../resource/color";
import Input from "../../components/Input/Input";
import { FlexRow } from "../../components/Container/Container";
import AutoComplete from "../../components/AutoComplete/AutoComplete";

const mockNews: any = [
  "ข่าวที่หนึ่งจ้า",
  "ข่าวที่สองจ้า",
  "ข่าวอะไรไม่รู้",
  "พี่แบงค์เหงามาก ขับรถไปกวนคนอื่นไปทั่ว",
  "วันนี้มีไก่สิบตัว",
  "ข่าวด่วน พี่ไหมโมโหหิวกินดาร์ทเข้าไปทั้งตัว",
  "แมวเป้า ข่าวจ้าข่าว",
  "ทำความรู้จัก “วูช” รถไฟหัวกระสุนแรกของอินโดนีเซีย",
  "สองผู้คิดค้นวัคซีนเอ็มอาร์เอ็นเอ คว้ารางวัลโนเบลสาขาการแพทย์ 2023",
  "น้ำซัด สะพานวังแขม กำแพงเพชร ทรุดตัว",
  "ราคาทองคำทางด้านเทคนิคยังเป็นขาลง หลังราคายังลดลงทำจุดต่ำสุดใหม่อย่างต่อเนื่อง",
  "ณัฐพงษ์ เรืองปัญญาวุฒิ สส. บัญชีรายชื่อ แถลงข่าว Policy Watch จับตานโยบายด้านดิจิทัล",
  "ปธน.ไบเดน ลงนามรับรองกฎหมายงบชั่วคราว-ช่วยรัฐบาลเลี่ยงปิดทำการ",
  "จังหวัดปราจีนบุรี ร่วมกับเทศบาลเมืองปราจีนบุรี ติดตั้งธงสีเหลืองแจ้งเตือนระดับน้ำท่วม",
  "สุโขทัย อ่วมพนังกั้นน้ำยมแตกหลายจุดทะลักชุมชนในเขตเมือง เตรียมรับมวลน้ำอีกระลอก",
];
const mockData = [
  {
    key: "1",
    name: mockNews[0],
  },
  {
    key: "2",
    name: mockNews[1],
  },
  // {
  //   key: "3",
  //   name: "three",
  // },
  // {
  //   key: "4",
  //   name: "four",
  // },
  // {
  //   key: "5",
  //   name: "five",
  // },
];

const boxHeight = 57;

const IndexBox = styled.div`
  width: 56px;
  height: ${boxHeight}px;
  margin-top: 12px;

  border-radius: 4px;
  background: #6b7995;

  color: #f3f6f9;
  font-family: Helvetica;
  font-size: 24px;
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const AddBox = styled.div`
  width: 100%;
  height: ${boxHeight}px;

  border-radius: 4px;
  border: 1px dashed ${color.primary};
  background: white;

  color: ${color.primary};
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

const EmptyBox = styled.div`
  width: 100%;
  height: ${boxHeight}px;
  margin-top: 12px;

  border-radius: 4px;
  background: rgba(239, 242, 249, 0.4);

  color: ${color.Text3};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Table = styled(AntdTable)`
  .ant-table table {
    border-spacing: 0 12px;
  }
  .ant-table-cell {
    background: ${color.background1} !important;
    padding: 8px 16px !important;

    :last-child {
      border-radius: 0 4px 4px 0;
    }
    :first-child {
      border-radius: 4px 0 0 4px;
    }
  }
`;

const TableRow = ({ children, ...props }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === "sort") {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: "none", cursor: "move" }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

const TemplateArray = Array.from({ length: 5 }, (v, i) => i + 1);

export const PinedNews: React.FC = (props: any) => {
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [mainList, setMainList] = useState<any>([]);
  const [allList, setAllList] = useState<any>([]);
  const [uploading, setUploading] = useState(false);

  useEffectOnce(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setMainList(mockData);
      setAllList(mockData);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const PageTitle = () => {
    return <PageTitleNested title={"รายการปักหมุดข่าวสาร"} showBack={false} />;
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setMainList((previous: any) => {
        const activeIndex = previous.findIndex((i: any) => i.key === active.id);
        const overIndex = previous.findIndex((i: any) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  const Group = ({
    title,
    dataSource,
    setDataSource,
  }: {
    title: string;
    dataSource: any;
    setDataSource: (any: any) => void;
  }) => {
    const columns: ColumnsType<any> = [
      {
        key: "sort",
        width: 50,
      },
      {
        title: "ข่าวสารที่เลือก",
        dataIndex: "name",
        render: (value, record, index) => {
          return (
            <FlexRow align='center' justify='space-between'>
              <PushpinFilled style={{ color: "#F2C94C", fontSize: 20 }} />
              <AutoComplete
                defaultValue={value}
                style={{ width: "calc(100% - 32px)" }}
                options={mockNews
                  .filter((e: string) => !dataSource.find((s: any) => s.name === e))
                  .map((e: string) => ({ value: e }))}
                onSelect={(val: any) => {
                  const newData = [...dataSource];
                  newData[index] = {
                    ...dataSource[index],
                    name: val,
                  };
                  setDataSource(newData);
                }}
              />
            </FlexRow>
          );
        },
      },
      {
        title: "",
        width: 50,
        render: (value, record, index) => {
          return (
            <Row justify='end'>
              <MinusCircleOutlined
                style={{ color: color.error }}
                onClick={() => {
                  Modal.confirm({
                    title: "ต้องการยืนยันการลบหมุดข่าวสาร",
                    content:
                      "โปรดตรวจสอบหมุดข่าวสารที่คุณต้องการลบ ก่อนกดยืนยัน เพราะอาจส่งผลต่อการทำงานของผู้ดูแลระบบ",
                    onOk: () => {
                      setDataSource(dataSource.filter((v: any, i: number) => i !== index));
                    },
                  });
                }}
              />
            </Row>
          );
        },
      },
    ];

    const onAdd = () => {
      setDataSource([...dataSource, { key: `${dataSource.length + 1}` }]);
    };

    return (
      <>
        <br />
        <br />
        <Text level={5} fontWeight={700}>
          {title}
        </Text>
        <br />
        <br />
        <Row gutter={16}>
          <Col style={{ width: 72 }}>
            <Row justify='center'>
              <Text level={6} fontWeight={700} style={{ color: "#6B7995" }}>
                ลำดับ
              </Text>
            </Row>
            {TemplateArray.map((i) => {
              return <IndexBox key={i}>{i}</IndexBox>;
            })}
          </Col>
          <Col style={{ width: "calc(100% - 72px)" }}>
            <Row style={{ padding: "0px 10px" }}>
              <Text level={6} fontWeight={700} style={{ color: "#6B7995" }}>
                ข่าวสารที่เลือก
              </Text>
            </Row>
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
              <SortableContext
                // rowKey array
                items={dataSource.map((i: any) => i.key)}
                strategy={verticalListSortingStrategy}
              >
                <Table
                  components={{
                    body: {
                      row: TableRow,
                    },
                  }}
                  rowKey='key'
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                  showHeader={false}
                />
              </SortableContext>
            </DndContext>
            {TemplateArray.map((v, i) => {
              return dataSource[i] ? (
                <></>
              ) : i === dataSource.length ? (
                <AddBox onClick={onAdd}>+ เพิ่มปักหมุดข่าวสาร</AddBox>
              ) : (
                <EmptyBox>ไม่มีปักหมุดข่าวสาร</EmptyBox>
              );
            })}
          </Col>
        </Row>
      </>
    );
  };

  return loading ? (
    <div className='container '>
      <Card loading />
    </div>
  ) : (
    <Row justify={"space-between"} gutter={8}>
      <Col span={24}>
        <CardContainer>
          <PageTitle />
          <Group
            title={"หน้าหลักในแอปพลิเคชัน"}
            dataSource={mainList}
            setDataSource={setMainList}
          />
          <Group
            title={"หน้าข่าวสารทั้งหมดในแอปพลิเคชัน"}
            dataSource={allList}
            setDataSource={setAllList}
          />
          <Divider />
          <Row align='middle' justify='end'>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              style={{ width: 136 }}
              loading={uploading}
            >
              บันทึก
            </Button>
          </Row>
        </CardContainer>
      </Col>
    </Row>
  );
};
