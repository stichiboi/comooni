import type { Question } from "../types";
import { useMemo } from "react";

interface QuestionProps {
  question: Question;
  onAnswer: () => void;
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
  return Array.from(indexes).map((index) => regions[index]);
}

export function Question({ question, onAnswer }: QuestionProps) {
  const options = useMemo(() => {
    const rawOptions = getRandomOptions(question.answer);

    return (
      <div>
        {rawOptions.map((option) => (
          <button key={option} onClick={onAnswer}>
            {option}
          </button>
        ))}
      </div>
    );
  }, [question.answer, onAnswer]);

  return (
    <main>
      <section>
        <img src={question.imageUrl} alt={question.title} />
        <h2>{question.title}</h2>
      </section>
      <section>{options}</section>
    </main>
  );
}
