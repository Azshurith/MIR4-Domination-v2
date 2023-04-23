import { Next } from "discordx";
import { Client, Colors, CommandInteraction, EmbedBuilder } from "discord.js";

/**
 * This function is used as a middleware to check if the user's Discord account is already linked to a character.
 * If the user's account is already linked, it returns an error message and stops the execution.
 * Otherwise, it proceeds to the next function.
 * 
 * @author  Devitrax
 * @version 1.0, 11/17/22
 * 
 * @param {CommandInteraction} interaction - The interaction object for the command.
 * @param {Client} client - The Discord client object.
 * @param {Next} next - The function to proceed to if the user's account is not already linked.
 * @returns {Promise<void>} - A promise that resolves with nothing.
 */
export async function NotLinked(interaction: CommandInteraction, client: Client, next: Next): Promise<void> {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle("Character Link")
        .setColor(Colors.Red)
        .setFooter({
            text: `${new Date()}`,
            iconURL: 'attachment://embed-footer.png',
        });

    if (!client.user) {
        embed.setDescription(`User not found.`)
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }

    if (!interaction.guild) {
        embed.setDescription(`Guild not found.`)
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }

    if (!interaction.member) {
        embed.setDescription(`Member not found.`)
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }

    await next();
}