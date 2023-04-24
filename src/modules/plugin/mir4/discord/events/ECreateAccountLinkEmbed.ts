import { ArgsOf, ButtonComponent, ModalComponent } from "discordx";
import { Discord, On, Client } from "discordx";
import { IOnReadyCron } from "../../../../core/interface/events/IOnReadyCron";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Colors, EmbedBuilder, MessageActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import HDiscordBot from "../../../../core/helpers/HDiscordBot.js";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import AccountLinkController from "../controllers/AccountLinkController.js";
import AccountUnlinkController from "../controllers/AccountUnlinkController.js";
import AccountTicketController from "../controllers/AccountTicketController.js";

@Discord()
export abstract class ECreateAccountLinkEmbed implements IOnReadyCron {

    /**
     * Called when the client becomes ready to start working.
     * 
     * @param {[member]} args The arguments for the ready event.
     * @param {Client} client The Discord.js client.
     * @returns {Promise<void>}
     */
    @On({ event: "ready" })
    async onReady([member]: ArgsOf<"ready">, client: Client): Promise<void> {
        const verificationEmbed: string = await HDiscordConfig.loadDbConfig(`mir4.server.embed.verification`)
        if (!verificationEmbed) {
            const serverName: string = HDiscordConfig.loadEnv(`discord.server.name`)
            const channelName: string = HDiscordConfig.loadEnv(`discord.server.channel.verification`)
            const channel = HDiscordBot.getSpecificServerTextChannelByName(client, serverName, channelName) as TextChannel

            const embed = new EmbedBuilder()
                .setTitle(`Account Verification`)
                .setDescription(`To access the rest of our Discord Channel, you may need to link your MIR4 character to your Discord account. If someone else has already linked your account, simply click the **Open a Ticket** button to raise a ticket.`)
                .setColor(Colors.Gold)

            const menuRow: ActionRowBuilder<MessageActionRowComponentBuilder> = new ActionRowBuilder<MessageActionRowComponentBuilder>()
                .addComponents(new ButtonBuilder()
                    .setLabel("Link Account")
                    .setCustomId("linkAccountButton")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("🔐")
                )
                .addComponents(new ButtonBuilder()
                    .setLabel("Unlink Account")
                    .setCustomId("unlinkAccountButton")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("🔓")
                )
                .addComponents(new ButtonBuilder()
                    .setLabel("Open a Ticket")
                    .setCustomId("ticketAccountButton")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("✉️")
                )

            const message = await channel.send({
                embeds: [
                    embed
                ],
                components: [
                    menuRow
                ]
            })

            await HDiscordConfig.loadDbConfig(`mir4.server.embed.verification`, message.id)
        }
    }

    /**
     * Executes the link command to link a MIR4 account to a Discord account.
     * 
     * @param {ButtonInteraction} interaction - The interaction object representing the command invocation.
     * @returns {Promise<void>}
     * @throws {Error} - If an error occurs while executing the command.
     */
    @ButtonComponent({ id: "linkAccountButton" })
    linkAccountButton(interaction: ButtonInteraction): void {
        const modal: ModalBuilder = new ModalBuilder()
            .setTitle(`Link your account`)
            .setCustomId("linkAccountModal");

        const characterName: TextInputBuilder = new TextInputBuilder()
            .setCustomId("characterName")
            .setLabel("Character Name")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Character Name")
            .setRequired(true)

        const serverName: TextInputBuilder = new TextInputBuilder()
            .setCustomId("serverName")
            .setLabel("Server Name")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Server Name")
            .setRequired(true)

        const row1 = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(characterName);

        const row2 = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(serverName);

        modal.addComponents(row1, row2);

        interaction.showModal(modal);
    }

    /**
     * A modal component that links a Mir4 character to a Discord account.
     * 
     * @param {ModalSubmitInteraction} interaction - The interaction object received from Discord.
     * @returns {Promise<void>} - Promise that resolves to void when the function completes.
     * @throws {Error} - Throws an error if an exception occurs during execution.
     */
    @ModalComponent()
    async linkAccountModal(interaction: ModalSubmitInteraction): Promise<void> {
        try {
            const [characterName, serverName] = ["characterName", "serverName"].map((id) =>
                interaction.fields.getTextInputValue(id)
            );

            await new AccountLinkController(interaction.client).fetch({
                params: {
                    characterName: characterName,
                    serverName: serverName,
                    interaction: interaction
                }
            })
        } catch (error) {
            CLogger.error(`An exception has occured in Link Command: ${error}`)
        }
        return;
    }

