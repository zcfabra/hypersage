import { router } from "../trpc";
import { authRouter } from "./auth";
import { collectionsRouter } from "./collections";
import { exampleRouter } from "./example";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  collections: collectionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
