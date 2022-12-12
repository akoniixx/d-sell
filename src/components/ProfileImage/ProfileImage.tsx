import { Row, Upload, UploadProps } from "antd";
import React from "react";
import styled from "styled-components";
import color from "../../resource/color";
import image from "../../resource/image";
import Button from "../Button/Button";
import Text from "../Text/Text";

interface Props {
  onChange?: (value: any) => void;
  value?: any;
}
const ImageStyled = styled.img``;
export default function ProfileImage({ onChange, value }: Props): JSX.Element {
  const [nameFile, setNameFile] = React.useState<string>("");
  const onChangeImage: UploadProps["onChange"] = (info) => {
    if (info.file.status === "done") {
      onChange?.(info.file.response);
    }
  };
  const beforeUpload = (file: any) => {
    setNameFile(file.name);
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      alert("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      alert("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  return (
    <Row
      style={{
        marginTop: 16,
        gap: 16,
        alignItems: "center",
      }}
    >
      {value ? (
        <ImageStyled
          src={value}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
          }}
        />
      ) : (
        <div
          style={{
            borderRadius: "50%",
            width: 100,
            height: 100,
            padding: 16,
            backgroundColor: color.background2,
          }}
        >
          <ImageStyled
            src={image.no_image}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Row
          style={{
            gap: 8,
            alignItems: "center",
          }}
        >
          <Upload
            onChange={onChangeImage}
            name='file'
            accept='.jpg,.png'
            beforeUpload={beforeUpload}
            showUploadList={false}
            customRequest={async (options) => {
              const { onSuccess, onError, file } = options;
              
              const convertToImage = (file: any) => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = (error) => reject(error);
                });
              };
              const newFile = await convertToImage(file);
              onChange?.(newFile);

              //   const reader = new FileReader();
              //   reader.readAsDataURL(file);
              //   reader.onload = async function () {
              //     try {
              //       const res = await request.post("/container/image/base64", {
              //         base64: reader.result,
              //         name: file.name,
              //       });
              //       onSuccess(res.data);
              //     } catch (error: any) {
              //       onError({ event: error });
              //     }
              //   };
              //   reader.onerror = function (error) {
              //     console.log("Error: ", error);
              //   };
            }}
          >
            <Row>
              <Button
                typeButton='primary-light'
                title='เลือกไฟล์'
                level={6}
                height={24}
                style={{
                  padding: "0px 8px",
                }}
              />
            </Row>
          </Upload>
          {value ? (
            <Text>{nameFile}</Text>
          ) : (
            <Text level={6} color='Text1'>
              ยังไม่มีรูปโปรไฟล์
            </Text>
          )}
        </Row>
        <Row>
          {value ? (
            <Button
              typeButton='border-light'
              title='ลบรูป'
              level={6}
              onClick={() => {
                onChange?.(null);
              }}
              height={24}
              style={{
                padding: "0px 8px",
                width: 70,
              }}
            />
          ) : (
            <Text level={7} color='Text3'>
              JPG, PNG. Max size of 1:1
            </Text>
          )}
        </Row>
      </div>
    </Row>
  );
}