    /**
     * Executes the link command to link a MIR4 account to a Discord account.
     * 
     * @param {ButtonInteraction} interaction - The interaction object representing the command invocation.
     * @returns {Promise<void>}
     * @throws {Error} - If an error occurs while executing the command.
     */
    @ButtonComponent({ id: "unlinkAccountButton" })
    unlinkAccountButton(interaction: ButtonInteraction): void {
        const modal: ModalBuilder = new ModalBuilder()
            .setTitle(`Unlink your Account`)
            .setCustomId("unlinkAccountModal");

        const leaveConfirm: TextInputBuilder = new TextInputBuilder()
            .setCustomId("leaveConfirm")
            .setLabel("Are you sure you want to unlink your account?")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Type Confirm")
            .setRequired(true)

        const row1 = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(leaveConfirm);

        modal.addComponents(row1);

        interaction.showModal(modal);
    }

    /**
     * A modal component that unlinks a Mir4 character to a Discord account.
     * 
     * @param {ModalSubmitInteraction} interaction - The interaction object received from Discord.
     * @returns {Promise<void>} - Promise that resolves to void when the function completes.
     * @throws {Error} - Throws an error if an exception occurs during execution.
     */
    @ModalComponent()
    async unlinkAccountModal(interaction: ModalSubmitInteraction): Promise<void> {
        try {
            const [leaveConfirm] = ["leaveConfirm"].map((id) =>
                interaction.fields.getTextInputValue(id)
            );

            await new AccountUnlinkController(interaction.client).fetch({
                params: {
                    text: leaveConfirm,
                    interaction: interaction
                }
            })
        } catch (error) {
            CLogger.error(`An exception has occured in Unlink Command: ${error}`)
        }
        return;
    }

    /**
     * Executes the link command to link a MIR4 account to a Discord account.
     * 
     * @param {ButtonInteraction} interaction - The interaction object representing the command invocation.
     * @returns {Promise<void>}
     * @throws {Error} - If an error occurs while executing the command.
     */
    @ButtonComponent({ id: "ticketAccountButton" })
    ticketAccountButton(interaction: ButtonInteraction): void {
        const modal: ModalBuilder = new ModalBuilder()
            .setTitle(`Open a ticket`)
            .setCustomId("ticketAccountModal");

        const ticketUsername: TextInputBuilder = new TextInputBuilder()
            .setCustomId("ticketUsername")
            .setLabel("Your character's name")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Character Name")
            .setRequired(true)

        const ticketServer: TextInputBuilder = new TextInputBuilder()
            .setCustomId("ticketServer")
            .setLabel("Your character's server")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Server Name")
            .setRequired(true)

        const ticketDescription: TextInputBuilder = new TextInputBuilder()
            .setCustomId("ticketDescription")
            .setLabel("Details of ownership")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Description")
            .setRequired(true)
            .setMinLength(10)
            .setMaxLength(1000)

        const row1 = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(ticketUsername);

        const row2 = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(ticketServer);

        const row3 = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(ticketDescription);

        modal.addComponents(row1, row2, row3);

        interaction.showModal(modal);
    }

    /**
     * A modal component that tickets a Mir4 character to a Discord account.
     * 
     * @param {ModalSubmitInteraction} interaction - The interaction object received from Discord.
     * @returns {Promise<void>} - Promise that resolves to void when the function completes.
     * @throws {Error} - Throws an error if an exception occurs during execution.
     */
    @ModalComponent()
    async ticketAccountModal(interaction: ModalSubmitInteraction): Promise<void> {
        try {
            const [ticketUsername, ticketServer, ticketDescription] = ["ticketUsername", "ticketServer", "ticketDescription"].map((id) =>
                interaction.fields.getTextInputValue(id)
            );

            await new AccountTicketController(interaction.client).fetch({
                params: {
                    characterName: ticketUsername,
                    serverName: ticketServer,
                    description: ticketDescription,
                    interaction: interaction
                }
            })
        } catch (error) {
            CLogger.error(`An exception has occured in Ticket Command: ${error}`)
        }
        return;
    }

}