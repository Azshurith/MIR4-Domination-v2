import { ModalSubmitInteraction } from "discord.js"
import { DefaultRequest } from "../../../../core/interface/requests/IDefaultRequest"

/**
 * Represents a request for the account ticket
 * @version 1.0.0
 * @since 04/23/23
 * @property {AccountTicketParams} params - The parameters of the request
 */
export interface AccountTicketRequest extends DefaultRequest {
    params: AccountTicketParams
}

/**
 * Represents the params for the account ticket.
 * @version 1.0.0
 * @since 04/23/23
 * @property {string} [characterName] - The character name.
 * @property {string} [serverName] - The server name.
 * @property {string} [description] - The ticket's description
 * @property {ModalSubmitInteraction} [interaction] - The modal interaction.
 */
export interface AccountTicketParams {
    characterName: string
    serverName: string
    description: string
    interaction: ModalSubmitInteraction
}
