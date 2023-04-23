/**
 * Represents the canvas interfaces
 * 
 * @version 1.0.0
 * @since 04/13/23
 * @author
 *  - Devitrax
 */
export interface IDatabase {
    name: string
    username: string
    password: string
    host: string
    port: number
    max: number
    isLog: boolean
    path: string[]
}