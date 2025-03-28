import { Chip } from "@heroui/react"
import React from 'react'

type Props = {
  children: React.ReactNode
  color?: "primary" | "default" | "secondary" | "success" | "warning" | "danger"
  className?: string
  endContent?: React.ReactNode
  isActive: boolean
  isDisabled?: boolean
  onClick?: () => void
}

const ClickableChip = ({ color="primary", children, isActive, isDisabled=false, onClick }: Props) => {
  return (
    <Chip
      color={color}
      onClose={isActive ? () => {
        onClick && onClick()
      } : undefined}
      onClick={onClick}
      isDisabled={isDisabled}
      variant={isActive ? "solid" : "bordered"}
      className={`cursor-pointer`}
    >
      {children}
    </Chip>
  )
}

export default ClickableChip