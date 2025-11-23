import { useCallback, useState } from "react";
import { Menu } from "./Menu";
import { GameRunner } from "./GameRunner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./GameManager.css";

export function GameManager() {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const queryClient = new QueryClient();

  const startGame = useCallback(
    (difficulty: string) => {
      setDifficulty(difficulty);
      setIsGameRunning(true);
    },
    [setDifficulty]
  );

  const onGameOver = useCallback(
    (score: number) => {
      setPreviousScore(score);
      setIsGameRunning(false);

      setTimeout(() => {
        // keep as separate to allow transition back to menu
        setDifficulty(null);
      }, 450);
    },
    [setDifficulty, setPreviousScore]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={"manager scrollable" + (isGameRunning ? " scrolled" : "")}
      >
        <Menu onStartGame={startGame} previousScore={previousScore} />
        {difficulty && (
          <GameRunner onGameOver={onGameOver} difficulty={difficulty!} />
        )}
      </div>
    </QueryClientProvider>
  );
}
