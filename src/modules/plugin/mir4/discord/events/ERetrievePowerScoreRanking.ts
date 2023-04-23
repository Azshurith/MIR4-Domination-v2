import { ArgsOf } from "discordx";
import { Discord, On, Client } from "discordx";
import { IOnReadyCron } from "../../../../core/interface/events/IOnReadyCron";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import RetrievePowerScoreRanking from "../controllers/RetrievePowerScoreRanking.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import * as Cron from "node-cron";

@Discord()
export abstract class ERetrievePowerScoreRanking implements IOnReadyCron {

    @On({ event: "ready" })
    async onReady([member]: ArgsOf<"ready">, client: Client): Promise<void> {
        const url: string = await HDiscordConfig.loadConfig(`mir4.forum.leaderboard.url`)
        console.log(url);
        Cron.schedule("* * * * *", async () => {
            CLogger.info(`Start > Retrieving Mir4 Leaderboard`);

            try {
                const url: string = await HDiscordConfig.loadConfig(`mir4.forum.leaderboard.url`)
                await new RetrievePowerScoreRanking(client).fetch({
                    ranktype: 1,
                    worldgroupid: 1,
                    worldid: 1,
                    url: url
                })
            } catch (error) {
                CLogger.error(`API Error > Retrieving Mir4 Leaderboard: (${error})`);
            }

            CLogger.info(`End > Retrieving Mir4 Leaderboard`);
        }, {
            scheduled: true,
            timezone: "Asia/Manila"
        });
    }
}