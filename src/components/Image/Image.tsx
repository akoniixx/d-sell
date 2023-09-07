import { DeleteOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { CSSProperties } from "react";
import styled from "styled-components";
import color from "../../resource/color";

const Container = styled.div`
  position: relative;
  margin: 0px auto;
  border-radius: 4px;
  border: 1px dashed ${color.Disable};

  .delete {
    background-color: #ffffff99;
    padding: 6px 10px 4px;
    border-radius: 4px 0 0 0;
    color: red;
    display: none;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  :hover .delete {
    display: block;
  }
`;

const Image = styled.img`
  position: relative;
  margin: 0px auto;
`;

export const ImageWithDeleteButton = ({
  width,
  height,
  src,
  handleDelete,
}: {
  width: number | string;
  height: number | string;
  src?: string;
  handleDelete?: () => void;
}) => {
  const onClick = () => {
    Modal.confirm({
      title: "ยืนยันการลบรูป",
      onOk: handleDelete,
    });
  };
  return (
    <Container>
      <Image
        style={{
          width,
          height,
          borderRadius: 4,
        }}
        src={src}
      />
      <div className='delete' onClick={onClick}>
        <DeleteOutlined />
      </div>
    </Container>
  );
};
