import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
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
  FormNewQuestion,
} from "./styles";

import imgProfile from "../../assets/foto_perfil.png";
import logo from "../../assets/logo.png";
import { api } from "../../services/api";
import { getUser, signOut } from "../../services/security";
import Modal from "../../components/Modal";
import Input from "../../components/input/index";
import Select from "../../components/Select";
import Tag from "../../components/Tag";

function Profile() {
  const student = getUser();

  return (
    <>
      <section>
        <img src={imgProfile} alt="Imagem de perfil" title="Foto de Perfil" />
        <a href="a">Editar Foto</a>
      </section>
      <section>
        <strong>NOME:</strong>
        <p>{student.Name}</p>
      </section>
      <section>
        <strong>RA:</strong>
        <p>{student.ra}</p>
      </section>
      <section>
        <strong>E-MAIL:</strong>
        <p>{student.email}</p>
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

  const student = getUser();

  return (
    <QuestionCard>
      <header>
        <img src={imgProfile} />
        <strong>
          por{" "}
          {student.studentId === question.Student.id
            ? "Você"
            : question.Student.name}
        </strong>
        <p>
          em {format(new Date(question.created_at), "dd/MM/yyyy 'as' HH:mm")}
        </p>
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
  const student = getUser();

  return (
    <AnswersCard>
      <header>
        <img src={imgProfile} />
        <strong>
          por{" "}
          {student.studentId === answer.Student.id
            ? "Você"
            : answer.Student.name}
        </strong>
        <p>em {format(new Date(answer.created_at), "dd/MM/yyyy 'as' HH:mm")}</p>
      </header>
      <p>{answer.description}</p>
    </AnswersCard>
  );
}

function NewQuestion() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get("/categories");

        setCategories(response.data);
      } catch (error) {
        alert(error);
      }
    };

    loadCategories();
  }, []);

  return (
    <FormNewQuestion>
      <Input id="title" label="Titulo" />
      <Input id="description" label="Descrição" />
      <Input id="gist" label="Gist" />
      <Select id="categories" label="Categorias">
        <option value="">Selecione</option>
        {categories.map((c) => (
          <option value={c.id}>{c.description}</option>
        ))}
      </Select>
      <div>
        <Tag info="Backend"></Tag>
        <Tag info="Frontend"></Tag>
      </div>
      <input type="file" />
      <button>Enviar</button>
    </FormNewQuestion>
  );
}

function Home() {
  const history = useHistory();

  const [questions, setQuestions] = useState([]);

  const [reload, setReload] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      const response = await api.get("/questions/feed");

      setQuestions(response.data);

      console.log(response);
    };

    loadQuestions();
  }, [reload]);

  const handleSignOut = () => {
    signOut();

    history.replace("/");
  };

  const handleReload = () => {
    setReload(Math.random());
  };

  return (
    <>
      <Modal title="Faça uma pergunta">
        <NewQuestion></NewQuestion>
      </Modal>
      <Container>
        <Header>
          <Logo src={logo} onClick={handleReload} />
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
    </>
  );
}

export default Home;
