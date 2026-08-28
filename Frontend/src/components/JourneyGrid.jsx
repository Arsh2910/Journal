import { useNavigate } from "react-router-dom";

export default function JourneyGrid({ days = [], currentDay = 0 }) {
  const navigate = useNavigate();

  if (!days.length) return null;

  const handleClick = (day, isDocumented, isPast) => {
    if (!isPast && day !== currentDay) return; // future — locked
    navigate(`/journal/${day}`);
  };

  return (
    <div className="grid grid-cols-10 md:grid-cols-[repeat(20,minmax(0,1fr))] gap-1.5 w-full">
      {days.map(({ day, completed }) => {
        const isCurrent = day === currentDay;
        const isPast    = day < currentDay;
        const isFuture  = day > currentDay;
        const isClickable = !isFuture;

        let cellClass = "aspect-square w-full transition-all duration-300 relative group flex items-center justify-center ";
        
        if (isClickable) {
          cellClass += "cursor-pointer ";
        } else {
          cellClass += "cursor-not-allowed ";
        }

        if (completed) {
          // Documented: solid primary container block with slight organic opacity variation
          const opacities = ['opacity-100', 'opacity-90', 'opacity-80'];
          const opacity = opacities[day % opacities.length];
          cellClass += `bg-primary-container ${opacity} hover:scale-110 hover:z-20 shadow-sm `;
          if (isCurrent) cellClass += "ring-2 ring-primary ring-offset-2 ring-offset-[#2b2622] ";
        } else if (isPast) {
          // Missed: outlined empty box
          cellClass += "border border-outline hover:border-primary hover:bg-primary-container/10 ";
        } else if (isCurrent) {
          // Today (not completed yet): dashed outline
          cellClass += "border-2 border-primary border-dashed hover:bg-primary-container/10 ";
        } else {
          // Future: faded out outline
          cellClass += "border border-outline/50 opacity-60 hover:border-outline hover:opacity-100 ";
        }

        return (
          <div
            key={day}
            className={cellClass}
            onClick={() => isClickable && handleClick(day, completed, isPast)}
          >
            {/* Tooltip hint */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-high border border-outline-variant px-3 py-1 text-on-surface font-sans text-label-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-30 shadow-md">
              Day {day} {completed ? "✓" : isFuture ? "🔒" : isCurrent ? "(Today)" : "✕"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
