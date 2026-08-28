export default function LoadingState({ message = "Turning the page..." }) {
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center space-y-4 opacity-70 animate-pulse">
      <div className="w-12 h-12 border border-outline-variant/40 flex items-center justify-center rotate-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-secondary"
        >
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </div>
      <p className="font-serif italic text-on-surface-variant/60 text-sm">
        {message}
      </p>
    </div>
  );
}
