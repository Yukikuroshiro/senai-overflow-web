import styled from "styled-components";

export const Container = styled.article`
  width: fit-content;
  padding: 2px 10px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  background-color: var(--darkGray);

  margin: 0px 10px 10px 0px;

  > span {
    margin-left: 10px;
    font-size: 20px;
    cursor: pointer;
    transition: 0.2s;

    :hover {
      color: var(--primary);
    }
  }
`;
