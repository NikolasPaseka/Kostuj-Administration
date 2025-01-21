import { Button, forwardRef } from "@heroui/react"

type Props = { 
  children: React.ReactNode, 
  EndContent?: React.ComponentType<{
    className?: string;
  }> | null;
  className?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isSecondary?: boolean;
  size?: "sm" | "md" | "lg";
}

const PrimaryButton = forwardRef(({ children, EndContent = null, className, onClick = () => {}, isDisabled = false, isSecondary = false, size="md" }: Props, ref) => {
  return (
    <>
      {EndContent != null ?
        <Button 
          ref={ref}
          onClick={onClick} 
          variant={isSecondary ? "bordered" : "solid"} 
          size={size} 
          color={isSecondary? "secondary" : "primary"} 
          endContent={<EndContent className={`size-4 ${isSecondary ? 'text-secondary': 'text-white'}`} />} 
          className={className} 
          isDisabled={isDisabled}
        >
          {children}
        </Button>
        :
        <Button onClick={onClick} variant={isSecondary ? "bordered" : "solid"} size={size} color={isSecondary ? "secondary" : "primary"} className={className} isDisabled={isDisabled}>{children}</Button>
      }
    </>
  )
});

export default PrimaryButton