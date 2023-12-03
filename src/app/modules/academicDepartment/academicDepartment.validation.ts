import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'academic department must be a string',
      required_error: 'name is required',
    }),
    academicFaculty: z.string({
      required_error: 'faculty is required',
    }),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'academic department must be a string',
        required_error: 'name is required',
      })
      .optional(),
    academicFaculty: z
      .string({
        required_error: 'faculty is required',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidation = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
