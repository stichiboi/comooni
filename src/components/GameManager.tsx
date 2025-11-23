import { useState } from "react";
import { Menu } from "./Menu";
import { GameRunner } from "./GameRunner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function GameManager() {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const queryClient = new QueryClient();

  const startGame = (difficulty: string) => {
    setDifficulty(difficulty);
  };

  const onGameOver = () => {
    setDifficulty(null);
  };

  if (!difficulty) {
    return <Menu onStartGame={startGame} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GameRunner onGameOver={onGameOver} difficulty={difficulty} />
    </QueryClientProvider>
  );
}
