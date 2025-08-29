import { initTRPC } from "@trpc/server";
import { z } from "zod";
import type { Context } from "./context";
import { jobApplications, jobPosts } from "../db/schema";

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  createJobPost: t.procedure
    .input(
      z.object({
        organizationId: z.string().min(1),
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
          organizationId: input.organizationId,
          department: input.department,
          overview: input.overview,
          location: input.location,
          employmentType: input.employmentType,
          locationType: input.locationType,
        })
        .returning();
      return inserted;
    }),
  createJobApplication: t.procedure
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
});

export type AppRouter = typeof appRouter;
