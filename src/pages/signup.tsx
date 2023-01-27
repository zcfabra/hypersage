import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import FormInput from '../components/Form';
import { trpc } from '../utils/trpc';
import { GetServerSidePropsContext } from 'next';
import { getServerAuthSession } from '../server/common/get-server-auth-session';


const Signup = () => {

  const router = useRouter();
  const signUpMutation = trpc.auth.createNewUser.useMutation({
    onError(err){
      let error;
      if (err.message.includes("[") || err.message.includes("{")){
        error = JSON.parse(err.message);
        for (const err_message of error){
          toast.error(err_message["message"], {closeOnClick: true});
        }
      } else {

        toast.error(err.message, {closeOnClick:true})
      }


    },
    onSuccess(){
      router.push("/login");
    }
  })
  return (
    <div className='w-full h-screen bg-gray-100 flex flex-col items-center justify-center'>
      <button onClick={()=>router.push("/")} className='absolute top-0 left-0 w-32 h-12 hover:underline transition-all text-gray-500 '>Home</button>
      <span>Signups temporarily unavailable</span>
{/* 
      <Formik
        initialValues={{email: "", password: ""}}
        onSubmit={(values)=>{
          signUpMutation.mutate(values);
        }}
      >
        {()=>(
          <Form className='w-10/12 sm:w-7/12 md:w-6/12 lg:w-4/12 rounded-xl h-5/6 bg-white flex flex-col items-center'>
            <h1 className='text-6xl font-bold mt-4'>Sign Up</h1>
            <div className='w-9/12 h-full mt-8 flex flex-col items-center'>

              <FormInput placeholder="Email" type="email" name="email"/> 
              <FormInput placeholder='Password' type="password" name="password"/> 
            </div>
              <button type="submit" className='w-32 h-20 mb-8 mt-auto bg-gradient-to-r from-pink-500 to-orange-500 rounded-md text-white'>Sign Up</button>
          </Form>
        )}
        </Formik>  */}
    </div>
)
}

export default Signup;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const amIAuthed = await getServerAuthSession(ctx);

  if (amIAuthed && amIAuthed.user) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      }
    }
  } else {
    return {
      props: {}
    }
  }

}