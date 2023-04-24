
import { Client } from "discordx";
import { ActivityOptions, ActivityType, AttachmentBuilder, Colors, EmbedBuilder, Role } from "discord.js";
import { NFTCurrencyRequest } from "../interface/IRetrieveNFTCurrency";
import { SimplePriceResponse } from "coingecko-api-v3"
import { APIController } from "../../../../core/interface/controllers/APIController.js";
import HDiscordBot from "../../../../core/helpers/HDiscordBot.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";

/**
 * A class representing the Currency Retrieve retrieve controller.
 *
 * @version 1.0.0
 * @since 04/16/23
 * @author
 *  - Devitrax
 */
export default class RetrieveNFTController implements APIController {

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
     * Retrieves the latest NFT currency prices from a cryptocurrency API.
     *
     * @param {NFTCurrencyRequest} request - The request object containing the API endpoint URL to retrieve.
     * @returns {Promise<void>} - A promise that resolves with no value when the latest currency prices have been retrieved.
     */
    async fetch(request: NFTCurrencyRequest): Promise<void> {
        try {
            CLogger.info(`Loading WEMIX currency.`);

            request.client.simplePrice({
                ids: "wemix-token",
                vs_currencies: 'usd,php'
            }).then(async (result: SimplePriceResponse) => {

                const wemix: number = Number(await HDiscordConfig.loadDbConfig(`mir4.server.wemix.value`))

                if (wemix != result["wemix-token"].usd) {
                    CLogger.info(`Updating WEMIX value.`);
                    await HDiscordConfig.loadDbConfig(`mir4.server.wemix.value`, `${result["wemix-token"].usd}`)

                    let activity: ActivityOptions = {
                        name: `WEMIX ~ $${result["wemix-token"].usd} 💸`,
                        type: ActivityType.Watching
                    }

                    if (!this._client.user) {
                        CLogger.error(`User does not exist.`);
                        return;
                    }

                    this._client.user.setActivity(activity)
                    this.notify(result);
                }

            }).catch(error => {
                CLogger.error(`API Error > NFT Currency Request: (${error})`);
            })

        } catch (error) {
            CLogger.error(`API Error > NFT Currency Request: (${error})`);
        }
    }

    /**
     * Sends a notification message to the specified text channel containing the details of the updated NFT list.
     * 
     * @param {SimplePriceResponse} result - The response object containing the latest WEMIX currency prices.
     * @returns {void}
     */
    async notify(result: SimplePriceResponse): Promise<void> {
        try {
            const serverName: string = HDiscordConfig.loadEnv(`discord.server.name`)
            const forumName: string = HDiscordConfig.loadEnv(`discord.server.channel.information`)
            const threadName: string = HDiscordConfig.loadEnv(`discord.server.channel.information.thread.crypto`)
            const threadContent: string = HDiscordConfig.loadEnv(`discord.server.channel.information.thread.crypto.content`)
            const threadRole: string = HDiscordConfig.loadEnv(`discord.server.roles.crypto.name`)

            const thread = await HDiscordBot.getSpecificServerForumThreadByName(this._client, serverName, forumName, threadName, threadContent)
            if (!thread) {
                CLogger.error(`Thread does not exist.`);
                return;
            }

            const embed: EmbedBuilder = new EmbedBuilder()
                .setTitle(`WEMIX PRICE`)
                .setColor(Colors.Gold)
                .setImage('attachment://profile-image.png')
                .setFooter({
                    text: `${new Date()}`,
                    iconURL: 'attachment://embed-footer.png',
                })
                .addFields({
                    name: `USD/WEMIX`,
                    value: "```" + result["wemix-token"].usd + "```",
                    inline: true
                }, {
                    name: `PHP/WEMIX`,
                    value: "```" + result["wemix-token"].php + "```",
                    inline: true
                })

            const role: Role | null = await HDiscordBot.findRole(thread.guild, threadRole)
            if (!role) {
                CLogger.error(`Role does not exist.`);
                return;
            }

            thread.send({
                content: HDiscordBot.tagRole(role.id),
                embeds: [
                    embed
                ],
                files: [
                    new AttachmentBuilder(`${process.cwd()}/src/modules/core/resources/images/DominationFooter.png`, { name: 'embed-footer.png' }),
                    new AttachmentBuilder(`${process.cwd()}/src/modules/plugin/mir4/currency/resources/images/wemix.png`, { name: 'profile-image.png' })
                ]
            })
        } catch (error) {
            CLogger.error(`API Error > Unable to send embed: (${error})`);
        }
    }
}
