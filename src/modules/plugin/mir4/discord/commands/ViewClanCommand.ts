import { ApplicationCommandOptionType, AutocompleteInteraction, BaseMessageOptions, Colors, CommandInteraction, EmbedBuilder } from "discord.js"
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx"
import { NotLinked } from "../guards/NotLinked.js";
import { Mir4CharacterClan } from "../models/CharacterClan.js";
import { Mir4Clan } from "../models/Clan.js";
import { In, Like } from "typeorm";
import { Pagination, PaginationType } from "@discordx/pagination";
import { Mir4Character } from "../models/Character.js";
import { Mir4ClanServer } from "../models/ClanServer.js";
import { Mir4Server } from "../models/Server.js";

/**
 * Search for a Mir4Clan by name and respond with a list of matching clans
 *
 * @param {AutocompleteInteraction} interaction - The interaction that triggered the search
 * @returns {Promise<void>} - A Promise that resolves when the response is sent
 */
const searchClan = async (interaction: AutocompleteInteraction): Promise<void> => {
    const results = await Mir4Clan.find({
        where: { name: Like(`%${interaction.options.getFocused(true).value}%`) },
        take: 25
    });
    const mappedResults = results.map((value: Mir4Clan) => ({
        name: value.name,
        value: value.name
    }));
    interaction.respond(mappedResults);
}

/**
 * Paginates a list of characters in a clan and creates embed pages for each page.
 * @param interaction The Discord command interaction.
 * @param embed The embed builder for the message.
 * @param clan The clan details.
 * @param server The server of the clan.
 * @param limit The maximum number of pages.
 * @returns An array of message options for each page.
 */
const paginateClan = async (interaction: CommandInteraction, embed: EmbedBuilder, clan: Mir4Clan, server: Mir4Server, limit: number): Promise<BaseMessageOptions[]> => {

    const totalPages: number = await Mir4CharacterClan.count({ where: { clan_id: clan.id, is_leave: false } });

    const pages: Promise<EmbedBuilder>[] = Array.from(Array(Math.ceil(totalPages / limit)).keys()).map(async (i) => {
        embed.setTitle("Clan Details")
            .setDescription(`${clan.name} is a clan from the server ${server.name}.`)
            .setColor(Colors.Gold)
            .setFooter({
                text: `${new Date()}`,
                iconURL: "https://coinalpha.app/images/coin/1_20211022025215.png",
            });

        const characterClan: Mir4CharacterClan[] = await Mir4CharacterClan.find({ where: { clan_id: clan.id, is_leave: false }, take: limit, skip: i * limit });
        if (!characterClan) {
            embed.setDescription(`Character Clan is not found.`);
            await interaction.editReply({ embeds: [embed] });
            return embed;
        }

        const characterIds = characterClan.map(character => character.character_id);

        const characters: Mir4Character[] = await Mir4Character.find({
            where: { id: In(characterIds) }
        });

        const newEmbed = new EmbedBuilder()
            .setTitle("Clan Details")
            .setDescription(`${clan.name} is a clan from the server ${server.name}.`)
            .setColor(Colors.Gold)
            .setFooter({
                text: `${new Date()}`,
                iconURL: "https://coinalpha.app/images/coin/1_20211022025215.png",
            }).addFields({
                name: " ",
                value: "```📚 MEMBERS```",
                inline: false
            });

        characters.forEach((character: Mir4Character) => {
            newEmbed.addFields({
                name: character.username,
                value: character.powerscore.toLocaleString(),
                inline: true
            });
        });

        return newEmbed;
    });

    const resolvedPages: EmbedBuilder[] = await Promise.all(pages);

    return resolvedPages.map((page) => {
        return {
            embeds: [page]
        };
    });

}


/**
 * A class that provides the functionality to search for a clan.
 *
 * @author  Devitrax
 * @version 1.0, 11/27/22
 */
@Discord()
@Guard(NotLinked)
@SlashGroup({ description: "Interaction for the discord server", name: "mir4" })
@SlashGroup("mir4")
export abstract class RetrievePowerScoreRankingCommand {


    /**
     * Slash command to create a Discord embed.
     *
     * @param {string} clanName - Character Name from a MIR4 account
     * @param {CommandInteraction} interaction - The interaction context.
     * @returns {Promise<void>
     */
    @Slash({ name: "clan", description: "Displays the information of the Clan" })
    async viewCharacter(
        @SlashOption({
            name: "clan",
            description: "View MIR4 Clan",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: searchClan
        })
        clanName: string = "",
        interaction: CommandInteraction
    ): Promise<void> {
        const embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("Clan Details")
            .setColor(Colors.Gold)
            .setFooter({
                text: `${new Date()}`,
                iconURL: "https://coinalpha.app/images/coin/1_20211022025215.png",
            });

        const clan: Mir4Clan | null = await Mir4Clan.findOne({ where: { name: clanName } });
        if (!clan) {
            embed.setDescription(`Clan is not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const characterClan: Mir4CharacterClan[] = await Mir4CharacterClan.find({ where: { clan_id: clan.id, is_leave: false }, take: 25 });
        if (!characterClan) {
            embed.setDescription(`Character Clan is not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const clanServer: Mir4ClanServer | null = await Mir4ClanServer.findOne({ where: { clan_id: clan.id, is_disband: false } });
        if (!clanServer) {
            embed.setDescription(`Clan Server is not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const server: Mir4Server | null = await Mir4Server.findOne({ where: { id: clanServer.server_id } });
        if (!server) {
            embed.setDescription(`Server is not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        embed.setDescription(`${clanName} is a clan from the server ${server.name}.`)

        new Pagination(interaction, await paginateClan(interaction, embed, clan, server, 24), {
            type: PaginationType.SelectMenu,
        }).send()
    }

}