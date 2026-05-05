import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { defaultLanguage, SupportedLanguage } from "../../bot/i18n/language";
import { config } from "../../config/env";

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

    async setUserLanguage(
        telegramId: number,
        language: SupportedLanguage
    ) {
        const user = await this.userRepository.updateLanguageByTelegramId(
            telegramId,
            language
        );

        if (!user) {
            throw new Error("User not found. Please send /start first.");
        }

        return user;
    }
    
    async getUserLanguage(telegramId: number): Promise<SupportedLanguage> {
        const user = await this.userRepository.findByTelegramId(telegramId);

        return user?.language ?? defaultLanguage;
    }

    async setUserCurrency(
        telegramId: number,
        currency: string
    ) {
        const user = await this.userRepository.updateCurrencyByTelegramId(
            telegramId,
            currency
        );

        if (!user) {
            throw new Error("User not found. Please send /start first.");
        }

        return user;
    }

    async getUserCurrency(telegramId: number): Promise<string> {
        const user = await this.userRepository.findByTelegramId(telegramId);

        return user?.currency ?? config.defaultCurrency;
    }

}