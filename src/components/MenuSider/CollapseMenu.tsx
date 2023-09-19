import React from "react";
import styled, { css } from "styled-components";
import color from "../../resource/color";
import { TextStyled } from "./MenuSider";
import iconImport from "../../resource/icon";
import Text from "../Text/Text";
import { useNavigate } from "react-router-dom";
import { Dropdown, MenuProps } from "antd";
import { checkPermissionRenderMenu } from "../../utility/func/RedirectByPermission";
import { useRecoilValue } from "recoil";
import { roleAtom } from "../../store/RoleAtom";

interface Props {
  isOpenSidebar?: boolean;
  subLists?: {
    path: string;
    name: string;
    title: string;
    permission?: {
      name: string;
      action: string;
    } | null;
  }[];
  icon?: JSX.Element;
  name: string;
  title?: string;
  current?: {
    path: string;
    subPath: string;
  };
  setCurrent: React.Dispatch<
    React.SetStateAction<{
      path: string;
      subPath: string;
    }>
  >;
  frontPath?: string;
}
const ImageCollapseStyled = styled.img<{ isOpen?: boolean }>`
  ${(props) =>
    props.isOpen
      ? css`
          transition: all 0.5s ease;
          transform: rotate(180deg);
        `
      : css`
          transition: all 0.5s ease;
          transform: rotate(0deg);
        `}
  width: 20px;
  height: 20px;
  position: absolute;
  right: 16px;
`;
const ListCollapseStyled = styled.div<{ isOpen?: boolean; isFocus?: boolean }>`
  ${({ isOpen }) => {
    if (isOpen) {
      return css`
        display: grid;
        align-items: center;
        grid-template-columns: 20px 140px;
      `;
    } else {
      return css`
        display: flex;
        align-items: center;
      `;
    }
  }}
  ${({ isFocus, isOpen }) => {
    if (isFocus) {
      return css`
        background-color: ${color.secondary};
        color: white;
        border-radius: 8px;
        margin-left: ${isOpen ? "8px" : "16px"};
        margin-right: ${isOpen ? "8px" : "16px"};
      `;
    } else {
      return css`
        background-color: white;
        color: ${color.Text1};
      `;
    }
  }}
  padding: 8px;
  margin-bottom: 8px;
  gap: 8px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: ${(props) => (props.isFocus ? "white" : color.secondary)};
  }
`;
const SubListItem = styled.div<{ isFocus?: boolean }>`
  padding: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.isFocus ? color.background1 : "transparent")};
  border-radius: 8px;
  width: 100%;
`;
const TextSubStyled = styled(Text)<{ isFocus?: boolean }>`
  ${({ isFocus }) => {
    if (isFocus) {
      return css`
        color: ${color.primary};
      `;
    } else {
      return css`
        color: ${color.Text1};
      `;
    }
  }}
  margin-left: 24px;
  font-family: Helvetica, IBM Plex Sans Thai !important;

  &:hover {
    color: ${(props) => (props.isFocus ? color.primary : color.Text1)};
  }
`;
function CollapseMenu({
  isOpenSidebar,
  subLists = [],
  name,
  icon,
  title,
  current,
  setCurrent,
  frontPath,
}: Props): JSX.Element {
  const [isCollapse, setIsCollapse] = React.useState(true);
  const navigate = useNavigate();
  const roleData = useRecoilValue(roleAtom);
  const menus: MenuProps["items"] = subLists.map((item) => {
    const isPremission = checkPermissionRenderMenu({
      permission: item.permission || null,
      menus: roleData?.menus,
    });
    if (!isPremission) return null;
    return {
      label: (
        <div>
          <TextSubStyled
            style={{
              marginLeft: 0,
            }}
            isFocus={current?.subPath === item.name}
          >
            {item.title}
          </TextSubStyled>
        </div>
      ),
      onClick: () => {
        navigate(frontPath + item.path);
        setCurrent((prev) => {
          return {
            ...prev,
            subPath: item.name,
          };
        });
      },
      key: item.name,
    };
  });

  if (!isOpenSidebar) {
    return (
      <Dropdown
        trigger={["click"]}
        menu={{
          items: menus,
        }}
        overlayStyle={{
          borderRadius: "8px",
        }}
      >
        <ListCollapseStyled
          isOpen={isOpenSidebar}
          isFocus={current?.path === name}
          onClick={() => {
            setIsCollapse(!isCollapse);
            setCurrent({
              path: name,
              subPath: current?.subPath || "",
            });
          }}
        >
          <div>{icon}</div>
        </ListCollapseStyled>
      </Dropdown>
    );
  }

  return (
    <>
      <ListCollapseStyled
        isOpen={isOpenSidebar}
        isFocus={current?.path === name}
        onClick={() => {
          setIsCollapse(!isCollapse);
          setCurrent({
            path: name,
            subPath: current?.subPath || "",
          });
        }}
      >
        <div>{icon}</div>
        {isOpenSidebar && (
          <TextStyled isFocus={current?.path === name} strong>
            {title}
          </TextStyled>
        )}
        {isOpenSidebar && (
          <ImageCollapseStyled
            isOpen={!isCollapse}
            src={current?.path !== name ? iconImport.downGrayIcon : iconImport.upWhiteIcon}
          />
        )}
      </ListCollapseStyled>
      {!isCollapse && isOpenSidebar && (
        <div
          style={{
            width: "100%",
            padding: "0 8px 8px",
          }}
        >
          {subLists.map((subList, idx) => {
            const isPremiss = checkPermissionRenderMenu({
              menus: roleData?.menus,
              permission: subList?.permission || null,
            });
            if (!isPremiss) return null;
            return (
              <SubListItem
                key={idx}
                onClick={() => {
                  setCurrent((prev) => ({ ...prev, subPath: subList.name }));
                  navigate(frontPath + subList.path);
                }}
                isFocus={subList.name === current?.subPath}
              >
                <TextSubStyled strong isFocus={subList.name === current?.subPath}>
                  {subList.title}
                </TextSubStyled>
              </SubListItem>
            );
          })}
        </div>
      )}
    </>
  );
}

export default CollapseMenu;
