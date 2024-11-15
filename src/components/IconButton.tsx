import React from 'react'

type Props = {
  icon: React.ReactElement,
  onClick: () => void,
  className?: string;
  iconColor?: string;
  iconSize?: string;
  isDisabled?: boolean;
  withBackground?: boolean;
}

const IconButton = ({ icon, onClick, className, iconColor, iconSize, isDisabled = false, withBackground = false }: Props) => {
  return (
    <button className={`flex items-center justify-center ${className} ${withBackground ? "border-secondary border-2 p-[0.4rem] rounded-md" : ""}`} onClick={onClick} disabled={isDisabled}>
      {React.cloneElement(icon, { className: `${iconSize ? iconSize : "w-5 h-5" } ${withBackground ? "text-secondary" : iconColor ? iconColor : "text-gray-400"}` })}
    </button>
  )
}

export default IconButton