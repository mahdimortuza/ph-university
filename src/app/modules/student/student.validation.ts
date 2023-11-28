import { z } from 'zod';

const TUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name must be at least 1 character long' })
    .max(20, { message: 'Name cannot be longer than 20 characters' }),
  middleName: z.string(),
  lastName: z
    .string()
    .min(1, { message: 'Last name must be at least 1 character long' })
    .max(20, { message: 'Last name cannot be longer than 20 characters' }),
});

const TGuardianValidationSchema = z.object({
  fatherName: z.string().min(1, { message: "Father's name is required" }),
  fatherOccupation: z
    .string()
    .min(1, { message: 'Father occupation is required' }),
  fatherContactNo: z.string().min(1, { message: 'Father contact is required' }),
  motherName: z.string().min(1, { message: 'Mother name is required' }),
  motherOccupation: z
    .string()
    .min(1, { message: 'Mother occupation is required' }),
  motherContactNo: z.string().min(1, { message: 'Mother contact is required' }),
});

const TLocalGuardianValidationSchema = z.object({
  name: z.string().min(1, { message: 'Local guardian name is required' }),
  occupation: z.string().min(1, { message: 'Occupation is required' }),
  contactNo: z.string().min(1, { message: 'Contact number is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
});

const TStudentValidationSchema = z.object({
  id: z.string().min(1, { message: 'Student ID is required' }),
  password: z
    .string()
    .min(1, { message: 'Password must be at least 1 character long' })
    .max(20, { message: 'Password cannot be longer than 20 characters' }),
  name: TUserNameValidationSchema,
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  email: z.string().min(1, { message: 'Email is required' }),
  contactNo: z.string().min(1, { message: 'Contact number is required' }),
  emergencyContactNo: z
    .string()
    .min(1, { message: 'Emergency contact number is required' }),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  presentAddress: z.string().min(1, { message: 'Present address is required' }),
  permanentAddress: z
    .string()
    .min(1, { message: 'Permanent address is required' }),
  guardian: TGuardianValidationSchema,
  localGuardian: TLocalGuardianValidationSchema,
  profileImg: z.string(),
  isActive: z.enum(['active', 'blocked']).default('active'),
  // isDeleted: z.boolean(),
});

export default TStudentValidationSchema;
