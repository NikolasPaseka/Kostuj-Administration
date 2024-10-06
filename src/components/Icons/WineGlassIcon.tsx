import { IconProps } from "./IconProps";

const WineGlassIcon = ({ color, size }: IconProps) => {
  return (
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size}><path d="M320-120v-80h120v-164q-86-14-143-80t-57-156v-240h480v240q0 90-57 156t-143 80v164h120v80H320Zm160-320q56 0 98-34t56-86H326q14 52 56 86t98 34ZM320-640h320v-120H320v120Zm160 200Z"/></svg>
  )
}

export default WineGlassIcon;