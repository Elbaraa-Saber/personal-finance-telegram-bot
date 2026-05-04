import { LargeNumberLike } from "node:crypto";
import { UserDocument, UserModel } from "../database/models/user.model";

type CreateUserData = {
    telegramId: number;
    username?: string;
    firstName?: string;
    lastName?: string;
};

export class UserRepository {
    async findByTelegramId(telegramId: number): Promise<UserDocument | null> {
        return UserModel.findOne({ telegramId }).exec(); 
    }

    async create(data: CreateUserData): Promise<UserDocument>{
        return UserModel.create(data);
    }
}
