import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Input from "../../components/input";
import { api } from "../../services/api";

import { Body, Button, Container, FormLogin, Header } from "./styles";

function Register() {
  const history = useHistory();

  const [register, setRegister] = useState({
    ra: "",
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // return console.log(e);

    // const password = e.target;

    // return console.log(password);

    try {
      const response = await api.post("/students", register);

      console.log(response.data);

      //Implementar a autorização

      history.push("/home");
    } catch (error) {
      console.error(error);

      alert(error.response.data.error);
    }
  };
  const handleInput = (e) => {
    setRegister({ ...register, [e.target.id]: e.target.value });
  };

  return (
    <Container>
      <FormLogin onSubmit={handleSubmit}>
        <Header>
          <h1>BEM VINDO AO SENAIOVERFLOW</h1>
          <h2>INFORME SEUS DADOS</h2>
        </Header>
        <Body>
          <Input id="ra" label="RA" type="text" handler={handleInput} />
          <Input id="name" label="Nome" type="text" handler={handleInput} />
          <Input id="email" label="E-mail" type="email" handler={handleInput} />
          <Input
            id="password"
            label="Senha"
            type="password"
            handler={handleInput}
          />
          <Input id="validPassword" label="Confirmar senha" type="password" />
          <Button>Entrar</Button>
          <Link to="/">Ou se já tem cadastro clique para entrar</Link>
        </Body>
      </FormLogin>
    </Container>
  );
}

export default Register;
