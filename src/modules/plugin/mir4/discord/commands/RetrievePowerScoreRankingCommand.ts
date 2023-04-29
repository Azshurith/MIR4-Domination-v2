import { CommandInteraction, GuildMemberRoleManager, Role } from "discord.js"
import { Discord, Slash, SlashGroup } from "discordx"
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import RetrievePowerScoreRankingController from "../controllers/RetrievePowerScoreRankingController.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";

/**
 * A class that provides the functionality to retrieve and send a Discord embed message.
 *
 * @author  Devitrax
 * @version 1.0, 11/17/22
 */
@Discord()
@SlashGroup({ description: "Interaction for the discord server", name: "mir4" })
@SlashGroup("mir4")
export abstract class RetrievePowerScoreRankingCommand {

    /**
     * Slash command to create a Discord embed.
     *
     * @param {string} channel - Channel ID to send the embed to.
     * @param {CommandInteraction} interaction - The interaction context.
     * @returns {Promise<void>
     */
    @Slash({ name: "retrieve", description: "Retrieves all MIR4 users" })
    async retrieve(
        interaction: CommandInteraction
    ): Promise<void> {

        if (!interaction.client.user) {
            CLogger.error(`User not found.`);
            return;
        }

        if (!interaction.guild) {
            CLogger.error(`Guild not found.`);
            return;
        }

        if (!interaction.member) {
            CLogger.error(`Member not found.`);
            return;
        }
        
        const roleName: string = HDiscordConfig.loadEnv(`discord.server.roles.moderator.name`)
        const role: Role | undefined = interaction.guild.roles.cache.find(role => role.name === roleName);

        if (!role) {
            CLogger.error(`Role not found.`);
            return;
        }

        const roles: GuildMemberRoleManager | string[] = interaction.member.roles as GuildMemberRoleManager
        if (!roles.cache.has(role.id)) {
            interaction.reply({
                content: `Only a support is allowed to execute this command.`,
                ephemeral: true
            });
            return;
        }
        
        interaction.reply("Retrieving...")
        try {
            const isRunning = Boolean(await HDiscordConfig.loadDbConfig("mir4.server.cron.ranking"))
            if (!isRunning) {
                CLogger.info(`End > Retrieving Mir4 is still running`);
                return
            }

            await HDiscordConfig.loadDbConfig("mir4.server.cron.ranking", "true")

            CLogger.info(`Start > Retrieving Mir4 Leaderboard`);
            const url: string = await HDiscordConfig.loadEnvConfig(`mir4.forum.leaderboard.url`)
            await new RetrievePowerScoreRankingController(interaction.client).fetch({
                url: url,
                params: {
                    ranktype: 1,
                    worldgroupid: 1,
                    worldid: 1,
                }
            })
            CLogger.info(`End > Retrieving Mir4 Leaderboard`);
        } catch (error) {
            CLogger.error(`API Error > Retrieving Mir4 Leaderboard: (${error})`);
        }
    }

}