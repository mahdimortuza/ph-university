import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { hasTimeConflict } from './offeredCourse.utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
  } = payload;

  // check if the semester registration id exists!
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'semester registration not found.',
    );
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester;

  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'academic faculty not found.');
  }

  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'academic department not found.');
  }

  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'course not found.');
  }

  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'faculty not found.');
  }

  // check if the department is belong to the faculty
  const isDepartmentBelongTOFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,

    academicFaculty,
  });

  if (!isDepartmentBelongTOFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${isAcademicDepartmentExists.name} is not belong to ${isAcademicFacultyExists.name}`,
    );
  }

  // check if the same offered course same section section in same registered semester exists
  const isOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `offered course same section already exists.`,
    );
  }

  // get the schedules of the faulty
  const assignSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `this faculty is not available at this time choose other time or day.`,
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const getAllOfferedCourseFromDB = async () => {};

const getSingleOfferedCOurseFromDB = async (id: string) => {};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'faculty not found.');
  }

  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'faculty not found.');
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;
  // get the schedules of the faulty

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not found this offered course as it is ${semesterRegistrationStatus?.status}.`,
    );
  }

  const assignSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `this faculty is not available at this time choose other time or day.`,
    );
  }
  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  getSingleOfferedCOurseFromDB,
  updateOfferedCourseIntoDB,
};
