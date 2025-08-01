// import { postRouter } from "@/server/api/routers/post";
import { appointmentRouter } from "@/server/api/routers/appointment";
import { doctorRouter } from "@/server/api/routers/doctor";
import { documentRouter } from "@/server/api/routers/document";
import { medicalRecordRouter } from "@/server/api/routers/medicalRecord";
import { userRouter } from "@/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	// post: postRouter,
	appointment: appointmentRouter,
	doctor: doctorRouter,
	document: documentRouter,
	medicalRecord: medicalRecordRouter,
	user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
