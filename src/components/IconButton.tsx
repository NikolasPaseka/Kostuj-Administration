import React from 'react'

type Props = {
  icon: React.ReactElement,
  onClick: () => void
}

const IconButton = ({ icon, onClick }: Props) => {
  return (
    <button onClick={onClick}>
      {React.cloneElement(icon, { className: "w-5 h-5 text-gray-400" })}
    </button>
  )
}

export default IconButton