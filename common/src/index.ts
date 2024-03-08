import zod from "zod";

export const signinSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

export const signupSchema = zod.object({
  email: zod.string().email().min(1, "Email cannot be empty"),
  password: zod.string().min(8, "Atleast 8 charachters"),
  name: zod.string().min(3, "Name cannot be empty"),
});

export const createNoteSchema = zod.object({
  title: zod
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  description: zod.string().min(1),
});

export const updateNoteSchema = zod.object({
  id: zod.string(),
  title: zod
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  description: zod
    .string()
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
});

export type SigninSchema = zod.infer<typeof signinSchema>;
export type SignupSchema = zod.infer<typeof signupSchema>;
export type CreateNoteSchema = zod.infer<typeof createNoteSchema>;
export type UpdateNoteSchema = zod.infer<typeof updateNoteSchema>;
