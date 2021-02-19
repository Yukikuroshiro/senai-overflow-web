import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  position: relative;
  margin-top: 15px;

  > input {
    border: 0;
    padding-left: 10px;
    border-radius: 3px;
    font-family: sans-serif;
  }

  > label {
    position: absolute;
    top: 0;
    left: 10px;
    color: var(--darkGray);
    display: flex;
    align-items: center;
    cursor: text;
    transition: 0.2s ease-in-out;
    pointer-events: none;
  }

  > input,
  > label {
    width: 100%;
    height: 30px;
    font-size: 16px;
  }

  > input:focus {
    border-bottom: 2px solid var(--primary);
  }

  > input:not(:placeholder-shown) + label,
  > input:focus + label {
    top: -25px;
    font-size: 14px;
    left: 0px;
    color: var(--light);
  }

  /* > input:not(placeholder-shown) */
`;
