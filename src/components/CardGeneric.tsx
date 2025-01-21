import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";

type Props = {
  header: React.ReactNode,
  children: React.ReactNode,
  className?: string
}

const CardGeneric = ({ header, children, className }: Props) => {
  return (
    <Card className={className}>
      <CardHeader>
        {header}
      </CardHeader>
      <CardBody>
        {children}
      </CardBody>
    </Card>
  )
}

export default CardGeneric;