import { ArgsOf } from "discordx";
import { Discord, On, Client } from "discordx";
import { IOnReadyCron } from "../../../../core/interface/events/IOnReadyCron";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import RetrievePowerScoreRankingController from "../controllers/RetrievePowerScoreRankingController.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import * as Cron from "node-cron";

@Discord()
export abstract class ERetrievePowerScoreRanking implements IOnReadyCron {

    @On({ event: "ready" })
    async onReady([member]: ArgsOf<"ready">, client: Client): Promise<void> {
        if (HDiscordConfig.isLocalEnvironment()) return
        
        await HDiscordConfig.loadDbConfig("mir4.server.cron.ranking", "false")

        Cron.schedule("* * * * *", async () => {
            try {
                const isRunning = await HDiscordConfig.loadDbConfig("mir4.server.cron.ranking")
                if (isRunning == "true") {
                    CLogger.info(`End > Retrieving Mir4 Leaderboard is still running`);
                    return
                }

                await HDiscordConfig.loadDbConfig("mir4.server.cron.ranking", "true")

                CLogger.info(`Start > Retrieving Mir4 Leaderboard`);
                const url: string = await HDiscordConfig.loadEnvConfig(`mir4.forum.leaderboard.url`)
                await new RetrievePowerScoreRankingController(client).fetch({
                    url: url,
                    params: {
                        ranktype: 1,
                        worldgroupid: 1,
                        worldid: 1,
                    }
                })
                CLogger.info(`End > Retrieving Mir4 Leaderboard`);
            } catch (error) {
                CLogger.error(`API Error > Retrieving Mir4 Leaderboard: (${error})`);
            } finally {
                await HDiscordConfig.loadDbConfig("mir4.server.cron.ranking", "false")
            }
        }, {
            scheduled: true,
            timezone: "Asia/Manila"
        });
    }
}