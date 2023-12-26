import { TSchedule } from './offeredCourse.interface';

export const hasTimeConflict = (
  assignSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTIme = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTIme = new Date(`1970-01-01T${newSchedule.endTime}`);

    if (newStartTIme < existingEndTime && newEndTIme > existingStartTime) {
      return true;
    }
    return false;
  }
};
