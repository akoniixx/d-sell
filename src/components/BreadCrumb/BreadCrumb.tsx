import React, { ReactNode } from "react";
import { Breadcrumb as BreadCrumbAntd } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Text from "../Text/Text";

const BreadCrumbComponent = styled(BreadCrumbAntd)`
  .flex {
    display: flex;
    margin-right: 4px;
    align-items: center;
  }
  li {
    display: flex;
    align-items: center;
  }
  .ant-breadcrumb-separator {
    display: none;
  }
`;
interface Props {
  data: { text?: ReactNode; path: string }[];
}
function BreadCrumb({ data = [] }: Props): JSX.Element {
  const navigate = useNavigate();

  return (
    <BreadCrumbComponent>
      {data.map((el, idx) => {
        const isLast = idx === data.length - 1;
        return (
          <BreadCrumbAntd.Item key={idx} className={"flex"} separator={false}>
            <Text
              onClick={() => (isLast ? null : navigate(el.path))}
              level={7}
              color={isLast ? "primary" : "Text3"}
              style={{
                cursor: isLast ? "default" : "pointer",
              }}
            >
              {el.text}
            </Text>
            {!isLast && (
              <Text color='Text3' style={{ margin: "0px 8px" }} level={7}>
                {">"}
              </Text>
            )}
          </BreadCrumbAntd.Item>
        );
      })}
    </BreadCrumbComponent>
  );
}

export default BreadCrumb;
