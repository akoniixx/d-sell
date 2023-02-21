import styled from "styled-components";
import color from "../../resource/color";

interface FlexBox {
  align?: "start" | "end" | "center" | "space-around" | "space-between" | "space-evenly";
  justify?: "start" | "end" | "center" | "space-around" | "space-between" | "space-evenly";
}

export const FlexRow = styled.div<FlexBox>`
  display: flex;
  align-items: ${({ align }) => align || "start"};
  justify-content: ${({ justify }) => justify || "start"};
`;

export const FlexCol = styled(FlexRow)<FlexBox>`
  flex-direction: column;
`;

export const DetailBox = styled.div`
  padding: 32px;

  background: ${color.background1};
  border: 1px solid ${color.background2};
  border-radius: 16px;
`;
