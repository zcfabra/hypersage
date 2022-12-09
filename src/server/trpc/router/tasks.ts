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
                filesToInclude: input.filesToInclude,
                collection: {connect: {id: input.collectionID}}
            }
        });



    })
})