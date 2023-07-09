import { ApplicationCommandOptionType, AttachmentBuilder, Colors, CommandInteraction, EmbedBuilder, GuildMemberRoleManager, Role } from "discord.js"
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx"
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import HDiscordBot from "../../../../core/helpers/HDiscordBot.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";

/**
 * A class that provides the functionality to retrieve and send a Discord embed message.
 *
 * @author  Devitrax
 * @version 1.0, 11/17/22
 */
@Discord()
@SlashGroup({ description: "Interaction for the discord server", name: "mir4" })
@SlashGroup("mir4")
export abstract class MigrateServerCommand {

    /**
     * Migration 1.0
     */
    serverArray: Array<any> = [
        // { ASIA012: 'ASIA012' },
        // { ASIA133: 'ASIA012' },
        // { ASIA013: 'ASIA013' },
        // { ASIA203: 'ASIA013' },
        // { ASIA014: 'ASIA014' },
        // { ASIA062: 'ASIA014' },
        // { ASIA021: 'ASIA021' },
        // { ASIA032: 'ASIA021' },
        // { ASIA022: 'ASIA022' },
        // { ASIA141: 'ASIA022' },
        // { ASIA023: 'ASIA023' },
        // { ASIA253: 'ASIA023' },
        // { ASIA024: 'ASIA024' },
        // { ASIA064: 'ASIA024' },
        // { ASIA031: 'ASIA031' },
        // { ASIA181: 'ASIA031' },
        // { ASIA033: 'ASIA032' },
        // { ASIA153: 'ASIA032' },
        // { ASIA034: 'ASIA033' },
        // { ASIA224: 'ASIA033' },
        // { ASIA041: 'ASIA041' },
        // { ASIA081: 'ASIA041' },
        // { ASIA042: 'ASIA042' },
        // { ASIA192: 'ASIA042' },
        // { ASIA043: 'ASIA043' },
        // { ASIA144: 'ASIA043' },
        // { ASIA044: 'ASIA051' },
        // { ASIA174: 'ASIA051' },
        // { ASIA051: 'ASIA052' },
        // { ASIA173: 'ASIA052' },
        // { ASIA052: 'ASIA053' },
        // { ASIA212: 'ASIA053' },
        // { ASIA053: 'ASIA054' },
        // { ASIA061: 'ASIA054' },
        // { ASIA063: 'ASIA061' },
        // { ASIA095: 'ASIA061' },
        // { ASIA071: 'ASIA062' },
        // { ASIA261: 'ASIA062' },
        // { ASIA072: 'ASIA063' },
        // { ASIA132: 'ASIA063' },
        // { ASIA073: 'ASIA064' },
        // { ASIA264: 'ASIA064' },
        // { ASIA074: 'ASIA071' },
        // { ASIA244: 'ASIA071' },
        // { ASIA082: 'ASIA072' },
        // { ASIA164: 'ASIA072' },
        // { ASIA083: 'ASIA073' },
        // { ASIA271: 'ASIA073' },
        // { ASIA084: 'ASIA081' },
        // { ASIA252: 'ASIA081' },
        // { ASIA091: 'ASIA082' },
        // { ASIA121: 'ASIA082' },
        // { ASIA092: 'ASIA083' },
        // { ASIA103: 'ASIA083' },
        // { ASIA094: 'ASIA311' },
        // { ASIA233: 'ASIA311' },
        // { ASIA101: 'ASIA312' },
        // { ASIA143: 'ASIA312' },
        // { ASIA104: 'ASIA313' },
        // { ASIA204: 'ASIA313' },
        // { ASIA111: 'ASIA314' },
        // { ASIA191: 'ASIA314' },
        // { ASIA112: 'ASIA321' },
        // { ASIA115: 'ASIA321' },
        // { ASIA113: 'ASIA322' },
        // { ASIA151: 'ASIA322' },
        // { ASIA122: 'ASIA323' },
        // { ASIA184: 'ASIA323' },
        // { ASIA123: 'ASIA324' },
        // { ASIA242: 'ASIA324' },
        // { ASIA124: 'ASIA331' },
        // { ASIA254: 'ASIA331' },
        // { ASIA131: 'ASIA332' },
        // { ASIA194: 'ASIA332' },
        // { ASIA134: 'ASIA333' },
        // { ASIA142: 'ASIA333' },
        // { ASIA152: 'ASIA341' },
        // { ASIA243: 'ASIA341' },
        // { ASIA154: 'ASIA342' },
        // { ASIA223: 'ASIA342' },
        // { ASIA161: 'ASIA343' },
        // { ASIA211: 'ASIA343' },
        // { ASIA162: 'ASIA351' },
        // { ASIA231: 'ASIA351' },
        // { ASIA163: 'ASIA352' },
        // { ASIA232: 'ASIA352' },
        // { ASIA171: 'ASIA353' },
        // { ASIA201: 'ASIA353' },
        // { ASIA172: 'ASIA354' },
        // { ASIA234: 'ASIA354' },
        // { ASIA182: 'ASIA361' },
        // { ASIA213: 'ASIA361' },
        // { ASIA183: 'ASIA362' },
        // { ASIA222: 'ASIA362' },
        // { ASIA193: 'ASIA363' },
        // { ASIA214: 'ASIA363' },
        // { ASIA202: 'ASIA364' },
        // { ASIA251: 'ASIA364' },
        // { ASIA221: 'ASIA371' },
        // { ASIA263: 'ASIA371' },
        // { ASIA241: 'ASIA372' },
        // { ASIA262: 'ASIA372' },
        // { ASIA272: 'ASIA373' },
        // { ANFT021: 'ASIA373' },
        // { INMENA012: 'INMENA012' },
        // { INFT011: 'INMENA012' },
        // { EU025: 'EU022' },
        // { ENFT011: 'EU022' },
        // { SA014: 'SA014' },
        // { SA024: 'SA014' },
        // { SA041: 'SA041' },
        // { SA042: 'SA041' },
        // { SA082: 'SA071' },
        // { SA071: 'SA071' },
        // { SA084: 'SA081' },
        // { SNFT021: 'SA081' },
        // { NA051: 'NA051' },
        // { NA078: 'NA051' },
        // { NA054: 'NA054' },
        // { NA067: 'NA054' },
        // { NA066: 'NA062' },
        // { NNFT011: 'NA062' },
        // { NA064: 'NA064' },
        // { NA075: 'NA064' },
    ];

