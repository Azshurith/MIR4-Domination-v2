
import { Client } from "discordx";
import { SteamPostRequest, SteamPostResponse } from "../interface/IRetrieveSteamPost";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageActionRowComponentBuilder, Role, TextChannel } from "discord.js";
import { APIController } from "../../../../core/interface/controllers/APIController.js";
import { Mir4Post } from "../models/Post.js";
import HDiscordBot from "../../../../core/helpers/HDiscordBot.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import SteamAPI from "steamapi";

/**
 * A class representing the MIR4 NFT retrieve controller.
 *
 * @version 1.0.0
 * @since 04/15/23
 * @author
 *  - Devitrax
 */
export default class RetrieveSteamPostController implements APIController {

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
     * Fetches the latest post from a Steam page using the Steam Web API.
     * 
     * @param {SteamPostRequest} request - The request object containing the app ID to retrieve.
     * @returns {Promise<void>} - A promise that resolves with no value when the latest post has been retrieved.
     */
    async fetch(request: SteamPostRequest): Promise<void> {
        try {
            CLogger.info(`Loading MIR4 news from Steam`);

            const steam: SteamAPI = new SteamAPI(request.token);
            await steam.getGameNews(request.appId).then((news: Record<string, unknown>[]) => {
                const steamPostResponseList: SteamPostResponse[] = news.map((post) => {
                    const steamPostResponse: SteamPostResponse = {
                        gid: post.gid as string,
                        title: post.title as string,
                        url: post.url as string,
                        is_external_url: post.is_external_url as boolean,
                        author: post.author as string,
                        contents: post.contents as string,
                        feedlabel: post.feedlabel as string,
                        date: post.date as number,
                        feedname: post.feedname as string,
                        feed_type: post.feed_type as number,
                        appid: post.appid as number,
                    };
                    return steamPostResponse;
                });

                steamPostResponseList.sort((a, b) => a.date - b.date);

                steamPostResponseList.forEach(async (news: SteamPostResponse) => {
                    const post: Mir4Post | null = await Mir4Post.findOne({
                        where: { post_id: news.gid }
                    })

                    if (!post) {
                        CLogger.info(`Posting News > Steam Post Request: (${news.title})`);
                        await Mir4Post.create({
                            post_id: news.gid,
                            title: news.title,
                            url: news.url,
                            author: news.author,
                            contents: news.contents,
                            feedlabel: news.feedlabel,
                            feedname: news.feedname,
                            is_external_url: news.is_external_url,
                            posted_at: new Date(news.date * 1000)
                        }).save();
                        this.notify(news)
                    }
                })

            });
        } catch (error) {
            CLogger.error(`API Error > Steam Post Request: (${error})`);
        }
    }

    /**
     * Sends a notification message to the specified text channel containing the details of the updated Steam news post.
     * 
     * @param {SteamPostResponse} news - The Steam news post to be notified about.
     * @returns {Promise<void>}
     */
    async notify(news: SteamPostResponse): Promise<void> {
        try {
            const serverName: string = HDiscordConfig.loadEnv(`discord.server.name`)
            const channelName: string = HDiscordConfig.loadEnv(`discord.server.channel.news`)
            const roleName: string = HDiscordConfig.loadEnv(`discord.server.roles.news.name`)
            const cdnUrl: string = HDiscordConfig.loadEnv(`discord.server.channel.news.cdn`)

            const channel: TextChannel = HDiscordBot.getSpecificServerTextChannelByName(this._client, serverName, channelName) as TextChannel
            if (!channel) {
                CLogger.error(`Channel does not exist.`);
                return;
            }

            const role: Role | null = await HDiscordBot.findRole(channel.guild, roleName);
            if (!role) {
                CLogger.error(`Role does not exist.`);
                return;
            }

            const date: Date = new Date(news.date * 1000);
            const embed: EmbedBuilder = new EmbedBuilder()
                .setTitle(news.title)
                .setURL(news.url)
                .setColor(Colors.Aqua)
                .setFooter({
                    text: `${date}`,
                    iconURL: "https://coinalpha.app/images/coin/1_20211022025215.png",
                })

            const regex: RegExp = /\[img\](.*?)\[\/img\]/;
            const match: RegExpExecArray | null = regex.exec(news.contents);
            let image: string = "";
            if (match) {
                image = match[1].replace(/\{STEAM_CLAN_IMAGE\}/g, cdnUrl)
                embed.setImage(image)
            }

            news.contents = HDiscordBot.limit(HDiscordBot.bbCodeToDiscord(news.contents), 2048);
            embed.setDescription(news.contents)

            const menuRow: ActionRowBuilder<MessageActionRowComponentBuilder> = new ActionRowBuilder<MessageActionRowComponentBuilder>()
                .addComponents(new ButtonBuilder()
                    .setLabel("Read More")
                    .setStyle(ButtonStyle.Link)
                    .setURL(news.url)
                )

            channel.send({
                content: HDiscordBot.tagRole(role.id),
                embeds: [
                    embed
                ],
                components: [
                    menuRow
                ]
            })

            const now: Date = new Date();
            channel.guild.scheduledEvents.create({
                name: news.title,
                scheduledStartTime: now.setMinutes(now.getMinutes() + 30),
                scheduledEndTime: new Date(date.getFullYear(), date.getMonth() + 1, 0),
                privacyLevel: 2,
                entityType: 3,
                entityMetadata: {
                    location: "MIR4"
                },
                description: HDiscordBot.limit(news.contents, 1000),
                image: image
            })
        } catch (error) {
            CLogger.error(`API Error > Unable to send embed: (${error})`);
        }
    }
}
