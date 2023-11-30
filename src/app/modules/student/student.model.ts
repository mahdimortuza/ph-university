import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';

const UserNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'first name is required'],
    trim: true,
    maxlength: [20, 'name can not be 20 characters'],
    validate: {
      validator: function (value: string) {
        const firstNameStr =
          value.charAt(0).toLocaleUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: '{VALUE} is not capitalized format',
    },
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [20, 'last name must be 20 characters'],
    // validate: {
    //     validator: (value: string) => validator.isAlpha(value),
    //     message: '{VALUE} is not valid',
    //   },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, "Father's name is required."],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'father occupation is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'father contact is required'],
  },
  motherName: {
    type: String,
    required: [true, 'mother name is required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'mother occupation is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'mother contact is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'local guardian name is required'],
  },
  occupation: {
    type: String,
    required: [true, ' occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'contact no is required'],
  },
  address: {
    type: String,
    required: [true, 'address is required'],
  },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'student id is required'],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      maxlength: [20, 'password can not be more than 20 characters.'],
    },
    name: {
      type: UserNameSchema,
      required: [true, 'student name is required.'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'others'],
        message: '{VALUE} is not valid',
      },
      required: [true, 'gender is required'],
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
    },
    contactNo: {
      type: String,
      required: [true, 'contact number is required'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'contact number is required'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: {
      type: String,
      required: [true, 'present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'permanent address is required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required.'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local guardian information is required.'],
    },
    profileImg: {
      type: String,
    },
    isActive: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// virtual
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// middleware

studentSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

studentSchema.post('save', async function (doc, next) {
  doc.password = '';
  next();
});

// query middleware

studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// creating a custom static method
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

// const schema = new Schema<IUser, UserModel>({ name: String });
// schema.static('myStaticMethod', function myStaticMethod() {
//   return 42;
// });

// creating a custom instance method
// studentSchema.methods.isUserExist = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

export const Student = model<TStudent, StudentModel>('Student', studentSchema);