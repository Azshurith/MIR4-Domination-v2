import { Client } from "discord.js";
import { APIController } from "../../../../core/interface/controllers/APIController";
import { IContinent, IServer, LeaderBoardRequest } from "../interface/ILeaderBoard";
import { InsertResult, Not } from "typeorm";
import { Mir4Character } from "../models/Character.js";
import { Mir4CharacterClan } from "../models/CharacterClan.js";
import { Mir4CharacterClass } from "../models/CharacterClass.js";
import { Mir4CharacterServer } from "../models/CharacterServer.js";
import { Mir4Class } from "../models/Class.js";
import { Mir4Clan } from "../models/Clan.js";
import { Mir4ClanServer } from "../models/ClanServer.js";
import { Mir4Region } from "../models/Region.js";
import { Mir4Server } from "../models/Server.js";
import { Mir4ServerRegion } from "../models/ServerRegion.js";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import queryString from "query-string";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import HDiscordBot from "../../../../core/helpers/HDiscordBot.js";

/**
 * Controller class for retrieving power score ranking information for MIR4 NFTs.
 *
 * @version 1.0.0
 * @since 04/22/23
 * @author
 *  - Devitrax
 */
export default class RetrievePowerScoreRankingController implements APIController {

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
     * Fetches the continents, classes and servers for a given leader board request.
     * 
     * @param {LeaderBoardRequest} request - The leader board request to be used to fetch the data.
     * @returns {Promise<void>} - A promise that resolves when the data has been fetched.
     */
    async fetch(request: LeaderBoardRequest): Promise<void> {
        try {
            const continents: IContinent[] = await this.fetchContinents(`${request.url}?${queryString.stringify(request.params)}`)
            await this.fetchClasses()
            await this.fetchServers(request, continents);
        } catch (error) {
            CLogger.error(`Retrieve Power Score Fetch Exception: ${error}`);
        }
    }

    /**
     * Fetches classes and saves them to the Mir4Class table in the database.
     * 
     * @returns {Promise<void>}
     */
    async fetchClasses(): Promise<void> {
        const classes: any[] = [{
            id: 1,
            name: "Warrior"
        }, {
            id: 2,
            name: "Sorcerer"
        }, {
            id: 3,
            name: "Taoist"
        }, {
            id: 4,
            name: "Arbalist"
        }, {
            id: 5,
            name: "Lancer"
        }, {
            id: 6,
            name: "Darkist"
        }]

        for (const clazz of classes) {
            const config: InsertResult = await Mir4Class.upsert(
                [{ id: clazz.id, name: clazz.name }],
                ['name']
            )
        }
    }

    /**
     * Fetches leaderboards of all servers in the specified continents for the provided request.
     * 
     * @param {LeaderBoardRequest} request - The request object containing the data required to fetch the leaderboards.
     * @param {IContinent[]} continents - An array of continent objects containing the server information.
     * @returns {Promise<void>} - A promise that resolves when all the servers' leaderboards are fetched.
     */
    async fetchServers(request: LeaderBoardRequest, continents: IContinent[]): Promise<void> {
        CLogger.info(`Start Fetching Servers`);
        try {
            const fetchPromises = [];
            for (const continent of continents) {
                CLogger.info(`Fetching Continent: ${continent.name}`);
                for (const server of continent.servers) {
                    CLogger.info(`Fetching Server: ${server.name}`);
                    fetchPromises.push(this.fetchServer(request, continent, server)); //REMOVE AWAIT
                }
            }

            await Promise.all(fetchPromises);
        } catch (error) {
            CLogger.error(`Fetch Server Promise All Exception: ${error}`);
        } finally {
            CLogger.error(`2: Setting mir4.server.cron.ranking to false`);
            await HDiscordConfig.loadDbConfig("mir4.server.cron.ranking", "false")
        }
        CLogger.info(`End Fetching Servers`);
    }

