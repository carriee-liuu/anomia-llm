import React from 'react';

// Retro color configurations for each shape
const getRetroColors = (baseColor) => {
  const colorMap = {
    '#3B82F6': { // Blue circle
      fill: '#3B82F6',
      stroke: '#ffffff',
      shadow: '#2563EB',
      glow: '#60A5FA',
      dropShadow: 'rgba(0, 0, 0, 0.3)'
    },
    '#22C55E': { // Green circle - fallback for existing code
      fill: '#22C55E',
      stroke: '#ffffff',
      shadow: '#16a34a',
      glow: '#4ade80',
      dropShadow: 'rgba(0, 0, 0, 0.3)'
    },
    '#E8A54A': { // Orange/Gold hashtag
      fill: '#E8A54A',
      stroke: '#ffffff',
      shadow: '#D4913D',
      glow: '#F4C57C',
      dropShadow: 'rgba(0, 0, 0, 0.3)'
    },
    '#F59E0B': { // Yellow square - fallback for existing code
      fill: '#F59E0B',
      stroke: '#ffffff',
      shadow: '#D97706',
      glow: '#FCD34D',
      dropShadow: 'rgba(0, 0, 0, 0.3)'
    },
    '#9333EA': { // Purple plus
      fill: '#9333EA',
      stroke: '#ffffff',
      shadow: '#7C3AED',
      glow: '#A855F7',
      dropShadow: 'rgba(0, 0, 0, 0.3)'
    },
    '#06B6D4': { // Cyan waves
      fill: '#06B6D4',
      stroke: '#ffffff',
      shadow: '#0891B2',
      glow: '#22D3EE',
      dropShadow: 'rgba(0, 0, 0, 0.3)'
    },
    '#FF7F50': { // Warm orange coral diamond
      fill: '#FF7F50',
      stroke: '#ffffff',
      shadow: '#E86A3D',
      glow: '#FFA07A',
      dropShadow: 'rgba(0, 0, 0, 0.3)'
    },
    '#DC2626': { // Deep red diamond - fallback for existing code
      fill: '#DC2626',
      stroke: '#ffffff',
      shadow: '#B91C1C',
      glow: '#EF4444',
      dropShadow: 'rgba(0, 0, 0, 0.3)'
    },
    '#EF4444': { // Bright red asterisk
      fill: '#EF4444',
      stroke: '#ffffff',
      shadow: '#DC2626',
      glow: '#F87171',
      dropShadow: 'rgba(0, 0, 0, 0.3)'
    },
    '#14B8A6': { // Teal asterisk
      fill: '#14B8A6',
      stroke: '#ffffff',
      shadow: '#0F766E',
      glow: '#5EEAD4',
      dropShadow: 'rgba(0, 0, 0, 0.3)'
    },

    '#EC4899': { // Pink dots
      fill: '#EC4899',
      stroke: '#ffffff',
      shadow: '#DB2777',
      glow: '#F472B6',
      dropShadow: 'rgba(0, 0, 0, 0.3)'
    },
    '#84CC16': { // Lime green equals
      fill: '#84CC16',
      stroke: '#ffffff',
      shadow: '#65A30D',
      glow: '#A3E635',
      dropShadow: 'rgba(0, 0, 0, 0.3)'
    },
    '#ffffff': { // White/fallback
      fill: '#ffffff',
      stroke: '#ffffff',
      shadow: '#ffffff',
      glow: '#ffffff',
      dropShadow: 'rgba(0, 0, 0, 0.3)'
    }
  };
  return colorMap[baseColor] || colorMap['#ffffff'] || { fill: '#ffffff', stroke: '#ffffff', shadow: '#ffffff', glow: '#ffffff', dropShadow: 'rgba(0, 0, 0, 0.3)' };
};

export const CircleIcon = ({ size = 80, className = "", color = "#22C55E" }) => {
  // Support both new Figma colors and existing colors
  const colorToUse = color === '#22C55E' ? '#22C55E' : color === '#3B82F6' ? '#3B82F6' : color || '#22C55E';
  const colors = getRetroColors(colorToUse);
  const centerX = size / 2;
  const centerY = size / 2;
  const strokeWidth = Math.max(2, size * 0.08);
  const shadowOffset = Math.max(1, size * 0.02);
  const filterId = `retroGlow-circle-${size}-${colorToUse.replace('#', '')}`;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Drop Shadow */}
      <circle
        cx={centerX + shadowOffset * 2}
        cy={centerY + shadowOffset * 2}
        r={size / 2 - strokeWidth / 2}
        fill={colors.dropShadow}
        opacity={0.4}
      />
      {/* Shadow */}
      <circle
        cx={centerX + shadowOffset}
        cy={centerY + shadowOffset}
        r={size / 2 - strokeWidth / 2}
        fill={colors.shadow}
        opacity={0.3}
      />
      {/* Main circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={size / 2 - strokeWidth / 2}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={strokeWidth}
        filter={`url(#${filterId})`}
      />
      {/* Inner highlight */}
      <circle
        cx={centerX - size * 0.15}
        cy={centerY - size * 0.15}
        r={size * 0.2}
        fill={colors.glow}
        opacity={0.4}
      />
    </svg>
  );
};

