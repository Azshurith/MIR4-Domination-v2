import { GuardFunction, ArgsOf, Next } from "discordx";
import { BaseInteraction, ButtonInteraction, Client, CommandInteraction, GuildMemberRoleManager, Role } from "discord.js";
import CLogger from "../../interface/utilities/logger/controllers/CLogger.js";

/**
 * Middleware that checks if the interaction member has the moderator role.
 * 
 * @author  Devitrax
 * @version 1.0, 11/17/22
 * 
 * @param {CommandInteraction} interaction - The interaction being executed.
 * @param {Client} client - The Discord.js client instance.
 * @param {Next} next - The function to call if the interaction member has the moderator role.
 * @returns {Promise<void>}
 */
export async function isModerator(interaction: BaseInteraction, client: Client, next: Next): Promise<void> {
    if (!process.env.SERVER_MODERATOR_ROLE_ID) {
        CLogger.error(`[${import.meta.url}] The SERVER_MODERATOR_ROLE_ID environment variable is not set.`);
        return;
    }

    if (!client.user) {
        CLogger.error(`[${import.meta.url}] User not found.`);
        return;
    }

    if (!interaction.guild) {
        CLogger.error(`[${import.meta.url}] Guild not found.`);
        return;
    }

    if (!interaction.member) {
        CLogger.error(`[${import.meta.url}] Member not found.`);
        return;
    }

    const role: Role | undefined = interaction.guild.roles.cache.find(role => role.id === process.env.SERVER_MODERATOR_ROLE_ID);

    if (!role) {
        CLogger.error(`[${import.meta.url}] Role not found.`);
        return;
    }

    if ((interaction instanceof ButtonInteraction) || (interaction instanceof CommandInteraction)) {

        const roles: GuildMemberRoleManager | string[] = interaction.member.roles as GuildMemberRoleManager
        if (roles.cache.has(role.id)) {
            await next();
            return;
        }
            
        interaction.reply(`Only a support is allowed to execute this command.`)
    }     
    return;
}