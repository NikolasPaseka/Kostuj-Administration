export type DropdownActionItem = {
    key: string,
    label: string,
    description?: string,
    startContent?: JSX.Element,
    onClick?: () => void
    endContent?: JSX.Element,
}