export const SquareIcon = ({ size = 80, className = "", color = "#F59E0B" }) => {
  const colorToUse = color === '#F59E0B' ? '#F59E0B' : color === '#E8A54A' ? '#E8A54A' : color || '#F59E0B';
  const colors = getRetroColors(colorToUse);
  const centerX = size / 2;
  const centerY = size / 2;
  const strokeWidth = Math.max(2, size * 0.08);
  const shadowOffset = Math.max(1, size * 0.02);
  const lineLength = size * 0.75;
  const lineThickness = size * 0.14;
  const spacing = size * 0.14;
  const filterId = `retroGlow-square-${size}-${colorToUse.replace('#', '')}`;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Drop Shadow */}
      <g>
        {/* Vertical lines - drop shadow */}
        <rect x={centerX - spacing - lineThickness / 2 + shadowOffset * 2} y={centerY - lineLength / 2 + shadowOffset * 2} width={lineThickness} height={lineLength} fill={colors.dropShadow} rx={lineThickness / 2} ry={lineThickness / 2} opacity={0.4} />
        <rect x={centerX + spacing - lineThickness / 2 + shadowOffset * 2} y={centerY - lineLength / 2 + shadowOffset * 2} width={lineThickness} height={lineLength} fill={colors.dropShadow} rx={lineThickness / 2} ry={lineThickness / 2} opacity={0.4} />
        
        {/* Horizontal lines - drop shadow */}
        <rect x={centerX - lineLength / 2 + shadowOffset * 2} y={centerY - spacing - lineThickness / 2 + shadowOffset * 2} width={lineLength} height={lineThickness} fill={colors.dropShadow} rx={lineThickness / 2} ry={lineThickness / 2} opacity={0.4} />
        <rect x={centerX - lineLength / 2 + shadowOffset * 2} y={centerY + spacing - lineThickness / 2 + shadowOffset * 2} width={lineLength} height={lineThickness} fill={colors.dropShadow} rx={lineThickness / 2} ry={lineThickness / 2} opacity={0.4} />
      </g>
      {/* Shadow */}
      <g>
        {/* Vertical lines - shadow */}
        <rect x={centerX - spacing - lineThickness / 2 + shadowOffset} y={centerY - lineLength / 2 + shadowOffset} width={lineThickness} height={lineLength} fill={colors.shadow} rx={lineThickness / 2} ry={lineThickness / 2} opacity={0.3} />
        <rect x={centerX + spacing - lineThickness / 2 + shadowOffset} y={centerY - lineLength / 2 + shadowOffset} width={lineThickness} height={lineLength} fill={colors.shadow} rx={lineThickness / 2} ry={lineThickness / 2} opacity={0.3} />
        
        {/* Horizontal lines - shadow */}
        <rect x={centerX - lineLength / 2 + shadowOffset} y={centerY - spacing - lineThickness / 2 + shadowOffset} width={lineLength} height={lineThickness} fill={colors.shadow} rx={lineThickness / 2} ry={lineThickness / 2} opacity={0.3} />
        <rect x={centerX - lineLength / 2 + shadowOffset} y={centerY + spacing - lineThickness / 2 + shadowOffset} width={lineLength} height={lineThickness} fill={colors.shadow} rx={lineThickness / 2} ry={lineThickness / 2} opacity={0.3} />
      </g>
      {/* White border layer */}
      <g>
        {/* Vertical lines - white border */}
        <rect x={centerX - spacing - lineThickness / 2} y={centerY - lineLength / 2} width={lineThickness} height={lineLength} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} rx={lineThickness / 2} ry={lineThickness / 2} />
        <rect x={centerX + spacing - lineThickness / 2} y={centerY - lineLength / 2} width={lineThickness} height={lineLength} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} rx={lineThickness / 2} ry={lineThickness / 2} />
        
        {/* Horizontal lines - white border */}
        <rect x={centerX - lineLength / 2} y={centerY - spacing - lineThickness / 2} width={lineLength} height={lineThickness} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} rx={lineThickness / 2} ry={lineThickness / 2} />
        <rect x={centerX - lineLength / 2} y={centerY + spacing - lineThickness / 2} width={lineLength} height={lineThickness} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} rx={lineThickness / 2} ry={lineThickness / 2} />
      </g>
      {/* Yellow fill layer */}
      <g>
        {/* Vertical lines - yellow */}
        <rect x={centerX - spacing - lineThickness / 2} y={centerY - lineLength / 2} width={lineThickness} height={lineLength} fill={colors.fill} rx={lineThickness / 2} ry={lineThickness / 2} filter={`url(#${filterId})`} />
        <rect x={centerX + spacing - lineThickness / 2} y={centerY - lineLength / 2} width={lineThickness} height={lineLength} fill={colors.fill} rx={lineThickness / 2} ry={lineThickness / 2} filter={`url(#${filterId})`} />
        
        {/* Horizontal lines - yellow */}
        <rect x={centerX - lineLength / 2} y={centerY - spacing - lineThickness / 2} width={lineLength} height={lineThickness} fill={colors.fill} rx={lineThickness / 2} ry={lineThickness / 2} filter={`url(#${filterId})`} />
        <rect x={centerX - lineLength / 2} y={centerY + spacing - lineThickness / 2} width={lineLength} height={lineThickness} fill={colors.fill} rx={lineThickness / 2} ry={lineThickness / 2} filter={`url(#${filterId})`} />
      </g>
      {/* Inner highlights */}
      <g>
        {/* Vertical lines highlights */}
        <rect x={centerX - spacing - lineThickness * 0.3} y={centerY - lineLength * 0.35} width={lineThickness * 0.4} height={lineLength * 0.3} fill={colors.glow} rx={lineThickness * 0.1} ry={lineThickness * 0.1} opacity={0.4} />
        <rect x={centerX + spacing - lineThickness * 0.3} y={centerY - lineLength * 0.35} width={lineThickness * 0.4} height={lineLength * 0.3} fill={colors.glow} rx={lineThickness * 0.1} ry={lineThickness * 0.1} opacity={0.4} />
        
        {/* Horizontal lines highlights */}
        <rect x={centerX - lineLength * 0.35} y={centerY - spacing - lineThickness * 0.3} width={lineLength * 0.3} height={lineThickness * 0.4} fill={colors.glow} rx={lineThickness * 0.1} ry={lineThickness * 0.1} opacity={0.4} />
        <rect x={centerX - lineLength * 0.35} y={centerY + spacing - lineThickness * 0.3} width={lineLength * 0.3} height={lineThickness * 0.4} fill={colors.glow} rx={lineThickness * 0.1} ry={lineThickness * 0.1} opacity={0.4} />
      </g>
    </svg>
  );
};

