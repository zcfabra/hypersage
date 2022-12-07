import { getCsrfToken, signIn } from 'next-auth/react'
import React from 'react'
import { trpc } from '../utils/trpc'
import { Field, Form, Formik } from 'formik'
import { router } from '../server/trpc/trpc'
import { useRouter } from 'next/router'

const Login =  () => {
    const amIAuthed = trpc.auth.getSession.useQuery();
    const router = useRouter()

    if (amIAuthed.data?.user){
        router.push("/dashboard")
    }

    return (
        <div className='w-full h-screen bg-gray-100 flex flex-col items-center justify-center'>
            <div className='w-4/12 h-5/6 rounded-xl bg-white flex flex-col items-center p-4'>
                <h1 className='text-5xl font-bold'>Login</h1>
                <Formik
                    initialValues={{email: "", password: ""}}
                    onSubmit={async (values)=>{
                        // const csrf = await getCsrfToken()
                        const res = await signIn("credentials", {redirect:true,callbackUrl:"/dashboard", email: values.email, password: values.password})
                        console.log(res)
                    }}
                >{({})=>(
                    <Form className='w-full h-full flex flex-col items-center'>

                        <div className='h-full w-9/12 mt-8'>

                        <Field className="rounded-md shadow-inner px-4 my-2 w-full bg-gray-100 h-12" type="email" name="email"></Field>
                        <Field className="rounded-md shadow-inner px-4 my-2 w-full bg-gray-100 h-12" type="password" name="password"></Field>
                        </div>
                        <button className='w-32 h-12 rounded-md bg-pink-500 text-white' type='submit'>Login</button>
                    </Form>
                )}</Formik>
            </div>
        </div>
    )
}

export default Login