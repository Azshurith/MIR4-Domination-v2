import { ModalSubmitInteraction, PermissionResolvable } from "discord.js";
import CLogger from "../interface/utilities/logger/controllers/CLogger.js";

/**
 * A class representing a helper for the discord bot
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
export default class HDiscordBot {

    /**
     * This static method checks if a specific permission is present in the app permissions of an interaction.
     * 
     * @param {ModalSubmitInteraction} interaction - The interaction object.
     * @param {PermissionResolvable} permission - The permission to check.
     * @returns {boolean} - A boolean indicating whether the permission is present in the app permissions of the interaction.
     */
    static async checkPermissionThruInteraction(interaction: ModalSubmitInteraction, permission: PermissionResolvable): Promise<boolean> {
        if (!interaction.guild) {
            CLogger.error(`Guild not found.`)
            return false
        }

        const bot = await interaction.guild.members.fetchMe()
        return bot.permissions.has(permission)
    }

}