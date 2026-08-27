// PageHeader — DAY N / date / fraction stamp
export default function PageHeader({ dayNumber, date, total, showFraction = true }) {
  const formatted = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="space-y-1">
      {/* Day stamp */}
      <div className="flex items-baseline gap-4">
        <h2
          className="font-serif text-display-lg text-secondary"
          style={{ letterSpacing: "-0.02em", lineHeight: "1.1" }}
        >
          Day {dayNumber}
        </h2>
        {showFraction && total && (
          <span className="font-sans text-label-md text-on-surface-variant uppercase tracking-widest self-end pb-2">
            {dayNumber} / {total}
          </span>
        )}
      </div>

      {/* Date */}
      {formatted && (
        <p className="font-sans text-label-md text-on-surface-variant uppercase tracking-widest">
          {formatted}
        </p>
      )}

      {/* Decorative ruled line */}
      <div className="w-24 h-px bg-outline-variant/50 mt-2" />
    </div>
  );
}
