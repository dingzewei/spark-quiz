interface ProgressBarProps {
  current: number;
  total: number;
  showText?: boolean;
  color?: string;
}

export default function ProgressBar({ current, total, showText = true, color = 'bg-blue-500' }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        {showText && (
          <span className="text-sm text-gray-600">{current}/{total}</span>
        )}
        {showText && (
          <span className="text-sm text-gray-500">{pct}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
