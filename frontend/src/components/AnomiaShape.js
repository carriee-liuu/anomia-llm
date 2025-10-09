import React from 'react';

const AnomiaShape = ({ shape, size = 60, color = "#ffffff", className = "" }) => {
  const shapeStyle = {
    width: size,
    height: size,
    fill: color,
    stroke: color,
    strokeWidth: 2,
  };

  const renderShape = () => {
    switch (shape) {
      case 'circle':
        return (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            style={shapeStyle}
          />
        );
      
      case 'square':
        return (
          <rect
            x={2}
            y={2}
            width={size - 4}
            height={size - 4}
            style={shapeStyle}
          />
        );
      
      case 'triangle':
        return (
          <polygon
            points={`${size / 2},2 ${size - 2},${size - 2} 2,${size - 2}`}
            style={shapeStyle}
          />
        );
      
      case 'diamond':
        return (
          <polygon
            points={`${size / 2},2 ${size - 2},${size / 2} ${size / 2},${size - 2} 2,${size / 2}`}
            style={shapeStyle}
          />
        );
      
      case 'star':
        // 5-pointed star
        const starPoints = [];
        const centerX = size / 2;
        const centerY = size / 2;
        const outerRadius = size / 2 - 2;
        const innerRadius = outerRadius * 0.4;
        
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = centerX + radius * Math.cos(angle - Math.PI / 2);
          const y = centerY + radius * Math.sin(angle - Math.PI / 2);
          starPoints.push(`${x},${y}`);
        }
        
        return (
          <polygon
            points={starPoints.join(' ')}
            style={shapeStyle}
          />
        );
      
      case 'heart':
        // Heart shape using path
        const heartPath = `M ${size / 2},${size - 2} 
          C ${size / 2},${size * 0.7} ${size * 0.2},${size * 0.4} ${size * 0.2},${size * 0.6}
          C ${size * 0.2},${size * 0.8} ${size * 0.4},${size * 0.9} ${size / 2},${size - 2}
          C ${size * 0.6},${size * 0.9} ${size * 0.8},${size * 0.8} ${size * 0.8},${size * 0.6}
          C ${size * 0.8},${size * 0.4} ${size * 0.6},${size * 0.7} ${size / 2},${size - 2} Z`;
        
        return (
          <path
            d={heartPath}
            style={shapeStyle}
          />
        );
      
      case 'hexagon':
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = size / 2 + (size / 2 - 2) * Math.cos(angle);
          const y = size / 2 + (size / 2 - 2) * Math.sin(angle);
          hexPoints.push(`${x},${y}`);
        }
        
        return (
          <polygon
            points={hexPoints.join(' ')}
            style={shapeStyle}
          />
        );
      
      case 'pentagon':
        const pentPoints = [];
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI) / 5;
          const x = size / 2 + (size / 2 - 2) * Math.cos(angle - Math.PI / 2);
          const y = size / 2 + (size / 2 - 2) * Math.sin(angle - Math.PI / 2);
          pentPoints.push(`${x},${y}`);
        }
        
        return (
          <polygon
            points={pentPoints.join(' ')}
            style={shapeStyle}
          />
        );
      
      default:
        return (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            style={shapeStyle}
          />
        );
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
