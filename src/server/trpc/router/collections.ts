import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const collectionsRouter = router({
    getCollections: protectedProcedure.query(({ctx})=>{
        const collections = ctx.prisma.collection.findMany({where: {owner: {email: ctx.session.user.email}}})
        if (collections){
            return collections
        }
        return null;
    }),
    getCollection: protectedProcedure.input(z.object({id: z.string()})).query(({ctx, input})=>{
        const collection = ctx.prisma.collection.findUnique({where: {id: input.id}, include:{files:true}})

        if (!collection){
            throw new TRPCError({code: "NOT_FOUND", message: "Collection not found"});
            return;
        }

        return collection;
    })
})