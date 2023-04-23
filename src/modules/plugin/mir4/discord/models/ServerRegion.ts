import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4Server } from "./Server.js"
import { Mir4Region } from "./Region.js"

/**
 * A Region representing the MIR4 ServerRegion model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`mir4_servers_regions`)
export class Mir4ServerRegion extends BaseEntity {

    /**
     * The unique identifier of the ServerRegion
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `ServerRegion Identity`, type: 'bigint' })
    id!: number

    /**
     * Many-to-One relationship between Mir4Server and Mir4ServerRegion entities.
     * 
     * @type {Mir4Server}
    */
    @ManyToOne((type) => Mir4Server, (Mir4Server: Mir4Server) => Mir4Server.server_regions)
    @JoinColumn({ name: "server_id", referencedColumnName: "id", foreignKeyConstraintName: "serverregion_server" })
    server!: Relation<Mir4Server>

    /**
     * Many-to-One relationship between Mir4Server and Mir4ServerRegion entities.
     * 
     * @type {Mir4Server}
     */
    @ManyToOne((type) => Mir4Region, (Mir4Region: Mir4Region) => Mir4Region.server_regions)
    @JoinColumn({ name: "region_id", referencedColumnName: "id", foreignKeyConstraintName: "serverregion_region" })
    region!: Relation<Mir4Region>

    /**
     * The Server id of the ServerRegion
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `ServerRegion Server ID`, type: 'bigint' })
    server_id!: number

    /**
     * The Region id of the ServerRegion
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `ServerRegion Region ID`, type: 'bigint' })
    region_id!: number

    /**
     * The timestamp when the ServerRegion was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `ServerRegion Created At` })
    created_at!: Date

    /**
     * The timestamp when the ServerRegion was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `ServerRegion Updated At` })
    updated_at!: Date

}