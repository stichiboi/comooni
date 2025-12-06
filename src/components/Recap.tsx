import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { GameStats } from "../types";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

interface RecapProps {
  gameStats: GameStats;
}

export function Recap({ gameStats }: RecapProps) {
  return (
    <div>
      <h2>Risultati</h2>
      <h3>Punteggio: {gameStats.score}</h3>
      <h3>Difficoltà: {gameStats.difficulty}</h3>
      <table>
        {/* <thead></thead> */}
        <tbody>
          {gameStats.answers.map((answer) => (
            <tr key={answer.question.title}>
              <td>{answer.question.title}</td>
              <td>{answer.question.answer}</td>
              <td>
                {answer.isCorrect ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon icon={faXmark} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
