import { Colors, TextChannel } from "discord.js";
import { ActionRowBuilder, ApplicationCommandOptionType, ChannelType, CommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js"
import { Discord, Guard, ModalComponent, Slash, SlashGroup, SlashOption } from "discordx"
import { NotLinked } from "../guards/NotLinked.js";
import Mir4Character from "../models/Character.js";
import Mir4Server from "../models/Server.js";
import Mir4CharacterServer from "../models/CharacterServer.js";

/**
 * A class that provides the functionality to retrieve and send a Discord embed message.
 *
 * @author  Devitrax
 * @version 1.0, 11/17/22
 */
@Discord()
@Guard(NotLinked)
@SlashGroup({ description: "Communicates to MIR4", name: "mir4" })
@SlashGroup("mir4")
export abstract class RegisterCommand {

    /**
     * Slash command to create a Discord embed.
     *
     * @param {string} channel - Channel ID to send the embed to.
     * @param {CommandInteraction} interaction - The interaction context.
     * @returns {Promise<void>
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

    @ModalComponent()
    async LinkAccount(interaction: ModalSubmitInteraction): Promise<void> {
        const [characterName, serverName] = ["characterName", "serverName"].map((id) =>
            interaction.fields.getTextInputValue(id)
        );

        const embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("Character Link")
            .setColor(Colors.Red)
            .setFooter({
                text: `${new Date()}`,
                iconURL: "https://coinalpha.app/images/coin/1_20211022025215.png",
            });

        const character = await Mir4Character.findOne({ where: { username: characterName } });
        if (!character) {
            embed.setDescription(`The character \`${characterName}\` is not found.`)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const server = await Mir4Server.findOne({ where: { name: serverName } });
        if (!server) {
            embed.setDescription(`The server \`${serverName}\` is not found.`)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const characterServer = await Mir4CharacterServer.findOne({ where: { server_id: server.dataValues.server_id, character_id: character.dataValues.character_id } });
        if (!characterServer) {
            embed.setDescription(`Character \`${characterName}\` is not found in Server \`${serverName}\`.`)
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        embed.setColor(Colors.Gold)
            .setDescription(`Successfully linked the character \`${characterName}\` to your discord account.`)

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }


}
