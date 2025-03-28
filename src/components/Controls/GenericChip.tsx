import React from 'react'
import { Chip } from "@heroui/react"

type Props = {
  children: React.ReactNode
  variant?: "solid" | "flat"
  className?: string
}

const GenericChip= ({ children, className, variant="solid"}: Props) => {
  const classNameExt = variant === "flat" ? "text-black" : ""

  return (
    <Chip 
      color="secondary" 
      variant={variant}
      className={className + " " + classNameExt}
    >
      {children}
    </Chip>
  )
}

export default GenericChip