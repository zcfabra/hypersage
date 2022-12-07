import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { getServerAuthSession } from "../server/common/get-server-auth-session";

const Home: NextPage = () => {

  const router = useRouter();
  const amIAuthed = trpc.auth.getSession.useQuery();
  return (
    <>
      <div className="w-full h-screen bg-white text-black flex flex-col items-center pt-16">
        <div className="absolute  top-0 w-full h-16 flex flex-row items-center justify-end px-4">
          {amIAuthed.data ? <button onClick={()=>signOut({redirect: true, callbackUrl: "/"})} className="w-32 h-12 bg-pink-500 text-white rounded-md">Logout</button> :<button onClick={()=>router.push("/login")}className="h-12 w-32 bg-pink-500 rounded-md text-white">Login</button>}
        </div>
        {/* <h1 className="text-9xl h-1/6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Docsage</h1> */}
        {amIAuthed.data 
        ?
        (<>
        <h1>Welcome back {amIAuthed.data.user?.email}</h1>
        </>)
        :
        (<><h1 className="text-black text-9xl font-bold">Hypersage</h1>
        <button onClick={()=>router.push("/signup")} className="w-32 h-16 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-md text-lg">Sign Up</button></>)}
        
      
      </div>
    </>
  )
} 

export default Home;