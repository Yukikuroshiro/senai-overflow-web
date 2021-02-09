import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Input from "../../components/input";
import Loading from "../../components/Loading";
import { api } from "../../services/api";
import { signIn } from "../../services/security";

import { Body, Button, Container, FormLogin, Header } from "./styles";

function Register() {
  const history = useHistory();
  const [showLoading, setShowLoading] = useState(false);

  const [register, setRegister] = useState({
    ra: "",
    name: "",
    email: "",
    password: "",
  });

  const validPassword = () => register.password === confirmPassword;

  const [confirmPassword, setConfirmPassword] = useState("");
  // const [buttonState, setButtonState] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);

    if (confirmPassword !== register.password)
      return alert("Atenção as senhas não colidem");

    try {
      const { ra, name, email, password } = register;

      const response = await api.post("/students", {
        ra,
        name,
        email,
        password,
      });

      console.log(response.data);

      signIn(response.data);

      //Implementar a autorização

      history.push("/home");
      setShowLoading(false);
    } catch (error) {
      console.error(error);

      alert(error.response.data.error);
      setShowLoading(false);
    }
  };
  const handleInput = (e) => {
    setRegister({ ...register, [e.target.id]: e.target.value });
  };
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleButton = (e) => {
    const { ra, name, email, password } = register;

    if (
      !ra ||
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !validPassword()
    )
      return true;
    else return false;
  };

  return (
    <>
      {showLoading && <Loading></Loading>}
      <Container>
        <FormLogin onSubmit={handleSubmit}>
          <Header>
            <h1>BEM VINDO AO SENAIOVERFLOW</h1>
            <h2>INFORME SEUS DADOS</h2>
          </Header>
          <Body>
            <Input
              id="ra"
              label="RA"
              value={register.ra}
              type="text"
              handler={handleInput}
            />
            <Input
              id="name"
              label="Nome"
              value={register.name}
              type="text"
              handler={handleInput}
            />
            <Input
              id="email"
              label="E-mail"
              value={register.email}
              type="email"
              handler={handleInput}
            />
            <Input
              id="password"
              label="Senha"
              type="password"
              handler={handleInput}
              value={register.password}
            />
            <Input
              id="validPassword"
              label="Confirmar senha"
              type="password"
              onBlur={(e) => {
                if (!validPassword()) {
                  alert("As senhas precisam ser iguais");
                  e.target.focus();
                }
              }}
              value={confirmPassword}
              handler={handleConfirmPassword}
            />
            <Button disabled={handleButton()}>Entrar</Button>
            <Link to="/">Ou se já tem cadastro clique para entrar</Link>
          </Body>
        </FormLogin>
      </Container>
    </>
  );
}

export default Register;
