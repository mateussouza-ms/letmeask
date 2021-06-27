import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";

import { database } from "../../services/firebase";
import { Button } from "../../components/Button";
import { ToggleButton } from "../../components/ToggleButton";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";
import lightLogoImg from "../../assets/images/logo-light.svg";
import googleIconImg from "../../assets/images/google-icon.svg";
import loginIconImg from "../../assets/images/login-icon.svg";

import "./styles.scss";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");
  const { currentTheme, handleToggleTheme } = useTheme();

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Room does not exists.");
      return;
    }

    if (roomRef.val().endedAt) {
      alert("Room already closed.");
      return;
    }

    history.push(`rooms/${roomCode}`);
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

          <button
            type="button"
            className="create-room"
            onClick={handleCreateRoom}
          >
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={(event) => {
                setRoomCode(event.target.value);
              }}
            />
            <Button type="submit">
              <img src={loginIconImg} alt="Ícone de login" />
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
