import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4ServerRegion } from "./ServerRegion.js"
import { Mir4CharacterServer } from "./CharacterServer.js"
import { Mir4ClanServer } from "./ClanServer.js"

/**
 * A class representing the MIR4 Server model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`mir4_servers`)
export class Mir4Server extends BaseEntity {

    /**
     * The unique identifier of the Server data
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `Server Identity`, type: 'bigint' })
    id!: number

    /**
     * One-to-Many relationship between Mir4Server and Mir4ServerRegion entities.
     * 
     * @type {Mir4ServerRegion[]}
     */
    @OneToMany((type) => Mir4ServerRegion, (Mir4ServerRegion: Mir4ServerRegion) => Mir4ServerRegion.server)
    server_regions!: Relation<Mir4ServerRegion[]>

    /**
     * One-to-Many relationship between Mir4Server and Mir4CharacterServer entities.
     * 
     * @type {Mir4CharacterServer[]}
     */
    @OneToMany((type) => Mir4CharacterServer, (Mir4CharacterServer: Mir4CharacterServer) => Mir4CharacterServer.character)
    character_servers!: Relation<Mir4CharacterServer[]>

    /**
     * One-to-Many relationship between Mir4Server and Mir4ClanServer entities.
     * 
     * @type {Mir4ClanServer[]}
     */
    @OneToMany((type) => Mir4ClanServer, (Mir4ClanServer: Mir4ClanServer) => Mir4ClanServer.clan)
    clan_servers!: Relation<Mir4ClanServer[]>

    /**
     * The name of the Server
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: true, comment: `Server Name` })
    name!: string

    /**
     * The timestamp when the Server was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `Server Created At` })
    created_at!: Date

    /**
     * The timestamp when the Server was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `Server Updated At` })
    updated_at!: Date

}