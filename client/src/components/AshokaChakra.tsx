import React from 'react';

interface AshokaChakraProps {
  size?: number;
  color?: string;
  className?: string;
}

const AshokaChakra: React.FC<AshokaChakraProps> = ({ size = 100, color = "currentColor", className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
    >
      {/* Outer circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="46" 
        stroke={color} 
        strokeWidth="3" 
        fill="none" 
      />
      {/* 24 spokes */}
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="12"
          x2="50"
          y2="46"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${i * 15} 50 50)`}
        />
      ))}
      {/* Center dot */}
      <circle cx="50" cy="50" r="5" fill={color} />
    </svg>
  );
};

export default AshokaChakra;
