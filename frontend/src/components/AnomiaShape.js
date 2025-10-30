import React from 'react';
import {
  CircleIcon,
  SquareIcon,
  PlusIcon,
  WavesIcon,
  DiamondIcon,
  AsteriskIcon,
  DotsIcon,
  EqualsIcon
} from './anomia-icons';

const AnomiaShape = ({ shape, size = 60, color = "#ffffff", className = "" }) => {
  const iconProps = { size, className, color };
    
    switch (shape) {
      case 'circle':
      return <CircleIcon {...iconProps} />;
    case 'square':
      return <SquareIcon {...iconProps} />;
    case 'plus':
      return <PlusIcon {...iconProps} />;
    case 'waves':
      return <WavesIcon {...iconProps} />;
    case 'diamond':
      return <DiamondIcon {...iconProps} />;
    case 'asterisk':
      return <AsteriskIcon {...iconProps} />;
    case 'dots':
      return <DotsIcon {...iconProps} />;
    case 'equals':
      return <EqualsIcon {...iconProps} />;
      default:
        return null;
    }
};

export default AnomiaShape;
