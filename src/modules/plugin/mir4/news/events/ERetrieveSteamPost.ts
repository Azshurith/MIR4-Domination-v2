import type { ArgsOf } from "discordx";
import { Discord, On, Client } from "discordx";
import { IOnReadyCron } from "../../../../core/interface/events/IOnReadyCron.js";
import CRetrieveSteamPost from "../controllers/RetrieveSteamPostController.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import * as Cron from "node-cron";

/**
 * Represents an event triggered when retrieving a Steam post for the MIR4 game.
 * 
 * @version 1.0.0
 * @since 04/15/23
 * @author
 *  - Devitrax
 */
@Discord()
export abstract class ERetrieveSteamPost implements IOnReadyCron {

    /**
     * An event that triggers when the bot is ready and retrieving the Steam post.
     * 
     * @param {ArgsOf<"ready">} member - The member associated with the event.
     * @param {Client} client - The Discord client instance.
     */
    @On({ event: "ready" })
    onReady([member]: ArgsOf<"ready">, client: Client): void {
        Cron.schedule("* * * * *", async () => {
            try {
                CLogger.info(`Start > Retrieving MIR4 Steam Post`);

                await new CRetrieveSteamPost(client).fetch({
                    appId: HDiscordConfig.loadEnv(`discord.server.channel.news.app.id`),
                    token: HDiscordConfig.loadEnv(`discord.server.channel.news.app.token`)
                });

                CLogger.info(`End > Retrieving MIR4 Steam Post`);
            } catch (error) {
                CLogger.error(`Exception > Retrieving MIR4 Steam Post`);
            };
        }, {
            scheduled: true,
            timezone: "Asia/Manila"
        });
    }

}