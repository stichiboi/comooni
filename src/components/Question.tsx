import type { Question } from "../types";
import { useCallback, useMemo, useState } from "react";

interface QuestionProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

const regions = [
  "Lazio",
  "Lombardia",
  "Liguria",
  "Valle d'Aosta",
  "Veneto",
  "Friuli-Venezia Giulia",
  "Emilia-Romagna",
  "Toscana",
  "Umbria",
  "Marche",
  "Abruzzo",
  "Molise",
  "Campania",
  "Puglia",
  "Basilicata",
  "Calabria",
  "Sicilia",
  "Sardegna",
  "Trentino-Alto Adige",
  "Piemonte",
];

function getRandomOptions(answer: string, count: number = 4) {
  const answerIndex = regions.indexOf(answer);

  const indexes = new Set<number>([answerIndex]);
  while (indexes.size < count) {
    const index = Math.floor(Math.random() * regions.length);
    indexes.add(index);
  }
  // shuffle array
  const shuffled = Array.from(indexes).sort(() => Math.random() - 0.5);
  return shuffled.map((index) => regions[index]);
}

export function Question({ question, onAnswer }: QuestionProps) {
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    setHasAnswered(true);
    setIsCorrect(isCorrect);
  }, []);

  const goNext = useCallback(() => {
    setHasAnswered(false);
    onAnswer(isCorrect);
    setIsCorrect(false);
  }, [onAnswer, isCorrect]);

  const rawOptions = useMemo(() => {
    return getRandomOptions(question.answer);
  }, [question.answer]);

  const options = useMemo(() => {
    return (
      <div>
        {rawOptions.map((option) => (
          <button
            key={option}
            style={{
              backgroundColor: hasAnswered
                ? option === question.answer
                  ? "green"
                  : "red"
                : "transparent",
              opacity: hasAnswered ? 0.5 : 1,
            }}
            onClick={(e) => {
              if (hasAnswered) {
                return;
              }
              e.stopPropagation();
              handleAnswer(option === question.answer);
            }}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }, [question.answer, handleAnswer, hasAnswered, rawOptions]);

  return (
    <main
      onClick={() => {
        if (hasAnswered) {
          goNext();
        }
      }}
    >
      <section>
        <img src={question.imageUrl} alt={question.title} />
        <h2>{question.title}</h2>
      </section>
      <section>{options}</section>
    </main>
  );
}
