import { Col, Divider, Row } from "antd";
import React from "react";
import { OrderFileEntity } from "../../../entities/FileEntity";
import icon from "../../../resource/icon";
import Text from "../../../components/Text/Text";

export const FileItem = ({ file }: { file: OrderFileEntity }) => {
  return (
    <div>
      <Row align='middle' justify='space-between'>
        <div style={{ alignItems: "center" }}>
          <img
            src={file.filePath}
            style={{ width: 40, height: 40, borderRadius: 4, marginRight: 12 }}
          />
          <Text level={5}>{file?.filePath?.substring(0, 20)}...</Text>
        </div>
        <img
          src={icon.viewFileIcon}
          style={{ cursor: "pointer" }}
          onClick={() => window.open(file.filePath)}
        />
      </Row>
      <Divider style={{ margin: "10px 0px" }} />
    </div>
  );
};
