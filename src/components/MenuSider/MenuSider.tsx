import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import color from "../../resource/color";
import Text from "../Text/Text";
import {
  ShoppingCartOutlined,
  GiftOutlined,
  TagOutlined,
  UserOutlined,
  FundOutlined,
  ContainerOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import CollapseMenu from "./CollapseMenu";
import { useEffectOnce } from "react-use";
import { checkPermissionRenderMenu } from "../../utility/func/RedirectByPermission";
import { useRecoilValue } from "recoil";
import { roleAtom } from "../../store/RoleAtom";
import { version } from "../../config/version";
interface Props {
  style?: React.CSSProperties;
  lists: {
    path: string;
    name: string;
    title: string;
    permission: {
      name: string | string[];
      action: string;
    } | null;
    subMenu: {
      path: string;
      name: string;
      title: string;
      permission?: {
        name: string;
        action: string;
      } | null;
    }[];
  }[];
  isOpenSidebar?: boolean;
}
const MenuSiderStyled = styled.div`
  background-color: white;
  height: 100%;
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const ListStyled = styled.div<{ isOpen?: boolean; isFocus?: boolean }>`
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
        color: black;
      `;
    }
  }}
  padding: 8px;
  margin-bottom: 8px;
  gap: 8px;
  justify-content: center;
  cursor: pointer;
  &:hover {
    color: ${(props) => (props.isFocus ? "white" : color.secondary)};
  }
`;

export const TextStyled = styled(Text)<{ isFocus?: boolean }>`
  ${({ isFocus }) => {
    if (isFocus) {
      return css`
        color: white;
      `;
    } else {
      return css`
        color: ${color.Text1};
      `;
    }
  }}
  font-family: Helvetica !important;
  &:hover {
    color: ${(props) => (props.isFocus ? "white" : color.secondary)};
  }
`;

const iconsInActive = {
  order: (
    <ShoppingCartOutlined
      style={{
        fontSize: "20px",
      }}
    />
  ),
  approveOrder: (
    <ContainerOutlined
      style={{
        fontSize: "20px",
      }}
    />
  ),
  promotion: (
    <GiftOutlined
      style={{
        fontSize: "20px",
      }}
    />
  ),
  discountList: (
    <TagOutlined
      style={{
        fontSize: "20px",
      }}
    />
  ),
  priceList: (
    <FundOutlined
      style={{
        fontSize: "20px",
      }}
    />
  ),
  shopManagement: (
    <ShopOutlined
      style={{
        fontSize: "20px",
      }}
    />
  ),
  user: (
    <UserOutlined
      style={{
        fontSize: "20px",
      }}
    />
  ),
};
function MenuSider({ style, lists = [], isOpenSidebar = false }: Props): JSX.Element {
  const navigate = useNavigate();
  const [current, setCurrent] = useState({
    path: "",
    subPath: "",
  });
  const roleData = useRecoilValue(roleAtom);
  useEffectOnce(() => {
    const pathName = window.location.pathname;
    const pathNameSplit = pathName.split("/").filter((item) => item !== "");

    const currentPath = lists.find((item) => item.path === `/${pathNameSplit[0]}`);
    if (currentPath) {
      const isHaveSubPath = currentPath.subMenu.find((el) => el.path === `/${pathNameSplit[1]}`);

      setCurrent({
        path: currentPath.name,
        subPath: isHaveSubPath ? isHaveSubPath.name : "",
      });
    }
    // const pathNameSplit = pathName.split("/");
    // if (pathNameSplit.length > 2) {
    //   setCurrent(pathNameSplit[2]);
    // }
  });

  const onClickList = (name: string) => {
    setCurrent({
      path: name,
      subPath: "",
    });
  };
  return (
    <MenuSiderStyled style={style}>
      <div>
        {lists.map((list, idx) => {
          const isPremiss = checkPermissionRenderMenu({
            menus: roleData?.menus,
            permission: list?.permission || null,
          });

          if (!isPremiss) return null;

          if (list.subMenu.length < 1) {
            return (
              <ListStyled
                key={idx}
                isOpen={isOpenSidebar}
                isFocus={current.path === list.name}
                onClick={() => {
                  onClickList(list.name);
                  navigate(list.path);
                }}
              >
                <div>{iconsInActive[list.name as keyof typeof iconsInActive]}</div>
                {isOpenSidebar && (
                  <TextStyled isFocus={current.path === list.name} strong>
                    {list.title}
                  </TextStyled>
                )}
              </ListStyled>
            );
          } else {
            return (
              <CollapseMenu
                isOpenSidebar={isOpenSidebar}
                key={idx}
                subLists={list.subMenu}
                icon={iconsInActive[list.name as keyof typeof iconsInActive]}
                name={list.name}
                title={list.title}
                setCurrent={setCurrent}
                current={current}
                frontPath={list.path}
              />
            );
          }
        })}
      </div>
      <div
        style={{
          padding: "0 4px",
        }}
      >
        <Text level={7} fontWeight={700}>{` Dev : ${version.dev} `}</Text>
      </div>
    </MenuSiderStyled>
  );
}

export default MenuSider;
