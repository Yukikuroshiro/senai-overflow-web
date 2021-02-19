import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { format, set } from "date-fns";
import ReactEmbedGist from "react-embed-gist";

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
  GistIcon,
  ContainerGist,
} from "./styles";

import imgProfile from "../../assets/foto_perfil.png";
import logo from "../../assets/logo.png";
import { api } from "../../services/api";
import { getUser, setUser, signOut } from "../../services/security";
import Modal from "../../components/Modal";
import Input from "../../components/input/index";
import Select from "../../components/Select";
import Tag from "../../components/Tag";
import Loading from "../../components/Loading";
import { validSquaredImage } from "../../utils";
import SpinnerLoading from "../../components/SpinnerLoading";

function Profile({ setIsLoading, handleReload, setMessage }) {
  const [student, setStudent] = useState(getUser());

  // useEffect(() => {
  //   setStudent(getUser());
  // }, []);

  const handleImage = async (e) => {
    if (!e.target.files) return;

    try {
      await validSquaredImage(e.target.files[0]);

      const data = new FormData();

      data.append("image", e.target.files[0]);

      setIsLoading(true);

      const response = await api.post(`/students/${student.id}/images`, data);

      setTimeout(() => {
        setStudent({ ...student, image: response.data.image });
        handleReload();
      }, 1000);

      setUser({ ...student, image: response.data.image });
    } catch (error) {
      alert(error);
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <section>
        <img
          src={student.image || imgProfile}
          alt="Imagem de perfil"
          title="Foto de Perfil"
        />
        <label htmlFor="editImageProfile">Editar Foto</label>
        <input id="editImageProfile" type="file" onChange={handleImage} />
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

function Question({ question, setIsLoading, setCurrentGist }) {
  const [newAnswer, setNewAnswer] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

  const [answers, setAnswers] = useState([]);
  // const handleInput = (e) => {
  //   setAnswer(e.target.value);
  // };

  useEffect(() => {
    setAnswers(question.Answers);
  }, [question.Answers]);

  const qtdAnwers = answers.length;

  const handleAddAnswer = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
          image: aluno.image,
        },
      };

      setAnswers([...answers, answerAdded]);

      setNewAnswer("");
      setIsLoading(false);
      // console.log(response);
    } catch (error) {
      alert(error);
      setIsLoading(false);
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

  const student = getUser();

  return (
    <QuestionCard>
      <header>
        <img
          src={question.Student.image || imgProfile}
          alt="Imagem de perfil"
        />
        <strong>
          por{" "}
          {student.studentId === question.Student.id
            ? "Você"
            : question.Student.name}
        </strong>
        <p>
          em {format(new Date(question.created_at), "dd/MM/yyyy 'as' HH:mm")}
        </p>
        {question.gist && (
          <GistIcon onClick={() => setCurrentGist(question.gist)} />
        )}
      </header>
      <section>
        <strong>{question.title}</strong>
        <p>{question.description}</p>
        {question.image ? (
          <img src={question.image} alt="Imagem da pergunta" />
        ) : (
          ""
        )}
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
        <img src={answer.Student.image || imgProfile} alt="Imagem de perfil" />
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

function NewQuestion({ handleReload, setIsLoading }) {
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
    gist: "",
  });

  const [categories, setCategories] = useState([]);

  const [categoriesSel, setCategoriesSel] = useState([]);

  const [image, setImage] = useState(null);

  const imageRef = useRef();

  const categoriesRef = useRef();

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

  const handleCategories = (e) => {
    const idSel = e.target.value;

    const categorySel = categories.find((c) => c.id.toString() === idSel);

    if (categorySel && !categoriesSel.includes(categorySel))
      setCategoriesSel([...categoriesSel, categorySel]);

    e.target[e.target.selectedIndex].disabled = true;
    e.target.value = "";
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      imageRef.current.src = URL.createObjectURL(e.target.files[0]);
      imageRef.current.style.display = "flex";
    } else {
      imageRef.current.src = "";
      imageRef.current.style.display = "none";
    }

    setImage(e.target.files[0]);
  };

  const handleUnselCategory = (idUnsel) => {
    setCategoriesSel(categoriesSel.filter((c) => c.id !== idUnsel));

    const { options } = categoriesRef.current;

    for (let index = 0; index < options.length; index++) {
      if (options[index].value === idUnsel.toString())
        options[index].disabled = false;
    }
  };

  const handleAddNewQuestion = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();

    data.append("title", newQuestion.title);
    data.append("description", newQuestion.description);

    const categories = categoriesSel.reduce((s, c) => (s += c.id + ","), "");

    data.append("categories", categories.substr(0, categories.length - 1));

    if (image) data.append("image", image);
    if (newQuestion.gist) data.append("gist", newQuestion.gist);

    setIsLoading(true);

    try {
      await api.post("/questions", data, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      handleReload();
    } catch (error) {
      alert(error);
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleInput = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.id]: e.target.value });
  };

  return (
    <FormNewQuestion onSubmit={handleAddNewQuestion}>
      <Input
        id="title"
        label="Titulo"
        value={newQuestion.title}
        handler={handleInput}
        required
      />
      <Input
        id="description"
        label="Descrição"
        value={newQuestion.description}
        handler={handleInput}
        required
      />
      <Input
        id="gist"
        label="Gist"
        value={newQuestion.gist}
        handler={handleInput}
      />
      <Select
        id="categories"
        label="Categorias"
        handler={handleCategories}
        ref={categoriesRef}
      >
        <option value="">Selecione</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.description}
          </option>
        ))}
      </Select>
      <div>
        {categoriesSel.map((c) => (
          <Tag
            key={c.id}
            info={c.description}
            handleClose={() => handleUnselCategory(c.id)}
          ></Tag>
        ))}
      </div>
      <input type="file" onChange={handleImage} />
      <img alt="Pré-visualização" ref={imageRef} />
      <button>Enviar</button>
    </FormNewQuestion>
  );
}

