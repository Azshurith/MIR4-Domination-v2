import { ActionRowBuilder, ApplicationCommandOptionType, ChannelType, CommandInteraction, EmbedBuilder, ForumChannel, GuildBasedChannel, GuildMemberRoleManager, ModalBuilder, ModalSubmitInteraction, Role, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js"
import { Discord, ModalComponent, Slash, SlashGroup, SlashOption } from "discordx"
import { Color } from "../interface/IEmbedColor.js";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";

/**
 * A class that provides the functionality to retrieve and send a Discord embed message.
 *
 * @author  Devitrax
 * @version 1.0, 11/17/22
 */
@Discord()
@SlashGroup({ description: "Interaction for the discord server", name: "server" })
@SlashGroup("server")
export abstract class CreateEmbedPostCommand {

    colors: Color = {
        Default: 0x000000,
        White: 0xffffff,
        Aqua: 0x1abc9c,
        Green: 0x57f287,
        Blue: 0x3498db,
        Yellow: 0xfee75c,
        Purple: 0x9b59b6,
        LuminousVividPink: 0xe91e63,
        Fuchsia: 0xeb459e,
        Gold: 0xf1c40f,
        Orange: 0xe67e22,
        Red: 0xed4245,
        Grey: 0x95a5a6,
        Navy: 0x34495e,
        DarkAqua: 0x11806a,
        DarkGreen: 0x1f8b4c,
        DarkBlue: 0x206694,
        DarkPurple: 0x71368a,
        DarkVividPink: 0xad1457,
        DarkGold: 0xc27c0e,
        DarkOrange: 0xa84300,
        DarkRed: 0x992d22,
        DarkGrey: 0x979c9f,
        DarkerGrey: 0x7f8c8d,
        LightGrey: 0xbcc0c0,
        DarkNavy: 0x2c3e50,
        Blurple: 0x5865f2,
        Greyple: 0x99aab5,
        DarkButNotBlack: 0x2c2f33,
        NotQuiteBlack: 0x23272a
    };

    /**
     * Slash command to create a Discord embed.
     *
     * @param {string} channel - Channel ID to send the embed to.
     * @param {CommandInteraction} interaction - The interaction context.
     * @returns {Promise<void>
     */
    @Slash({ name: "embed", description: "Creates a discord embed" })
    async retrieve(
        @SlashOption({
            name: "channel",
            description: "Channel to send embed",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [
                ChannelType.GuildText,
                ChannelType.GuildForum
            ],
            required: true
        })
        channel: string = "",
        interaction: CommandInteraction
    ): Promise<void> {

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
        
        const roleName: string = HDiscordConfig.loadEnv(`discord.server.roles.moderator.name`)
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

        try {

            const channelId: string = channel.toString().replace(/<|#|>/g, '');
            const modal: ModalBuilder = new ModalBuilder()
                .setTitle(`Create an Embed`)
                .setCustomId("CreateEmbed");

            const embedChannel: TextInputBuilder = new TextInputBuilder()
                .setCustomId("embedChannel")
                .setLabel("Channel ID")
                .setStyle(TextInputStyle.Short)
                .setValue(channelId)
                .setPlaceholder("Discord Channel ID")

            const embedTitle: TextInputBuilder = new TextInputBuilder()
                .setCustomId("embedTitle")
                .setLabel("Title")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("The title of the embed")
                .setRequired(false)

            const embedImage: TextInputBuilder = new TextInputBuilder()
                .setCustomId("embedImage")
                .setLabel("Image URL")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("The image of the embed")
                .setRequired(false)

            const embedColor: TextInputBuilder = new TextInputBuilder()
                .setCustomId("embedColor")
                .setLabel("Color")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("The color of the embed")
                .setRequired(false)

            const embedContent = new TextInputBuilder()
                .setCustomId("embedContent")
                .setLabel("Content")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder("The content of the embed")
                .setRequired(false)

            const row1 = new ActionRowBuilder<TextInputBuilder>()
                .addComponents(embedChannel);

            const row2 = new ActionRowBuilder<TextInputBuilder>()
                .addComponents(embedTitle);

            const row3 = new ActionRowBuilder<TextInputBuilder>()
                .addComponents(embedImage);

            const row4 = new ActionRowBuilder<TextInputBuilder>()
                .addComponents(embedColor);

            const row5 = new ActionRowBuilder<TextInputBuilder>()
                .addComponents(embedContent);

            modal.addComponents(row1, row2, row3, row4, row5);

            interaction.showModal(modal);
        } catch (error) {
            CLogger.error(`[${import.meta.url}] Component Error: (${error})`);
        }
    }

    /**
     * Creates and sends an embed message based on user input.
     * 
     * @param {ModalSubmitInteraction} interaction - The modal submit interaction containing user input.
     * @returns {Promise<void>} - A Promise that resolves once the embed message has been sent.
     */
    @ModalComponent()
    async CreateEmbed(interaction: ModalSubmitInteraction): Promise<void> {
        try {
            const [embedChannel, embedTitle, embedImage, embedColor, embedContent] = ["embedChannel", "embedTitle", "embedImage", "embedColor", "embedContent"].map((id) =>
                interaction.fields.getTextInputValue(id)
            );

            let color:number = this.colors.Default 
            if (embedColor && this.colors[embedColor]) {
                color = this.colors[embedColor];
            }

            if (!interaction.guild) {
                await interaction.reply(`Guild does not exist`);
                return;
            }

            const embed: EmbedBuilder = new EmbedBuilder()
                .setColor(color)

            if (embedTitle) embed.setTitle(embedTitle)
            if (embedContent) embed.setDescription(embedContent)
            if (embedImage) embed.setImage(embedImage)

            const channel: GuildBasedChannel | undefined = interaction.guild.channels.cache.find((channel) => channel.id === embedChannel);
            if (!channel) {
                await interaction.reply(`Channel not found.`);
                return;
            }

            if (channel instanceof TextChannel) {
                channel.send({
                    embeds: [
                        embed
                    ]
                })
            }

            if (channel instanceof ForumChannel) {
                channel.threads.create({
                    name: embedTitle,
                    autoArchiveDuration: 60,
                    reason: `Generated by ${interaction.client.user?.username}`,
                    message: {
                        content: "",
                        components: [],
                        embeds: [
                            embed
                        ],
                        allowedMentions: { parse: [] },
                    }
                });
            }

            const embedReply: EmbedBuilder = new EmbedBuilder()
                .setTitle("Embed Generated!")
                .setColor(color)
                .setDescription(`Your embed is processed.`)
                .setFooter({
                    text: `${new Date()}`,
                    iconURL: "https://coinalpha.app/images/coin/1_20211022025215.png",
                })

            await interaction.reply({
                embeds: [
                    embedReply
                ]
            });
        } catch (error) {
            CLogger.error(`[${import.meta.url}] Response Error: (${error})`);
        }
        return;
    }

}