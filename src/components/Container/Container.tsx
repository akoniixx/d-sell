import styled from "styled-components";

interface FlexBox {
    align?: "start" | "end" | "center" | "space-around" | "space-between" | "space-evenly";
    justify?: "start" | "end" | "center" | "space-around" | "space-between" | "space-evenly";
}

export const FlexRow = styled.div<FlexBox>`
    display: flex;
    align-items: ${({ align }) => align || "start" };
    justify-content: ${({ justify }) => justify || "start" };
`;

export const FlexCol = styled(FlexRow)<FlexBox>`
    flex-direction: column;
`;