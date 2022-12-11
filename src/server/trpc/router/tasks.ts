import { z } from "zod";
import { trpc } from "../../../utils/trpc";
import { protectedProcedure, router } from "../trpc";


function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep() {
    await timeout(3000);

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

        return {data: await res.json()}




    })
})