export const PlusIcon = ({ size = 80, className = "", color = "#9333EA" }) => {
  const colors = getRetroColors(color || '#9333EA');
  const centerX = size / 2;
  const centerY = size / 2;
  const strokeWidth = Math.max(2, size * 0.08);
  const shadowOffset = Math.max(1, size * 0.02);
  const plusThickness = size * 0.2;
  const filterId = `retroGlow-plus-${size}-${(color || '#9333EA').replace('#', '')}`;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Drop Shadow */}
      <g>
        <rect
          x={centerX - plusThickness / 2 + shadowOffset * 2}
          y={centerY - size * 0.4 + shadowOffset * 2}
          width={plusThickness}
          height={size * 0.8}
          fill={colors.dropShadow}
          rx={plusThickness / 2}
          ry={plusThickness / 2}
          opacity={0.4}
        />
        <rect
          x={centerX - size * 0.4 + shadowOffset * 2}
          y={centerY - plusThickness / 2 + shadowOffset * 2}
          width={size * 0.8}
          height={plusThickness}
          fill={colors.dropShadow}
          rx={plusThickness / 2}
          ry={plusThickness / 2}
          opacity={0.4}
        />
      </g>
      {/* Shadow */}
      <g>
        <rect
          x={centerX - plusThickness / 2 + shadowOffset}
          y={centerY - size * 0.4 + shadowOffset}
          width={plusThickness}
          height={size * 0.8}
          fill={colors.shadow}
          rx={plusThickness / 2}
          ry={plusThickness / 2}
          opacity={0.3}
        />
        <rect
          x={centerX - size * 0.4 + shadowOffset}
          y={centerY - plusThickness / 2 + shadowOffset}
          width={size * 0.8}
          height={plusThickness}
          fill={colors.shadow}
          rx={plusThickness / 2}
          ry={plusThickness / 2}
          opacity={0.3}
        />
      </g>
      {/* White border layer */}
      <g>
        <rect
          x={centerX - plusThickness / 2}
          y={centerY - size * 0.4}
          width={plusThickness}
          height={size * 0.8}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth * 2}
          rx={plusThickness / 2}
          ry={plusThickness / 2}
          strokeLinecap="round"
        />
        <rect
          x={centerX - size * 0.4}
          y={centerY - plusThickness / 2}
          width={size * 0.8}
          height={plusThickness}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth * 2}
          rx={plusThickness / 2}
          ry={plusThickness / 2}
          strokeLinecap="round"
        />
      </g>
      {/* Purple fill layer */}
      <g>
        <rect
          x={centerX - plusThickness / 2}
          y={centerY - size * 0.4}
          width={plusThickness}
          height={size * 0.8}
          fill={colors.fill}
          rx={plusThickness / 2}
          ry={plusThickness / 2}
          filter={`url(#${filterId})`}
        />
        <rect
          x={centerX - size * 0.4}
          y={centerY - plusThickness / 2}
          width={size * 0.8}
          height={plusThickness}
          fill={colors.fill}
          rx={plusThickness / 2}
          ry={plusThickness / 2}
          filter={`url(#${filterId})`}
        />
      </g>
      {/* Inner highlight */}
      <g>
        <rect
          x={centerX - plusThickness * 0.3}
          y={centerY - size * 0.3}
          width={plusThickness * 0.4}
          height={size * 0.2}
          fill={colors.glow}
          rx={plusThickness * 0.1}
          ry={plusThickness * 0.1}
          opacity={0.4}
        />
        <rect
          x={centerX - size * 0.3}
          y={centerY - plusThickness * 0.3}
          width={size * 0.2}
          height={plusThickness * 0.4}
          fill={colors.glow}
          rx={plusThickness * 0.1}
          ry={plusThickness * 0.1}
          opacity={0.4}
        />
      </g>
    </svg>
  );
};

