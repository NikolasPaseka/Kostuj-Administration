import React from 'react'

type Props = {
  icon: React.ReactElement,
  onClick: () => void,
  className?: string;
  iconColor?: string;
  iconSize?: string;
  isDisabled?: boolean;
}

const IconButton = ({ icon, onClick, className, iconColor, iconSize, isDisabled = false }: Props) => {
  return (
    <button className={`flex items-center justify-center ${className}`} onClick={onClick} disabled={isDisabled}>
      {React.cloneElement(icon, { className: `${iconSize ? iconSize : "w-5 h-5" } ${iconColor ? iconColor : "text-gray-400"}` })}
    </button>
  )
}

export default IconButton