// ProgressBar — tally-mark style (thin vertical bars)
export default function ProgressBar({ completed = 0, total = 100, current = 0 }) {
  const bars = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex items-end gap-px flex-wrap" style={{ maxWidth: "600px" }}>
      {bars.map((day) => {
        let cls = "tally-bar";
        if (day < current && day <= completed) cls += " documented";
        else if (day === current) cls += " current";
        // else remains default (empty)

        return (
          <div
            key={day}
            className={cls}
            style={{ height: day % 5 === 0 ? "20px" : "14px" }} // every 5th bar is taller (tally)
            title={`Day ${day}`}
          />
        );
      })}
    </div>
  );
}