export const WavesIcon = ({ size = 80, className = "", color = "#06B6D4" }) => {
  const colors = getRetroColors(color || '#06B6D4');
  const filterId = `retroGlow-waves-${size}-${(color || '#06B6D4').replace('#', '')}`;
  const centerX = size / 2;
  const centerY = size / 2;
  const strokeWidth = Math.max(2, size * 0.08);
  const shadowOffset = Math.max(1, size * 0.02);
  const waveHeight = size * 0.2;
  const waveThickness = size * 0.1;
  const waveSpacing = size * 0.2;
  
  const wavePath1 = `M ${centerX - size * 0.35} ${centerY - waveSpacing} 
    Q ${centerX - size * 0.175} ${centerY - waveSpacing - waveHeight} 
      ${centerX} ${centerY - waveSpacing}
    Q ${centerX + size * 0.175} ${centerY - waveSpacing + waveHeight} 
      ${centerX + size * 0.35} ${centerY - waveSpacing}`;
      
  const wavePath2 = `M ${centerX - size * 0.35} ${centerY + waveSpacing} 
    Q ${centerX - size * 0.175} ${centerY + waveSpacing - waveHeight} 
      ${centerX} ${centerY + waveSpacing}
    Q ${centerX + size * 0.175} ${centerY + waveSpacing + waveHeight} 
      ${centerX + size * 0.35} ${centerY + waveSpacing}`;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Drop Shadow */}
      <g>
        <path
          d={wavePath1}
          stroke={colors.dropShadow}
          strokeWidth={waveThickness + strokeWidth * 2}
          fill="none"
          strokeLinecap="round"
          opacity={0.4}
          transform={`translate(${shadowOffset * 2}, ${shadowOffset * 2})`}
        />
        <path
          d={wavePath2}
          stroke={colors.dropShadow}
          strokeWidth={waveThickness + strokeWidth * 2}
          fill="none"
          strokeLinecap="round"
          opacity={0.4}
          transform={`translate(${shadowOffset * 2}, ${shadowOffset * 2})`}
        />
      </g>
      {/* Shadow */}
      <g>
        <path
          d={wavePath1}
          stroke={colors.shadow}
          strokeWidth={waveThickness + strokeWidth}
          fill="none"
          strokeLinecap="round"
          opacity={0.3}
          transform={`translate(${shadowOffset}, ${shadowOffset})`}
        />
        <path
          d={wavePath2}
          stroke={colors.shadow}
          strokeWidth={waveThickness + strokeWidth}
          fill="none"
          strokeLinecap="round"
          opacity={0.3}
          transform={`translate(${shadowOffset}, ${shadowOffset})`}
        />
      </g>
      {/* White border layer */}
      <g>
        <path
          d={wavePath1}
          stroke={colors.stroke}
          strokeWidth={waveThickness + strokeWidth * 2}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={wavePath2}
          stroke={colors.stroke}
          strokeWidth={waveThickness + strokeWidth * 2}
          fill="none"
          strokeLinecap="round"
        />
      </g>
      {/* Cyan fill layer */}
      <g>
        <path
          d={wavePath1}
          stroke={colors.fill}
          strokeWidth={waveThickness}
          fill="none"
          strokeLinecap="round"
          filter={`url(#${filterId})`}
        />
        <path
          d={wavePath2}
          stroke={colors.fill}
          strokeWidth={waveThickness}
          fill="none"
          strokeLinecap="round"
          filter={`url(#${filterId})`}
        />
      </g>
      {/* Inner highlights - small ellipses on the wave peaks, inside the fill */}
      <g>
        <ellipse
          cx={centerX - size * 0.175}
          cy={centerY - waveSpacing - waveHeight * 0.5}
          rx={size * 0.055}
          ry={size * 0.03}
          fill={colors.glow}
          opacity={0.6}
        />
        <ellipse
          cx={centerX - size * 0.175}
          cy={centerY + waveSpacing - waveHeight * 0.5}
          rx={size * 0.055}
          ry={size * 0.03}
          fill={colors.glow}
          opacity={0.6}
        />
      </g>
    </svg>
  );
};

