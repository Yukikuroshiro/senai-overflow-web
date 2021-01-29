import Input from "../../components/input";
import { Body, Button, Container, FormLogin, Header } from "./styles";

function Register() {
  return (
    <Container>
      <FormLogin>
        <Header>
          <h1>BEM VINDO AO SENAIOVERFLOW</h1>
          <h2>INFORME SEUS DADOS</h2>
        </Header>
        <Body>
          <Input id="ra" label="RA" type="text" />
          <Input id="nome" label="Nome" type="text" />
          <Input id="email" label="E-mail" type="email" />
          <Input id="password" label="Senha" type="password" />
          <Input id="valid-Password" label="Confirmar senha" type="password" />
          <Button>Entrar</Button>
          <a href="a">Ou se já tem cadastro clique para entrar</a>
        </Body>
      </FormLogin>
    </Container>
  );
}

export default Register;
