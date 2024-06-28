import React from 'react'
import { Link } from 'react-router-dom';

interface Props {
  path: string;
  text: string;
  Icon: React.ComponentType<{
    className?: string;
  }>;
}

const SidebarItem = ({ path, text, Icon }: Props) => {
  return (
    <Link to={path} className="flex items-center px-4 py-2 my-2 w-5/6 hover:bg-primary hover:text-onPrimary hover:rounded-xl">
      <Icon className="w-6 h-6 mr-2" />
      {text}
    </Link>
  )
}

export default SidebarItem