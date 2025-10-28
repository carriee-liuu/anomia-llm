import React from 'react';

const AnomiaShape = ({ shape, size = 60, color = "#ffffff", className = "" }) => {
  const renderShape = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    const strokeWidth = Math.max(2, size * 0.08);
    const shadowOffset = Math.max(1, size * 0.02);
    
    // Retro color variations based on shape
    const getRetroColors = (baseColor) => {
      const colorMap = {
        '#ffffff': {
          fill: '#ffffff',
          stroke: 'oklch(0.35 0.08 280)', // Exact same as --foreground (card borders)
          shadow: 'oklch(0.35 0.08 280)',
          glow: '#ffffff'
        },
        '#ff6b35': {
          fill: '#ff6b35',
          stroke: '#cc4a1a',
          shadow: '#8b2c0f',
          glow: '#ff8c5a'
        },
        '#22C55E': { // Green circle with white border
          fill: '#22C55E',
          stroke: '#ffffff',
          shadow: '#16a34a',
          glow: '#4ade80',
          dropShadow: 'rgba(0, 0, 0, 0.3)'
        },
        '#F59E0B': { // Yellow square with white border
          fill: '#F59E0B',
          stroke: '#ffffff',
          shadow: '#D97706',
          glow: '#FCD34D',
          dropShadow: 'rgba(0, 0, 0, 0.3)'
        },
           '#9333EA': { // Purple plus with white border
             fill: '#9333EA',
             stroke: '#ffffff',
             shadow: '#7C3AED',
             glow: '#A855F7',
             dropShadow: 'rgba(0, 0, 0, 0.3)'
           },
           '#06B6D4': { // Cyan waves with white border
             fill: '#06B6D4',
             stroke: '#ffffff',
             shadow: '#0891B2',
             glow: '#22D3EE',
             dropShadow: 'rgba(0, 0, 0, 0.3)'
           },
           '#DC2626': { // Deep red diamond with white border
             fill: '#DC2626',
             stroke: '#ffffff',
             shadow: '#B91C1C',
             glow: '#EF4444',
             dropShadow: 'rgba(0, 0, 0, 0.3)'
           },
           '#F97316': { // Orange asterisk with white border
             fill: '#F97316',
             stroke: '#ffffff',
             shadow: '#EA580C',
             glow: '#FB923C',
             dropShadow: 'rgba(0, 0, 0, 0.3)'
           },
           '#14B8A6': { // Teal asterisk with white border
             fill: '#14B8A6',
             stroke: '#ffffff',
             shadow: '#0F766E',
             glow: '#5EEAD4',
             dropShadow: 'rgba(0, 0, 0, 0.3)'
           },
           '#3B82F6': { // Blue dots with white border
             fill: '#3B82F6',
             stroke: '#ffffff',
             shadow: '#2563EB',
             glow: '#60A5FA',
             dropShadow: 'rgba(0, 0, 0, 0.3)'
           },
           '#84CC16': { // Lime green equals with white border
             fill: '#84CC16',
             stroke: '#ffffff',
             shadow: '#65A30D',
             glow: '#A3E635',
             dropShadow: 'rgba(0, 0, 0, 0.3)'
        }
      };
      return colorMap[baseColor] || {
        fill: baseColor,
        stroke: baseColor,
        shadow: baseColor,
        glow: baseColor
      };
    };
    
    const colors = getRetroColors(color);
    
    switch (shape) {
      case 'circle':
        return (
          <g>
            {/* Drop Shadow */}
            {colors.dropShadow && (
              <circle
                cx={centerX + shadowOffset * 2}
                cy={centerY + shadowOffset * 2}
                r={size / 2 - strokeWidth / 2}
                fill={colors.dropShadow}
                opacity={0.4}
              />
            )}
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
              filter="url(#retroGlow)"
            />
            {/* Inner highlight */}
            <circle
              cx={centerX - size * 0.15}
              cy={centerY - size * 0.15}
              r={size * 0.2}
              fill={colors.glow}
              opacity={0.4}
            />
          </g>
        );

      case 'square': { // Yellow grid pattern (3x3 internal grid, no outer border)
        const gridSize = size * 0.7; // Overall grid size
        const gridThickness = size * 0.06; // Thicker lines for better visibility
        const cellSize = gridSize / 3; // Size of each small square (3x3 grid)
        
        return (
          <g>
            {/* Drop Shadow */}
            {colors.dropShadow && (
              <g>
                {/* Vertical internal grid lines */}
                <rect x={centerX - gridSize / 2 + cellSize + shadowOffset * 2} y={centerY - gridSize / 2 + shadowOffset * 2} width={gridThickness} height={gridSize} fill={colors.dropShadow} opacity={0.4} />
                <rect x={centerX - gridSize / 2 + cellSize * 2 + shadowOffset * 2} y={centerY - gridSize / 2 + shadowOffset * 2} width={gridThickness} height={gridSize} fill={colors.dropShadow} opacity={0.4} />
                
                {/* Horizontal internal grid lines */}
                <rect x={centerX - gridSize / 2 + shadowOffset * 2} y={centerY - gridSize / 2 + cellSize + shadowOffset * 2} width={gridSize} height={gridThickness} fill={colors.dropShadow} opacity={0.4} />
                <rect x={centerX - gridSize / 2 + shadowOffset * 2} y={centerY - gridSize / 2 + cellSize * 2 + shadowOffset * 2} width={gridSize} height={gridThickness} fill={colors.dropShadow} opacity={0.4} />
              </g>
            )}
            {/* Shadow */}
            <g>
              {/* Vertical internal grid lines */}
              <rect x={centerX - gridSize / 2 + cellSize + shadowOffset} y={centerY - gridSize / 2 + shadowOffset} width={gridThickness} height={gridSize} fill={colors.shadow} opacity={0.3} />
              <rect x={centerX - gridSize / 2 + cellSize * 2 + shadowOffset} y={centerY - gridSize / 2 + shadowOffset} width={gridThickness} height={gridSize} fill={colors.shadow} opacity={0.3} />
              
              {/* Horizontal internal grid lines */}
              <rect x={centerX - gridSize / 2 + shadowOffset} y={centerY - gridSize / 2 + cellSize + shadowOffset} width={gridSize} height={gridThickness} fill={colors.shadow} opacity={0.3} />
              <rect x={centerX - gridSize / 2 + shadowOffset} y={centerY - gridSize / 2 + cellSize * 2 + shadowOffset} width={gridSize} height={gridThickness} fill={colors.shadow} opacity={0.3} />
            </g>
            {/* White border layer */}
            <g>
              {/* Vertical internal grid lines */}
              <rect x={centerX - gridSize / 2 + cellSize} y={centerY - gridSize / 2} width={gridThickness} height={gridSize} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} />
              <rect x={centerX - gridSize / 2 + cellSize * 2} y={centerY - gridSize / 2} width={gridThickness} height={gridSize} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} />
              
              {/* Horizontal internal grid lines */}
              <rect x={centerX - gridSize / 2} y={centerY - gridSize / 2 + cellSize} width={gridSize} height={gridThickness} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} />
              <rect x={centerX - gridSize / 2} y={centerY - gridSize / 2 + cellSize * 2} width={gridSize} height={gridThickness} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} />
            </g>
            {/* Yellow fill layer */}
            <g>
              {/* Vertical internal grid lines */}
              <rect x={centerX - gridSize / 2 + cellSize} y={centerY - gridSize / 2} width={gridThickness} height={gridSize} fill={colors.fill} filter="url(#retroGlow)" />
              <rect x={centerX - gridSize / 2 + cellSize * 2} y={centerY - gridSize / 2} width={gridThickness} height={gridSize} fill={colors.fill} filter="url(#retroGlow)" />
              
              {/* Horizontal internal grid lines */}
              <rect x={centerX - gridSize / 2} y={centerY - gridSize / 2 + cellSize} width={gridSize} height={gridThickness} fill={colors.fill} filter="url(#retroGlow)" />
              <rect x={centerX - gridSize / 2} y={centerY - gridSize / 2 + cellSize * 2} width={gridSize} height={gridThickness} fill={colors.fill} filter="url(#retroGlow)" />
            </g>
            {/* Inner highlight */}
            <g>
              {/* Vertical internal grid lines highlight */}
              <rect x={centerX - gridSize / 2 + cellSize + gridThickness * 0.2} y={centerY - gridSize * 0.3} width={gridThickness * 0.3} height={gridSize * 0.6} fill={colors.glow} opacity={0.4} />
              <rect x={centerX - gridSize / 2 + cellSize * 2 + gridThickness * 0.2} y={centerY - gridSize * 0.3} width={gridThickness * 0.3} height={gridSize * 0.6} fill={colors.glow} opacity={0.4} />
              
              {/* Horizontal internal grid lines highlight */}
              <rect x={centerX - gridSize * 0.3} y={centerY - gridSize / 2 + cellSize + gridThickness * 0.2} width={gridSize * 0.6} height={gridThickness * 0.3} fill={colors.glow} opacity={0.4} />
              <rect x={centerX - gridSize * 0.3} y={centerY - gridSize / 2 + cellSize * 2 + gridThickness * 0.2} width={gridSize * 0.6} height={gridThickness * 0.3} fill={colors.glow} opacity={0.4} />
            </g>
          </g>
        );
      }

      case 'plus': { // Purple plus sign
        const plusThickness = size * 0.2; // Adjusted to fit within viewport
        return (
          <g>
            {/* Drop Shadow */}
            {colors.dropShadow && (
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
            )}
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
            {/* Purple fill layer on top */}
          <g>
            <rect
              x={centerX - plusThickness / 2}
                y={centerY - size * 0.4}
              width={plusThickness}
                height={size * 0.8}
                fill={colors.fill}
              rx={plusThickness / 2}
              ry={plusThickness / 2}
                filter="url(#retroGlow)"
            />
            <rect
                x={centerX - size * 0.4}
              y={centerY - plusThickness / 2}
                width={size * 0.8}
              height={plusThickness}
                fill={colors.fill}
              rx={plusThickness / 2}
              ry={plusThickness / 2}
                filter="url(#retroGlow)"
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
          </g>
        );
      }

      case 'waves': // Purple waves - two parallel wavy lines
        const waveHeight = size * 0.2; // Made bigger
        const waveThickness = size * 0.1; // Made thicker
        const waveSpacing = size * 0.2; // Increased spacing between waves
        
        // Create smooth wave paths - adjusted to stay within bounds
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
          <g>
            {/* Drop Shadow */}
            {colors.dropShadow && (
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
            )}
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
            {/* Purple fill layer */}
            <g>
              <path
                d={wavePath1}
                stroke={colors.fill}
                strokeWidth={waveThickness}
                fill="none"
                strokeLinecap="round"
                filter="url(#retroGlow)"
              />
              <path
                d={wavePath2}
                stroke={colors.fill}
                strokeWidth={waveThickness}
                fill="none"
                strokeLinecap="round"
                filter="url(#retroGlow)"
              />
            </g>
          </g>
        );
        
      case 'diamond': { // Red diamond
        const diamondSize = size * 0.6; // Smaller to ensure it fits within viewport
        return (
          <g>
            {/* Drop Shadow */}
            {colors.dropShadow && (
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
            )}
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
            {/* Yellow fill layer */}
            <rect
              x={centerX - diamondSize / 2}
              y={centerY - diamondSize / 2}
              width={diamondSize}
              height={diamondSize}
              fill={colors.fill}
              rx={diamondSize * 0.1}
              ry={diamondSize * 0.1}
              transform={`rotate(45 ${centerX} ${centerY})`}
              filter="url(#retroGlow)"
            />
            {/* Inner highlight */}
            <rect
              x={centerX - diamondSize * 0.3}
              y={centerY - diamondSize * 0.3}
              width={diamondSize * 0.6}
              height={diamondSize * 0.6}
              fill={colors.glow}
              rx={diamondSize * 0.05}
              ry={diamondSize * 0.05}
              transform={`rotate(45 ${centerX} ${centerY})`}
              opacity={0.4}
            />
          </g>
        );
      }

      case 'asterisk': { // Teal 8-pointed asterisk
        const asteriskSize = size * 0.8; // Made even bigger but still fits viewport
        const armLength = asteriskSize * 0.5; // Even longer arms
        const armThickness = size * 0.12; // Even thicker arms
        
        // Create 8-pointed star using two overlapping plus signs (0°, 45°)
        return (
          <g>
            {/* Drop Shadow */}
            {colors.dropShadow && (
              <g>
                {/* Vertical/horizontal arms */}
                <rect
                  x={centerX - armThickness / 2 + shadowOffset * 2}
                  y={centerY - armLength + shadowOffset * 2}
                  width={armThickness}
                  height={armLength * 2}
                  fill={colors.dropShadow}
                  rx={armThickness / 2}
                  ry={armThickness / 2}
                  opacity={0.4}
                />
                <rect
                  x={centerX - armLength + shadowOffset * 2}
                  y={centerY - armThickness / 2 + shadowOffset * 2}
                  width={armLength * 2}
                  height={armThickness}
                  fill={colors.dropShadow}
                  rx={armThickness / 2}
                  ry={armThickness / 2}
                  opacity={0.4}
                />
                {/* Diagonal arms (45° rotation) */}
                <rect
                  x={centerX - armThickness / 2 + shadowOffset * 2}
                  y={centerY - armLength + shadowOffset * 2}
                  width={armThickness}
                  height={armLength * 2}
                  fill={colors.dropShadow}
                  rx={armThickness / 2}
                  ry={armThickness / 2}
                  transform={`rotate(45 ${centerX + shadowOffset * 2} ${centerY + shadowOffset * 2})`}
                  opacity={0.4}
                />
                <rect
                  x={centerX - armLength + shadowOffset * 2}
                  y={centerY - armThickness / 2 + shadowOffset * 2}
                  width={armLength * 2}
                  height={armThickness}
                  fill={colors.dropShadow}
                  rx={armThickness / 2}
                  ry={armThickness / 2}
                  transform={`rotate(45 ${centerX + shadowOffset * 2} ${centerY + shadowOffset * 2})`}
                  opacity={0.4}
                />
              </g>
            )}
            {/* Shadow */}
            <g>
              {/* Vertical/horizontal arms */}
              <rect
                x={centerX - armThickness / 2 + shadowOffset}
                y={centerY - armLength + shadowOffset}
                width={armThickness}
                height={armLength * 2}
                fill={colors.shadow}
                rx={armThickness / 2}
                ry={armThickness / 2}
                opacity={0.3}
              />
              <rect
                x={centerX - armLength + shadowOffset}
                y={centerY - armThickness / 2 + shadowOffset}
                width={armLength * 2}
                height={armThickness}
                fill={colors.shadow}
                rx={armThickness / 2}
                ry={armThickness / 2}
                opacity={0.3}
              />
              {/* Diagonal arms (45° rotation) */}
              <rect
                x={centerX - armThickness / 2 + shadowOffset}
                y={centerY - armLength + shadowOffset}
                width={armThickness}
                height={armLength * 2}
                fill={colors.shadow}
                rx={armThickness / 2}
                ry={armThickness / 2}
                transform={`rotate(45 ${centerX + shadowOffset} ${centerY + shadowOffset})`}
                opacity={0.3}
              />
              <rect
                x={centerX - armLength + shadowOffset}
                y={centerY - armThickness / 2 + shadowOffset}
                width={armLength * 2}
                height={armThickness}
                fill={colors.shadow}
                rx={armThickness / 2}
                ry={armThickness / 2}
                transform={`rotate(45 ${centerX + shadowOffset} ${centerY + shadowOffset})`}
                opacity={0.3}
              />
            </g>
            {/* White border layer */}
            <g>
              {/* Vertical/horizontal arms */}
              <rect
                x={centerX - armThickness / 2}
                y={centerY - armLength}
                width={armThickness}
                height={armLength * 2}
                fill="none"
                stroke={colors.stroke}
                strokeWidth={strokeWidth * 2}
                rx={armThickness / 2}
                ry={armThickness / 2}
                strokeLinecap="round"
              />
              <rect
                x={centerX - armLength}
                y={centerY - armThickness / 2}
                width={armLength * 2}
                height={armThickness}
                fill="none"
                stroke={colors.stroke}
                strokeWidth={strokeWidth * 2}
                rx={armThickness / 2}
                ry={armThickness / 2}
                strokeLinecap="round"
              />
              {/* Diagonal arms (45° rotation) */}
              <rect
                x={centerX - armThickness / 2}
                y={centerY - armLength}
                width={armThickness}
                height={armLength * 2}
                fill="none"
                stroke={colors.stroke}
                strokeWidth={strokeWidth * 2}
                rx={armThickness / 2}
                ry={armThickness / 2}
                strokeLinecap="round"
                transform={`rotate(45 ${centerX} ${centerY})`}
              />
              <rect
                x={centerX - armLength}
                y={centerY - armThickness / 2}
                width={armLength * 2}
                height={armThickness}
                fill="none"
                stroke={colors.stroke}
                strokeWidth={strokeWidth * 2}
                rx={armThickness / 2}
                ry={armThickness / 2}
                strokeLinecap="round"
                transform={`rotate(45 ${centerX} ${centerY})`}
              />
            </g>
            {/* Orange fill layer */}
            <g>
              {/* Vertical/horizontal arms */}
              <rect
                x={centerX - armThickness / 2}
                y={centerY - armLength}
                width={armThickness}
                height={armLength * 2}
                fill={colors.fill}
                rx={armThickness / 2}
                ry={armThickness / 2}
                filter="url(#retroGlow)"
              />
              <rect
                x={centerX - armLength}
                y={centerY - armThickness / 2}
                width={armLength * 2}
                height={armThickness}
                fill={colors.fill}
                rx={armThickness / 2}
                ry={armThickness / 2}
                filter="url(#retroGlow)"
              />
              {/* Diagonal arms (45° rotation) */}
              <rect
                x={centerX - armThickness / 2}
                y={centerY - armLength}
                width={armThickness}
                height={armLength * 2}
                fill={colors.fill}
                rx={armThickness / 2}
                ry={armThickness / 2}
                filter="url(#retroGlow)"
                transform={`rotate(45 ${centerX} ${centerY})`}
              />
              <rect
                x={centerX - armLength}
                y={centerY - armThickness / 2}
                width={armLength * 2}
                height={armThickness}
                fill={colors.fill}
                rx={armThickness / 2}
                ry={armThickness / 2}
                filter="url(#retroGlow)"
                transform={`rotate(45 ${centerX} ${centerY})`}
              />
            </g>
          </g>
        );
      }

      case 'dots': { // Pink four dots in square formation
        const dotRadius = size * 0.15; // Made slightly smaller
        const dotOffset = size * 0.25; // Slightly closer but still in viewport
        
        return (
          <g>
            {/* Drop Shadow */}
            {colors.dropShadow && (
              <g>
                <circle cx={centerX - dotOffset + shadowOffset * 2} cy={centerY - dotOffset + shadowOffset * 2} r={dotRadius} fill={colors.dropShadow} opacity={0.4} />
                <circle cx={centerX + dotOffset + shadowOffset * 2} cy={centerY - dotOffset + shadowOffset * 2} r={dotRadius} fill={colors.dropShadow} opacity={0.4} />
                <circle cx={centerX - dotOffset + shadowOffset * 2} cy={centerY + dotOffset + shadowOffset * 2} r={dotRadius} fill={colors.dropShadow} opacity={0.4} />
                <circle cx={centerX + dotOffset + shadowOffset * 2} cy={centerY + dotOffset + shadowOffset * 2} r={dotRadius} fill={colors.dropShadow} opacity={0.4} />
              </g>
            )}
            {/* Shadow */}
            <g>
              <circle cx={centerX - dotOffset + shadowOffset} cy={centerY - dotOffset + shadowOffset} r={dotRadius} fill={colors.shadow} opacity={0.3} />
              <circle cx={centerX + dotOffset + shadowOffset} cy={centerY - dotOffset + shadowOffset} r={dotRadius} fill={colors.shadow} opacity={0.3} />
              <circle cx={centerX - dotOffset + shadowOffset} cy={centerY + dotOffset + shadowOffset} r={dotRadius} fill={colors.shadow} opacity={0.3} />
              <circle cx={centerX + dotOffset + shadowOffset} cy={centerY + dotOffset + shadowOffset} r={dotRadius} fill={colors.shadow} opacity={0.3} />
            </g>
            {/* White border layer */}
            <g>
              <circle cx={centerX - dotOffset} cy={centerY - dotOffset} r={dotRadius} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} />
              <circle cx={centerX + dotOffset} cy={centerY - dotOffset} r={dotRadius} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} />
              <circle cx={centerX - dotOffset} cy={centerY + dotOffset} r={dotRadius} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} />
              <circle cx={centerX + dotOffset} cy={centerY + dotOffset} r={dotRadius} fill="none" stroke={colors.stroke} strokeWidth={strokeWidth * 2} />
            </g>
            {/* Pink fill layer */}
            <g>
              <circle cx={centerX - dotOffset} cy={centerY - dotOffset} r={dotRadius} fill={colors.fill} filter="url(#retroGlow)" />
              <circle cx={centerX + dotOffset} cy={centerY - dotOffset} r={dotRadius} fill={colors.fill} filter="url(#retroGlow)" />
              <circle cx={centerX - dotOffset} cy={centerY + dotOffset} r={dotRadius} fill={colors.fill} filter="url(#retroGlow)" />
              <circle cx={centerX + dotOffset} cy={centerY + dotOffset} r={dotRadius} fill={colors.fill} filter="url(#retroGlow)" />
            </g>
            {/* Inner highlight */}
            <g>
              <circle cx={centerX - dotOffset} cy={centerY - dotOffset} r={dotRadius * 0.6} fill={colors.glow} opacity={0.4} />
              <circle cx={centerX + dotOffset} cy={centerY - dotOffset} r={dotRadius * 0.6} fill={colors.glow} opacity={0.4} />
              <circle cx={centerX - dotOffset} cy={centerY + dotOffset} r={dotRadius * 0.6} fill={colors.glow} opacity={0.4} />
              <circle cx={centerX + dotOffset} cy={centerY + dotOffset} r={dotRadius * 0.6} fill={colors.glow} opacity={0.4} />
            </g>
          </g>
        );
      }

      case 'equals': { // Lime green equal signs (vertical lines)
        const equalsThickness = size * 0.15; // Thicker lines for bigger appearance
        const equalsOffset = size * 0.2; // Slightly more spacing
        const equalsLength = size * 0.8; // Even longer height, maxing out viewport
        
        return (
          <g>
            {/* Drop Shadow */}
            {colors.dropShadow && (
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
            )}
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
                filter="url(#retroGlow)"
            />
            <rect
                x={centerX + equalsOffset - equalsThickness / 2}
                y={centerY - equalsLength / 2}
                width={equalsThickness}
                height={equalsLength}
                fill={colors.fill}
              rx={equalsThickness / 2}
              ry={equalsThickness / 2}
                filter="url(#retroGlow)"
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
          </g>
        );
      }

      case 'wild': // Wild card - shows question mark or special symbol
        return (
          <g>
            {/* Shadow */}
            <circle
              cx={centerX + shadowOffset}
              cy={centerY + shadowOffset}
              r={size / 2 - strokeWidth / 2}
              fill="#8b2c0f"
              opacity={0.4}
            />
            {/* Main circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={size / 2 - strokeWidth / 2}
              fill="#ff6b35"
              stroke="#cc4a1a"
              strokeWidth={strokeWidth}
              filter="url(#retroGlow)"
            />
            {/* Inner highlight */}
            <circle
              cx={centerX - size * 0.15}
              cy={centerY - size * 0.15}
              r={size * 0.2}
              fill="#ff8c5a"
              opacity={0.5}
            />
            {/* Question mark */}
            <text
              x={centerX}
              y={centerY + size * 0.08}
              textAnchor="middle"
              fontSize={size * 0.35}
              fill="#ffffff"
              fontWeight="bold"
              fontFamily="'Press Start 2P', monospace"
              filter="url(#textShadow)"
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
        {/* Retro SVG Filters */}
        <defs>
          <filter id="retroGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.5"/>
          </filter>
        </defs>
        {renderShape()}
      </svg>
    </div>
  );
};

export default AnomiaShape;
