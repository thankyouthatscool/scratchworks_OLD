import { authRouter, orderRouter } from "./routes";
import { router } from ".";

export const appRouter = router({ auth: authRouter, order: orderRouter });

export type AppRouter = typeof appRouter;
