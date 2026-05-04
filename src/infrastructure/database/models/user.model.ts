import { model, Schema, Types } from "mongoose";

export interface UserDocument {
  _id: Types.ObjectId;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    telegramId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    username: String,
    firstName: String,
    lastName: String,
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<UserDocument>("User", userSchema);