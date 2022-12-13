import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { trpc } from "../../../utils/trpc";
import { protectedProcedure, router } from "../trpc";


function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep() {
    await timeout(3000);

}

export type SimilarityTable= {
    [key:string]: {
        [key:string]: number,
    }
}

const connectNewTasks = (dataToUnpack: {[key:string] : number}) =>{

    return {create: dataToUnpack.map(i=>({
        
    })) }
}

export const tasksRouter = router({
    getTasksForCollection: protectedProcedure.input(z.object({collectionID: z.string()})).query(async ({ctx, input})=>{
        const tasks = await ctx.prisma.task.findMany({where: {collectionID: input.collectionID}});
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
        console.log(unpack)



        const addToTask = await ctx.prisma.task.update({data: {
            // [task.type == "Similarity" ? "similarities" : task.type == "NER" ? "ner" : "sentiment"]: task.type == "Similarity" ? 
            // unpack : connectNewTasks(unpack) ,
            ner: {
                create: {

                }
            }
        }, where: {id: task.id}});

        if (!addToTask){
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Error when updating task with computed data",
            });

        }

        else return true;




    })
})