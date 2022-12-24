import { Collection, File, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { use } from "react";
import { string, z, ZodNumber } from "zod";
import { getServerAuthSession } from "../../common/get-server-auth-session";
import { protectedProcedure, router } from "../trpc";

const fileArrayValidator = z.object({type: z.string(), size:z.number(), name: z.string(), text: z.string()}).array()
const createCollectionValidator = z.object({
    name: z.string(),
    files: fileArrayValidator
});


const updateCollectionValidator = z.object({
    id: z.string(),
    files: fileArrayValidator

})

export const collectionsRouter = router({
    getCollections: protectedProcedure.query(({ctx})=>{
        const collections = ctx.prisma.collection.findMany({where: {owner: {email: ctx.session.user.email}}})
        if (collections){
            return collections
        }
        return null;
    }),
    getCollection: protectedProcedure.input(z.object({id: z.string()})).query(async ({ctx, input})=>{
        const collection = await ctx.prisma.collection.findUnique({where: {id: input.id}, include:{files:true}})

        if (!collection){
            throw new TRPCError({code: "NOT_FOUND", message: "Collection not found"});
            return;
        }

        return collection;
    }),
    createCollection: protectedProcedure.input(createCollectionValidator).mutation(async ({ctx, input})=>{
        console.log(input);
        const user = ctx.session.user;
        if (!user){
            throw new TRPCError({code: "BAD_REQUEST", message: "For some reason, invalid session"});
        }
        let collection;
        try {

            collection = await ctx.prisma.collection.create({data: {
                name: input.name,
                files: {create: input.files.map((i)=>({
                    name: i.name,
                    size: i.size,
                    text: i.text,
                    type: i.type,
                })) },
                numFiles: input.files.length,
                owner: {connect:{ email: user.email!}}} 
            });
        } catch (e){
            if (e instanceof Prisma.PrismaClientKnownRequestError){
                if (e.code == "P2002"){
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "A collection with that name already exists" ,
                    });
                }
            }
        }
        console.log("CREATED: ", collection);

        if (!collection){
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Couldn't create collection", 
            });
        }

        return true;



    }),
    deleteFileFromCollection : protectedProcedure.input(z.object({id: z.string()})).mutation(async ({ctx, input})=>{
        const del = await ctx.prisma.file.delete({where: {id: input.id}});
        if (!del){
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Couldn't delete file"});
        } else {
            const update = await ctx.prisma.collection.update({where:{id :del.collectionId}, data: {numFiles: {decrement: 1}}})
            return true;
        }
    }),
    getTextOfFile: protectedProcedure.input(z.object({id: z.string()})).query(async ({ctx, input})=>{
        const file = await ctx.prisma.file.findUnique({where: {id: input.id}});
        if (!file) {
            throw new TRPCError({
                code:"BAD_REQUEST", 
                message: "File not found"
        });
        } else {
            return file;
        }
    }),
    addFilesToCollection: protectedProcedure.input(updateCollectionValidator).mutation(async ({ctx, input})=>{
       
            const addedToCollection = await ctx.prisma.collection.update({
                where: {
                    id: input.id
                }, 
                data:{
                    files: {
                        create: input.files.map((i)=>({
                            name: i.name,
                            size: i.size,
                            text: i.text,
                            type: i.type,
                        })) 
                    },
                    numFiles: {increment: input.files.length}
                }
            });

            if (!addedToCollection){
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Couldn't add new files to collection"
                })
            }

            return true;

        }


    ),

    fullTextSearchInCollection: protectedProcedure.input(z.object({collectionID:z.string(), query: z.string()})).query(async({ctx, input})=>{
        const res = await ctx.prisma.file.findMany({
            where: {
                collectionId: input.collectionID,
                text: {
                    search: input.query
                }
            }
        });

        if (!res){
            return null;
        }

        console.log(res);

        return res;
    }),

    deleteCollection: protectedProcedure.input(z.object({collectionID: z.string()})).mutation(async ({ctx, input})=>{
        const deleted = await ctx.prisma.collection.delete({where: {id: input.collectionID}});

        if (!deleted){
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Couldn't delete collection"
            });
        } else {
            return true;
        }
    })

      

})