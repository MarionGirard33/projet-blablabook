import { z } from "zod";

export const updateUserSchema = z
  .object({
    username: z.string().max(100, "Maximum 100 caractères").optional(),
    email: z.email({ message: "Email invalide" }).optional(),
    password: z.string().min(8, "Minimum 8 caractères").optional(),
    confirmPassword: z.string().optional(),
    image: z.enum(["image1.jpg", "image2.jpg", "image3.jpg"]).optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      path: ["confirmPassword"],
      message: "Les mots de passe ne correspondent pas",
    }
  );

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
