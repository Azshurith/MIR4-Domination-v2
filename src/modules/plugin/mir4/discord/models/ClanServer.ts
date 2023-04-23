import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4Clan } from "./Clan.js"
import { Mir4Server } from "./Server.js"

/**
 * A class representing the MIR4 ClanServer model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`mir4_clans_servers`)
export class Mir4ClanServer extends BaseEntity {

    /**
     * The unique identifier of the ClanServer
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `ClanServer Identity`, type: 'bigint' })
    id!: number

    /**
     * Many-to-One relationship between Mir4Clan and Mir4ClanServer entities.
     * 
     * @type {Mir4Clan}
     */
    @ManyToOne((type) => Mir4Clan, (Mir4Clan: Mir4Clan) => Mir4Clan.clan_servers)
    @JoinColumn({ name: "clan_id", referencedColumnName: "id", foreignKeyConstraintName: "clanServer_clan" })
    clan!: Relation<Mir4Clan>

    /**
     * Many-to-One relationship between Mir4Clan and Mir4ClanServer entities.
     * 
     * @type {Mir4Clan}
     */
    @ManyToOne((type) => Mir4Server, (Mir4Server: Mir4Server) => Mir4Server.clan_servers)
    @JoinColumn({ name: "server_id", referencedColumnName: "id", foreignKeyConstraintName: "clanServer_Server" })
    Server!: Relation<Mir4Server>

    /**
     * The clan id of the ClanServer
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `ClanServer Clan ID`, type: 'bigint' })
    clan_id!: number

    /**
     * The Server id of the ClanServer
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `ClanServer Server ID`, type: 'bigint' })
    server_id!: number

    /**
     * The Disband Flag of the ClanServer
     * 
     * @type {boolean}
     */
    @Column({ nullable: false, unsigned: true, comment: `ClanServer Disband Indicator`, type: 'boolean' })
    is_disband!: boolean

    /**
     * The timestamp when the ClanServer was last checked
     * 
     * @type {Date}
     */
    @Column({ nullable: false, unique: false, comment: `ClanServer Checked At` })
    checked_at!: Date

    /**
     * The timestamp when the ClanServer was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `ClanServer Created At` })
    created_at!: Date

    /**
     * The timestamp when the ClanServer was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `ClanServer Updated At` })
    updated_at!: Date

}