    /**
     * Fetches a server's leaderboard data and pages through until all data has been retrieved.
     * 
     * @param {LeaderBoardRequest} request - The request object containing the required parameters for fetching the leaderboard data.
     * @param {IContinent} continent - The continent on which the server is located.
     * @param {IServer} server - The server to be fetched
     * @returns {Promise<void>} A promise that resolves when the leaderboard data has been fetched and updated in the database.
     */
    async fetchServer(request: LeaderBoardRequest, continent: IContinent, server: IServer): Promise<void> {
        try {
            const serverPage = `${continent.name}.${server.name}.page`.toLowerCase()
            const serverDate = `${continent.name}.${server.name}.date`.toLowerCase()
            let pageNo = Number(await HDiscordConfig.loadDbConfig(serverPage))
            const lastUpdate = await HDiscordConfig.loadDbConfig(serverDate)
            const todayDate = HDiscordBot.todayDate().toString();

            if (lastUpdate == todayDate && pageNo <= 1) {
                CLogger.info(`Skipping Server [Continent: ${continent.name}] [Server: ${server.name}] [Last Update: ${lastUpdate}]  [Today Date: ${todayDate}]`);
                return;
            }

            if (lastUpdate != todayDate && pageNo <= 1) {
                pageNo = Number(await HDiscordConfig.loadDbConfig(serverPage, "200"))
            }

            await HDiscordConfig.loadDbConfig(serverDate, todayDate)

            while (pageNo >= 1) {
                pageNo--
                CLogger.info(`Start Fetching Server [Continent: ${continent.name}] [Server: ${server.name}] [Page: ${pageNo}]`);
                await this.fetchPlayers({
                    url: request.url,
                    params: {
                        ranktype: request.params.ranktype,
                        worldgroupid: continent.region,
                        worldid: server.id,
                        liststyle: "ol",
                        page: pageNo
                    }
                }, server)

                await HDiscordConfig.loadDbConfig(serverPage, lastUpdate != todayDate ? "200" : pageNo.toString())
                CLogger.info(`End Fetching Server [Continent: ${continent.name}] [Server: ${server.name}] [Page: ${pageNo}]`);
            }
        } catch (error) {
            CLogger.error(`Fetch Server Exception: ${error}`);
        }
    }

    /**
     * Fetches the servers data for each continent, and fetches players' data for each server.
     * 
     * @param request The leaderboard request object containing data about the leaderboard.
     * @param {IServer} server - The server to be fetched
     * @returns A boolean value indicating if the fetch operation was successful or not.
     */
    async fetchPlayers(request: LeaderBoardRequest, server: IServer): Promise<boolean> {
        try {
            const url: string = `${request.url}?${queryString.stringify(request.params)}`;
            const response: AxiosResponse<any> = await axios.get<any>(url);
            const $: cheerio.CheerioAPI = cheerio.load(response.data, { xmlMode: true });

            if (!response.data || response.data.trim() === '') {
                return false;
            }

            for (const element of $('tr.list_article')) {
                try {
                    const rank = Number($(element).find('.num').text().trim());
                    const userName = $(element).find('.user_name').text().trim();
                    const clanName = $(element).find('td:nth-of-type(3) span').text().trim();
                    const powerScore = parseFloat($(element).find('.text_right span').text().trim().replaceAll(',', ''));
                    const clazz = Number($(element).find('.user_icon').attr('style')!.match(/background-image: url\((.*?)\);/)![1]!.match(/char_(\d+)\.png/)![1]);

                    let world: Mir4Server | null = await Mir4Server.findOne({ where: { name: server.name } });
                    if (!world) {
                        CLogger.error(`Unable to find Server [${request.params.worldid}], skipping User [${userName}].`);
                        continue;
                    }

                    let character: Mir4Character | null = await Mir4Character.findOne({ where: { username: userName } });
                    if (!character) {
                        character = await Mir4Character.create({ username: userName, powerscore: powerScore, checked_at: new Date() }).save();
                    } else {
                        await Mir4Character.update({ id: character.id }, { powerscore: powerScore, checked_at: new Date() });
                    }

                    let clan: Mir4Clan | null = await Mir4Clan.findOne({ where: { name: clanName } });
                    if (!clan) {
                        clan = await Mir4Clan.create({ name: clanName, checked_at: new Date() }).save();
                    } else {
                        await Mir4Clan.update({ id: clan.id }, { name: clanName, checked_at: new Date() });
                    }

                    let characterClan: Mir4CharacterClan | null = await Mir4CharacterClan.findOne({ where: { character_id: character.id, clan_id: clan.id, is_leave: false } });
                    if (!characterClan) {
                        characterClan = await Mir4CharacterClan.create({ character_id: character.id, clan_id: clan.id, is_leave: false, checked_at: new Date() }).save();
                    } else {
                        await Mir4CharacterClan.update({ id: characterClan.id, is_leave: false }, { checked_at: new Date() });
                        await Mir4CharacterClan.update({ id: Not(characterClan.id), character_id: character.id, is_leave: false }, { is_leave: true, checked_at: new Date() });
                    }

                    let clanServer: Mir4ClanServer | null = await Mir4ClanServer.findOne({ where: { clan_id: clan.id, server_id: world.id, is_disband: false } });
                    if (!clanServer) {
                        clanServer = await Mir4ClanServer.create({ clan_id: clan.id, server_id: world.id, is_disband: false, checked_at: new Date() }).save();
                    } else {
                        await Mir4ClanServer.update({ id: clanServer.id, is_disband: false }, { checked_at: new Date() });
                    }

                    let characterClass: Mir4CharacterClass | null = await Mir4CharacterClass.findOne({ where: { character_id: character.id, class_id: clazz } });
                    if (!characterClass) {
                        characterClass = await Mir4CharacterClass.create({ character_id: character.id, class_id: clazz, checked_at: new Date() }).save();
                    }

                    let characterServer: Mir4CharacterServer | null = await Mir4CharacterServer.findOne({ where: { character_id: character.id, server_id: world.id, is_leave: false } });
                    if (!characterServer) {
                        characterServer = await Mir4CharacterServer.create({ character_id: character.id, server_id: world.id, is_leave: false, checked_at: new Date() }).save();
                    } else {
                        await Mir4CharacterServer.update({ id: characterServer.id, is_leave: false }, { checked_at: new Date() });
                        await Mir4CharacterServer.update({ id: Not(characterServer.id), character_id: character.id, is_leave: false }, { is_leave: true, checked_at: new Date() });
                    }
                } catch (error) {
                    console.log(error);
                    CLogger.error(`Failed to process ${url} : ${error}`);
                }
            }
        } catch (error) {
            CLogger.error(`Fetch Players Exception: ${error}`);
        }

        return true;
    }