export const DiamondIcon = ({ size = 80, className = "", color = "#DC2626" }) => {
  const colorToUse = color === '#DC2626' ? '#DC2626' : color === '#FF7F50' ? '#FF7F50' : color || '#DC2626';
  const colors = getRetroColors(colorToUse);
  const filterId = `retroGlow-diamond-${size}-${colorToUse.replace('#', '')}`;
  const centerX = size / 2;
  const centerY = size / 2;
  const strokeWidth = Math.max(2, size * 0.08);
  const shadowOffset = Math.max(1, size * 0.02);
  const diamondSize = size * 0.6;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Drop Shadow */}
      <rect
        x={centerX - diamondSize / 2 + shadowOffset * 2}
        y={centerY - diamondSize / 2 + shadowOffset * 2}
        width={diamondSize}
        height={diamondSize}
        fill={colors.dropShadow}
        rx={diamondSize * 0.1}
        ry={diamondSize * 0.1}
        transform={`rotate(45 ${centerX + shadowOffset * 2} ${centerY + shadowOffset * 2})`}
        opacity={0.4}
      />
      {/* Shadow */}
      <rect
        x={centerX - diamondSize / 2 + shadowOffset}
        y={centerY - diamondSize / 2 + shadowOffset}
        width={diamondSize}
        height={diamondSize}
        fill={colors.shadow}
        rx={diamondSize * 0.1}
        ry={diamondSize * 0.1}
        transform={`rotate(45 ${centerX + shadowOffset} ${centerY + shadowOffset})`}
        opacity={0.3}
      />
      {/* White border layer */}
      <rect
        x={centerX - diamondSize / 2}
        y={centerY - diamondSize / 2}
        width={diamondSize}
        height={diamondSize}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={strokeWidth * 2}
        rx={diamondSize * 0.1}
        ry={diamondSize * 0.1}
        transform={`rotate(45 ${centerX} ${centerY})`}
      />
      {/* Red fill layer */}
      <rect
        x={centerX - diamondSize / 2}
        y={centerY - diamondSize / 2}
        width={diamondSize}
        height={diamondSize}
        fill={colors.fill}
        rx={diamondSize * 0.1}
        ry={diamondSize * 0.1}
        transform={`rotate(45 ${centerX} ${centerY})`}
        filter={`url(#${filterId})`}
      />
      {/* Inner highlight */}
      <rect
        x={centerX - diamondSize * 0.4}
        y={centerY - diamondSize * 0.42}
        width={diamondSize * 0.25}
        height={diamondSize * 0.45}
        fill={colors.glow}
        rx={diamondSize * 0.05}
        ry={diamondSize * 0.05}
        transform={`rotate(45 ${centerX} ${centerY})`}
        opacity={0.4}
      />
    </svg>
  );
};

