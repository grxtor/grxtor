import { z } from "zod";

export const socialSchema = z.object({
  url: z.string(),
  navbar: z.boolean(),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  realName: z.string().min(1),
  initials: z.string().min(1),
  url: z.string().min(1),
  location: z.string(),
  locationLink: z.string(),
  description: z.string(),
  summary: z.string(),
  avatarUrl: z.string(),
  email: z.string(),
  social: z.record(z.string(), socialSchema),
  spotifyArtistId: z.string(),
});

export const workItemSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  href: z.string(),
  badges: z.array(z.string()),
  location: z.string(),
  title: z.string().min(1),
  logoUrl: z.string(),
  start: z.string().min(1),
  end: z.string(),
  description: z.string(),
});
export const workArraySchema = z.array(workItemSchema);

export const skillsSchema = z.array(z.string());

export const projectItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  href: z.string(),
  dates: z.string(),
  description: z.string().min(1),
  technologies: z.array(z.string()),
  image: z.string(),
  video: z.string(),
  active: z.boolean(),
});
export const projectArraySchema = z.array(projectItemSchema);

export const blogPostSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  date: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens only"),
  content: z.string(),
});
