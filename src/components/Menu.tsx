import { Button } from "./generic/Button";
import "./Menu.css";

interface Difficulty {
  label: string;
  color: string;
  questionSet: string;
}

interface MenuProps {
  onStartGame: (difficulty: string) => void;

  previousScore: number | null;
}
export function Menu({ onStartGame, previousScore }: MenuProps) {
  const difficulties: Record<string, Difficulty> = {
    easy: {
      label: "Facile",
      color: "#00FF00",
      questionSet: "easy.json",
    },
    medium: {
      label: "Medio",
      color: "#FFFF00",
      questionSet: "medium.json",
    },
    hard: {
      label: "Difficile",
      color: "#FF0000",
      questionSet: "hard.json",
    },
  };

  return (
    <main className="menu">
      <h1>{"Comooni"}</h1>
      <section>
        Indovina la regione dei comuni italiani, basandoti solo su nome e
        immagine!
      </section>
      {previousScore !== null && (
        <section>
          <h3>Punteggio precedente</h3>
          <p>{previousScore} / 10</p>
        </section>
      )}
      <section className="difficulty-buttons">
        {Object.entries(difficulties).map(([key, difficulty]) => (
          <Button key={key} className={key} onClick={() => onStartGame(key)}>
            {difficulty.label}
          </Button>
        ))}
      </section>
    </main>
  );
}
