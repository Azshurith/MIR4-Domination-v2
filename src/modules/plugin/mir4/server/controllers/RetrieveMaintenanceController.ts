
import { Client } from "discordx";
import { AttachmentBuilder, Colors, EmbedBuilder, Role, TextChannel } from "discord.js";
import { ServerMaintenanceDateResponse, ServerMaintenanceResponse } from "../interface/IRetrieveServerMaintenance";
import { APIController } from "../../../../core/interface/controllers/APIController";
import { DefaultRequest } from "../../../../core/interface/requests/IDefaultRequest";
import axios, { AxiosResponse } from "axios";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import HDiscordBot from "../../../../core/helpers/HDiscordBot.js";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";

/**
 * A class representing the MIR4 Server Maintenance Detail
 *
 * @version 1.0.0
 * @since 04/15/23
 * @author
 *  - Devitrax
 */
export default class RetrieveMaintenanceController implements APIController {

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
     * Fetches server maintenance status and date from an API endpoint and sends a Discord embed message to notify users of any updates or changes in server maintenance status or date.
     * 
     * @param {DefaultRequest} request - The request object containing the API endpoint URL to fetch the server maintenance status.
     * @returns {Promise<void>} - Returns a promise that resolves once the Discord embed message has been sent.
     * @throws {Error} - Throws an error if there was a problem with fetching the server maintenance status or sending the Discord embed message.
     */
    async fetch(request: DefaultRequest): Promise<void> {
        try {
            const url: string = HDiscordConfig.loadEnv(`mir4.api.maintenance.date`)

            const response: AxiosResponse<ServerMaintenanceResponse, any> = await axios.get<ServerMaintenanceResponse>(request.url!);
            const dateResponse: AxiosResponse<ServerMaintenanceDateResponse, any> = await axios.get<ServerMaintenanceDateResponse>(url);
            let { sdate, edate } = dateResponse.data;

            const maintenanceStatus: number = Number(await HDiscordConfig.loadDbConfig(`mir4.server.maintenance.status`))
            const maintenanceStart: string = await HDiscordConfig.loadDbConfig(`mir4.server.maintenance.date.start`)
            const maintenanceEnd: string = await HDiscordConfig.loadDbConfig(`mir4.server.maintenance.date.end`)

            const embed: EmbedBuilder = new EmbedBuilder()
                .setImage('attachment://profile-image.png')
                .setFooter({
                    text: `${new Date()}`,
                    iconURL: "https://coinalpha.app/images/coin/1_20211022025215.png",
                })
                .setFields({
                    name: `Start`,
                    value: "```" + sdate + "```",
                    inline: true
                }, {
                    name: `End`,
                    value: "```" + edate + "```",
                    inline: true
                })


            switch (response.data.code) {
                case 200:
                    if (response.data.code == maintenanceStatus) {
                        return;
                    }

                    embed.setTitle(`The server maintenance has ended`)
                        .setDescription(`The maintenance procedures have been completed, and the game servers are now up and running!`)
                        .setColor(Colors.Green)
                    break;
                default:
                    if (response.data.code == maintenanceStatus && (maintenanceStart != sdate || maintenanceEnd != edate)) {
                        embed.setTitle(`A new maintenance has been posted`)
                            .setDescription(`The maintenance schedule is updated. Check the latest news for more details.`)
                            .setColor(Colors.Yellow)
                    } else if (response.data.code != maintenanceStatus) {
                        embed.setTitle(`The server maintenance has started`)
                            .setDescription(`Due to the ongoing maintenance activities, all game servers, including the NFT page, are temporarily unavailable.`)
                            .setColor(Colors.Red)
                    } else {
                        return;
                    }
                    break;
            }

            const channelRole: string = HDiscordConfig.loadEnv(`discord.server.roles.maintenance.name`)
            const serverName: string = HDiscordConfig.loadEnv(`discord.server.name`)
            const channelName: string = HDiscordConfig.loadEnv(`discord.server.channel.maintenance`)

            const channel: TextChannel = HDiscordBot.getSpecificServerTextChannelByName(this._client, serverName, channelName) as TextChannel
            if (!channel) {
                CLogger.error(`Thread does not exist.`);
                return;
            }

            if (!channel.guild) {
                CLogger.error(`Guild does not exist.`);
                return;
            }

            const role: Role | null = await HDiscordBot.findRole(channel.guild, channelRole)
            if (!role) {
                CLogger.error(`Role does not exist.`);
                return;
            }

            channel.send({
                content: HDiscordBot.tagRole(role.id),
                embeds: [
                    embed
                ],
                files: [
                    new AttachmentBuilder(`${process.cwd()}/src/modules/plugin/mir4/server/resources/images/maintenance.png`, { name: 'profile-image.png' })
                ]
            })

            await HDiscordConfig.loadDbConfig(`mir4.server.maintenance.status`, response.data.code.toString())
            await HDiscordConfig.loadDbConfig(`mir4.server.maintenance.date.start`, sdate)
            await HDiscordConfig.loadDbConfig(`mir4.server.maintenance.date.end`, edate)
        } catch (error) {
            CLogger.error(`API Error > Unable to send maintenance embed: (${error})`);
        }
    }

}
