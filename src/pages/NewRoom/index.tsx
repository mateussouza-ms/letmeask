import { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { Button } from "../../components/Button";
import { ToggleButton } from "../../components/ToggleButton";
import { database } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";
import lightLogoImg from "../../assets/images/logo-light.svg";

import "../Home/styles.scss";
import "./styles.scss";

export function NewRoom() {
  const { user } = useAuth();
  const { currentTheme, handleToggleTheme } = useTheme();

  const [newRoom, setNewRoom] = useState("");
  const history = useHistory();

  async function handleCreateNewRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth" className={`theme-${currentTheme}`}>
      <aside>
        <div className="theme-control">
          <ToggleButton
            checked={currentTheme === "dark"}
            onToggle={handleToggleTheme}
          />
          <span>Tema escuro</span>
        </div>
        <div className="content">
          <img src={illustrationImg} alt="Imagem de ilustração" />
          <strong>Toda pergunta tem uma resposta.</strong>
          <p>Aprenda e compartilhe conhecimento com outras pessoas.</p>
        </div>
      </aside>
      <main>
        <div className="main-content">
          <img
            src={currentTheme == "dark" ? lightLogoImg : logoImg}
            alt="Letmeask logo"
            className="logo"
          />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateNewRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              value={newRoom}
              onChange={(event) => setNewRoom(event.target.value)}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>{" "}
          </p>
        </div>
      </main>
    </div>
  );
}