export const AsteriskIcon = ({ size = 80, className = "", color = "#14B8A6" }) => {
  const colorToUse = color === '#EF4444' ? '#EF4444' : color === '#14B8A6' ? '#14B8A6' : color || '#14B8A6';
  const colors = getRetroColors(colorToUse);
  const filterId = `retroGlow-asterisk-${size}-${colorToUse.replace('#', '')}`;
  const centerX = size / 2;
  const centerY = size / 2;
  const strokeWidth = Math.max(2, size * 0.08);
  const shadowOffset = Math.max(1, size * 0.02);
  const asteriskSize = size * 0.8;
  const armLength = asteriskSize * 0.5;
  const armThickness = size * 0.12;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Drop Shadow */}
      <g>
        <rect x={centerX - armThickness / 2 + shadowOffset * 2} y={centerY - armLength + shadowOffset * 2} width={armThickness} height={armLength * 2} fill={colors.dropShadow} rx={armThickness / 2} ry={armThickness / 2} opacity={0.4} />
        <rect x={centerX - armLength + shadowOffset * 2} y={centerY - armThickness / 2 + shadowOffset * 2} width={armLength * 2} height={armThickness} fill={colors.dropShadow} rx={armThickness / 2} ry={armThickness / 2} opacity={0.4} />
        <rect x={centerX - armThickness / 2 + shadowOffset * 2} y={centerY - armLength + shadowOffset * 2} width={armThickness} height={armLength * 2} fill={colors.dropShadow} rx={armThickness / 2} ry={armThickness / 2} transform={`rotate(45 ${centerX + shadowOffset * 2} ${centerY + shadowOffset * 2})`} opacity={0.4} />
        <rect x={centerX - armLength + shadowOffset * 2} y={centerY - armThickness / 2 + shadowOffset * 2} width={armLength * 2} height={armThickness} fill={colors.dropShadow} rx={armThickness / 2} ry={armThickness / 2} transform={`rotate(45 ${centerX + shadowOffset * 2} ${centerY + shadowOffset * 2})`} opacity={0.4} />
      </g>
      {/* Shadow */}
      <g>
        <rect x={centerX - armThickness / 2 + shadowOffset} y={centerY - armLength + shadowOffset} width={armThickness} height={armLength * 2} fill={colors.shadow} rx={armThickness / 2} ry={armThickness / 2} opacity={0.3} />
        <rect x={centerX - armLength + shadowOffset} y={centerY - armThickness / 2 + shadowOffset} width={armLength * 2} height={armThickness} fill={colors.shadow} rx={armThickness / 2} ry={armThickness / 2} opacity={0.3} />
        <rect x={centerX - armThickness / 2 + shadowOffset} y={centerY - armLength + shadowOffset} width={armThickness} height={armLength * 2} fill={colors.shadow} rx={armThickness / 2} ry={armThickness / 2} transform={`rotate(45 ${centerX + shadowOffset} ${centerY + shadowOffset})`} opacity={0.3} />
        <rect x={centerX - armLength + shadowOffset} y={centerY - armThickness / 2 + shadowOffset} width={armLength * 2} height={armThickness} fill={colors.shadow} rx={armThickness / 2} ry={armThickness / 2} transform={`rotate(45 ${centerX + shadowOffset} ${centerY + shadowOffset})`} opacity={0.3} />
      </g>
      {/* White border layer */}
      <g>
        <rect x={centerX - armThickness / 2} y={centerY - armLength} width={armThickness} height={armLength * 2} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} rx={armThickness / 2} ry={armThickness / 2} strokeLinecap="round" />
        <rect x={centerX - armLength} y={centerY - armThickness / 2} width={armLength * 2} height={armThickness} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} rx={armThickness / 2} ry={armThickness / 2} strokeLinecap="round" />
        <rect x={centerX - armThickness / 2} y={centerY - armLength} width={armThickness} height={armLength * 2} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} rx={armThickness / 2} ry={armThickness / 2} strokeLinecap="round" transform={`rotate(45 ${centerX} ${centerY})`} />
        <rect x={centerX - armLength} y={centerY - armThickness / 2} width={armLength * 2} height={armThickness} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} rx={armThickness / 2} ry={armThickness / 2} strokeLinecap="round" transform={`rotate(45 ${centerX} ${centerY})`} />
      </g>
      {/* Fill layer */}
      <g>
        <rect x={centerX - armThickness / 2} y={centerY - armLength} width={armThickness} height={armLength * 2} fill={colors.fill} rx={armThickness / 2} ry={armThickness / 2} filter={`url(#${filterId})`} />
        <rect x={centerX - armLength} y={centerY - armThickness / 2} width={armLength * 2} height={armThickness} fill={colors.fill} rx={armThickness / 2} ry={armThickness / 2} filter={`url(#${filterId})`} />
        <rect x={centerX - armThickness / 2} y={centerY - armLength} width={armThickness} height={armLength * 2} fill={colors.fill} rx={armThickness / 2} ry={armThickness / 2} filter={`url(#${filterId})`} transform={`rotate(45 ${centerX} ${centerY})`} />
        <rect x={centerX - armLength} y={centerY - armThickness / 2} width={armLength * 2} height={armThickness} fill={colors.fill} rx={armThickness / 2} ry={armThickness / 2} filter={`url(#${filterId})`} transform={`rotate(45 ${centerX} ${centerY})`} />
      </g>
      {/* Inner highlights - on the arms */}
      <g>
        {/* Vertical arm highlight */}
        <rect
          x={centerX - armThickness * 0.3}
          y={centerY - armLength * 0.7}
          width={armThickness * 0.45}
          height={armLength * 0.35}
          fill={colors.glow}
          rx={armThickness * 0.1}
          ry={armThickness * 0.1}
          opacity={0.6}
        />
        {/* Horizontal arm highlight */}
        <rect
          x={centerX - armLength * 0.7}
          y={centerY - armThickness * 0.3}
          width={armLength * 0.35}
          height={armThickness * 0.45}
          fill={colors.glow}
          rx={armThickness * 0.1}
          ry={armThickness * 0.1}
          opacity={0.6}
        />
      </g>
    </svg>
  );
};

