import { AttachmentBuilder, CacheType, Client, Colors, EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { APIController } from "../../../../core/interface/controllers/APIController";
import { DiscordUser } from "../../../../core/models/User.js";
import { Mir4CharacterDiscord } from "../models/CharacterDiscord.js";
import { Mir4Character } from "../models/Character.js";
import { Mir4Server } from "../models/Server.js";
import { Mir4CharacterServer } from "../models/CharacterServer.js";
import { AccountUnlinkRequest } from "../interface/IAccountUnlink";
import HDiscordBot from "../../../../core/helpers/HDiscordBot.js";
import HServerUtil from "../../../../core/helpers/HServerUtil.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";

/**
 * Controller class for unlinking MIR4 account to discord.
 *
 * @version 1.0.0
 * @since 04/22/23
 * @author
 *  - Devitrax
 */
export default class AccountUnlinkController implements APIController {

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
     * This method fetches the requested account unlink data and unlinks the character to the user's Discord account.
     * 
     * @param {AccountUnlinkRequest} request - Object containing request parameters.
     * @returns {Promise<void>} - Promise which resolves after the account unlink is completed. 
     */
    async fetch(request: AccountUnlinkRequest): Promise<void> {

        const embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("Character Unlink")
            .setColor(Colors.Red)
            .setFooter({
                text: `${new Date()}`,
                iconURL: 'attachment://embed-footer.png',
            });

        const interaction: ModalSubmitInteraction<CacheType> = request.params.interaction

        await interaction.deferReply({
            ephemeral: true
        });

        if (request.params.text.toLocaleLowerCase() != "confirm") {
            embed.setDescription(`Please write down **Confirm**.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

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

        let discordUser: DiscordUser | null = await DiscordUser.findOne({ where: { discord_id: interaction.member.user.id } });
        if (!discordUser) {
            embed.setDescription(`Your account is not registered to our system.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        let characterDiscord: Mir4CharacterDiscord | null = await Mir4CharacterDiscord.findOne({ where: { discord_id: discordUser.id, is_unlink: false } });
        if (!characterDiscord) {
            embed.setDescription(`Your discord is not linked to any of the characters.`)
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

        const permission = await HDiscordBot.checkPermissionThruInteraction(interaction, "ChangeNickname")
        if (!permission) {
            embed.setDescription(`Bot does not have Change Nickname Permission.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const permissionManageRole = await HDiscordBot.checkPermissionThruInteraction(interaction, "ManageRoles")
        if (!permissionManageRole) {
            embed.setDescription(`Bot does not have Manage Role Permission.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const member = await interaction.guild.members.fetch(interaction.member.user.id);
        if (!member) {
            embed.setDescription(`Guild member not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        if (interaction.guild.ownerId != member.user.id) {
            await member.setNickname(member.user.username)
        }

        embed.setColor(Colors.Green)
            .setDescription(`Successfully unlinked your discord account.`)

        await interaction.editReply({
            embeds: [embed],
            files: [
                new AttachmentBuilder(`${process.cwd()}/src/modules/core/resources/images/DominationFooter.png`, { name: 'embed-footer.png' })
            ]
        })

        await Mir4CharacterDiscord.update({ id: characterDiscord.id }, { is_unlink: true })

        const roleServer: string = `${HDiscordConfig.loadEnv(`discord.server.roles.server.name.prefix`)}${server.name}`
        const roleMember: string = HDiscordConfig.loadEnv(`discord.server.roles.member.name`)
        await HDiscordBot.removeRoleFromUser(member, roleServer)
        await HDiscordBot.removeRoleFromUser(member, roleMember)

        embed.setDescription(`${HDiscordBot.tagUser(member.user.id)} has successfully unlinked the character \`${character.username}\` to their discord account.`)
            .setColor(Colors.Red)

        await HServerUtil.logVerification(this._client, embed)
    }

}
