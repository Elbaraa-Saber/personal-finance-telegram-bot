import { model, Schema, Types } from "mongoose";
import { SupportedLanguage } from "../../../bot/i18n/language";

export interface UserDocument {
  _id: Types.ObjectId;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  language?: SupportedLanguage;
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
    language: {
      type: String,
      enum: ["ar", "ru", "en"],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<UserDocument>("User", userSchema);