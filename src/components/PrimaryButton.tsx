import { Button } from '@nextui-org/react'

type Props = { 
  children: React.ReactNode, 
  EndContent?: React.ComponentType<{
    className?: string;
  }> | null;  
  className?: string;
  onClick?: () => void;
  isDisabled?: boolean;
}

const PrimaryButton = ({ children, EndContent = null, className, onClick = () => {}, isDisabled = false }: Props) => {
  return (
    <>
      {EndContent != null ?
        <Button onClick={onClick} color="primary" endContent={<EndContent className="w-4 h-4" />} className={className} isDisabled={isDisabled}>{children}</Button>
        :
        <Button onClick={onClick} color="primary" className={className} isDisabled={isDisabled}>{children}</Button>
      }
    </>
  )
}

export default PrimaryButton