import { AttachmentBuilder, CacheType, Client, Colors, EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { APIController } from "../../../../core/interface/controllers/APIController";
import { DiscordUser } from "../../../../core/models/User.js";
import { Mir4Character } from "../models/Character.js";
import { Mir4CharacterDiscord } from "../models/CharacterDiscord.js";
import { Mir4CharacterServer } from "../models/CharacterServer.js";
import { Mir4Server } from "../models/Server.js";
import { AccountTicketRequest } from "../interface/IAccountTicket";
import HDiscordBot from "../../../../core/helpers/HDiscordBot.js";
import HServerUtil from "../../../../core/helpers/HServerUtil.js";
import HTicketUtil from "../../../utilities/ticketing/helpers/HTicketUtil.js";

/**
 * Controller class for the account linking ticket MIR4 account to discord.
 *
 * @version 1.0.0
 * @since 04/22/23
 * @author
 *  - Devitrax
 */
export default class AccountTicketController implements APIController {

    /**
     * @var {Client} client - The client object used to interact with the API.
     */
    private readonly _client: Client

    /**
     * Create a new instance of the class.
     * 
     * @param {Client} client - The client object used to interact with the API.
     */
    constructor(client: Client) {
        this._client = client
    }

    /**
     * This method fetches the requested account link ticket data.
     * 
     * @param {AccountTicketRequest} request - Object containing request parameters.
     * @returns {Promise<void>} - Promise which resolves after the account link is completed. 
     */
    async fetch(request: AccountTicketRequest): Promise<void> {
        const embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("Character Link")
            .setColor(Colors.Red)
            .setFooter({
                text: `${new Date()}`,
                iconURL: 'attachment://embed-footer.png',
            });

        const interaction: ModalSubmitInteraction<CacheType> = request.params.interaction
        const characterName: string = request.params.characterName
        const serverName: string = request.params.serverName

        await interaction.deferReply({
            ephemeral: true
        });

        if (!interaction.member) {
            embed.setDescription(`Member not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        if (!interaction.guild) {
            embed.setDescription(`Guild not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const character: Mir4Character | null = await Mir4Character.findOne({ where: { username: characterName } });
        if (!character) {
            embed.setDescription(`The character \`${characterName}\` is not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const server: Mir4Server | null = await Mir4Server.findOne({ where: { name: serverName } });
        if (!server) {
            embed.setDescription(`The server \`${serverName}\` is not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const characterserver: Mir4CharacterServer | null = await Mir4CharacterServer.findOne({ where: { server_id: server.id, character_id: character.id } });
        if (!characterserver) {
            embed.setDescription(`Character \`${characterName}\` is not found in Server \`${serverName}\`.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        let discordUser: DiscordUser | null = await DiscordUser.findOne({ where: { discord_id: interaction.member.user.id, discriminator: interaction.member.user.discriminator } });
        if (!discordUser) {
            discordUser = await DiscordUser.create({ username: interaction.member.user.username, discord_id: interaction.member.user.id, discriminator: interaction.member.user.discriminator }).save();
        }

        let characterDiscord: Mir4CharacterDiscord | null = await Mir4CharacterDiscord.findOne({ where: { discord_id: discordUser.id, is_unlink: false } });
        if (characterDiscord) {
            embed.setDescription(`Your discord is already linked.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const ticketEmbed: EmbedBuilder = new EmbedBuilder()
            .setTitle("New Ticket")
            .setColor(Colors.Gold)
            .setDescription(HDiscordBot.limit(request.params.description, 1000))
            .setFooter({
                text: `${new Date()}`,
                iconURL: 'attachment://embed-footer.png',
            })
            .addFields({
                name: `Name`,
                value: "```" + characterName + "```",
                inline: true
            }, {
                name: `Server`,
                value: "```" + serverName + "```",
                inline: true
            })

        const channel = await HTicketUtil.createTicket(this._client, interaction.member, character, discordUser, ticketEmbed)
        if (!channel) {
            embed.setDescription(`Channel not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const member = await interaction.guild.members.fetch(interaction.member.user.id);

        embed.setDescription(`Your ticket is now created ${HDiscordBot.tagChannel(channel.id)}.`)
            .setColor(Colors.Green)

        await interaction.editReply({
            embeds: [embed],
            files: [
                new AttachmentBuilder(`${process.cwd()}/src/modules/core/resources/images/DominationFooter.png`, { name: 'embed-footer.png' })
            ]
        })
        
        embed.setDescription(`${HDiscordBot.tagUser(member.user.id)} has created a ticket ${HDiscordBot.tagChannel(channel.id)}`)
        await HServerUtil.logVerification(this._client, embed)
    }

}
