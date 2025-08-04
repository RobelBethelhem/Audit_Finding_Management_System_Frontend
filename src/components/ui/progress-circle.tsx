import React from 'react';

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  color?: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  size = 80,
  strokeWidth = 8,
  className = '',
  showPercentage = true,
  color
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on percentage if not provided
  const getColor = () => {
    if (color) return color;
    if (percentage >= 80) return '#10b981'; // green-500
    if (percentage >= 60) return '#f59e0b'; // amber-500
    if (percentage >= 40) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  const progressColor = getColor();

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-700">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
};

// Mini version for smaller spaces
export const MiniProgressCircle: React.FC<Omit<ProgressCircleProps, 'size' | 'strokeWidth'>> = (props) => (
  <ProgressCircle {...props} size={40} strokeWidth={4} />
);

// Large version for prominent display
export const LargeProgressCircle: React.FC<Omit<ProgressCircleProps, 'size' | 'strokeWidth'>> = (props) => (
  <ProgressCircle {...props} size={120} strokeWidth={10} />
);
