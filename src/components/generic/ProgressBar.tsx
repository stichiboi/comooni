import "./ProgressBar.css";

interface ProgressBarProps {
  // progress is a number between 0 and 1
  progress: number;
  label?: string;
  color?: string;
}

export function ProgressBar({
  progress,
  label,
  color = "#58cc02",
}: ProgressBarProps) {
  return (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{
          width: `${progress * 100}%`,
          background: color,
          boxShadow: `0 2px 4px color-mix(in srgb, ${color} 30%, transparent)`,
        }}
      />
      {label && <span className="progress-bar-label">{label}</span>}
    </div>
  );
}
