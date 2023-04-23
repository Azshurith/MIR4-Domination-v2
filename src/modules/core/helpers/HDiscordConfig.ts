import { DiscordConfig } from "../models/Config.js";

/**
 * A class representing the config helper
 * 
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
export default class HDiscordConfig {

    /**
     * Loads config from database
     * 
     * @param {string} path - The path to the config
     * @returns {Promise<string>} - Returns the config value or null if config does not exist
     * @throws {Error} - Throws an error if there was a problem loading the config
     */
    static async loadDbConfig(path: string, value: string = ""): Promise<string> {
        if (value) {
            await DiscordConfig.upsert(
                [
                    { path: path, value: value }
                ],
                ['path']
            )
        }

        const config: DiscordConfig | null = await DiscordConfig.findOne({
            where: { path: path }
        });

        return config ? config.value : ""
    }

    /**
     * Loads config from database
     * 
     * @param {string} path - The path to the config
     * @returns {Promise<string>} - Returns the config value or null if config does not exist
     * @throws {Error} - Throws an error if there was a problem loading the config
     */
    static async loadEnvConfig(path: string): Promise<string> {
        const value: string = this.loadEnv(path)

        await DiscordConfig.upsert(
            [
                { path: path, value: value }
            ],
            ['path']
        )

        const config = await DiscordConfig.findOneOrFail({
            where: { path: path }
        });

        return config.value
    }

    /**
     * Loads environment variable
     * 
     * @param {string} path - The path to the environment variable
     * @returns {string} - Returns the value of the environment variable
     * @throws {Error} - Throws an error if the environment variable does not exist
     */
    static loadEnv(path: string): string {
        if (!process.env[path]) {
            throw Error(`The configuration for \`${path}\` does not exist.`);
        }

        return process.env[path]!
    }

}