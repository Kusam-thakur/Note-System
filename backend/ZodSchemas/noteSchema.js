import { z } from 'zod';

export const NoteSchema = z.object({
  tittle: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title is too long" }),

  content: z
    .string()
    .min(1, { message: "Content is required" }),

  creator_id: z
    .string()
    .optional() 
});
// export const updateNoteSchema = z.object({
//   title: z
//     .string()
//     .min(1, { message: "Title cannot be empty" })
//     .max(255, { message: "Title is too long" })
//     .optional(),
//   content: z
//     .string()
//     .min(1, { message: "Content cannot be empty" })
//     .optional(),
    
//     creator_id: z
//     .number()
//     .optional() 
// });