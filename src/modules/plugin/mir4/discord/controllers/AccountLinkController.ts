import { AttachmentBuilder, CacheType, Client, Colors, EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { APIController } from "../../../../core/interface/controllers/APIController";
import { DiscordUser } from "../../../../core/models/User.js";
import { Mir4Character } from "../models/Character.js";
import { Mir4CharacterDiscord } from "../models/CharacterDiscord.js";
import { Mir4CharacterServer } from "../models/CharacterServer.js";
import { Mir4Server } from "../models/Server.js";
import { AccountLinkRequest } from "../interface/IAccountLink.js";
import HDiscordBot from "../../../../core/helpers/HDiscordBot.js";
import HServerUtil from "../../../../core/helpers/HServerUtil.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";

/**
 * Controller class for linking MIR4 account to discord.
 *
 * @version 1.0.0
 * @since 04/22/23
 * @author
 *  - Devitrax
 */
export default class AccountLinkController implements APIController {

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
     * This method fetches the requested account link data and links the character to the user's Discord account.
     * 
     * @param {AccountLinkRequest} request - Object containing request parameters.
     * @returns {Promise<void>} - Promise which resolves after the account link is completed. 
     */
    async fetch(request: AccountLinkRequest): Promise<void> {
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

        if (!interaction.member) {
            embed.setDescription(`Member not found.`)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        if (!interaction.guild) {
            embed.setDescription(`Guild not found.`)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const character: Mir4Character | null = await Mir4Character.findOne({ where: { username: characterName } });
        if (!character) {
            embed.setDescription(`The character \`${characterName}\` is not found.`)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const server: Mir4Server | null = await Mir4Server.findOne({ where: { name: serverName } });
        if (!server) {
            embed.setDescription(`The server \`${serverName}\` is not found.`)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const characterserver: Mir4CharacterServer | null = await Mir4CharacterServer.findOne({ where: { server_id: server.id, character_id: character.id } });
        if (!characterserver) {
            embed.setDescription(`Character \`${characterName}\` is not found in Server \`${serverName}\`.`)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        let discordUser: DiscordUser | null = await DiscordUser.findOne({ where: { discord_id: interaction.member.user.id, discriminator: interaction.member.user.discriminator } });
        if (!discordUser) {
            discordUser = await DiscordUser.create({ username: interaction.member.user.username, discord_id: interaction.member.user.id, discriminator: interaction.member.user.discriminator }).save();
        }

        let characterDiscord1: Mir4CharacterDiscord | null = await Mir4CharacterDiscord.findOne({ where: { discord_id: discordUser.id, is_unlink: false } });
        if (characterDiscord1) {
            embed.setDescription(`Your discord is already linked.`)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        let characterDiscord2: Mir4CharacterDiscord | null = await Mir4CharacterDiscord.findOne({ where: { character_id: character.id, is_unlink: false } });
        if (characterDiscord2) {
            embed.setDescription(`The character \`${characterName}\` is already linked to someone else.`)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const permissionNickName = await HDiscordBot.checkPermissionThruInteraction(interaction, "ChangeNickname")
        if (!permissionNickName) {
            embed.setDescription(`Bot does not have Change Nickname Permission.`)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const permissionManageRole = await HDiscordBot.checkPermissionThruInteraction(interaction, "ManageRoles")
        if (!permissionManageRole) {
            embed.setDescription(`Bot does not have Manage Role Permission.`)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const member = await interaction.guild.members.fetch(interaction.member.user.id);
        if (!member) {
            embed.setDescription(`Guild member not found.`)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        if (interaction.guild.ownerId != member.user.id) {
            await member.setNickname(characterName)
        }

        embed.setColor(Colors.Green)
            .setDescription(`Successfully linked the character \`${characterName}\` to your discord account.`)

        await Mir4CharacterDiscord.create({ character_id: character.id, discord_id: discordUser.id, is_unlink: false }).save();

        const roleServer: string = `${HDiscordConfig.loadEnv(`discord.server.roles.server.name.prefix`)}${server.name}`
        const roleMember: string = HDiscordConfig.loadEnv(`discord.server.roles.member.name`)
        await HDiscordBot.addRoleToUser(member, roleServer)
        await HDiscordBot.addRoleToUser(member, roleMember)

        await interaction.followUp({
            embeds: [embed],
            ephemeral: true,
            files: [
                new AttachmentBuilder(`${process.cwd()}/src/modules/core/resources/images/DominationFooter.png`, { name: 'embed-footer.png' })
            ]
        });
        
        embed.setDescription(`${HDiscordBot.tagUser(member.user.id)} has successfully linked the character \`${characterName}\` to their discord account.`)
        await HServerUtil.logVerification(this._client, embed)
    }

}
