import { router, publicProcedure, protectedProcedure } from "../trpc";
import {z} from "zod"
import argon2 from "argon2"
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  createNewUser: publicProcedure.input(z.object({email: z.string().email({message: "Must ve a valid email"}), password: z.string().min(3, {message: "Password must be 3 or more characters"})})).mutation(async ({input})=>{
    const hashedPassword = await argon2.hash(input.password);

    const alreadyExists = await prisma?.user.findUnique({where:{email: input.email}});

    if (alreadyExists){
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "An account with that email already exists"
      })
    }

    const user = await prisma?.user.create({data:{email: input.email, password: hashedPassword}});

    if (!user){
      return false;

    }

    return true;

    


  })
});
