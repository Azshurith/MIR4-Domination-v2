import { APIInteractionGuildMember, ActionRowBuilder, AnyThreadChannel, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, Colors, EmbedBuilder, FetchedThreads, GuildMember, GuildMemberRoleManager, MessageActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, Role, TextInputBuilder, TextInputStyle, ThreadChannel } from "discord.js";
import { Mir4Character } from "../../../mir4/discord/models/Character.js";
import { Mir4CharacterTicket } from "../../../mir4/discord/models/CharacterTicket.js";
import { UtilityTicket } from "../models/Ticket.js";
import { ButtonComponent, Discord, ModalComponent } from "discordx";
import { DiscordUser } from "../../../../core/models/User.js";
import HDiscordBot from "../../../../core/helpers/HDiscordBot.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import HServerUtil from "../../../../core/helpers/HServerUtil.js";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";

/**
 * A class representing the mail shortcuts
 * 
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Discord()
export default class HTicketUtil {

    /**
     * Creates a new support ticket thread for a member.
     * 
     * @param {Client} client - The Discord client instance. 
     * @param {GuildMember | APIInteractionGuildMember} member - The member who is creating the ticket.
     * @param {EmbedBuilder} embed - The embed to send with the ticket.
     * @returns {Promise<ThreadChannel<boolean> | null>} - The new ticket thread, or null if the channel doesn't exist.
     */
    static async createTicket(client: Client, member: GuildMember | APIInteractionGuildMember, character: Mir4Character, discrd: DiscordUser, embed: EmbedBuilder): Promise<ThreadChannel<boolean> | null> {
        const threadName: string = `ticket-${(await UtilityTicket.count() + 1)}`
        const guildName: string = HDiscordConfig.loadEnv(`discord.server.name`)
        const channelName: string = HDiscordConfig.loadEnv(`discord.server.channel.ticket`)
        const channel = HDiscordBot.getSpecificServerTextChannelByName(client, guildName, channelName)

        if (!channel) {
            CLogger.error(`Channel [${channelName}] does not exist.`);
            return null;
        }

        const fetchedThreads: FetchedThreads = await channel.threads.fetch();
        const threadsArray: AnyThreadChannel<boolean>[] = Array.from(fetchedThreads.threads.values());
        let thread: ThreadChannel<boolean> | null = threadsArray.find((thread) => thread.name === threadName) as ThreadChannel;
        if (!thread) {
            thread = await channel.threads.create({
                name: threadName,
                autoArchiveDuration: 60,
                reason: `Generated by ${client.user?.username}`,
            });
            const ticket: UtilityTicket | null = await UtilityTicket.create({ description: embed.data.description, thread_id: thread.id }).save();
            await Mir4CharacterTicket.create({ character_id: character.id, ticket_id: ticket.id, discord_id: discrd.id }).save();
        }

        const menuRow: ActionRowBuilder<MessageActionRowComponentBuilder> = new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .addComponents(new ButtonBuilder()
                .setLabel("Respond to Ticket")
                .setCustomId("respondTicket")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("✉️")
            )
            .addComponents(new ButtonBuilder()
                .setLabel("Close Ticket")
                .setCustomId("closeTicket")
                .setStyle(ButtonStyle.Danger)
                .setEmoji("🔐")
            )

        thread.send({
            content: `${HDiscordBot.tagUser(member.user.id)}, Please wait until a support handles your ticket.`,
            embeds: [embed],
            components: [menuRow]
        })

        return thread
    }

    /**
     * Closes a support ticket
     * 
     * @param interaction - The button interaction
     */
    @ButtonComponent({ id: "closeTicket" })
    async closeTicket(interaction: ButtonInteraction): Promise<void> {

        await interaction.deferReply();

        const embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("Close Ticket")
            .setColor(Colors.Green)
            .setFooter({
                text: `${new Date()}`,
                iconURL: 'attachment://embed-footer.png',
            });

        if (!interaction.member) {
            embed.setDescription(`Member not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        if (!interaction.channel) {
            embed.setDescription(`Channel not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        if (!interaction.guild) {
            embed.setDescription(`Guild not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const threadChannel: ThreadChannel = await interaction.guild.channels.fetch(interaction.channel.id) as ThreadChannel

        if (!threadChannel) {
            embed.setDescription(`Thread Channel not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const utilityTicket: UtilityTicket | null = await UtilityTicket.findOne({ where: { thread_id: threadChannel.id } })
        if (!utilityTicket) {
            embed.setDescription(`Utility Ticket not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const discordUser: DiscordUser | null = await DiscordUser.findOne({ where: { discord_id: interaction.member.user.id, discriminator: interaction.member.user.discriminator } });
        if (!discordUser) {
            embed.setDescription(`Your account is not registered to our system.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const characterTicket: Mir4CharacterTicket | null = await Mir4CharacterTicket.findOne({ where: { discord_id: discordUser.id, ticket_id: utilityTicket.id } })
        if (!characterTicket) {
            embed.setDescription(`Unable to close, ticket is owned by ${HDiscordBot.tagUser(interaction.member.user.id)}.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        embed.setDescription(`${HDiscordBot.tagUser(interaction.member.user.id)} has closed the ticket, We will now archive the ticket.`)

        threadChannel.setLocked(true)
        threadChannel.setArchived(true)

        await interaction.editReply({
            embeds: [embed]
        })
        return;
    }

    /**
     * Handles the button click event for the "respondTicket" button and shows the reply ticket modal to a support member.
     * 
     * @param {ButtonInteraction} interaction - The interaction data for the button click event.
     * @returns {void}
     */
    @ButtonComponent({ id: "respondTicket" })
    respondTicket(interaction: ButtonInteraction): void {
        const roleName: string = HDiscordConfig.loadEnv(`discord.server.roles.moderator.name`)
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

        const modal: ModalBuilder = new ModalBuilder()
            .setTitle(`Reply to ticket`)
            .setCustomId("replyTicketModal");

        const ticketReply: TextInputBuilder = new TextInputBuilder()
            .setCustomId("ticketReply")
            .setLabel("Response")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Your response")
            .setRequired(true)
            .setMinLength(10)
            .setMaxLength(1000)

        const row1 = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(ticketReply);

        modal.addComponents(row1);

        interaction.showModal(modal);
    }

    /**
     * Handles the submission of the reply ticket modal form and sends the ticket reply to the specified channel.
     * 
     * @param {ModalSubmitInteraction} interaction - The interaction data for the submitted modal form.
     * @returns {Promise<void>}
     */
    @ModalComponent()
    async replyTicketModal(interaction: ModalSubmitInteraction): Promise<void> {
        try {
            const [ticketReply] = ["ticketReply"].map((id) =>
                interaction.fields.getTextInputValue(id)
            );

            await interaction.deferReply();

            if (!interaction.member) {
                CLogger.error(`Member not found.`);
                return;
            }

            if (!interaction.channel) {
                CLogger.error(`Channel not found.`);
                return;
            }

            const embed: EmbedBuilder = new EmbedBuilder()
                .setTitle("Ticket Reply")
                .setDescription(`${HDiscordBot.tagUser(interaction.member.user.id)} has responded to the ticket ${HDiscordBot.tagChannel(interaction.channel.id)}\n\n${ticketReply}`)
                .setColor(Colors.Yellow)
                .setFooter({
                    text: `${new Date()}`,
                    iconURL: 'attachment://embed-footer.png',
                });

            interaction.editReply(ticketReply)

            await HServerUtil.logVerification(interaction.client, embed)
        } catch (error) {
            CLogger.error(`An exception has occured in Ticket Reply: ${error}`)
        }
        return;
    }

}