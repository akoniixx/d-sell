import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import color from '../../resource/color';
import Text from '../Text/Text';
import {
  ShoppingCartOutlined,
  GiftOutlined,
  TagOutlined,
  UserOutlined,
  FundOutlined,
  ContainerOutlined,
} from '@ant-design/icons';
import CollapseMenu from './CollapseMenu';
interface Props {
  style?: React.CSSProperties;
  lists: {
    path: string;
    name: string;
    title: string;
    subMenu: {
      path: string;
      name: string;
      title: string;
    }[];
  }[];
  isOpenSidebar?: boolean;
}
const MenuSiderStyled = styled.div`
  background-color: white;
  height: 100%;
  padding-top: 48px;
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
        margin-left: ${isOpen ? '8px' : '16px'};
        margin-right: ${isOpen ? '8px' : '16px'};
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
    color: ${(props) => (props.isFocus ? 'white' : color.secondary)};
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
        color: black;
      `;
    }
  }}
  &:hover {
    color: ${(props) => (props.isFocus ? 'white' : color.secondary)};
  }
`;

const iconsInActive = {
  order: (
    <ShoppingCartOutlined
      style={{
        fontSize: '20px',
      }}
    />
  ),
  approveOrder: (
    <ContainerOutlined
      style={{
        fontSize: '20px',
      }}
    />
  ),
  promotion: (
    <GiftOutlined
      style={{
        fontSize: '20px',
      }}
    />
  ),
  discountList: (
    <TagOutlined
      style={{
        fontSize: '20px',
      }}
    />
  ),
  priceList: (
    <FundOutlined
      style={{
        fontSize: '20px',
      }}
    />
  ),
  user: (
    <UserOutlined
      style={{
        fontSize: '20px',
      }}
    />
  ),
};
function MenuSider({ style, lists = [], isOpenSidebar = false }: Props): JSX.Element {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('order');
  const onClickList = (name: string) => {
    setCurrent(name);
  };
  return (
    <MenuSiderStyled style={style}>
      {lists.map((list, idx) => {
        if (list.subMenu.length < 1) {
          return (
            <ListStyled
              key={idx}
              isOpen={isOpenSidebar}
              isFocus={current === list.name}
              onClick={() => {
                onClickList(list.name);
                navigate(list.path);
              }}
            >
              <div>{iconsInActive[list.name as keyof typeof iconsInActive]}</div>
              {isOpenSidebar && (
                <TextStyled isFocus={current === list.name} strong>
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
            />
          );
        }
      })}
    </MenuSiderStyled>
  );
}

export default MenuSider;
