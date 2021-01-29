import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  :root{
    --dark: #282a36;
    --darkGray: #44475a;
    --light: #EDF2f4;
    --primary: #ef233c;
    --secondary: #D90425;
  }
  
  
  *{
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
    color: var(--light);
    background-color: var(--light);
  }


  button {
    padding:10px;
    font-weight:bold;
    color: var(--light);
    background-color: var(--darkGray);
    border: 1px solid var(--light);
    border-radius:4px;
    cursor: pointer;
    transition: .2s ease-in;

    :hover{
      background-color:var(--primary);
    }
    :active{
      transform:scale(0.95);
    }
    :disabled{
      background-color: transparent;
      border: 1px solid var(--darkGray);
      color: var(--darkGray);
    }
  }


  a{
    color: var(--light);
    transition: .2s;
    :hover{
      color: var(--primary);
    }
    :active{
      transform: scale(0.95);
    }
  }
`;
