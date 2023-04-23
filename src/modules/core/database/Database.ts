import { DataSource } from "typeorm";
import HDiscordConfig from "../helpers/HDiscordConfig.js";

/**
 * A Class representing the database config
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
export default class Database {

	/**
	 * The database configuration
	 * 
	 * @type {DataSource}
	 */
	private readonly database: DataSource

	/**
	 * Creates a new Database instance
	 * 
	 * @constructor
	 */
	constructor() {
		    /**
			 * The charset for the connection. This is called "collation" in the SQL-level of MySQL (like utf8_general_ci).
			 * If a SQL-level charset is specified (like utf8mb4) then the default collation for that charset is used.
			 * Default: 'UTF8_GENERAL_CI'
     		*/
			// readonly charset?: string;
		this.database = new DataSource({
			type: `mariadb`,
			timezone: `Z`,
			charset: "utf8mb4_unicode_ci",
			name: HDiscordConfig.loadEnv(`discord.database.name`),
			entities: [
				`${process.cwd()}/src/modules/**/models/*.{ts,js}`
			],
			entityPrefix: ``,
			synchronize: true,
			relationLoadStrategy: `query`,
			cache: {
				duration: 30000
			},
			host: HDiscordConfig.loadEnv(`discord.database.host`),
			port: Number(HDiscordConfig.loadEnv(`discord.database.port`)),
			username: HDiscordConfig.loadEnv(`discord.database.username`),
			password: HDiscordConfig.loadEnv(`discord.database.password`),
			database: HDiscordConfig.loadEnv(`discord.database.name`)
		})
	}

	public async init(): Promise<void> {
		await this.database.initialize()
	}

}