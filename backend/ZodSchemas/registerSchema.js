import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3,"Username is required"),
  password: z.string().min(6,"Password must be at least 6 characters"),
  role: z.enum(["student", "teacher"] ,"role is required"),
  teacherId: z.string().optional(), 
}).superRefine((data, ctx) => {
  if (data.role === "student" && !data.teacherId) {
    ctx.addIssue({
      message: "Teacher ID is required for students",
      path: ["teacherId"],
    });
  }
});
