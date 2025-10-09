import React from 'react';

const AnomiaShape = ({ shape, size = 60, color = "#ffffff", className = "" }) => {
  const renderShape = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    
    switch (shape) {
      case 'circle':
        return (
          <circle
            cx={centerX}
            cy={centerY}
            r={size / 2}
            fill={color}
          />
        );

      case 'square': // The "grid" symbol is a square in the base game.
        return (
          <rect
            x={centerX - size / 2}
            y={centerY - size / 2}
            width={size}
            height={size}
            fill={color}
            rx={size * 0.2}
            ry={size * 0.2}
          />
        );

      case 'plus': // Green plus sign
        const plusThickness = size * 0.2;
        return (
          <g>
            <rect
              x={centerX - plusThickness / 2}
              y={centerY - size / 2}
              width={plusThickness}
              height={size}
              fill={color}
              rx={plusThickness / 2}
              ry={plusThickness / 2}
            />
            <rect
              x={centerX - size / 2}
              y={centerY - plusThickness / 2}
              width={size}
              height={plusThickness}
              fill={color}
              rx={plusThickness / 2}
              ry={plusThickness / 2}
            />
          </g>
        );

      case 'waves': // Purple waves
        return (
          <g>
            <circle cx={centerX - size * 0.25} cy={centerY + size * 0.1} r={size * 0.2} fill={color} />
            <circle cx={centerX} cy={centerY - size * 0.15} r={size * 0.2} fill={color} />
            <circle cx={centerX + size * 0.25} cy={centerY + size * 0.1} r={size * 0.2} fill={color} />
          </g>
        );
        
      case 'diamond': // Yellow diamond
        return (
          <rect
            x={centerX - size / 2}
            y={centerY - size / 2}
            width={size}
            height={size}
            fill={color}
            rx={size * 0.1}
            ry={size * 0.1}
            transform={`rotate(45 ${centerX} ${centerY})`}
          />
        );

      case 'asterisk': // Brown asterisk
        const asteriskThickness = size * 0.15;
        return (
          <g>
            <rect
              x={centerX - asteriskThickness / 2}
              y={centerY - size / 2}
              width={asteriskThickness}
              height={size}
              fill={color}
              rx={asteriskThickness / 2}
              ry={asteriskThickness / 2}
            />
            <rect
              x={centerX - size / 2}
              y={centerY - asteriskThickness / 2}
              width={size}
              height={asteriskThickness}
              fill={color}
              rx={asteriskThickness / 2}
              ry={asteriskThickness / 2}
              transform={`rotate(60 ${centerX} ${centerY})`}
            />
            <rect
              x={centerX - size / 2}
              y={centerY - asteriskThickness / 2}
              width={size}
              height={asteriskThickness}
              fill={color}
              rx={asteriskThickness / 2}
              ry={asteriskThickness / 2}
              transform={`rotate(120 ${centerX} ${centerY})`}
            />
          </g>
        );

      case 'dots': // Four red dots
        const dotRadius = size * 0.1;
        const dotOffset = size * 0.2;
        return (
          <g>
            <circle cx={centerX - dotOffset} cy={centerY - dotOffset} r={dotRadius} fill={color} />
            <circle cx={centerX + dotOffset} cy={centerY - dotOffset} r={dotRadius} fill={color} />
            <circle cx={centerX - dotOffset} cy={centerY + dotOffset} r={dotRadius} fill={color} />
            <circle cx={centerX + dotOffset} cy={centerY + dotOffset} r={dotRadius} fill={color} />
          </g>
        );

      case 'equals': // Pink equal signs
        const equalsThickness = size * 0.15;
        const equalsOffset = size * 0.15;
        return (
          <g>
            <rect
              x={centerX - size / 2}
              y={centerY - equalsOffset - equalsThickness / 2}
              width={size}
              height={equalsThickness}
              fill={color}
              rx={equalsThickness / 2}
              ry={equalsThickness / 2}
            />
            <rect
              x={centerX - size / 2}
              y={centerY + equalsOffset - equalsThickness / 2}
              width={size}
              height={equalsThickness}
              fill={color}
              rx={equalsThickness / 2}
              ry={equalsThickness / 2}
            />
          </g>
        );

      case 'wild': // Wild card - shows question mark or special symbol
        return (
          <g>
            <circle
              cx={centerX}
              cy={centerY}
              r={size / 2}
              fill={color}
              stroke="#ff6b35"
              strokeWidth={size * 0.1}
            />
            <text
              x={centerX}
              y={centerY + size * 0.1}
              textAnchor="middle"
              fontSize={size * 0.4}
              fill="#ff6b35"
              fontWeight="bold"
            >
              ?
            </text>
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`anomia-shape ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {renderShape()}
      </svg>
    </div>
  );
};

export default AnomiaShape;
