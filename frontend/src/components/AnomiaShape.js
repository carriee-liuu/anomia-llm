import React from 'react';

const AnomiaShape = ({ shape, size = 60, color = '#ffffff' }) => {
  const shapeStyle = {
    width: size,
    height: size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
  };

  const renderShape = () => {
    switch (shape) {
      case 'circle':
        return (
          <div
            style={{
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: '50%',
              backgroundColor: color,
              border: `3px solid ${color}`,
              background: 'transparent'
            }}
          />
        );
      
      case 'square':
        return (
          <div
            style={{
              width: size * 0.7,
              height: size * 0.7,
              backgroundColor: color,
              border: `3px solid ${color}`,
              background: 'transparent'
            }}
          />
        );
      
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size * 0.4}px solid transparent`,
              borderRight: `${size * 0.4}px solid transparent`,
              borderBottom: `${size * 0.7}px solid ${color}`,
            }}
          />
        );
      
      case 'diamond':
        return (
          <div
            style={{
              width: size * 0.6,
              height: size * 0.6,
              backgroundColor: color,
              border: `3px solid ${color}`,
              background: 'transparent',
              transform: 'rotate(45deg)'
            }}
          />
        );
      
      case 'star':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      
      case 'heart':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      
      case 'hexagon':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z"/>
          </svg>
        );
      
      case 'pentagon':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <path d="M12 2l8 6v8l-8 6-8-6V8l8-6z"/>
          </svg>
        );
      
      default:
        return (
          <div
            style={{
              width: size * 0.6,
              height: size * 0.6,
              backgroundColor: color,
              borderRadius: '4px'
            }}
          />
        );
    }
  };

  return (
    <div style={shapeStyle}>
      {renderShape()}
    </div>
  );
};

export default AnomiaShape;
