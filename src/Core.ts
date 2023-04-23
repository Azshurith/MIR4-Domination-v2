import { dirname, importx } from "@discordx/importer";
import type { Interaction, Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import Database from "./modules/core/database/Database.js"
import CLogger from "./modules/core/interface/utilities/logger/controllers/CLogger.js";
import "dotenv/config";
import "reflect-metadata"

class Core {

    private readonly database: Database = new Database()

    constructor() {
        this.database
            .init()
            .then(async () => {
                CLogger.info(`Databased Initialized`)

                await importx(process.cwd() + "/src/modules/**/{events,commands}/**/*.{ts,js}");
                
                if (!process.env.BOT_DOMINATION) {
                    throw Error("Could not find BOT_DOMINATION in your environment");
                }

                // Log in with your bot token
                const bot: Client = this.createBot()
                await bot.login(process.env.BOT_DOMINATION);

                CLogger.info(`Application has started`)
            })
    }

    createBot(): Client {
        const bot: Client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMessageReactions,
                IntentsBitField.Flags.GuildVoiceStates,
                IntentsBitField.Flags.GuildPresences
            ],
            plugins: [],
            silent: false,
            simpleCommand: {
                prefix: "!",
            },
        });

        bot.once("ready", async () => {
            await bot.initApplicationCommands();
            CLogger.info("Bot Started")
        });

        bot.on("interactionCreate", (interaction: Interaction) => {
            bot.executeInteraction(interaction);
        });

        bot.on("messageCreate", (message: Message) => {
            bot.executeCommand(message);
        });

        return bot;
    }

}

new Core()