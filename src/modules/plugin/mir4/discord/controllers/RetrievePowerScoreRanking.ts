import { Client } from "discord.js";
import { APIController } from "../../../../core/interface/controllers/APIController";
import { IContinent, IData, IServer, LeaderBoardRequest } from "../interface/ILeaderBoard";
import { Sequelize } from "sequelize-typescript";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import pLimit from 'p-limit';
import queryString from "query-string";
import Mir4Region from "../models/Region.js";
import Mir4Server from "../models/Server.js";
import Mir4Class from "../models/Class.js";
import Mir4Clan from "../models/Clan.js";
import Mir4Character from "../models/Character.js";
import Mir4CharacterClan from "../models/CharacterClan.js";
import Mir4CharacterClass from "../models/CharacterClass.js";
import Mir4CharacterServer from "../models/CharacterServer.js";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";

/**
 * Controller class for retrieving power score ranking information for MIR4 NFTs.
 *
 * @version 1.0.0
 * @since 04/22/23
 * @author
 *  - Devitrax
 */
export default class RetrievePowerScoreRanking implements APIController {

    /**
     * @var {Client} client - The client object used to interact with the API.
     */
    private readonly _client: Client

    private _cache: IData = {
        clans: [],
        characters: []
    }

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
        const continents: IContinent[] = await this.fetchContinents(`${process.env.MIR4_FORUM_LEADERBOARD_URL}?${queryString.stringify(request)}`)
        await this.fetchClasses()
        await this.fetchServers(request, continents);
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
            const existingClazz = await Mir4Class.findByPk(clazz.id);
            if (existingClazz) {
                existingClazz.name = clazz.name;
                await existingClazz.save();
            } else {
                await Mir4Class.create(clazz);
            }
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
        const fetchPromises = [];
        for (const continent of continents) {
            CLogger.info(`Fetching Continent: ${continent.name}`);
            for (const server of continent.servers) {
                CLogger.info(`Fetching Server: ${server.name}`);
                fetchPromises.push(this.fetchServer(request, continent, server)); //REMOVE AWAIT
            }
        }
        await Promise.all(fetchPromises);
        CLogger.info(`End Fetching Servers`);
    }

    /**
     * Fetches a server's leaderboard data and pages through until all data has been retrieved.
     * 
     * @param {LeaderBoardRequest} request - The request object containing the required parameters for fetching the leaderboard data.
     * @param {IContinent} continent - The continent on which the server is located.
     * @param {IContinent} continent - The continent on which the server is located.
     * @returns {Promise<void>} A promise that resolves when the leaderboard data has been fetched and updated in the database.
     */
    async fetchServer(request: LeaderBoardRequest, continent: IContinent, server: IServer): Promise<void> {
        const limit = pLimit(5);
        let done = false;
        let page = 1;

        while (!done) {
            CLogger.info(`Fetching Server ${continent.name} - ${server.name} on Page: ${page}`);
            const fetchPromise = limit(() => this.fetchPlayers({
                ranktype: request.ranktype,
                worldgroupid: continent.region,
                worldid: server.id,
                liststyle: "ol",
                page: page
            }));
            const newData = await fetchPromise;
            if (!newData) {
                CLogger.info(`Finished Fetching Server: ${continent.name} - ${server.name}`);
                done = true;
            }
            page++;
        }
    }

    /**
     * Fetches the servers data for each continent, and fetches players' data for each server.
     * 
     * @param request The leaderboard request object containing data about the leaderboard.
     * @returns A boolean value indicating if the fetch operation was successful or not.
     */
    async fetchPlayers(request: LeaderBoardRequest): Promise<boolean> {
        const url: string = `${process.env.MIR4_FORUM_LEADERBOARD_URL}?${queryString.stringify(request)}`;
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
                
                const isPlayerProcessed = this._cache.characters.some(character => character.name === userName);
                if (isPlayerProcessed) {
                    continue;
                }

                this._cache.characters.push({
                    name: userName,
                    powerscore: powerScore
                })

                const updateOrCreate = async ([clanResult, characterResult, characterClanResult, characterClassResult, characterServerResult]: [[Mir4Clan, boolean], [Mir4Character, boolean], [Mir4CharacterClan, boolean], [Mir4CharacterClass, boolean], [Mir4CharacterServer, boolean]]): Promise<void> => {
                    return new Promise(async (resolve, reject) => {
                        const [clan, createdClan] = clanResult;
                        const [character, createdCharacter] = characterResult;
                        const [characterClan, createdCharacterClan] = characterClanResult;
                        const [characterClass, createdCharacterClass] = characterClassResult;
                        const [characterServer, createdCharacterServer] = characterServerResult;

                        if (!createdClan) {
                            await clan.update({
                                server_id: request.worldid,
                                checked_at: Sequelize.literal("CURRENT_TIMESTAMP")
                            })
                        }

                        if (!createdCharacter) {
                            await character.update({
                                powerscore: powerScore,
                                checked_at: Sequelize.literal("CURRENT_TIMESTAMP")
                            })
                        }

                        if (!createdCharacterClan) {
                            await characterClan.update({
                                checked_at: Sequelize.literal("CURRENT_TIMESTAMP")
                            })
                        }

                        if (!createdCharacterClass) {
                            await characterClass.update({
                                checked_at: Sequelize.literal("CURRENT_TIMESTAMP")
                            })
                        }

                        if (!createdCharacterServer) {
                            await characterServer.update({
                                checked_at: Sequelize.literal("CURRENT_TIMESTAMP")
                            })
                        }

                        resolve();
                    });
                }

                const [clan, createdClan] = await Mir4Clan.findCreateFind({
                    where: {
                        name: clanName
                    },
                    defaults: { server_id: request.worldid, checked_at: Sequelize.literal("CURRENT_TIMESTAMP") },
                });

                const [character, createdCharacter] = await Mir4Character.findCreateFind({
                    where: {
                        username: userName
                    },
                    defaults: { powerscore: powerScore, checked_at: Sequelize.literal("CURRENT_TIMESTAMP") },
                });

                const [characterClan, createdCharacterClan] = await Mir4CharacterClan.findCreateFind({
                    where: {
                        character_id: createdCharacter ? character.character_id : character.dataValues.character_id,
                        clan_id: createdClan ? clan.clan_id : clan.dataValues.clan_id
                    },
                    defaults: { checked_at: Sequelize.literal("CURRENT_TIMESTAMP") },
                });

                const [characterClass, createdCharacterClass] = await Mir4CharacterClass.findCreateFind({
                    where: {
                        character_id: createdCharacter ? character.character_id : character.dataValues.character_id,
                        class_id: clazz
                    },
                    defaults: { checked_at: Sequelize.literal("CURRENT_TIMESTAMP") },
                });

                const [characterServer, createdCharacterServer] = await Mir4CharacterServer.findCreateFind({
                    where: {
                        character_id: createdCharacter ? character.character_id : character.dataValues.character_id,
                        server_id: request.worldid
                    },
                    defaults: { checked_at: Sequelize.literal("CURRENT_TIMESTAMP") },
                });

                await updateOrCreate([[clan, createdClan], [character, createdCharacter], [characterClan, createdCharacterClan], [characterClass, createdCharacterClass], [characterServer, createdCharacterServer]]);
            } catch (error) {
                CLogger.error(`Failed to process ${url} : ${error}`);
            }
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

        for (const continent of continents) {
            const [region, created]: [Mir4Region, boolean] = await Mir4Region.findOrCreate({
                where: { region_id: continent.region },
                defaults: { name: continent.name },
            });

            const servers: any[] = continent.servers.map((s: IServer) => ({
                server_id: s.id,
                name: s.name,
                region_id: created ? region.region_id : region.dataValues.region_id,
            }));

            await Mir4Server.bulkCreate(servers, {
                updateOnDuplicate: ['name'],
            });
        }

        return continents;
    }

}
