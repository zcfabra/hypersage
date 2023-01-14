import { Field, Form, Formik } from 'formik'
import { GetServerSidePropsContext } from 'next'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { getServerAuthSession } from '../server/common/get-server-auth-session'
import { trpc } from '../utils/trpc'

const Login =  () => {
    const router = useRouter();
    // const amIAuthed = trpc.auth.getSession.useQuery();
    // if (amIAuthed.data?.user) {
    //     router.push("/dashboard")
    // }
    return (
        <div className='w-full h-screen bg-gray-100 flex flex-col items-center justify-center'>
            <button onClick={() => router.push("/")} className='absolute top-0 left-0 w-32 h-12 hover:underline transition-all text-gray-500 '>Home</button>
            <div className='w-10/12 sm:w-7/12 md:w-6/12 lg:w-4/12 h-5/6 rounded-xl bg-white flex flex-col items-center p-4'>
                <h1 className='text-5xl font-bold'>Login</h1>
                <Formik
                    initialValues={{email: "", password: ""}}
                    onSubmit={async (values)=>{
                        // const csrf = await getCsrfToken()
                        const res = await signIn("credentials", {redirect:false,callbackUrl:"/dashboard", email: values.email, password: values.password});
                        if (res!.ok){
                            router.push("/dashboard");
                        } else {
                            // console.log( res!.error);

                            if (res!.error == "CredentialsSignin"){
                                toast.error("Incorrect credentials", {closeOnClick: true})
                            }
                        }

                    }}
                >{({})=>(
                    <Form className='w-full h-full flex flex-col items-center'>

                        <div className='h-full w-9/12 mt-8'>

                        <Field placeholder="Email" className="rounded-md shadow-inner px-4 my-2 w-full bg-gray-100 h-12" type="email" name="email"></Field>
                        <Field placeholder="Password" className="rounded-md shadow-inner px-4 my-2 w-full bg-gray-100 h-12" type="password" name="password"></Field>
                        </div>
                        <button className='w-32 h-16 rounded-md bg-gradient-to-r from-pink-500 to-orange-500 text-white' type='submit'>Login</button>
                    </Form>
                )}</Formik>
            </div>
        </div>
    )
}

export default Login

export async function getServerSideProps(ctx: GetServerSidePropsContext){
    // console.log("HIT",ctx.req.url)
    const amIAuthed =await getServerAuthSession(ctx);

    if (amIAuthed &&  amIAuthed.user){
        return{
            redirect: {
                destination: "/dashboard",
                permanent: false,
            }
        }
    } else {
        return {
            props:{}
        }
    }

}