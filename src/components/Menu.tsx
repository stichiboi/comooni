interface Difficulty {
  label: string;
  color: string;
  questionSet: string;
}

interface MenuProps {
  onStartGame: (difficulty: string) => void;
}
export function Menu({ onStartGame }: MenuProps) {
  const difficulties: Record<string, Difficulty> = {
    easy: {
      label: "Facile",
      color: "#00FF00",
      questionSet: "easy.json",
    },
    medium: {
      label: "Medio",
      color: "#FFFF00",
      questionSet: "medium.json",
    },
    hard: {
      label: "Difficile",
      color: "#FF0000",
      questionSet: "hard.json",
    },
  };

  return (
    <div>
      <h1>{"Comooni"}</h1>
      <section>
        {Object.entries(difficulties).map(([key, difficulty]) => (
          <button
            key={key}
            style={{ backgroundColor: difficulty.color }}
            onClick={() => onStartGame(key)}
          >
            {difficulty.label}
          </button>
        ))}
      </section>
    </div>
  );
}
