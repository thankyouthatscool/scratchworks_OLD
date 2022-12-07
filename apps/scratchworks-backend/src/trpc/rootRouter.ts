import { authRouter } from "./routes";
import { router } from ".";

export const appRouter = router({ auth: authRouter });

export type AppRouter = typeof appRouter;
