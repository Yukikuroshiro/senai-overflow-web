import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Alert from "../../components/Alert";
import Input from "../../components/input";
import Loading from "../../components/Loading";

import { api } from "../../services/api";
import { signIn } from "../../services/security";
import { Body, Button, Container, FormLogin, Header } from "./styles";

function Login() {
  const history = useHistory();

  const [message, setMessage] = useState(undefined);

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    try {
      const response = await api.post("/sessions", login);

      signIn(response.data);

      //Implementar a autorização

      history.push("/home");
      setShowLoading(false);
    } catch (error) {
      console.error(error);
      setMessage({ title: "Ops...", description: error.response.data.error });
      setShowLoading(false);
    }
  };

  const handleInput = (e) => {
    setLogin({ ...login, [e.target.id]: e.target.value });
  };

  const [showLoading, setShowLoading] = useState(false);

  return (
    <>
      <Alert message={message} type="error" handleClose={setMessage} />
      {showLoading && <Loading></Loading>}
      <Container>
        <FormLogin onSubmit={handleSubmit}>
          <Header>
            <h1>BEM VINDO AO SENAIOVERFLOW</h1>
            <h2>O SEU PORTAL DE RESPOSTAS</h2>
          </Header>
          <Body>
            <Input
              id="email"
              label="E-mail"
              type="email"
              value={login.email}
              handler={handleInput}
              required
            />
            <Input
              id="password"
              label="Senha"
              type="password"
              value={login.password}
              handler={handleInput}
              required
            />
            <Button>Entrar</Button>
            <Link to="/register">Ou clique aqui para se cadastrar</Link>
          </Body>
        </FormLogin>
      </Container>
    </>
  );
}

export default Login;
