import { ApplicationCommandOptionType, AttachmentBuilder, ChannelType, Colors, CommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager, Role } from "discord.js"
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx"
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import RetrievePowerScoreRankingController from "../controllers/RetrievePowerScoreRankingController.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import { NotLinked } from "../guards/NotLinked.js";
import HDiscordBot from "../../../../core/helpers/HDiscordBot.js";
import { DiscordUser } from "../../../../core/models/User.js";
import { Mir4CharacterDiscord } from "../models/CharacterDiscord.js";
import { Mir4Character } from "../models/Character.js";
import { Mir4CharacterServer } from "../models/CharacterServer.js";
import { Mir4Server } from "../models/Server.js";
import { Mir4CharacterClass } from "../models/CharacterClass.js";
import { Mir4Class } from "../models/Class.js";
import { Mir4CharacterClan } from "../models/CharacterClan.js";
import { Mir4Clan } from "../models/Clan.js";
import { Mir4ServerRegion } from "../models/ServerRegion.js";
import { Mir4Region } from "../models/Region.js";

/**
 * A class that provides the functionality to retrieve and send a Discord embed message.
 *
 * @author  Devitrax
 * @version 1.0, 11/17/22
 */
@Discord()
@Guard(NotLinked)
@SlashGroup({ description: "Interaction for the discord server", name: "mir4" })
@SlashGroup("mir4")
export abstract class RetrievePowerScoreRankingCommand {

    /**
     * Slash command to create a Discord embed.
     *
     * @param {string} characterName - Character Name from a MIR4 account
     * @param {CommandInteraction} interaction - The interaction context.
     * @returns {Promise<void>
     */
    @Slash({ name: "character", description: "Displays the information of the character" })
    async viewCharacter(
        @SlashOption({
            name: "character",
            description: "View MIR4 character",
            type: ApplicationCommandOptionType.User,
            required: true
        })
        characterName: string = "",
        interaction: CommandInteraction
    ): Promise<void> {
        const characterId: string = characterName.toString().replace(/<|@|>/g, '');
        
        const embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("Character Details")
            .setColor(Colors.Gold)
            .setThumbnail('attachment://embed-character.png')
            .setFooter({
                text: `${new Date()}`,
                iconURL: "https://coinalpha.app/images/coin/1_20211022025215.png",
            });

        const discordUser: DiscordUser | null = await DiscordUser.findOne({ where: { discord_id: characterId, discriminator: interaction.member!.user.discriminator } });
        if (!discordUser) {
            embed.setDescription(`${HDiscordBot.tagUser(characterId)} is not registered to our system.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }
    
        const characterDiscord: Mir4CharacterDiscord | null = await Mir4CharacterDiscord.findOne({ where: { discord_id: discordUser.id, is_unlink: false } });
        if (!characterDiscord) {
            embed.setDescription(`${HDiscordBot.tagUser(characterId)} MIR4 character is not linked to its discord account.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const character: Mir4Character | null = await Mir4Character.findOne({ where: { id: characterDiscord.character_id } });
        if (!character) {
            embed.setDescription(`Your character data is not in our system.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const characterserver: Mir4CharacterServer | null = await Mir4CharacterServer.findOne({ where: { character_id: character.id } });
        if (!characterserver) {
            embed.setDescription(`Character Server not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const server: Mir4Server | null = await Mir4Server.findOne({ where: { id: characterserver.server_id } });
        if (!server) {
            embed.setDescription(`Server is not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const serverregion: Mir4ServerRegion | null = await Mir4ServerRegion.findOne({ where: { server_id: server.id } });
        if (!serverregion) {
            embed.setDescription(`Server Region is not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const region: Mir4Region | null = await Mir4Region.findOne({ where: { id: serverregion.region_id } });
        if (!region) {
            embed.setDescription(`Region is not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }
        

        const characterclass: Mir4CharacterClass | null = await Mir4CharacterClass.findOne({ where: { character_id: character.id } });
        if (!characterclass) {
            embed.setDescription(`Character Class not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const clazz: Mir4Class | null = await Mir4Class.findOne({ where: { id: characterclass.class_id } });
        if (!clazz) {
            embed.setDescription(`Class is not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const characterclan: Mir4CharacterClan | null = await Mir4CharacterClan.findOne({ where: { character_id: character.id } });
        if (!characterclan) {
            embed.setDescription(`Character Clan not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const clan: Mir4Clan | null = await Mir4Clan.findOne({ where: { id: characterclan.clan_id } });
        if (!clan) {
            embed.setDescription(`Clan is not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const min: number = 2;
        const max: number = 5;
        const randomNum: number = Math.floor(Math.random() * (max - min + 1)) + min;

        embed.setDescription(`${HDiscordBot.tagUser(characterId)} is a ${clazz.name} in the clan ${clan.name} which is from the server ${server.name}.`)
            .addFields({
                name: `Name`,
                value: "```" + character.username + "```",
                inline: true
            }, {
                name: `Region`,
                value: "```" + region.name + "```",
                inline: true
            }, {
                name: `Server`,
                value: "```" + server.name + "```",
                inline: true
            }, {
                name: `Power Score`,
                value: "```" + Number(character.powerscore).toLocaleString() + "```",
                inline: true
            }, {
                name: `Class`,
                value: "```" + clazz.name + "```",
                inline: true
            }, {
                name: `Clan`,
                value: "```" + clan.name + "```",
                inline: true
            })

        interaction.editReply({
            embeds: [
                embed
            ],
            files: [
                new AttachmentBuilder(`${process.cwd()}/src/modules/plugin/mir4/discord/resources/images/${clazz.name}-grade${randomNum}.png`, { name: 'embed-character.png' }),
            ]
        });
    }

}