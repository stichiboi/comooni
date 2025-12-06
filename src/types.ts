export interface Question {
  title: string;
  imageUrl: string;
  answer: string;
  province: string;
}

export interface DataPoint {
  nome_comune: string;
  codice_provincia: string;
  lat: number;
  lon: number;
  superficie_kmq: number;
  flag_capoluogo: string;
  pageviews: number;
  provincia: string;
  regione: string;
  abitanti: number | null;
  immagine: string;
}

export const Difficulty = {
  Easy: "easy",
  Medium: "medium",
  Hard: "hard",
};

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty]; // "easy" | "medium" | "hard"

export interface GameOption {
  difficulty: Difficulty;
  label: string;
  color: string;
  questionSet: string;
}

export interface GameStats {
  difficulty: Difficulty;
  score: number;
  answers: { question: Question; isCorrect: boolean }[];
}
