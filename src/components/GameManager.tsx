import { useCallback, useMemo, useState } from "react";
import { Menu } from "./Menu";
import { GameRunner } from "./GameRunner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./GameManager.css";

export function GameManager() {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const queryClient = new QueryClient();

  const startGame = useCallback(
    (difficulty: string) => {
      setDifficulty(difficulty);
    },
    [setDifficulty]
  );

  const onGameOver = useCallback(
    (score: number) => {
      setDifficulty(null);
      setPreviousScore(score);
    },
    [setDifficulty, setPreviousScore]
  );

  const content = useMemo(() => {
    if (!difficulty) {
      return <Menu onStartGame={startGame} previousScore={previousScore} />;
    }
    return <GameRunner onGameOver={onGameOver} difficulty={difficulty} />;
  }, [difficulty, previousScore, startGame, onGameOver]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="manager">{content}</div>
    </QueryClientProvider>
  );
}
