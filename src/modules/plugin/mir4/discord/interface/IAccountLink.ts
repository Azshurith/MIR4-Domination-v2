import { ModalSubmitInteraction } from "discord.js"
import { DefaultRequest } from "../../../../core/interface/requests/IDefaultRequest"

/**
 * Represents a request for the account link
 * @version 1.0.0
 * @since 04/23/23
 * @property {AccountLinkParams} params - The parameters of the request
 */
export interface AccountLinkRequest extends DefaultRequest {
    params: AccountLinkParams
}

/**
 * Represents the params for the account link.
 * @version 1.0.0
 * @since 04/23/23
 * @property {string} [characterName] - The character name.
 * @property {string} [serverName] - The server name.
 * @property {ModalSubmitInteraction} [interaction] - The modal interaction.
 */
export interface AccountLinkParams {
    characterName: string
    serverName: string
    interaction: ModalSubmitInteraction
}
