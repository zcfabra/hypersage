import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Head from "next/head";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Hypersage</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="../../public/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
