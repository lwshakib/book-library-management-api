import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  publishedDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Published date must be a valid date",
  }),
  genre: z.string().min(1, "Genre is required"),
  summary: z.string().min(1, "Summary is required"),
  ISBN: z.string().min(1, "ISBN is required"),
  buyHardCopyFrom: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});
