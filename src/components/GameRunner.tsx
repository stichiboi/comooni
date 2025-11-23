import { useState } from "react";
import type { DataPoint, Question } from "../types";
import { Question as QuestionComponent } from "./Question";
import { useQuery } from "@tanstack/react-query";

interface GameRunnerProps {
  difficulty: string;
  onGameOver: (score: number) => void;
}

function mapDataPointToQuestion(dataPoint: DataPoint): Question {
  return {
    title: dataPoint.nome_comune,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/PratoSesia_panorama_inv.jpg/960px-PratoSesia_panorama_inv.jpg",
    answer: dataPoint.regione,
  };
}

const GAME_LENGTH = 20;

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
          // pick 20 at random
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

  const onAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    if (currentQuestion === questions!.length - 1) {
      onGameOver(score);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!questions) {
    return <div>No questions found</div>;
  }

  return (
    <div>
      <QuestionComponent
        onAnswer={onAnswer}
        question={questions[currentQuestion]}
      />
    </div>
  );
}
