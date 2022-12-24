import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";
import { ToastContainer } from "react-toastify";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
  
    <SessionProvider session={session}>
      <Head>
        <title>Hypersage</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
    <ToastContainer
      autoClose={2000}
      closeOnClick={true}
      pauseOnHover={false}
     /> 
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
