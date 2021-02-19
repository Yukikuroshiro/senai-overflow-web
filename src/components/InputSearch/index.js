import { useRef } from "react";
import { Container, IconSearch } from "./style";

function InputSearch({ id, label, value, handler, ...rest }) {
  const inputRef = useRef();

  return (
    <Container>
      <input
        id={id}
        type="search"
        {...rest}
        placeholder="Procurar"
        value={value}
        onChange={handler}
        ref={inputRef}
      />
      <IconSearch onClick={() => inputRef.current.focus()} />
    </Container>
  );
}

export default InputSearch;
