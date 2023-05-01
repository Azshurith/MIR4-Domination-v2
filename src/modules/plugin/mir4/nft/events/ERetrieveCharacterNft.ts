import type { ArgsOf } from "discordx";
import { Discord, On, Client } from "discordx";
import { IOnReadyCron } from "../../../../core/interface/events/IOnReadyCron.js";
import CRetrieveCharacterNft from "../controllers/RetrieveCharacterNftController.js";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import * as Cron from "node-cron";

/**
 * An event representing the Character NFT retrieve process.
 * 
 * @version 1.0.0
 * @since 04/09/23
 * @author
 *  - Devitrax
 */
@Discord()
export abstract class ERetrieveCharacterNft implements IOnReadyCron {

    /**
     * An event that triggers when the bot is ready and retrieving NFT characters.
     * 
     * @param {ArgsOf<"ready">} member - The member associated with the event.
     * @param {Client} client - The Discord client instance.
     */
    @On({ event: "ready" })
    async onReady([member]: ArgsOf<"ready">, client: Client): Promise<void> {
        if (HDiscordConfig.isLocalEnvironment()) return

        await HDiscordConfig.loadDbConfig("mir4.server.cron.nft", "false")
        
        Cron.schedule("* * * * *", async () => {
            try {
                const isRunning = await HDiscordConfig.loadDbConfig("mir4.server.cron.nft")
                if (isRunning == "true") {
                    CLogger.info(`End > Retrieving Character NFT is still running`);
                    return
                }

                await HDiscordConfig.loadDbConfig("mir4.server.cron.nft", "true")

                CLogger.info(`Start > Retrieving Character NFT`,);
                await new CRetrieveCharacterNft(client).fetch({
                    listType: 'sale',
                    class: 0,
                    levMin: 0,
                    levMax: 0,
                    powerMin: 0,
                    powerMax: 0,
                    priceMin: 0,
                    priceMax: 0,
                    sort: 'latest',
                    page: 1,
                    languageCode: 'en'
                });
                CLogger.info(`End > Retrieving Character NFT`);
            } catch (error) {
                CLogger.error(`Exception > Retrieving Character NFT`);
            } finally {
                await HDiscordConfig.loadDbConfig("mir4.server.cron.nft", "false")
            }
        }, {
            scheduled: true,
            timezone: "Asia/Manila"
        });
    }

}