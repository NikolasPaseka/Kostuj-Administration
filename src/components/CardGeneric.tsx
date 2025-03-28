import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import React from "react";

type Props = {
  header: React.ReactNode,
  children: React.ReactNode,
  className?: string,
  showDivider?: boolean
}

const CardGeneric = ({ header, children, className, showDivider = false }: Props) => {
  return (
    <Card className={className}>
      <CardHeader>
        {header}
      </CardHeader>
      {showDivider && <Divider />}
      <CardBody>
        {children}
      </CardBody>
    </Card>
  )
}

export default CardGeneric;