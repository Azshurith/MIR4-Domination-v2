import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4CharacterClan } from "./CharacterClan.js"
import { Mir4ClanServer } from "./ClanServer.js"

/**
 * A class representing the MIR4 Clan model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`mir4_clans`, { engine: 'InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin' })
export class Mir4Clan extends BaseEntity {

    /**
     * The unique identifier of the Clan data
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `Clan Identity`, type: 'bigint' })
    id!: number

    /**
     * One-to-Many relationship between Mir4Character and Mir4CharacterClan entities.
     * 
     * @type {Mir4CharacterClan[]}
     */
    @OneToMany((type) => Mir4CharacterClan, (Mir4CharacterClan: Mir4CharacterClan) => Mir4CharacterClan.clan)
    character_clans!: Relation<Mir4CharacterClan[]>

    /**
     * One-to-Many relationship between Mir4Character and Mir4ClanServer entities.
     * 
     * @type {Mir4ClanServer[]}
     */
    @OneToMany((type) => Mir4ClanServer, (Mir4ClanServer: Mir4ClanServer) => Mir4ClanServer.clan)
    clan_servers!: Relation<Mir4ClanServer[]>

    /**
     * The name of the Clan
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: false, comment: `Clan Name` })
    name!: string

    /**
     * The timestamp when the Clan was last checked
     * 
     * @type {Date}
     */
    @Column({ nullable: false, unique: false, comment: `Clan Checked At` })
    checked_at!: Date

    /**
     * The timestamp when the Clan was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `Clan Created At` })
    created_at!: Date

    /**
     * The timestamp when the Clan was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `Clan Updated At` })
    updated_at!: Date

}