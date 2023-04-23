import { Sequelize } from 'sequelize-typescript'
import { IDatabase } from './interface/IDatabase';
import { Client } from 'discordx';
import CLogger from '../interface/utilities/logger/controllers/CLogger.js';
import Mir4Character from '../../plugin/mir4/discord/models/Character.js';
import Mir4Server from '../../plugin/mir4/discord/models/Server.js';
import Mir4Class from '../../plugin/mir4/discord/models/Class.js';
import Mir4Clan from '../../plugin/mir4/discord/models/Clan.js';
import Mir4Region from '../../plugin/mir4/discord/models/Region.js';
import Mir4CharacterClan from '../../plugin/mir4/discord/models/CharacterClan.js';
import Mir4CharacterClass from '../../plugin/mir4/discord/models/CharacterClass.js';
import Mir4CharacterServer from '../../plugin/mir4/discord/models/CharacterServer.js';
import DiscordConfig from '../models/Config.js';

export default class Database {

    private readonly _sequelize: Sequelize

    constructor(bot: Client, database: IDatabase) {
        this._sequelize = new Sequelize(database.name, database.username, database.password, {
            dialect: 'mariadb',
            host: database.host,
            port: database.port,
            logging: database.isLog,
            dialectOptions: {
                connectTimeout: 10000,
            },
            pool: {
                max: database.max,
                min: 0,
                acquire: 30000,
                idle: 300000
            },
            models: [
                DiscordConfig,
                Mir4Character,
                Mir4CharacterClan,
                Mir4CharacterClass,
                Mir4CharacterServer,
                Mir4Server,
                Mir4Class,
                Mir4Clan,
                Mir4Region
            ],
            define: {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }
        })

        this._sequelize
            .authenticate()
            .then(() => {
                CLogger.info("[DATABASE] Connected")

                this._sequelize
                    .sync()
                    .then(async () => {
                        CLogger.info("[DATABASE] Sync")

                        // Let's start the bot
                        if (!process.env.BOT_DOMINATION) {
                            throw Error("Could not find BOT_DOMINATION in your environment");
                        }

                        // Log in with your bot token
                        await bot.login(process.env.BOT_DOMINATION);

                    })
                    .catch(e => console.error('[database] error 1', e))
            })
            .catch(e => console.error('[database] error 2', e))
    }

    public get sequelize(): Sequelize {
        return this._sequelize;
    }

}