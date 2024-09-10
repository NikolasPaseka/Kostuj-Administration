import React from 'react'

type Props = {
  icon: React.ReactElement,
  onClick: () => void,
  className?: string;
  iconColor?: string;
  isDisabled?: boolean;
}

const IconButton = ({ icon, onClick, className, iconColor, isDisabled = false }: Props) => {
  return (
    <button className={`${className}`} onClick={onClick} disabled={isDisabled}>
      {React.cloneElement(icon, { className: `w-5 h-5 ${iconColor ? iconColor : "text-gray-400"}` })}
    </button>
  )
}

export default IconButton