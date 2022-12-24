import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/router';
import React from 'react'
import FormInput from '../components/Form';
import { trpc } from '../utils/trpc';
import { toast } from 'react-toastify';


const Signup = () => {

  const router = useRouter();
  const signUpMutation = trpc.auth.createNewUser.useMutation({
    onError(err){
      toast(err.message, {closeOnClick:true})

    },
    onSuccess(){
      router.push("/login");
    }
  })
  return (
    <div className='w-full h-screen bg-gray-100 flex flex-col items-center justify-center'>

      <Formik
        initialValues={{email: "", password: ""}}
        onSubmit={(values)=>{
          signUpMutation.mutate(values);
        }}
      >
        {()=>(
          <Form className='w-10/12 sm:w-7/12 md:w-6/12 lg:w-4/12 rounded-xl h-5/6 bg-white flex flex-col items-center'>
            <h1 className='text-6xl font-bold mt-4'>Sign Up</h1>
            <div className='w-9/12 mt-8 flex flex-col items-center'>
              <FormInput type="email" name="email"/> 
              <FormInput type="password" name="password"/> 
              <button type="submit"className='w-32 h-12 bg-pink-500 rounded-md text-white'>Sign Up</button>
            </div>
          </Form>
        )}
        </Formik> 
    </div>
)
}

export default Signup