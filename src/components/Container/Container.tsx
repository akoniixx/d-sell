import styled from "styled-components";
import color from "../../resource/color";

interface FlexBox {
  align?: "start" | "end" | "center" | "space-around" | "space-between" | "space-evenly";
  justify?: "start" | "end" | "center" | "space-around" | "space-between" | "space-evenly";
}

interface ScrollBox {
  width?: number;
  height?: number;
  scrollableX?: boolean;
  scrollableY?: boolean;
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

export const ScrollContainer = styled.div<ScrollBox>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;

  overflow-x: ${({ scrollableX }) => (scrollableX ? "auto" : "hidden")};
  overflow-y: ${({ scrollableY }) => (scrollableY ? "auto" : "hidden")};
`;
