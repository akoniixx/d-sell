import React, { useState, useRef, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Card, Form, Divider, Table as AntdTable } from "antd";
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

const mockData = [
  {
    key: "1",
    name: "one",
  },
  {
    key: "2",
    name: "two",
  },
  {
    key: "3",
    name: "three",
  },
  {
    key: "4",
    name: "four",
  },
  {
    key: "5",
    name: "five",
  },
];

const IndexBox = styled.div`
  width: 56px;
  height: 57px;
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

export const PinedNews: React.FC = (props: any) => {
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState<any>([]);
  const [uploading, setUploading] = useState(false);

  useEffectOnce(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setDataState(mockData);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const PageTitle = () => {
    return <PageTitleNested title={"รายการปักหมุดข่าวสาร"} showBack={false} />;
  };

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
            <Input value={value} style={{ width: "calc(100% - 32px)" }} />
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
            <MinusCircleOutlined style={{ color: color.error }} />
          </Row>
        );
      },
    },
  ];

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataState((previous: any) => {
        const activeIndex = previous.findIndex((i: any) => i.key === active.id);
        const overIndex = previous.findIndex((i: any) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
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
          <br />
          <br />
          <Text level={5} fontWeight={700}>
            หน้าหลักในแอปพลิเคชัน
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
              {Array.from({ length: 5 }, (v, i) => i + 1).map((i) => {
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
                  items={dataState.map((i: any) => i.key)}
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
                    dataSource={dataState}
                    pagination={false}
                    showHeader={false}
                  />
                </SortableContext>
              </DndContext>
            </Col>
          </Row>

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
