import { Col, Row } from "antd";
import Text from "../Text/Text";

interface Props {
  title: string;
  extra?: React.ReactNode;
}
const PageTitle = ({ title, extra }: Props) => {
  return (
    <Row justify='space-between'>
      <Col>
        <div>
          <Text level={2} color='Text2'>
            {title}
          </Text>
        </div>
      </Col>
      {extra && <Col>{extra}</Col>}
    </Row>
  );
};
export default PageTitle;
