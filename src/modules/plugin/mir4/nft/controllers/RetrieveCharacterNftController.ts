
import { Client } from "discordx";
import { AttachmentBuilder, EmbedBuilder, Role } from "discord.js";
import { NFTListRequest, NFTListResponse, List, CharacterSummaryResponse } from "../interface/IRetrieveCharacterNft";
import { APIController } from "../../../../core/interface/controllers/APIController.js";
import HNFTData from "../helpers/HNFTData.js";
import HDiscordBot from "../../../../core/helpers/HDiscordBot.js";
import HDiscordConfig from "../../../../core/helpers/HDiscordConfig.js";
import CLogger from "../../../../core/interface/utilities/logger/controllers/CLogger.js";
import axios, { AxiosResponse } from "axios";
import queryString from 'query-string';
import * as path from 'path';
import * as fs from 'fs';
import canvas from "canvas";

/**
 * A class representing the MIR4 NFT retrieve controller.
 *
 * @version 1.0.0
 * @since 04/09/23
 * @author
 *  - Devitrax
 */
export default class RetrieveCharacterNftController implements APIController {

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
     * Retrieves all NFTs from all pages.
     *
     * @param {NFTListRequest} request - The request object for fetching NFTs.
     * @returns {Promise<void>} A promise that resolves when the NFTs are retrieved.
     */
    async fetch(request: NFTListRequest): Promise<void> {
        try {
            const nftListUrl: string = HDiscordConfig.loadEnv(`discord.server.channel.information.thread.nft.url.list`)

            const listUrl: string = `${nftListUrl}?${queryString.stringify(request)}`;
            const listResponse: AxiosResponse<NFTListResponse, any> = await axios.get<NFTListResponse>(listUrl);

            if (!listResponse.data.data.totalCount) {
                CLogger.error(`Server is currently in maintenance.`);
                return;
            }
            const totalPages: number = Math.ceil(listResponse.data.data.totalCount / 20);

            const filePath: string = `${process.cwd()}/src/modules/plugin/mir4/nft/resources/data/users/nfts-${request.languageCode}.json`;
            const directoryPath: string = path.dirname(filePath);

            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
            }

            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '[]');
            }

            const file: string = fs.readFileSync(filePath, 'utf-8')
            const oldNft: List[] = JSON.parse(file)
            let newNft: List[] = [];

            for (let i = 1; i <= totalPages; i++) {
                CLogger.info(`Retrieving MIR4 NFT Characters: ${i} of ${totalPages}.`)

                request.page = i;
                newNft = newNft.concat(
                    await this.fetchNft(request)
                )
            }

            const removedNft: List[] = oldNft.filter((nft: List) => !newNft.some((newNft: List) => newNft.transportID === nft.transportID))
            const addedNft: List[] = newNft.filter((newNft: List) => !oldNft.some((nft: List) => newNft.transportID === nft.transportID))

            if (removedNft.length > 0) {
                CLogger.info(`Removing ${removedNft.length} NFT items from (${filePath}).`)
                removedNft.forEach((nft: List) => {
                    const index: number = oldNft.findIndex((item: List) => item.transportID === nft.transportID)
                    oldNft.splice(index, 1)
                    this.notify(nft, request)
                });
            }

            if (addedNft.length > 0) {
                CLogger.info(`Adding ${addedNft.length} NFT items to (${filePath}).`)
                addedNft.forEach((nft: List) => {
                    oldNft.push(nft)
                    this.notify(nft, request)
                });
            }

            if (removedNft.length > 0 || addedNft.length > 0) {
                CLogger.info(`Updating nft list (${filePath}).`);
                fs.writeFileSync(filePath, JSON.stringify(oldNft))
            }

        } catch (error) {
            CLogger.error(`API Error > NFT List Request: (${error})`);
        }
    }

    /**
     * Fetches the NFT data and corresponding spirit data for the given request.
     * 
     * @param {NFTListRequest} request - The NFTListRequest object containing the request parameters. 
     * @returns {Promise<List[]>} - Returns a promise that resolves with void.
     */
    async fetchNft(request: NFTListRequest): Promise<List[]> {

        const listNfts: List[] = [];

        try {
            const nftListUrl: string = HDiscordConfig.loadEnv(`discord.server.channel.information.thread.nft.url.list`)

            const listUrl: string = `${nftListUrl}?${queryString.stringify(request)}`;
            const listResponse: AxiosResponse<NFTListResponse, any> = await axios.get<NFTListResponse>(listUrl)

            await Promise.all(listResponse.data.data.lists.map(async (nft: List) => {
                // CLogger.info(`Retrieving MIR4 NFT Data: ${nft.characterName}`);
                listNfts.push(nft)

                // await this.fetchSpirit({
                //     transportID: nft.transportID,
                //     languageCode: request.languageCode
                // }, nft);

                // await this.fetchSkills({
                //     transportID: nft.transportID,
                //     class: nft.class,
                //     languageCode: request.languageCode
                // }, nft);

            }));
        } catch (error) {
            CLogger.error(`API Error > NFT List Request: (${error})`);
        }

        return listNfts;
    }

    /**
     * Sends a notification message to the specified text channel containing the details of the updated NFT list.
     * 
     * @param {List} nft - The NFT list to be notified about.
     * @param {NFTListRequest} request - The request object for fetching NFTs.
     * @returns {void}
     */
    async notify(nft: List, request: NFTListRequest): Promise<void> {
        try {
            const serverName: string = HDiscordConfig.loadEnv(`discord.server.name`)
            const forumName: string = HDiscordConfig.loadEnv(`discord.server.channel.information`)
            const threadName: string = HDiscordConfig.loadEnv(`discord.server.channel.information.thread.nft`)
            const threadContent: string = HDiscordConfig.loadEnv(`discord.server.channel.information.thread.nft.content`)
            const threadRole: string = HDiscordConfig.loadEnv(`discord.server.roles.nft.name`)
            const profileListUrl: string = HDiscordConfig.loadEnv(`discord.server.channel.information.thread.nft.url.profile`)
            const summaryListUrl: string = HDiscordConfig.loadEnv(`discord.server.channel.information.thread.nft.url.summary`)

            const thread = await HDiscordBot.getSpecificServerForumThreadByName(this._client, serverName, forumName, threadName, threadContent)
            if (!thread) {
                CLogger.error(`Thread does not exist.`);
                return;
            }

            const role: Role | null = await HDiscordBot.findRole(thread.guild, threadRole)
            if (!role) {
                CLogger.error(`Role does not exist.`);
                return;
            }

            const summaryRequest: any = {
                seq: nft.seq,
                languageCode: request.languageCode
            }
            const summaryUrl: string = `${summaryListUrl}?${queryString.stringify(summaryRequest)}`;
            const summaryResponse: AxiosResponse<CharacterSummaryResponse, any> = await axios.get<CharacterSummaryResponse>(summaryUrl);
            const characterSummary: CharacterSummaryResponse = summaryResponse.data

            const transactionType: any[] = HNFTData.getTransactionType(characterSummary.data.tradeType)

            const canvas: canvas.Canvas = await HNFTData.getCharacterCanva(characterSummary);
            const embed: EmbedBuilder = new EmbedBuilder()
                .setTitle(`[${transactionType[0]}] NFT List is updated`)
                .setDescription(`**From your story, to our legacy.**\n ${characterSummary.data.character.name} is a Level ${characterSummary.data.character.level} ${HNFTData.getClassNameById(characterSummary.data.character.class)} from the ${characterSummary.data.character.worldName} Server.`)
                .setColor(transactionType[1])
                .setImage('attachment://profile-image.png')
                .setURL(`${profileListUrl}${nft.seq}`)
                .setFooter({
                    text: `Sealed On: ${new Date(characterSummary.data.sealedTS * 1000)}`,
                    iconURL: "https://coinalpha.app/images/coin/1_20211022025215.png",
                })
                .addFields({
                    name: `Name`,
                    value: "```" + characterSummary.data.character.name + "```",
                    inline: true
                }, {
                    name: `Level`,
                    value: "```" + characterSummary.data.character.level + "```",
                    inline: true
                }, {
                    name: `Class`,
                    value: "```" + HNFTData.getClassNameById(characterSummary.data.character.class) + "```",
                    inline: true
                }, {
                    name: `Power Score`,
                    value: "```" + Number(characterSummary.data.character.powerScore).toLocaleString() + "```",
                    inline: true
                }, {
                    name: `Mirage Score`,
                    value: "```" + nft.MirageScore.toLocaleString() + "```",
                    inline: true
                }, {
                    name: `Price`,
                    value: "```" + characterSummary.data.price.toLocaleString() + " " + characterSummary.data.blockChain + "```",
                    inline: true
                })

            thread.send({
                content: HDiscordBot.tagRole(role.id),
                embeds: [
                    embed
                ],
                files: [
                    new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' })
                ]
            })
        } catch (error) {
            CLogger.error(`API Error > Unable to send embed: (${error})`);
        }
    }

}
