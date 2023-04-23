import { DefaultRequest } from "../../../../core/interface/requests/IDefaultRequest"

/**
 * Represents a request for the leader board.
 * @version 1.0.0
 * @since 04/21/23
 * @property {LeaderBoardParams} params - The parameters of the request
 */
export interface LeaderBoardRequest extends DefaultRequest {
    params: LeaderBoardParams
}

/**
 * Represents the params for the leader board.
 * @version 1.0.0
 * @since 04/21/23
 * @property {number} ranktype - The type of the rank.
 * @property {number} worldgroupid - The world group ID.
 * @property {number} worldid - The world ID.
 * @property {string} [classtype] - The class type.
 * @property {string} [searchname] - The name of the player to search.
 * @property {string} [liststyle] - The style of the list.
 * @property {number} [page] - The page number.
 */
export interface LeaderBoardParams {
    ranktype: number;
    worldgroupid: number;
    worldid: number;
    classtype?: string;
    searchname?: string;
    liststyle?: string;
    page?: number
}

/**
 * Represents a continent in the MIR4 game.
 * @version 1.0.0
 * @since 04/21/23
 * @property {number} region - The region ID of the continent.
 * @property {string} name - The name of the continent.
 * @property {IServer[]} servers - The list of servers in the continent.
 */
export interface IContinent {
    region: number
    name: string
    servers: IServer[]
}

/**
 * Represents a server in the MIR4 game.
 * @version 1.0.0
 * @since 04/21/23
 * @property {number} id - The ID of the server.
 * @property {string} name - The name of the server.
 */
export interface IServer {
    id: number
    name: string
}
