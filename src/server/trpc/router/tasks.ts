import { z } from "zod";
import { trpc } from "../../../utils/trpc";
import { protectedProcedure, router } from "../trpc";

export const tasksRouter = router({
    getTasksForCollection: protectedProcedure.input(z.object({collectionID: z.string()})).query(async ({ctx, input})=>{
        const tasks = await ctx.prisma.task.findMany({where: {collectionID: input.collectionID}});
        if (!tasks){
            return null;
        }
        return tasks;
    })
})