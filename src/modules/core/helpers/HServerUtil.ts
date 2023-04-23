import { Client, EmbedBuilder } from "discord.js";
import CLogger from "../interface/utilities/logger/controllers/CLogger.js";
import HDiscordBot from "./HDiscordBot.js";
import HDiscordConfig from "./HDiscordConfig.js";

/**
 * A class representing the server shortcuts
 * 
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
export default class HServerUtil {

    /**
     * Loads environment variable
     * 
     * @param {string} path - The path to the environment variable
     * @returns {string} - Returns the value of the environment variable
     * @throws {Error} - Throws an error if the environment variable does not exist
     */
    static async logVerification(client: Client, embed: EmbedBuilder): Promise<void> {
        const serverName: string = await HDiscordConfig.loadEnvConfig(`discord.server.name`)
        const forumName: string = await HDiscordConfig.loadEnvConfig(`discord.server.forum.log.channel`)
        const threadName: string = await HDiscordConfig.loadEnvConfig(`discord.server.forum.log.thread.verification`)
        const threadContent: string = await HDiscordConfig.loadEnvConfig(`discord.server.forum.log.thread.verification.content`)
        const thread = await HDiscordBot.getSpecificServerForumThreadByName(client, serverName, forumName, threadName, threadContent)

        if (!thread) {
            CLogger.error(`Thread [${threadName}] does not exist.`);
            return;
        }

        await thread.send({
            embeds: [
                embed
            ]
        })
    }

}