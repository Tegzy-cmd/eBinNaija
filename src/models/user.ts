import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'collector' | 'recycler' | 'admin';
  verified: boolean;
  phone?: string;
  profileImage?: string;
  walletBalance: number;
  _id: number;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    verified: { type: Boolean, default: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'collector', 'recycler', 'admin'], default: 'user' },
    phone: String,
    profileImage: String,
    walletBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
