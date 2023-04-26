import type { ArgsOf } from "discordx";
import { Discord, On, Client } from "discordx";
import { CoinGeckoClient } from "coingecko-api-v3"
import { IOnReadyCron } from "../../../../core/interface/events/IOnReadyCron.js";
import CRetrieveNFTCurrency from "../controllers/RetrieveNFTController.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import * as Cron from "node-cron";
/**
 * Represents an event triggered when retrieving a the MIR4 NFT Currency.
 *
 * @version 1.0.0
 * @since 04/15/23
 * @author
 *  - Devitrax
 */
@Discord()
export abstract class ERetrieveNFTCurrency implements IOnReadyCron {

    /**
     * An event that triggers when the bot is ready and retrieving the Currency value.
     * 
     * @param {ArgsOf<"ready">} member - The member associated with the event.
     * @param {Client} client - The Discord client instance.
     */
    @On({ event: "ready" })
    onReady([member]: ArgsOf<"ready">, client: Client): void {
        if (!HDiscordConfig.isLocalEnvironment()) return
        const coinGecko: CoinGeckoClient = new CoinGeckoClient();

        Cron.schedule("* * * * *", async () => {
            try {
                CLogger.info(`Start > Retrieving MIR4 NFT Currency`);

                await new CRetrieveNFTCurrency(client).fetch({
                    client: coinGecko
                });

                CLogger.info(`End > Retrieving MIR4 NFT Currency`);
            } catch (error) {
                CLogger.error(`Exception > Retrieving MIR4 NFT Currency`);
            };
        }, {
            scheduled: true,
            timezone: "Asia/Manila"
        });
    }

}