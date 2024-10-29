import React, { ReactElement } from "react"

type Props = {
  stateMessageType: "warning" | "success" | "error" | "info"
  text: React.ReactElement
}
const StateMessage = ({ stateMessageType, text }: Props) => {

  const getMessageColor = () => {
    switch (stateMessageType) {
      case "warning":
        return "bg-warning-100 border-warning-400"
      case "success":
        return "bg-success-100 border-success-400"
      case "error":
        return "bg-danger-100 border-danger-400"
      case "info":
        return "bg-blue-100 border-blue-400"
    }
  }

  const getTextColor = () => {
    switch (stateMessageType) {
      case "warning":
        return "text-warning-600"
      case "success":
        return "text-success-600"
      case "error":
        return "text-danger-600"
      case "info":
        return "text-blue-600"
    }
  }

  return (
    <div className={`
      rounded-md border-large px-4 py-2 my-2
      ${getMessageColor()}`
    }>
      {React.cloneElement(text as ReactElement, { className: getTextColor() })}
    </div> 
  )
}

export default StateMessage