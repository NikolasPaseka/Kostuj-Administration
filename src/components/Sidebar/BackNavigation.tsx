import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import IconButton from '../IconButton';

interface Props {
  headline: React.ReactNode;
  className?: string;
}

const BackNavigation = ({ headline, className }: Props) => {
  const navigate = useNavigate();

  return (
    <div className={`flex items-center ${className}`}>
      <IconButton 
        onClick={() => navigate(-1)} 
        icon={<ArrowLeftIcon className="w-8 h-8"/>}
        iconColor='text-black'
        iconSize='w-8 h-8'
        className="w-12 h-12 text-center bg-lightContainer rounded-full"
      />
      <span className="ml-4">{headline}</span>
    </div>
  )
}

export default BackNavigation
