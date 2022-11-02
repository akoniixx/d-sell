import React from 'react';
import styled, { css } from 'styled-components';
import color from '../../resource/color';
import { TextStyled } from './MenuSider';
import iconImport from '../../resource/icon';
import Text from '../Text/Text';
import { useNavigate } from 'react-router-dom';
import { Dropdown, MenuProps } from 'antd';

interface Props {
  isOpenSidebar?: boolean;
  subLists?: {
    path: string;
    name: string;
    title: string;
  }[];
  icon?: JSX.Element;
  name: string;
  title?: string;
  current?: string;
  setCurrent: React.Dispatch<React.SetStateAction<string>>;
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
  align-items: center;
  cursor: pointer;
  &:hover {
    color: ${(props) => (props.isFocus ? 'white' : color.secondary)};
  }
`;
const SubListItem = styled.div<{ isFocus?: boolean }>`
  padding: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.isFocus ? color.BG : 'transparent')};
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
        color: black;
      `;
    }
  }}
  margin-left: 24px;
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
}: Props): JSX.Element {
  const [isCollapse, setIsCollapse] = React.useState(true);
  const navigate = useNavigate();
  const [currentSub, setCurrentSub] = React.useState('');

  const menus: MenuProps['items'] = subLists.map((item) => {
    return {
      label: (
        <div>
          <TextSubStyled
            style={{
              marginLeft: 0,
            }}
            isFocus={currentSub === item.path}
          >
            {item.title}
          </TextSubStyled>
        </div>
      ),
      onClick: () => {
        navigate(item.path);
        setCurrentSub(item.path);
      },
      key: item.name,
    };
  });

  if (!isOpenSidebar) {
    return (
      <Dropdown
        trigger={['click']}
        menu={{
          items: menus,
        }}
        overlayStyle={{
          borderRadius: '8px',
        }}
      >
        <ListCollapseStyled
          isOpen={isOpenSidebar}
          isFocus={current === name}
          onClick={() => {
            setIsCollapse(!isCollapse);
            setCurrent(name);
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
        isFocus={current === name}
        onClick={() => {
          setIsCollapse(!isCollapse);
          setCurrent(name);
        }}
      >
        <div>{icon}</div>
        {isOpenSidebar && (
          <TextStyled isFocus={current === name} strong>
            {title}
          </TextStyled>
        )}
        {isOpenSidebar && (
          <ImageCollapseStyled
            isOpen={!isCollapse}
            src={current !== name ? iconImport.downGrayIcon : iconImport.upWhiteIcon}
          />
        )}
      </ListCollapseStyled>
      {!isCollapse && isOpenSidebar && (
        <div
          style={{
            width: '100%',
            padding: '0 8px 8px',
          }}
        >
          {subLists.map((subList, idx) => {
            return (
              <SubListItem
                key={idx}
                onClick={() => {
                  setCurrentSub(subList.name);
                  navigate(subList.path);
                }}
                isFocus={subList.name === currentSub}
              >
                <TextSubStyled strong isFocus={subList.name === currentSub}>
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