export const DotsIcon = ({ size = 80, className = "", color = "#EC4899" }) => {
  const colors = getRetroColors(color || '#EC4899');
  const filterId = `retroGlow-dots-${size}-${(color || '#EC4899').replace('#', '')}`;
  const centerX = size / 2;
  const centerY = size / 2;
  const strokeWidth = Math.max(2, size * 0.08);
  const shadowOffset = Math.max(1, size * 0.02);
  const dotRadius = size * 0.16;
  const dotOffset = size * 0.23;
  const dotStrokeWidth = strokeWidth * 0.75; // Slightly thicker border for bigger, cuter dots
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Drop Shadow */}
      <g>
        <circle cx={centerX - dotOffset + shadowOffset * 2} cy={centerY - dotOffset + shadowOffset * 2} r={dotRadius} fill={colors.dropShadow} opacity={0.4} />
        <circle cx={centerX + dotOffset + shadowOffset * 2} cy={centerY - dotOffset + shadowOffset * 2} r={dotRadius} fill={colors.dropShadow} opacity={0.4} />
        <circle cx={centerX - dotOffset + shadowOffset * 2} cy={centerY + dotOffset + shadowOffset * 2} r={dotRadius} fill={colors.dropShadow} opacity={0.4} />
        <circle cx={centerX + dotOffset + shadowOffset * 2} cy={centerY + dotOffset + shadowOffset * 2} r={dotRadius} fill={colors.dropShadow} opacity={0.4} />
      </g>
      {/* Shadow */}
      <g>
        <circle cx={centerX - dotOffset + shadowOffset} cy={centerY - dotOffset + shadowOffset} r={dotRadius} fill={colors.shadow} opacity={0.3} />
        <circle cx={centerX + dotOffset + shadowOffset} cy={centerY - dotOffset + shadowOffset} r={dotRadius} fill={colors.shadow} opacity={0.3} />
        <circle cx={centerX - dotOffset + shadowOffset} cy={centerY + dotOffset + shadowOffset} r={dotRadius} fill={colors.shadow} opacity={0.3} />
        <circle cx={centerX + dotOffset + shadowOffset} cy={centerY + dotOffset + shadowOffset} r={dotRadius} fill={colors.shadow} opacity={0.3} />
      </g>
      {/* White border layer */}
      <g>
        <circle cx={centerX - dotOffset} cy={centerY - dotOffset} r={dotRadius} fill="none" stroke={colors.stroke} strokeWidth={dotStrokeWidth} />
        <circle cx={centerX + dotOffset} cy={centerY - dotOffset} r={dotRadius} fill="none" stroke={colors.stroke} strokeWidth={dotStrokeWidth} />
        <circle cx={centerX - dotOffset} cy={centerY + dotOffset} r={dotRadius} fill="none" stroke={colors.stroke} strokeWidth={dotStrokeWidth} />
        <circle cx={centerX + dotOffset} cy={centerY + dotOffset} r={dotRadius} fill="none" stroke={colors.stroke} strokeWidth={dotStrokeWidth} />
      </g>
      {/* Pink fill layer */}
      <g>
        <circle cx={centerX - dotOffset} cy={centerY - dotOffset} r={dotRadius - dotStrokeWidth / 2} fill={colors.fill} filter={`url(#${filterId})`} />
        <circle cx={centerX + dotOffset} cy={centerY - dotOffset} r={dotRadius - dotStrokeWidth / 2} fill={colors.fill} filter={`url(#${filterId})`} />
        <circle cx={centerX - dotOffset} cy={centerY + dotOffset} r={dotRadius - dotStrokeWidth / 2} fill={colors.fill} filter={`url(#${filterId})`} />
        <circle cx={centerX + dotOffset} cy={centerY + dotOffset} r={dotRadius - dotStrokeWidth / 2} fill={colors.fill} filter={`url(#${filterId})`} />
      </g>
      {/* Inner highlight */}
      <g>
        <ellipse cx={centerX - dotOffset - dotRadius * 0.2} cy={centerY - dotOffset - dotRadius * 0.2} rx={dotRadius * 0.35} ry={dotRadius * 0.25} fill={colors.glow} opacity={0.4} />
        <ellipse cx={centerX + dotOffset - dotRadius * 0.2} cy={centerY - dotOffset - dotRadius * 0.2} rx={dotRadius * 0.35} ry={dotRadius * 0.25} fill={colors.glow} opacity={0.4} />
        <ellipse cx={centerX - dotOffset - dotRadius * 0.2} cy={centerY + dotOffset - dotRadius * 0.2} rx={dotRadius * 0.35} ry={dotRadius * 0.25} fill={colors.glow} opacity={0.4} />
        <ellipse cx={centerX + dotOffset - dotRadius * 0.2} cy={centerY + dotOffset - dotRadius * 0.2} rx={dotRadius * 0.35} ry={dotRadius * 0.25} fill={colors.glow} opacity={0.4} />
      </g>
    </svg>
  );
};

