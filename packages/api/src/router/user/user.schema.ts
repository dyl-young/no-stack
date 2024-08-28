import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { Profile } from "@no-stack/db/schema";

export const UpdateProfileSchema = createInsertSchema(Profile, {
  name: z.string().optional(),
  image: z.string().optional(),
}).omit({
  id: true,
});
