import { Typography } from 'antd';
import { TextProps } from 'antd/lib/typography/Text';
import React from 'react';
import styled from 'styled-components';

interface Props extends TextProps {
  children?: React.ReactNode;
}
const TextStyled = styled(Typography.Text)``;
function Text({ children, ...props }: Props): JSX.Element {
  return <TextStyled {...props}>{children}</TextStyled>;
}

export default Text;
