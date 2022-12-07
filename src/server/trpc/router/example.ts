import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ msg: z.string().nullish()}).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.msg ?? "world"}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});
