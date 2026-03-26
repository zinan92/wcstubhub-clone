export default function DefaultAvatar({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="50" fill="url(#avatar-gradient)" />
      <circle cx="50" cy="35" r="15" fill="white" fillOpacity="0.9" />
      <path
        d="M 25 75 Q 25 55 50 55 Q 75 55 75 75 L 75 85 Q 75 95 65 95 L 35 95 Q 25 95 25 85 Z"
        fill="white"
        fillOpacity="0.9"
      />
      <defs>
        <linearGradient id="avatar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
