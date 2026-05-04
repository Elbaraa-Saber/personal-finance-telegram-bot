import { UserRepository } from "../../infrastructure/repositories/user.repository";

type RegisterTelegramUserData = {
    telegramId: number;
    username?: string;
    firstName?: string;
    lastName?: string;
}

export class UserService {
    constructor(private readonly userRepository: UserRepository){}

    async registerTelegramUser(data: RegisterTelegramUserData) {
        const existingUser = await this.userRepository.findByTelegramId(
            data.telegramId
        );

        if (existingUser) {
            return existingUser;
        }

        return this.userRepository.create(data);       
    }
}