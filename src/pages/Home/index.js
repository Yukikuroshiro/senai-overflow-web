import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import {
  ActionsContainer,
  Container,
  Content,
  FeedContainer,
  Header,
  IconSignOut,
  Logo,
  ProfileContainer,
  QuestionCard,
  AnswersCard,
} from "./styles";

import imgProfile from "../../assets/foto_perfil.png";
import logo from "../../assets/logo.png";
import { api } from "../../services/api";
import { getUser, signOut } from "../../services/security";

function Profile() {
  return (
    <>
      <section>
        <img src={imgProfile} alt="Imagem de perfil" title="Foto de Perfil" />
        <a href="a">Editar Foto</a>
      </section>
      <section>
        <strong>NOME:</strong>
        <p>Fulano de Tal</p>
      </section>
      <section>
        <strong>RA:</strong>
        <p>1234567</p>
      </section>
      <section>
        <strong>E-MAIL:</strong>
        <p>fulano@gmail.com</p>
      </section>
    </>
  );
}

function Question({ question }) {
  const [newAnswer, setNewAnswer] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

  const [answers, setAnswers] = useState(question.Answers);
  // const handleInput = (e) => {
  //   setAnswer(e.target.value);
  // };

  const handleAddAnswer = async (e) => {
    e.preventDefault();

    if (newAnswer < 10)
      return alert("A resposta precisa ter no mínimo 10 caracteres");

    try {
      const response = await api.post(`/questions/${question.id}/answers`, {
        description: newAnswer,
      });

      const aluno = getUser();

      const answerAdded = {
        id: response.data.id,
        description: newAnswer,
        created_at: response.data.createdAt,
        Student: {
          id: aluno.studentId,
          name: aluno.name,
        },
      };

      setAnswers([...answers, answerAdded]);

      setNewAnswer("");
      // console.log(response);
    } catch (error) {
      alert(error);
    }
  };

  // const showAnswers = () => {
  //   if (show === true) {
  //     // const container = question.Answers.map((a) => <Answer answer={a} />);
  //     // console.log(container);

  //     setShow(false);
  //   } else {
  //     setShow(true);
  //   }

  //   // alert(show);
  // };

  const qtdAnwers = answers.length;

  return (
    <QuestionCard>
      <header>
        <img src={imgProfile} />
        <strong>por {question.Student.name}</strong>
        <p>em {question.created_at}</p>
      </header>
      <section>
        <strong>{question.title}</strong>
        <p>{question.description}</p>
        <img src={question.image} />
      </section>
      <footer>
        <h1 onClick={() => setShowAnswers(!showAnswers)}>
          {qtdAnwers === 0 ? (
            "Seja o primeiro a responder"
          ) : (
            <>
              {qtdAnwers}
              {qtdAnwers > 1 ? " Respostas" : " Resposta"}
            </>
          )}
        </h1>
        {showAnswers && (
          <>
            {answers.map((a) => (
              <Answer answer={a} />
            ))}

            {/* <AnswersCard>
          <header>
            <img src={imgProfile} />
            <strong>por </strong>
            <p>12/12/2012 as 12:12</p>
          </header>
          <p>Resposta para a pergunta.</p>
        </AnswersCard> */}

            <form onSubmit={handleAddAnswer}>
              <textarea
                minLength="10"
                placeholder="Responda essa dúvida!"
                onChange={(e) => setNewAnswer(e.target.value)}
                required
                id="answer"
                value={newAnswer}
              ></textarea>
              <button>Enviar</button>
            </form>
          </>
        )}
      </footer>
    </QuestionCard>
  );
}

function Answer({ answer }) {
  return (
    <AnswersCard>
      <header>
        <img src={imgProfile} />
        <strong>por {answer.Student.name}</strong>
        <p>as {answer.created_at}</p>
      </header>
      <p>{answer.description}</p>
    </AnswersCard>
  );
}

function Home() {
  const history = useHistory();

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const loadQuestions = async () => {
      const response = await api.get("/questions/feed");

      setQuestions(response.data);

      console.log(response);
    };

    loadQuestions();
  }, []);

  const handleSignOut = () => {
    signOut();

    history.replace("/");
  };

  return (
    <Container>
      <Header>
        <Logo src={logo} />
        <IconSignOut onClick={handleSignOut} />
      </Header>
      <Content>
        <ProfileContainer>
          <Profile />
        </ProfileContainer>
        <FeedContainer>
          {questions.map((q) => (
            <Question question={q} />
          ))}
        </FeedContainer>
        <ActionsContainer>
          <button>Fazer uma pergunta</button>
        </ActionsContainer>
      </Content>
    </Container>
  );
}

export default Home;
