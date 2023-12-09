import { boolean, z } from 'zod';

const preRequisiteValidationSchema = z.object({
  course: z.string(),
  isDeleted: boolean().optional(),
});

const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    prefix: z.string(),
    code: z.number(),
    credits: z.number(),
    preRequisiteCourse: z.array(preRequisiteValidationSchema).optional(),
  }),
});

export const CourseValidations = {
  createCourseValidationSchema,
};
