import React from 'react'

type Props = { 
  headline: string | null; 
  body: string;   
  Icon?: React.ComponentType<{
    className?: string;
  }>; 
};

const RowInfo = ({ headline, body, Icon }: Props) => {
  return (
    <div className="flex items-center pr-8">
      {Icon &&
        <Icon className="w-6 h-6 mr-2 flex-shrink-0 text-secondary"/>
      }
      {headline && <span className="text-md font-semibold mr-2">{headline}:</span> }
      <span className="text-md font-normal break-all">{body}</span>
    </div>
  )
}

export default RowInfo