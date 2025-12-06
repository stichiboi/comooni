import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { GameStats } from "../types";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./Recap.css";

interface RecapProps {
  gameStats: GameStats;
}

export function Recap({ gameStats }: RecapProps) {
  return (
    <div className="recap">
      <h3>Punteggio: {gameStats.score}</h3>
      <table className="recap-table">
        <tbody>
          {gameStats.answers.map(({ isCorrect, question }) => (
            <tr key={question.title}>
              <td>{question.title}</td>
              <td>{question.answer}</td>
              <td className={isCorrect ? "right" : "wrong"}>
                {isCorrect ? (
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
