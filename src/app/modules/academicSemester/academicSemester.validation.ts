import z from 'zod';

const createAcademicSemesterValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .max(20, { message: 'password must be less than 20  characters' })
    .optional(),
});

export const AcademicSemesterValidations = {
  createAcademicSemesterValidationSchema,
};
