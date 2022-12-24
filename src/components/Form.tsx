import { Field } from 'formik';
import React from 'react'

interface FormInputProps{
    name: string,
    type?: string,
    placeholder:string
}

const FormInput: React.FC<FormInputProps> = ({name, type, placeholder}) => {
  return (
    <Field  placeholder={placeholder} className="w-full h-12 rounded-md bg-gray-100 shadow-inner text-black px-4 my-4" name={name} type={type}></Field>
  )
}

export default FormInput;