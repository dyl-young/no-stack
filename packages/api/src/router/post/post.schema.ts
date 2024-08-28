import { z } from "zod";

export const getByIdSchema = z.object({
  id: z.string(),
});

export const DeleteSchema = z.string();
