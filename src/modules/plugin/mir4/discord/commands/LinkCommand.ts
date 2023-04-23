import { ActionRowBuilder, CommandInteraction, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js"
import { Discord, Guard, ModalComponent, Slash, SlashGroup } from "discordx"
import { NotLinked } from "../guards/NotLinked.js";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import AccountLinkController from "../controllers/AccountLinkController.js";

/**
 * Provides the functionality to link a MIR4 account to a Discord account using a Discord Slash command.
 *
 * @author  Devitrax
 * @version 1.0, 11/23/22
 */
@Discord()
@Guard(NotLinked)
@SlashGroup({ description: "Communicates to MIR4", name: "mir4" })
@SlashGroup("mir4")
export abstract class RegisterCommand {

    /**
     * Executes the link command to link a MIR4 account to a Discord account.
     * 
     * @param {CommandInteraction} interaction - The interaction object representing the command invocation.
     * @returns {Promise<void>}
     * @throws {Error} - If an error occurs while executing the command.
     */
    @Slash({ name: "link", description: "Link your MIR4 account to your discord" })
    async execute(
        interaction: CommandInteraction
    ): Promise<void> {

        const modal: ModalBuilder = new ModalBuilder()
            .setTitle(`Link your account`)
            .setCustomId("LinkAccount");

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
     * LinkAccount is a modal component that links a Mir4 character to a Discord account.
     * 
     * @param {ModalSubmitInteraction} interaction - The interaction object received from Discord.
     * @returns {Promise<void>} - Promise that resolves to void when the function completes.
     * @throws {Error} - Throws an error if an exception occurs during execution.
     */
    @ModalComponent()
    async LinkAccount(interaction: ModalSubmitInteraction): Promise<void> {
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

}
