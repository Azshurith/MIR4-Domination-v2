import { ModalSubmitInteraction } from "discord.js"
import { DefaultRequest } from "../../../../core/interface/requests/IDefaultRequest"

/**
 * Represents a request for the account unlink
 * @version 1.0.0
 * @since 04/23/23
 * @property {AccountUnlinkRequest} params - The parameters of the request
 */
export interface AccountUnlinkRequest extends DefaultRequest {
    params: AccountUnlinkParams
}

/**
 * Represents the params for the account unlink.
 * @version 1.0.0
 * @since 04/23/23
 * @property {string} [text] - The modal textfield value.
 * @property {ModalSubmitInteraction} [interaction] - The modal interaction.
 */
export interface AccountUnlinkParams {
    text: string
    interaction: ModalSubmitInteraction
}