function Gist({ gist, handleClose }) {
  if (gist) {
    const formatedGist = gist.split(".com/").pop();
    return (
      <Modal
        title="Exemplo de código"
        handleClose={() => handleClose(undefined)}
      >
        <ContainerGist>
          <ReactEmbedGist gist={formatedGist} />
        </ContainerGist>
      </Modal>
    );
  } else return null;
}

function Home() {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingFeed, setIsLoadingFeed] = useState(false);

  const [questions, setQuestions] = useState([]);

  const [reload, setReload] = useState(null);

  const [showNewQuestion, setShowNewQuestion] = useState(false);

  const [currentGist, setCurrentGist] = useState(undefined);

  const [searchQuestion, setSearchQuestion] = useState([]);

  const [page, setPage] = useState(1);

  const [totalQuestions, setTotalQuestions] = useState(0);

  const loadQuestions = async () => {
    //Se já estiver buscando, não busca de novo
    if (isLoadingFeed) return;

    //Se tiver chego no fim, não busca de novo
    if (totalQuestions > 0 && totalQuestions == questions.length) return;

    setIsLoadingFeed(true);
    const response = await api.get("/feed", {
      params: { page },
    });

    setPage(page + 1);

    setQuestions([...questions, ...response.data]);

    setTotalQuestions(response.headers["x-total-count"]);

    setIsLoadingFeed(false);
  };

  useEffect(() => {
    loadQuestions();
  }, [reload]);

  const handleSignOut = () => {
    signOut();

    history.replace("/");
  };

  const handleReload = () => {
    setShowNewQuestion(false);
    setIsLoading(false);
    setPage(1);
    setQuestions([]);
    setReload(Math.random());
  };

  const searchSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/questions/feed/search", {
        searchParams: searchQuestion,
      });

      setQuestions(response.data);

      setIsLoading(false);
      setSearchQuestion("");
      console.log(response.data);
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuestion(e.target.value);
  };

  const feedScrollObserver = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 100) loadQuestions();
  };

  return (
    <>
      {isLoading && <Loading />}

      <Gist gist={currentGist} handleClose={setCurrentGist} />

      {showNewQuestion && (
        <Modal
          title="Faça uma pergunta"
          handleClose={() => setShowNewQuestion(false)}
        >
          <NewQuestion
            handleReload={handleReload}
            setIsLoading={setIsLoading}
          ></NewQuestion>
        </Modal>
      )}
      <Container>
        <Header>
          <Logo src={logo} onClick={handleReload} />
          <form onSubmit={searchSubmit}>
            <div>
              <Input
                id="searchBar"
                type="text"
                label="Pesquise algo que te interessa"
                value={searchQuestion}
                handler={handleSearch}
              />
              <button>Procurar</button>
            </div>
          </form>
          <IconSignOut onClick={handleSignOut} />
        </Header>
        <Content>
          <ProfileContainer>
            <Profile handleReload={handleReload} setIsLoading={setIsLoading} />
          </ProfileContainer>
          <FeedContainer onScroll={feedScrollObserver}>
            {questions.map((q) => (
              <Question
                question={q}
                setIsLoading={setIsLoading}
                setCurrentGist={setCurrentGist}
              />
            ))}
            {isLoadingFeed && <SpinnerLoading />}
            {/* <button onClick={loadQuestions}>Ver Mais</button> */}
          </FeedContainer>
          <ActionsContainer>
            <button onClick={() => setShowNewQuestion(true)}>
              Fazer uma pergunta
            </button>
          </ActionsContainer>
        </Content>
      </Container>
    </>
  );
}

export default Home;
