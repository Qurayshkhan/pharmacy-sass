import React from 'react'
import { Spinner } from './spinner';

const FullPageSpinner = () => {
  return (
    <div className=' h-full w-full flex items-center justify-center'>
        <Spinner />
    </div>
  )
}

export default FullPageSpinner;
