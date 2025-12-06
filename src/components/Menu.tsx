import { Difficulty, type GameOption, type GameStats } from "../types";
import { Button } from "./generic/Button";
import "./Menu.css";
import { Recap } from "./Recap";

interface MenuProps {
  onStartGame: (difficulty: Difficulty) => void;

  previousGameStats: GameStats | null;
}
export function Menu({ onStartGame, previousGameStats }: MenuProps) {
  const difficulties: Record<string, GameOption> = {
    easy: {
      difficulty: Difficulty.Easy,
      label: "Facile",
      color: "#00FF00",
      questionSet: "easy.json",
    },
    medium: {
      difficulty: Difficulty.Medium,
      label: "Medio",
      color: "#FFFF00",
      questionSet: "medium.json",
    },
    hard: {
      difficulty: Difficulty.Hard,
      label: "Difficile",
      color: "#FF0000",
      questionSet: "hard.json",
    },
  };

  return (
    <main className="menu">
      <h1>{"Comooni"}</h1>
      {previousGameStats ? <Recap gameStats={previousGameStats} /> : null}
      <section className="difficulty-buttons">
        {Object.values(difficulties).map((difficulty) => (
          <Button
            key={difficulty.difficulty}
            className={difficulty.difficulty}
            onClick={() => onStartGame(difficulty.difficulty)}
          >
            {difficulty.label}
          </Button>
        ))}
      </section>
    </main>
  );
}
