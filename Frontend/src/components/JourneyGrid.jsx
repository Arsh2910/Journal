// JourneyGrid — GitHub-style contribution grid showing all challenge days
import { useNavigate } from "react-router-dom";

const WEEKS_PER_ROW = 17; // days per row chunk for visual grouping

export default function JourneyGrid({ days = [], currentDay = 0, challenge }) {
  const navigate = useNavigate();

  if (!days.length) return null;

  const handleClick = (day, isDocumented, isPast) => {
    if (!isPast && day !== currentDay) return; // future — locked
    navigate(`/journal/${day}`);
  };

  const rows = [];
  for (let i = 0; i < days.length; i += WEEKS_PER_ROW) {
    rows.push(days.slice(i, i + WEEKS_PER_ROW));
  }

  return (
    <div className="space-y-1.5">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1">
          {row.map(({ day, completed }) => {
            const isCurrent = day === currentDay;
            const isPast    = day < currentDay;
            const isFuture  = day > currentDay;
            const isClickable = !isFuture;

            let cellClass = "grid-cell";
            if (completed)    cellClass += " documented";
            else if (isCurrent) cellClass += " today";
            else if (isFuture)  cellClass += " future";

            return (
              <div
                key={day}
                className={`${cellClass} ${isClickable ? "cursor-pointer hover:ring-1 hover:ring-outline" : "cursor-not-allowed"}`}
                title={
                  isFuture
                    ? `Day ${day} — locked`
                    : completed
                    ? `Day ${day} — documented ✓`
                    : isCurrent
                    ? `Day ${day} — today`
                    : `Day ${day} — missed`
                }
                onClick={() => isClickable && handleClick(day, completed, isPast)}
              />
            );
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-6 pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 border border-outline-variant/20" style={{ background: "#45673f" }} />
          <span className="stamp-label">Documented</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 border border-outline-variant/20" style={{ background: "#abd1a1" }} />
          <span className="stamp-label">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 border border-outline-variant/20" style={{ background: "#1d1b19" }} />
          <span className="stamp-label">Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 border border-outline-variant/20 opacity-40" style={{ background: "#151311" }} />
          <span className="stamp-label">Future</span>
        </div>
      </div>
    </div>
  );
}
