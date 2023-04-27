import { Col, Row } from "antd";
import { CSSProperties, ReactNode } from "react";
import Text from "../Text/Text";

interface DescriptionProps {
  label: string;
  value?: string | ReactNode;
  leftSpan?: number;
  style?: CSSProperties;
}

const Descriptions = ({ label, value, leftSpan = 8, style }: DescriptionProps) => {
  return (
    <Row style={{ padding: "16px 0px", ...style }}>
      <Col span={leftSpan}>
        <Text color='Text3'>{label} :</Text>
      </Col>
      <Col span={24 - leftSpan}>
        <Text>{value || "-"}</Text>
      </Col>
    </Row>
  );
};

export default Descriptions;
