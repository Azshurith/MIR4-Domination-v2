import type { ArgsOf } from "discordx";
import { Discord, On, Client } from "discordx";
import { IOnReadyCron } from "../../../../core/interface/events/IOnReadyCron.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import RetrieveMaintenanceController from "../controllers/RetrieveMaintenanceController.js";
import * as Cron from "node-cron";

/**
 * Represents an event triggered when retrieving a Maintenance Status for the MIR4 game.
 * 
 * @version 1.0.0
 * @since 05/01/23
 * @author
 *  - Devitrax
 */
@Discord()
export abstract class ERetrieveServerMaintenance implements IOnReadyCron {

    /**
     * An event that triggers when the bot is ready and retrieving the Maintenance Status
     * 
     * @param {ArgsOf<"ready">} member - The member associated with the event.
     * @param {Client} client - The Discord client instance.
     */
    @On({ event: "ready" })
    async onReady([member]: ArgsOf<"ready">, client: Client): Promise<void> {
        if (HDiscordConfig.isLocalEnvironment()) return

        Cron.schedule("* * * * *", async () => {
            try {
                CLogger.info(`Start > Retrieving MIR4 Maintenance Status`);

                const url: string = HDiscordConfig.loadEnv(`mir4.api.maintenance.status`)

                await new RetrieveMaintenanceController(client).fetch({
                    url: url,
                });

                CLogger.info(`End > Retrieving MIR4 Maintenance Status`);
            } catch (error) {
                CLogger.error(`Exception > Retrieving MIR4 Maintenance Status`);
            };
        }, {
            scheduled: true,
            timezone: "Asia/Manila"
        });
    }

}