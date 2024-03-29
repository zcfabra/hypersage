import NextAuth, { type NextAuthOptions } from "next-auth";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import argon2 from "argon2";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 10*24*60*60
  },
  callbacks: {
    session({ session, token, user }) {
      // console.log("TOKEN", token)
      // console.log("SESSION",session);
      // console.log("USER", user)
      
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials){
        // console.log(credentials)
        const user = await prisma.user.findUnique({where:{email: credentials?.email}});
        // console.log("USER: ",user)
        if (!user){
          return null
        } 
        const isPasswordValid = await argon2.verify(user.password, credentials?.password as string);
        if (!isPasswordValid){
            return null 
        }
        return user;
      }
    })
    
    
  ],
  pages:{ 
     signIn: "/login"
  }
};

export default NextAuth(authOptions);
