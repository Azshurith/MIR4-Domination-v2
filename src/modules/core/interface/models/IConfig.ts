/**
 * Represents an interface for the config model
 * @version 1.0.0
 * @since 04/21/23
 * @property {number} id - The config id
 * @property {string} [path] - The config path
 * @property {string} [value] - The config value
 */
export interface IConfig {
    id: number
    path: string
    value: string
}