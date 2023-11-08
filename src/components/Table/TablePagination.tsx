/* eslint-disable @typescript-eslint/no-explicit-any */

import { Skeleton, Table, TablePaginationConfig } from "antd";
import { TableLocale } from "antd/lib/table/interface";
import styled, { css } from "styled-components";
import { icon } from "../../resource";
import color from "../../resource/color";
import image from "../../resource/image";
import Text from "../Text/Text";

const AntTable = styled(Table)`
  .ant-table table {
    border-collapse: separete;
  }
  .ant-pagination-item {
    border: 0px;
  }
  .ant-pagination-prev {
    margin-right: 0px;
  }
  .ant-pagination-next {
    margin-left: 0px;
  }
  .ant-pagination-item {
    margin-right: 0px;
  }
  .ant-table-thead > tr:first-child > th:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .ant-table-thead > tr:first-child > th:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not(
      [colspan]
    )::before {
    display: none;
  }
  .ant-table-cell {
    font-family: "IBM Plex Sans Thai", sans-serif;
    font-weight: 700 !important;
    font-size: 16px;
    color: ${color.Text1};
  }
  && tbody > tr:hover > td {
    border-radius: 4px;
  }

  .ant-table-thead > tr > th {
    background-color: ${color.background1};
    border-bottom: 0px;

    padding: 12px 16px;
  }
  .ant-table-expanded-row-fixed {
    font-weight: 400 !important;
  }
`;
const ContainerIcon = styled.div<{ left?: boolean; right?: boolean }>`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;

  ${({ left }) => {
    if (left) {
      return css`
        border-radius: 6px 0px 0px 6px;
      `;
    }
    return css`
      border-radius: 0px 6px 6px 0px;
    `;
  }}

  border: 1px solid ${color.border};
`;
const Image = styled.img`
  width: 24px;
  height: 24px;
`;

const ButtonJump = styled.div`
  width: 42px !important;
  height: 42px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
`;
const PageButton = styled.div<{ focus: boolean }>`
  width: 42px !important;
  height: 42px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border: 1px solid #d9d9d9 !important;
  background-color: white;
  font-family: Helvetica;
  font-weight: 400 !important;
  font-size: 18px;
  :hover {
    transition: all 0.3s ease-in-out;
    color: ${color.primary} !important;
    border: 1px solid ${color.primary} !important;
  }

  ${({ focus }) => {
    if (focus) {
      return css`
        color: ${color.primary} !important;
      `;
    }
    return css``;
  }}
`;

interface Props {
  columns: {
    title?: JSX.Element | string;
    dataIndex?: string;
    key: string;
    render: (value: any, data?: any) => JSX.Element;
  }[];
  data: any[];
  onClick?: (record: any) => void;

  isLoading?: boolean;
  pagination?: TablePaginationConfig | undefined;
  active?: boolean;
  rowCount?: number;

  scroll?: {
    x: string | number | true | undefined;
  };
  locale?: TableLocale;
}
function TablePagination({
  columns,
  data,
  active = true,
  scroll,

  ...props
}: Props) {
  return props.isLoading ? (
    <>
      <div style={{ display: "flex", gap: 16, marginBottom: 16, marginTop: 16 }}>
        {columns.map((item) => {
          return <Skeleton title paragraph={false} active={active} key={item.key} />;
        })}
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          flexDirection: "column",
        }}
      >
        {columns.map((item) => (
          <Skeleton active={active} paragraph={false} key={item.key} />
        ))}
      </div>
    </>
  ) : (
    <>
      <AntTable
        locale={{
          emptyText: (
            <div
              style={{
                padding: 32,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
                minHeight: 400,
              }}
            >
              <img
                src={image.emptyTable}
                style={{
                  width: 260,
                  height: 130,
                }}
                alt='empty_table'
              />
              <Text level={4}>ขออภัยไม่พบข้อมูล</Text>
            </div>
          ),
        }}
        columns={columns}
        className='table'
        onRow={(record) => {
          return {
            onClick: () => {
              props.onClick?.(record);
            },
          };
        }}
        scroll={data.length > 0 ? scroll : undefined}
        dataSource={data}
        {...props}
        pagination={
          props.pagination && {
            showSizeChanger: false,
            position: ["bottomCenter"],
            itemRender(page, type, element) {
              const currentPage = props.pagination?.current || 0;
              const total = props.pagination?.total || 0;
              const pageSize = props.pagination?.pageSize || 0;
              const totalPage = total / pageSize;
              const pageCount = Math.ceil(totalPage);

              if (type === "prev") {
                return (
                  <ContainerIcon left>
                    <Image
                      src={currentPage === 1 ? icon.iconDoubleLeftDisable : icon.iconDoubleLeft}
                    />
                  </ContainerIcon>
                );
              }
              if (type === "next") {
                return (
                  <ContainerIcon right>
                    <Image
                      src={
                        currentPage === pageCount
                          ? icon.iconDoubleRightDisable
                          : icon.iconDoubleRight
                      }
                    />
                  </ContainerIcon>
                );
              }
              if (!currentPage && currentPage !== 0) {
                return element;
              }
              if (type === "page") {
                return <PageButton focus={currentPage === page}>{page}</PageButton>;
              }
              return <ButtonJump>{element}</ButtonJump>;
            },
            ...props.pagination,
          }
        }
      />
    </>
  );
}

export default TablePagination;
