import { router } from "../trpc";
import { authRouter } from "./auth";
import { collectionsRouter } from "./collections";
import { tasksRouter } from "./tasks";

export const appRouter = router({
  // example: exampleRouter,
  auth: authRouter,
  collections: collectionsRouter,
  tasks: tasksRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
