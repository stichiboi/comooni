import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { DataPoint, Question } from "../types";
import "./GameRunner.css";
import { ProgressBar } from "./generic/ProgressBar";
import { Question as QuestionComponent } from "./Question";

interface GameRunnerProps {
  difficulty: string;
  onGameOver: (score: number) => void;
}

function mapDataPointToQuestion(dataPoint: DataPoint): Question {
  return {
    title: dataPoint.nome_comune,
    imageUrl: dataPoint.immagine,
    answer: dataPoint.regione,
    province: dataPoint.provincia,
  };
}

const GAME_LENGTH = 10;

export function GameRunner({ difficulty, onGameOver }: GameRunnerProps) {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const {
    data: questions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["questions", difficulty],
    queryFn: () =>
      fetch(`/questions/${difficulty}.json`)
        .then((response) => response.json())
        .then((data: DataPoint[]) => {
          const pickedIndexes = new Set<number>();
          while (pickedIndexes.size < GAME_LENGTH) {
            const index = Math.floor(Math.random() * data.length);
            pickedIndexes.add(index);
          }
          const pickedQuestions = Array.from(pickedIndexes).map((index) =>
            mapDataPointToQuestion(data[index])
          );
          return pickedQuestions;
        }),
  });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const onAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    const isLastQuestion = currentQuestion === questions!.length - 1;
    if (isLastQuestion) {
      onGameOver(score);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setIsTransitioning(true);
    }
  };

  useEffect(() => {
    if (isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 450);
    }
  }, [isTransitioning]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!questions) {
    return <div>No questions found</div>;
  }

  const difficultyColors: Record<string, string> = {
    easy: "var(--green)",
    medium: "var(--yellow)",
    hard: "var(--red)",
  };

  return (
    <div className="game-runner">
      <header className="header">
        <ProgressBar
          progress={currentQuestion / questions.length}
          label={`${currentQuestion} / ${questions.length}`}
          color={difficultyColors[difficulty] || "var(--green)"}
        />
      </header>
      <div
        className={
          "game-content" + (isTransitioning ? " scrollable scrolled" : "")
        }
      >
        {isTransitioning && (
          <QuestionComponent
            onAnswer={onAnswer}
            question={questions[currentQuestion - 1]!}
          />
        )}
        <QuestionComponent
          onAnswer={onAnswer}
          question={questions[currentQuestion]}
        />
      </div>
    </div>
  );
}
