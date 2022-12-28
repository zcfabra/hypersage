import { TRPCError } from "@trpc/server";
import { env } from "process";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";


function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep() {
    await timeout(3000);

}

export interface SimilarityTable{
  
    [key:string]: {
        name: string,
        similarities: {
        [key:string]: {
            name: string,
            score: number
        },
        },
        mostSimilar: {
            name: string,
            id: string
        },
        leastSimilar: {
            name:string,
            id:string,
        }
    }
}

export interface NERTable{
    [key:string]: {
        data: {
            label: string,
            text: string,
        }[]
    }
}

export interface SentimentTable {
    [key:string]:{
        sentiment: string,
        score: number,
        neg_words: string[],
        pos_words:string[],
    }
}





export const tasksRouter = router({
    checkForCollection: protectedProcedure.input(z.object({collectionID: z.string(), name: z.string()})).mutation(async({ctx, input})=>{


            const taskAlreadyExisting = await ctx.prisma.task.findFirst({ where: { name: input.name, collectionID: input.collectionID } });

            if (taskAlreadyExisting != null){
                // console.log("ERRR", e)
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "A task with that name already exists"
                    });
                
            } else {
            return true;
        }

        

    
    }),
    getTasksForCollection: protectedProcedure.input(z.object({collectionID: z.string()})).query(async ({ctx, input})=>{
        const tasks = await ctx.prisma.task.findMany({where: {collectionID: input.collectionID}, include:{
            filesToInclude: {select:{file:{select:{name: true,id:true}}}}
        }});
        if (!tasks){
            return null;
        }
        return tasks;
    }),

    createTask: protectedProcedure.input(z.object({collectionID: z.string(), filesToInclude: z.string().array(), name: z.string(),type: z.string()})).mutation(async({ctx, input})=>{
      
        
        const task = await ctx.prisma.task.create({data:
            {
                name: input.name,
                type: input.type,
                filesToInclude: {
                    create: input.filesToInclude.map((i)=>({
                        file:{ connect:{
                            id: i
                        }}
                    }))
                },
                collection: {
                    connect: {id: input.collectionID}
                }
            }, 
            include: {filesToInclude: {include:{file: true}}}
        });
        console.log("TASK:", task);

        const res = await fetch(`${env.SERVICE_URL}/tasks/${task.type}`, {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({data: task.filesToInclude}),
        });

        console.log("RET FROM PYTHON",res);

        const unpack = await res.json();
        console.log("UNPACK",unpack)

        const addToTask = await ctx.prisma.task.update({
            where:{
                id: task.id,
            },
            data: {
                taskData: unpack

            }
        })
        if (!addToTask){
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Error updating task with computed data"
            })
        } else {
            return true;
        }
    }),
    deleteTask: protectedProcedure.input(z.object({id: z.string()})).mutation(async ({ctx,input})=>{
        const deleted = await ctx.prisma.task.delete({where:{id: input.id}});
        if (!deleted){
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Unable to delete the task"
            })
        } else {
            return true;
        }

    })
})