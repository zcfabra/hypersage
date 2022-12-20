import { TRPCError } from "@trpc/server";
import { TbSalt } from "react-icons/tb";
import { z } from "zod";
import { trpc } from "../../../utils/trpc";
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
};

export interface SentimentTable {
    [key:string]:{
        sentiment: String,
        score: number,
        neg_words: string[],
        pos_words:string[],
    }
}





export const tasksRouter = router({
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

        const res = await fetch(`http://localhost:5000/tasks/${task.type}`, {
            method: "POST",  
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({data: task.filesToInclude}),
        });

        console.log("RET FROM PYTHON",res);

        let unpack = await res.json();
        console.log("UNPACK",unpack)

        let addToTask = await ctx.prisma.task.update({
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