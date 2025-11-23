import { useState } from "react";
import { Menu } from "./Menu";
import { GameRunner } from "./GameRunner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function GameManager() {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const queryClient = new QueryClient();

  const startGame = (difficulty: string) => {
    setDifficulty(difficulty);
  };

  const onGameOver = (score: number) => {
    setDifficulty(null);
    setPreviousScore(score);
  };

  if (!difficulty) {
    return <Menu onStartGame={startGame} previousScore={previousScore} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GameRunner onGameOver={onGameOver} difficulty={difficulty} />
    </QueryClientProvider>
  );
}
