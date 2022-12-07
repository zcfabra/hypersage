import { Field } from 'formik';
import React from 'react'

interface FormInputProps{
    name: string,
    type?: string
}

const FormInput: React.FC<FormInputProps> = ({name, type}) => {
  return (
    <Field className="w-full h-12 rounded-md bg-gray-100 shadow-inner text-black px-4 my-4" name={name} type={type}></Field>
  )
}

export default FormInput;