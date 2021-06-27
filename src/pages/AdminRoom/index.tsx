import { useHistory, useParams } from "react-router-dom";

import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";
import { Question } from "../../components/Question";
import { ToggleButton } from "../../components/ToggleButton";
import { useRoom } from "../../hooks/useRoom";
import { useTheme } from "../../hooks/useTheme";
import { database } from "../../services/firebase";

import logoImg from "../../assets/images/logo.svg";
import lightLogoImg from "../../assets/images/logo-light.svg";

import deleteImg from "../../assets/images/delete.svg";
import checkImg from "../../assets/images/check.svg";
import answerImg from "../../assets/images/answer.svg";

import "../Room/styles.scss";
import "./styles.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);
  const { currentTheme, handleToggleTheme } = useTheme();

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Você tem certeza que deseja excluir essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({ endedAt: new Date() });

    history.push("/");
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .update({ isAnswered: true });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .update({ isHighlighted: true });
  }

  return (
    <div id="page-room" className={`theme-${currentTheme}`}>
      <header>
        <div className="content">
          <div>
            <img
              src={currentTheme === "dark" ? lightLogoImg : logoImg}
              alt="Letmeask logo"
              className="logo"
            />
            <div className="theme-control">
              <ToggleButton
                checked={currentTheme === "dark"}
                onToggle={handleToggleTheme}
              />
              <span>Tema escuro</span>
            </div>
          </div>
          <div>
            <RoomCode code={roomId} />
            <Button type="button" isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length !== 0 && (
            <span>{questions.length} pergunta(s)</span>
          )}
        </div>
        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
                  <button
                    type="button"
                    title="Marcar pergunta como respondida"
                    className={question.isAnswered ? "active" : ""}
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  >
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                  </button>

                  <button
                    type="button"
                    title="Dar destaque à pergunta"
                    className={question.isHighlighted ? "active" : ""}
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Dar destaque à pergunta" />
                  </button>
                </>
              )}

              <button
                type="button"
                title="Excluir pergunta"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Excluir pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
