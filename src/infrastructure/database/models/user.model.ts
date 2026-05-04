import { model, Schema } from "mongoose";

export interface UserDocument {
    telegramId: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    createdAt: Date;
    updatedAp: Date; 
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