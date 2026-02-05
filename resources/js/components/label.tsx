import React from 'react'
import { Label as BaseLabel  } from './ui/label';

interface LabelProps {
    htmlFor:string;
    children: React.ReactNode;
    required?: boolean;
}

const Label: React.FC<LabelProps> = ({ htmlFor, children, required}) => {
  return (
     <BaseLabel  htmlFor={htmlFor}>{children}{required && <span className="text-red-500">*</span>}</BaseLabel>
  )
}
export default Label;
