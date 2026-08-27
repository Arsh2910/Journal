// MoodSelector — square chip selector for journal mood
const MOODS = [
  { value: "great",  label: "Great",  glyph: "✦" },
  { value: "good",   label: "Good",   glyph: "◆" },
  { value: "okay",   label: "Okay",   glyph: "◇" },
  { value: "hard",   label: "Hard",   glyph: "◈" },
  { value: "rough",  label: "Rough",  glyph: "◉" },
];

export default function MoodSelector({ value, onChange, readOnly = false }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="stamp-label mr-2">Mood</span>
      {MOODS.map((m) => (
        <button
          key={m.value}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange(m.value)}
          className={`mood-chip ${value === m.value ? "selected" : ""} ${readOnly ? "cursor-default opacity-70" : ""}`}
        >
          <span className="mr-1">{m.glyph}</span>
          {m.label}
        </button>
      ))}
    </div>
  );
}
