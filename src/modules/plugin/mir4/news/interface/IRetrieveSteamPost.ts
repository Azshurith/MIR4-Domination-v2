import { DefaultRequest } from "../../../../core/interface/requests/IDefaultRequest";

/**
 * Represents the interface for the Steam post
 * 
 * @version 1.0.0
 * @since 04/09/23
 * @author
 *  - Devitrax
 */

/**
 * An interface representing a Steam post request.
 * 
 * @property {string} appId - The app ID of the post.
 * @property {string} token - The authentication token for the request.
 */
export interface SteamPostRequest extends DefaultRequest {
    appId: string
    token: string
}

/**
 * An interface representing a Steam post response.
 * 
 * @property {string} gid - The unique identifier for the post.
 * @property {string} title - The title of the post.
 * @property {string} url - The URL of the post.
 * @property {boolean} is_external_url - Whether the URL is external to Steam.
 * @property {string} author - The author of the post.
 * @property {string} contents - The contents of the post.
 * @property {string} feedlabel - The label of the feed the post belongs to.
 * @property {number} date - The date of the post, in Unix timestamp format.
 * @property {string} feedname - The name of the feed the post belongs to.
 * @property {number} feed_type - The type of the feed the post belongs to.
 * @property {number} appid - The app ID of the post.
 */
export interface SteamPostResponse {
    gid: string;
    title: string;
    url: string;
    is_external_url: boolean;
    author: string;
    contents: string;
    feedlabel: string;
    date: number;
    feedname: string;
    feed_type: number;
    appid: number;
}

/**
 * An enum representing the available feed names for a Steam post.
 * 
 * @enum {string}
 */
export enum Feedname {
    SteamCommunityAnnouncements = "steam_community_announcements",
}
