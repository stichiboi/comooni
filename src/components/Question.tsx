import { useCallback, useMemo, useState } from "react";
import type { Question } from "../types";
import "./Question.css";
import { Button } from "./generic/Button";

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
  "Friuli Venezia Giulia",
  "Emilia Romagna",
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
  "Trentino Alto Adige",
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
  console.log(shuffled);
  return shuffled.map((index) => regions[index]);
}

export function Question({ question, onAnswer }: QuestionProps) {
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [selected, setSelected] = useState<number | null>(null);
  const rawOptions = useMemo(() => {
    return getRandomOptions(question.answer);
  }, [question.answer]);

  const handleAnswer = useCallback((selected: number) => {
    setSelected(selected);
    setHasAnswered(true);
  }, []);

  const goNext = useCallback(() => {
    setHasAnswered(false);
    setSelected(null);
    const isCorrect = rawOptions[selected!] === question.answer;
    onAnswer(isCorrect);
  }, [rawOptions, selected, question.answer, onAnswer]);

  const options = useMemo(() => {
    return (
      <section className={"option-buttons"}>
        {rawOptions.map((option, index) => {
          const classNames = ["align-left", "option", "option-button"];
          const isCorrect = option === question.answer;
          if (hasAnswered) {
            classNames.push("disabled");
            if (isCorrect) {
              classNames.push("correct");
            } else if (index === selected) {
              classNames.push("incorrect");
            }
          }
          return (
            <Button
              key={option}
              className={classNames.join(" ")}
              onClick={() => {
                if (hasAnswered) {
                  return;
                }
                handleAnswer(index);
              }}
            >
              <span>{index + 1}.</span>
              <span>{option}</span>
            </Button>
          );
        })}
      </section>
    );
  }, [rawOptions, hasAnswered, question.answer, selected, handleAnswer]);

  return (
    <main className="question">
      <section className="content">
        <img src={question.imageUrl} alt={question.title} />
        <h2>
          <span>{question.title} </span>
          <span> - </span>
          {hasAnswered && question.province ? (
            <span className="province">{question.province}</span>
          ) : (
            "???"
          )}
        </h2>
      </section>
      <div className="actions">
        {options}
        <footer>
          <Button onClick={goNext} className="next" disabled={!hasAnswered}>
            Continua
          </Button>
        </footer>
      </div>
    </main>
  );
}