    /**
     * Slash command to migrate discord server role to another server
     * 
     * @param {string} fromServer - Server Name from
     * @param {string} toServer - Server Name to
     * @param {CommandInteraction} interaction - The interaction context.
     * @returns {Promise<void>
     */
    @Slash({ name: "migrate", description: "Migrates server to another server" })
    async migrateServer(
        @SlashOption({
            name: "from",
            description: "Server From to Migrate",
            type: ApplicationCommandOptionType.Role,
            required: true
        })
        fromServer: string = "",
        @SlashOption({
            name: "to",
            description: "Server To to Migrate",
            type: ApplicationCommandOptionType.Role,
            required: true
        })
        toServer: string = "",
        interaction: CommandInteraction
    ): Promise<void> {
        const fromServerName: string = fromServer.toString().replace(/<|@&|>/g, '');
        const toServerName: string = toServer.toString().replace(/<|@&|>/g, '');

        const embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("Character Details")
            .setColor(Colors.Gold)
            .setThumbnail('attachment://embed-character.png')
            .setFooter({
                text: `${new Date()}`,
                iconURL: "https://coinalpha.app/images/coin/1_20211022025215.png",
            });

        if (!interaction.guild) {
            embed.setDescription(`Guild not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        if (!interaction.member) {
            embed.setDescription(`Member not found.`)
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const roleName: string = HDiscordConfig.loadEnv(`discord.server.roles.moderator.name`)
        const role: Role | undefined = interaction.guild.roles.cache.find(role => role.name === roleName);

        if (!role) {
            embed.setDescription(`Role ${roleName} not found.`)
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

        await interaction.deferReply({
            ephemeral: false
        });

        // await this.migrateFromData(interaction);

        const roleServerFrom: Role | undefined = interaction.guild.roles.cache.find(role => role.id === fromServerName);

        if (roleServerFrom == null) {
            embed.setDescription(`Role ${fromServerName} not found.`)
            CLogger.error(`Request Error > Role not found: (${fromServerName})`);
            return;
        }

        const roleServerTo: Role | undefined = interaction.guild.roles.cache.find(role => role.id === toServerName);

        if (roleServerTo == null) {
            embed.setDescription(`Role ${toServerName} not found.`)
            CLogger.error(`Request Error > Role not found: (${toServerName})`);
            return;
        }

        roleServerFrom.members.forEach(async member => {
            // CLogger.info(`Migrating User: (${member.user.username}) From: (${roleServerFrom.name}) To: (${roleServerTo.name}).`);
            // await HDiscordBot.addRoleToUser(member, roleServerTo.name);
            // await HDiscordBot.removeRoleFromUser(member, roleServerFrom.name);
        })

        embed.setDescription(`Successfully migrated the server role.`)
            .addFields({
                name: `From`,
                value: "```" + roleServerFrom.name + "```",
                inline: true
            }, {
                name: `To`,
                value: "```" + roleServerTo.name + "```",
                inline: true
            })

        interaction.editReply({
            embeds: [
                embed
            ],
            files: [
                new AttachmentBuilder(`${process.cwd()}/src/modules/plugin/mir4/discord/resources/images/migrate.png`, { name: 'embed-character.png' }),
            ]
        });
    }

    /**
     * Runs Migration script
     * 
     * @param interaction 
     * @returns {Promise<void>}
     */
    async migrateFromData(interaction: CommandInteraction): Promise<void> {

        this.serverArray.forEach(server => {
            const originalServer = Object.keys(server)[0];
            const mergedServer = server[originalServer];
          
            const fromServerName: string = `${HDiscordConfig.loadEnv(`discord.server.roles.server.name.prefix`)}${originalServer}`;
            const toServerName: string = `${HDiscordConfig.loadEnv(`discord.server.roles.server.name.prefix`)}${mergedServer}`;

            const roleServerFrom: Role | undefined = interaction.guild!.roles.cache.find(role => role.name.toLowerCase() === fromServerName.toLowerCase());

            if (roleServerFrom == null) {
                CLogger.error(`Request Error From > Role not found: (${fromServerName})`);
                return;
            }

            const roleServerTo: Role | undefined = interaction.guild!.roles.cache.find(role => role.name.toLowerCase() === toServerName.toLowerCase());

            if (roleServerTo == null) {
                CLogger.error(`Request Error To > Role not found: (${toServerName})`);
                return;
            }

            roleServerFrom.members.forEach(async member => {
                CLogger.info(`Migrating User: (${member.user.username}) From: (${roleServerFrom.name}) To: (${roleServerTo.name}).`);
                await HDiscordBot.addRoleToUser(member, roleServerTo.name);
                await HDiscordBot.removeRoleFromUser(member, roleServerFrom.name);
            })
        })

    }

}