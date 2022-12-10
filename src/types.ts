import { File } from "@prisma/client";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "./server/trpc/router/_app";

export type FileContainer = File;