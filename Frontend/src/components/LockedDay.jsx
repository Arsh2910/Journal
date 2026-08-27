// LockedDay — shown when navigating to a future day
export default function LockedDay({ dayNumber }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 opacity-40">
      <div className="w-16 h-20 border border-outline-variant/30 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
          className="text-outline">
          <rect x="3" y="11" width="18" height="11" rx="0" ry="0"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>
      <div className="text-center space-y-1">
        <p className="font-sans text-label-md text-outline uppercase tracking-widest">
          Day {dayNumber}
        </p>
        <p className="font-serif italic text-on-surface-variant text-body-md">
          This page has not yet been written.
        </p>
      </div>
    </div>
  );
}
