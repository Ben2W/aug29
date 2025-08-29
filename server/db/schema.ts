import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const jobPosts = sqliteTable("job_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizationId: text("organization_id").notNull(),
  department: text("department").notNull(),
  overview: text("overview").notNull(),
  location: text("location").notNull(),
  employmentType: text("employment_type").notNull(),
  locationType: text("location_type").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const jobApplications = sqliteTable("job_applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobPostId: integer("job_post_id")
    .notNull()
    .references(() => jobPosts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  linkedinUrl: text("linkedin_url").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type JobPost = typeof jobPosts.$inferSelect;
export type NewJobPost = typeof jobPosts.$inferInsert;

export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;
