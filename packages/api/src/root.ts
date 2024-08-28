import { authRouter } from "./router/auth/auth.router";
import { postRouter } from "./router/post/post.router";
import { userRouter } from "./router/user/user.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
