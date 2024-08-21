import { Divider } from '@nextui-org/react';
import React from 'react'
import RowInfo from '../../../components/RowInfo';

type Props = { 
  headline: string | null; 
  body: string;   
  Icon: React.ComponentType<{
    className?: string;
  }>; 
};

const CardInfoRow = ({ headline, body, Icon }: Props) => {
  return (
    <>
    <div className="py-3">
      <RowInfo headline={headline} body={body} Icon={Icon} />
    </div>
    <Divider />
    </>
  )
}

export default CardInfoRow