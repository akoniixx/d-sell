import { Col, Form, FormInstance, Row } from "antd";
import React, { useMemo } from "react";
import styled from "styled-components";
import color from "../../resource/color";
import { staticManageRoles, staticRolesObject } from "../../utility/StaticPermission";
import Button from "../Button/Button";
import CheckboxGroup from "../CheckboxGroup/CheckboxGroup";
import Text from "../Text/Text";
const CardRole = styled.div`
  border: 1px solid ${color.background1};
  border-radius: 8px;
  margin-bottom: 24px;
`;
interface Props {
  form: FormInstance;
  disabled?: boolean;
}
export default function RolesList({ form, disabled }: Props) {
  const { commonCheckList, manageCheckList } = useMemo(() => {
    const commonCheckList = Object.keys(staticRolesObject).map((key) => {
      return {
        menuName: key,
        ...staticRolesObject[key as keyof typeof staticRolesObject],
      };
    });
    const manageCheckList = Object.keys(staticManageRoles).map((key) => {
      return {
        menuName: key,
        ...staticManageRoles[key as keyof typeof staticManageRoles],
      };
    });
    return { commonCheckList, manageCheckList };
  }, []);

  const onClickSelectAll = () => {
    const listCommonData = commonCheckList.reduce((acc, cur) => {
      const data: any = cur.list;
      const list = data.map((el: any) => el.value);
      if (!cur.isNested) {
        return { ...acc, [cur.menuName]: list };
      } else {
        const listNested = data.reduce((accNested: any, curNested: any) => {
          const listNested = curNested?.listNested?.map((el: any) => el.value);
          return { ...accNested, [curNested.groupNameNested]: listNested };
        }, {});
        return { ...acc, [cur.menuName]: listNested };
      }
    }, {});
    const listManageData = manageCheckList.reduce((acc, cur) => {
      const data: any = cur.list;
      const list = data.map((el: any) => el.value);
      if (!cur.isNested) {
        return { ...acc, [cur.menuName]: list };
      } else {
        const listNested = data.reduce((accNested: any, curNested: any) => {
          const listNested = curNested?.listNested?.map((el: any) => el.value);
          return { ...accNested, [curNested.groupNameNested]: listNested };
        }, {});
        return { ...acc, [cur.menuName]: listNested };
      }
    }, {});
    form.setFieldsValue({ ...listCommonData, ...listManageData });
  };
  const onClearAll = () => {
    form.resetFields();
  };
  return (
    <CardRole>
      <Row
        style={{
          justifyContent: "space-between",
          padding: 16,
          alignItems: "center",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          backgroundColor: color.background1,
        }}
      >
        <Text fontWeight={700}>ผู้ใช้งานจะมีสิทธิ์ใช้งานดังนี้</Text>
        {!disabled && (
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <Button
              title='เลือกทั้งหมด'
              style={{
                width: 96,
                padding: "2px 4px",
              }}
              onClick={onClickSelectAll}
              height={32}
            />
            <Button
              title='ล้าง'
              onClick={onClearAll}
              typeButton='primary-light'
              style={{
                width: 96,
                padding: "4px 8px",
              }}
              height={32}
            />
          </div>
        )}
      </Row>
      <div
        style={{
          padding: 24,
        }}
      >
        <Row>
          <Col span={12}>
            <Text fontWeight={700}>ทั่วไป</Text>
            {commonCheckList.map((el) => {
              const data: any = el.list;

              if (!el.isNested) {
                return (
                  <Form.Item noStyle name={el.menuName} key={el.menuName}>
                    <CheckboxGroup data={data} name={el.groupName} disabled={disabled} />
                  </Form.Item>
                );
              } else {
                return (
                  <>
                    <Form.Item noStyle name={el.menuName} key={el.menuName}>
                      <CheckboxGroup
                        data={data}
                        isNested={el.isNested}
                        name={el.groupName}
                        nameKey={el.menuName}
                        disabled={disabled}
                      />
                    </Form.Item>
                  </>
                );
              }
            })}
          </Col>
          <Col span={12}>
            <Text fontWeight={700}>การจัดการระบบ</Text>
            {manageCheckList.map((el: any) => {
              const data: any = el.list;

              if (!el.isNested) {
                return (
                  <Form.Item noStyle name={el.menuName} key={el.menuName}>
                    <CheckboxGroup data={data} name={el.groupName} disabled={disabled} />
                  </Form.Item>
                );
              } else {
                return (
                  <>
                    <Form.Item noStyle name={el.menuName} key={el.menuName}>
                      <CheckboxGroup
                        data={data}
                        isNested={el.isNested}
                        name={el.groupName}
                        nameKey={el.menuName}
                        disabled={disabled}
                      />
                    </Form.Item>
                  </>
                );
              }
            })}
          </Col>
        </Row>
      </div>
    </CardRole>
  );
}
