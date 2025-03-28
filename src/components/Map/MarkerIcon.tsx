
import React from 'react'

type Props = {
  color: string
  IconComponent: React.ComponentType<{ style: React.CSSProperties }>
}

const MarkerIcon = ({ color, IconComponent}: Props) => {
  return (
    <div className="custom-marker" style={{ width: 40, height: 40 }}>
      <IconComponent style={{ fill: color, width: '100%', height: '100%' }} />
    </div>
  );
}


export default MarkerIcon