    /**
     * Fetches the continents data from the given URL and extracts the servers information from it.
     * 
     * @param url The URL to fetch the data from.
     * @returns A promise that resolves with an array of IContinent objects representing the continents and their servers.
     */
    async fetchContinents(url: string): Promise<IContinent[]> {
        const response: AxiosResponse<any> = await axios.get<any>(url);
        const $: cheerio.CheerioAPI = cheerio.load(response.data);
        const continents: IContinent[] = [];

        try {
            $('ul li').each((i: number, li: any) => {
                const a: any = $(li).find('a');
                const match: RegExpMatchArray | null = a.attr('href')?.match(/set_world\('(\d+)',\s*'(.+)',\s*'(\d+)',\s*'(.+)'\)/);
                if (!match) return;

                const [, region, regionName, serverId, serverName]: string[] = match;
                if (!region || !regionName || !serverId || !serverName) return;

                const continent: IContinent | undefined = continents.find((c: IContinent) => c.region === parseInt(region));
                if (continent) {
                    continent.servers.push({
                        id: parseInt(serverId),
                        name: serverName.trim(),
                    });
                } else {
                    continents.push({
                        region: parseInt(region),
                        name: regionName.trim(),
                        servers: [
                            {
                                id: parseInt(serverId),
                                name: serverName.trim(),
                            },
                        ],
                    });
                }
            });

            let clan: Mir4Clan | null = await Mir4Clan.findOne({ where: { name: "--" } });
            if (!clan) {
                clan = await Mir4Clan.create({ name: "--", checked_at: new Date() }).save();
            }
            for (const continent of continents) {
                let region: Mir4Region | null = await Mir4Region.findOne({ where: { name: continent.name } });

                if (!region) {
                    region = await Mir4Region.create({ name: continent.name }).save();
                }

                for (const server of continent.servers) {
                    let world: Mir4Server | null = await Mir4Server.findOne({ where: { name: server.name } });

                    if (!world) {
                        world = await Mir4Server.create({ name: server.name }).save();
                    }

                    const worldregion: Mir4ServerRegion | null = await Mir4ServerRegion.findOne({
                        where: { server_id: world.id, region_id: region.id },
                    });

                    if (!worldregion) {
                        await Mir4ServerRegion.create({ server_id: world.id, region_id: region.id }).save();
                    }
                }
            }
        } catch (error) {
            CLogger.error(`Fetch Continents Exception: ${error}`);
        }

        return continents;
    }

}
