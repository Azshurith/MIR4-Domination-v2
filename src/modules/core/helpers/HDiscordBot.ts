import { AnyThreadChannel, ChannelType, Client, FetchedThreads, ForumChannel, Guild, GuildMember, ModalSubmitInteraction, PermissionResolvable, Role, TextChannel, ThreadChannel } from "discord.js";
import CLogger from "../interface/utilities/logger/controllers/CLogger.js";

/**
 * A class representing a helper for the discord bot
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
export default class HDiscordBot {

    /**
     * This static method checks if a specific permission is present in the app permissions of an interaction.
     * 
     * @param {ModalSubmitInteraction} interaction - The interaction object.
     * @param {PermissionResolvable} permission - The permission to check.
     * @returns {boolean} - A boolean indicating whether the permission is present in the app permissions of the interaction.
     */
    static async checkPermissionThruInteraction(interaction: ModalSubmitInteraction, permission: PermissionResolvable): Promise<boolean> {
        if (!interaction.guild) {
            CLogger.error(`Guild not found.`)
            return false
        }

        const bot: GuildMember = await interaction.guild.members.fetchMe()
        return bot.permissions.has(permission)
    }

    /**
     * Returns the text channel with the given ID on the specified server.
     * 
     * @param {Guild} guild - The server to search for the channel on.
     * @param {string} channelId - The ID of the channel to search for.
     * @returns {?TextChannel} - The text channel with the given ID, or null/undefined if not found.
     */
    static getSpecificGuildTextChannelById(guild: Guild, channelId: string): TextChannel | null | undefined {
        try {

            const channel: TextChannel = guild.channels.cache.find((channel) => channel.id === channelId) as TextChannel;
            if (!channel) {
                CLogger.error(`Request Error > Channel not found: (${channelId})`);
                return null;
            }

            if (!channel.isTextBased()) {
                CLogger.error(`Request Error > Channel is not a text based channel: (${channelId})`);
                return null;
            }

            return channel;
        } catch (error) {
            CLogger.error(`Request Error > Server Error: (${error})`);
        }
    }

    /**
     * Returns the text channel with the given name on the specified server.
     * 
     * @param {Client} client - The Discord client instance to use.
     * @param {string} serverName - The name of the server to search for the channel on.
     * @param {string} channelName - The name of the channel to search for.
     * @returns {TextChannel|null|undefined} - The text channel with the given name, or null/undefined if not found.
     */
    static getSpecificServerTextChannelByName(client: Client, serverName: string, channelName: string): TextChannel | null | undefined {
        try {
            const guild: Guild | undefined = client.guilds.cache.find((guild) => guild.name === serverName);
            if (!guild) {
                CLogger.error(`Request Error > Server not found: (${serverName})`);
                return null;
            }

            const channel: TextChannel = guild.channels.cache.find((channel) => channel.name === channelName) as TextChannel;
            if (!channel) {
                CLogger.error(`Request Error > Channel not found: (${channelName})`);
                return null;
            }

            if (!channel.isTextBased()) {
                CLogger.error(`Request Error > Channel is not a text based channel: (${channelName})`);
                return null;
            }

            return channel;
        } catch (error) {
            CLogger.error(`Request Error > Server Error: (${error})`);
        }
    }

    /**
     * Get the forum thread in a specific server by name
     *
     * @param {Client} client - The Discord.js client
     * @param {string} serverName - The name of the server where the forum exists
     * @param {string} forumName - The name of the forum where the thread exists
     * @param {string} threadName - The name of the thread to retrieve or create
     * @returns {ThreadChannel | null | undefined} The thread channel or null/undefined if not found or an error occurred
     */
    static async getSpecificServerForumThreadByName(client: Client, serverName: string, forumName: string, threadName: string, content: string): Promise<ThreadChannel | null | undefined> {
        try {
            const channel: ForumChannel = this.getSpecificServerForumByName(client, serverName, forumName) as ForumChannel
            if (!channel) {
                CLogger.error(`Request Error > Forum not found: (${forumName})`);
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
                    message: {
                        content: content,
                        components: [],
                        embeds: [],
                        allowedMentions: { parse: [] },
                    }
                });
            }

            return thread;
        } catch (error) {
            CLogger.error(`Request Error > Server Error: (${error})`);
            return null;
        }
    }

    /**
     * Get the forum channel in a specific server by name
     *
     * @param {Client} client - The Discord.js client
     * @param {string} serverName - The name of the server where the forum exists
     * @param {string} forumName - The name of the forum channel to retrieve
     * @param {string} content - The content of the thread to create (if the thread doesn't already exist)
     * @returns {ForumChannel | null | undefined} The forum channel or null/undefined if not found or an error occurred
     */
    static getSpecificServerForumByName(client: Client, serverName: string, forumName: string): ForumChannel | null | undefined {
        try {
            const guild: Guild | undefined = client.guilds.cache.find((guild) => guild.name === serverName);
            if (!guild) {
                CLogger.error(`Request Error > Server not found: (${serverName})`);
                return null;
            }

            const channel: ForumChannel = guild.channels.cache.find((channel) => channel.name === forumName) as ForumChannel;
            if (!channel) {
                CLogger.error(`Request Error > Forum not found: (${forumName})`);
                return null;
            }

            if (channel.type !== ChannelType.GuildForum) {
                CLogger.error(`Request Error > Channel is not a forum: (${forumName})`);
                return null;
            }

            return channel;
        } catch (error) {
            CLogger.error(`Request Error > Server Error: (${error})`);
            return null;
        }
    }

    /**
     * Search for a guild member with a given name in a specified guild.
     *
     * @param {Guild} guild - The guild to search in.
     * @param {string} id - The id of the member to search for.
     * @returns {Promise<GuildMember | null>} - A promise that resolves with the matching GuildMember object, or null if no match was found.
     */
    static async searchMemberFromGuild(guild: Guild, id: string): Promise<GuildMember | null> {
        const member: GuildMember | undefined = guild.members.cache.find(member => member.id === id);

        if (member == null) {
            CLogger.error(`Request Error > Member not found: (${id})`);
            return null;
        }

        return member;
    }

    /**
     * Adds a role to a member in a guild.
     * 
     * @param {GuildMember} member - The guild member to add the role to.
     * @param {string} name - The name of the role to be added.
     * @returns {Promise<void>} A Promise that resolves once the role has been added to the member.
     */
    static async addRoleToUser(member: GuildMember, name: string): Promise<void> {
        const role: Role | undefined = member.guild.roles.cache.find(role => role.name.toLowerCase() === name.toLowerCase());

        if (role == null) {
            CLogger.error(`Request Error > Role not found: (${name})`);
            return;
        }

        await member.roles.add(role);
    }

    /**
     * Removes a role to a member in a guild.
     * 
     * @param {GuildMember} member - The guild member to add the role to.
     * @param {string} name - The name of the role to be added.
     * @returns {Promise<void>} A Promise that resolves once the role has been added to the member.
     */
    static async removeRoleFromUser(member: GuildMember, name: string): Promise<void> {
        const role: Role | undefined = member.guild.roles.cache.find(role => role.name.toLowerCase() === name.toLowerCase());

        if (role == null) {
            CLogger.error(`Request Error > Role not found: (${name})`);
            return;
        }

        await member.roles.remove(role);
    }

    /**
     * Finds a role in a guild by name.
     * 
     * @param {Guild} guild - The guild to search for the role in.
     * @param {string} name - The name of the role to search for.
     * @returns {Promise<Role | null>} - A promise that resolves to the found role, or null if the role was not found.
     */
    static async findRole(guild: Guild, name: string): Promise<Role | null> {
        const role: Role | undefined = guild.roles.cache.find(role => role.name.toLowerCase() === name.toLowerCase());

        if (role == null) {
            CLogger.error(`Request Error > Role not found: (${name})`);
            return null;
        }

        return role
    }

    /**
     * Converts BBCode to Discord-compatible text.
     * 
     * @param {string} text The text to convert.
     * @returns {string} The converted text.
     */
    static bbCodeToDiscord(text: string): string {
        try {
            text = text.replace(/\[b\](.*?)\[\/b\]/gs, "**$1**");
            text = text.replace(/\[i\](.*?)\[\/i\]/gs, "*$1*");
            text = text.replace(/\[u\](.*?)\[\/u\]/gs, "__$1__");
            text = text.replace(/\[url\](.*?)\[\/url\]/gs, "<$1>");
            text = text.replace(/\[img\](.*?)\[\/img\]/gs, (url) => "");
            text = text.replace(/\[h2\](.*?)\[\/h2\]/gs, "**$1**\n");
            text = text.replace(/\[h3\](.*?)\[\/h3\]/gs, "**$1**\n");
            text = text.replace(/\[\/?table\]/gs, "");
            text = text.replace(/\[\/?tr\]/gs, "");
            text = text.replace(/\[\/?th\]/gs, "");
            text = text.replace(/\[\/?td\]/gs, "");
            text = text.replace(/\[\/?strike\]/gs, "");
        } catch (error) {
            CLogger.error(
                `Request Error > BBCode to Discord: (${error})`
            );
        }

        return text;
    }

    /**
     * Limits the length of a given string to a specified maximum, and adds an ellipsis if the string is truncated.
     * 
     * @param {string} text - The input string to be limited.
     * @param {number} max - The maximum length of the output string, before an ellipsis is added.
     * @returns {string} The input string limited to max characters, with an ellipsis added if the input string was truncated.
     */
    static limit(text: string, max: number): string {
        if (text.length > max) {
            text = text.substring(0, max - 3) + "...";
        }
        return text;
    }

    /**
     * Returns a string representation of a Discord role mention.
     * 
     * @param {string} roleId The ID of the role to mention.
     * @returns {string} The string representation of the role mention.
     */
    static tagRole(roleId: string): string {
        return `<@&${roleId}>`;
    }

    /**
     * Returns a string representation of a Discord user mention.
     * 
     * @param {string} userId The ID of the user to mention.
     * @returns {string} The string representation of the user mention.
     */
    static tagUser(userId: string): string {
        return `<@${userId}>`;
    }

    /**
     * Returns a string representation of a Discord channel mention.
     * 
     * @param {string} channelId The ID of the channel to mention.
     * @returns {string} The string representation of the channel mention.
     */
    static tagChannel(channelId: string): string {
        return `<#${channelId}>`;
    }

}