export const EqualsIcon = ({ size = 80, className = "", color = "#84CC16" }) => {
  const colors = getRetroColors(color || '#84CC16');
  const filterId = `retroGlow-equals-${size}-${(color || '#84CC16').replace('#', '')}`;
  const centerX = size / 2;
  const centerY = size / 2;
  const strokeWidth = Math.max(2, size * 0.08);
  const shadowOffset = Math.max(1, size * 0.02);
  const equalsThickness = size * 0.15;
  const equalsOffset = size * 0.2;
  const equalsLength = size * 0.68;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Drop Shadow */}
      <g>
        <rect
          x={centerX - equalsOffset - equalsThickness / 2 + shadowOffset * 2}
          y={centerY - equalsLength / 2 + shadowOffset * 2}
          width={equalsThickness}
          height={equalsLength}
          fill={colors.dropShadow}
          rx={equalsThickness / 2}
          ry={equalsThickness / 2}
          opacity={0.4}
        />
        <rect
          x={centerX + equalsOffset - equalsThickness / 2 + shadowOffset * 2}
          y={centerY - equalsLength / 2 + shadowOffset * 2}
          width={equalsThickness}
          height={equalsLength}
          fill={colors.dropShadow}
          rx={equalsThickness / 2}
          ry={equalsThickness / 2}
          opacity={0.4}
        />
      </g>
      {/* Shadow */}
      <g>
        <rect
          x={centerX - equalsOffset - equalsThickness / 2 + shadowOffset}
          y={centerY - equalsLength / 2 + shadowOffset}
          width={equalsThickness}
          height={equalsLength}
          fill={colors.shadow}
          rx={equalsThickness / 2}
          ry={equalsThickness / 2}
          opacity={0.3}
        />
        <rect
          x={centerX + equalsOffset - equalsThickness / 2 + shadowOffset}
          y={centerY - equalsLength / 2 + shadowOffset}
          width={equalsThickness}
          height={equalsLength}
          fill={colors.shadow}
          rx={equalsThickness / 2}
          ry={equalsThickness / 2}
          opacity={0.3}
        />
      </g>
      {/* White border layer */}
      <g>
        <rect
          x={centerX - equalsOffset - equalsThickness / 2}
          y={centerY - equalsLength / 2}
          width={equalsThickness}
          height={equalsLength}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth * 2}
          rx={equalsThickness / 2}
          ry={equalsThickness / 2}
          strokeLinecap="round"
        />
        <rect
          x={centerX + equalsOffset - equalsThickness / 2}
          y={centerY - equalsLength / 2}
          width={equalsThickness}
          height={equalsLength}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth * 2}
          rx={equalsThickness / 2}
          ry={equalsThickness / 2}
          strokeLinecap="round"
        />
      </g>
      {/* Lime green fill layer */}
      <g>
        <rect
          x={centerX - equalsOffset - equalsThickness / 2}
          y={centerY - equalsLength / 2}
          width={equalsThickness}
          height={equalsLength}
          fill={colors.fill}
          rx={equalsThickness / 2}
          ry={equalsThickness / 2}
          filter={`url(#${filterId})`}
        />
        <rect
          x={centerX + equalsOffset - equalsThickness / 2}
          y={centerY - equalsLength / 2}
          width={equalsThickness}
          height={equalsLength}
          fill={colors.fill}
          rx={equalsThickness / 2}
          ry={equalsThickness / 2}
          filter={`url(#${filterId})`}
        />
      </g>
      {/* Inner highlight */}
      <g>
        <rect
          x={centerX - equalsOffset - equalsThickness * 0.3}
          y={centerY - equalsLength * 0.3}
          width={equalsThickness * 0.4}
          height={equalsLength * 0.6}
          fill={colors.glow}
          rx={equalsThickness * 0.1}
          ry={equalsThickness * 0.1}
          opacity={0.4}
        />
        <rect
          x={centerX + equalsOffset - equalsThickness * 0.3}
          y={centerY - equalsLength * 0.3}
          width={equalsThickness * 0.4}
          height={equalsLength * 0.6}
          fill={colors.glow}
          rx={equalsThickness * 0.1}
          ry={equalsThickness * 0.1}
          opacity={0.4}
        />
      </g>
    </svg>
  );
};
