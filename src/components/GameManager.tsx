import { useCallback, useState } from "react";
import { Menu } from "./Menu";
import { GameRunner } from "./GameRunner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./GameManager.css";
import type { Difficulty, GameStats, Question } from "../types";

export function GameManager() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [previousGameStats, setPreviousGameStats] = useState<GameStats | null>(
    null
  );
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const queryClient = new QueryClient();

  const startGame = useCallback(
    (difficulty: Difficulty) => {
      setDifficulty(difficulty);
      setIsGameRunning(true);
    },
    [setDifficulty]
  );

  const onGameOver = useCallback(
    (answers: { question: Question; isCorrect: boolean }[]) => {
      setPreviousGameStats({
        score: answers.reduce(
          (acc, answer) => acc + (answer.isCorrect ? 1 : 0),
          0
        ),
        answers: answers,
        difficulty: difficulty!,
      });
      setIsGameRunning(false);

      setTimeout(() => {
        // keep as separate to allow transition back to menu
        setDifficulty(null);
      }, 450);
    },
    [setDifficulty, setPreviousGameStats, difficulty]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={"manager scrollable" + (isGameRunning ? " scrolled" : "")}
      >
        <Menu onStartGame={startGame} previousGameStats={previousGameStats} />
        {difficulty && (
          <GameRunner onGameOver={onGameOver} difficulty={difficulty!} />
        )}
      </div>
    </QueryClientProvider>
  );
}
