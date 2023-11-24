import { z } from "zod";

export const PostSchema = z.object({
  title: z.string().max(120),
  image: z.string().max(200),
  slug: z.string().max(180),
  tags: z.array(z.string()).min(1),
  author: z.string().max(64),
  category: z.string().max(32),
  preview: z.string().max(210),
  content: z.string().max(20_000),
});
