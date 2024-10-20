import React from 'react'
import { Chip } from '@nextui-org/react'

type Props = {
  children: React.ReactNode
  variant?: "solid" | "flat"
  className?: string
}

const GenericChip= ({ children, className, variant="flat"}: Props) => {
  return (
    <Chip 
      color="secondary" 
      variant={variant}
      className={className}
    >
      {children}
    </Chip>
  )
}

export default GenericChip