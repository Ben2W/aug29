import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { buildContext, type Context } from "./context";
import { jobApplications, jobPosts } from "../db/schema";
import { and, desc, eq } from "drizzle-orm";

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});

const protectedProcedure = t.procedure.use(isAuthed);

export const appRouter = t.router({
  listJobPosts: t.procedure.query(async ({ ctx }) => {
    const rows = await ctx.db.query.jobPosts.findMany({
      orderBy: desc(jobPosts.createdAt),
    });
    return rows;
  }),
  listJobPostsByDepartment: t.procedure
    .input(
      z.object({
        department: z.enum([
          "engineering",
          "design",
          "data",
          "people",
          "growth",
        ]),
      })
    )
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db.query.jobPosts.findMany({
        where: eq(jobPosts.department, input.department),
        orderBy: desc(jobPosts.createdAt),
      });
      return rows;
    }),
  getJobPost: t.procedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const row = await ctx.db.query.jobPosts.findFirst({
        where: eq(jobPosts.id, input.id),
      });
      return row;
    }),
  createJobPost: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        department: z.enum([
          "engineering",
          "design",
          "data",
          "people",
          "growth",
        ]),
        overview: z.string().min(1),
        location: z.string().min(1),
        employmentType: z.enum(["full-time", "part-time"]),
        locationType: z.enum(["remote", "onsite", "hybrid"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [inserted] = await ctx.db
        .insert(jobPosts)
        .values({
          ownerUserId: ctx.userId!,
          name: input.name,
          department: input.department,
          overview: input.overview,
          location: input.location,
          employmentType: input.employmentType,
          locationType: input.locationType,
        })
        .returning();
      return inserted;
    }),
  listMyJobPosts: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.query.jobPosts.findMany({
      where: eq(jobPosts.ownerUserId, ctx.userId!),
      orderBy: desc(jobPosts.createdAt),
    });
    return rows;
  }),
  createJobApplication: protectedProcedure
    .input(
      z.object({
        jobPostId: z.number().int().positive(),
        name: z.string().min(1),
        email: z.string().email(),
        linkedinUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [inserted] = await ctx.db
        .insert(jobApplications)
        .values({
          jobPostId: input.jobPostId,
          name: input.name,
          email: input.email,
          linkedinUrl: input.linkedinUrl,
        })
        .returning();
      return inserted;
    }),
  listJobApplications: t.procedure
    .input(
      z.object({
        jobPostId: z.number().int().positive(),
        status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
      })
    )
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db.query.jobApplications.findMany({
        where: and(
          eq(jobApplications.jobPostId, input.jobPostId),
          eq(jobApplications.status, input.status)
        ),
        orderBy: desc(jobApplications.createdAt),
      });
      return rows;
    }),
});

export type AppRouter = typeof appRouter;

// Helper to build a server-side caller with injected context
export function createServerCaller(ctx: {
  db?: Context["db"];
  userId?: string | null;
}) {
  return appRouter.createCaller(
    buildContext({ db: ctx.db, userId: ctx.userId ?? null })
  );
}
