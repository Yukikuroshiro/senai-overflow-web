import { Container, FormLogin } from "./styles";

function Login() {
  return (
    <Container>
      <FormLogin>
        <h1>Bem vindo ao SENAI Overflow</h1>
        <label>E-mail</label>
        <input type="email" />
        <label>Senha</label>
        <input type="password" />
        <button>Entrar</button>
      </FormLogin>
    </Container>
  );
}

export default Login;
