import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';

const router = express.Router();

router.post(
  '/create-course',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get(
  '/:id',
  auth('admin', 'faculty', 'student'),
  CourseControllers.getSingleCourse,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.delete('/:id', auth('admin'), CourseControllers.deleteCourse);

router.put(
  '/:courseId/assign-faculties',
  CourseControllers.assignFacultyWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  CourseControllers.removeFacultiesFromCourse,
);

router.get('/', CourseControllers.getAllCourses);

export const CourseRoutes = router;
