import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4ServerRegion } from "./ServerRegion.js"

/**
 * A class representing the MIR4 Region model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`mir4_regions`)
export class Mir4Region extends BaseEntity {

    /**
     * The unique identifier of the Region data
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `Region Identity`, type: 'bigint' })
    id!: number

    /**
     * One-to-Many relationship between Mir4Server and Mir4ServerRegion entities.
     * 
     * @type {Mir4ServerRegion[]}
     */
    @OneToMany((type) => Mir4ServerRegion, (Mir4ServerRegion: Mir4ServerRegion) => Mir4ServerRegion.region)
    server_regions!: Relation<Mir4ServerRegion[]>

    /**
     * The name of the Region
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: true, comment: `Region Name` })
    name!: string

    /**
     * The timestamp when the Region was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `Region Created At` })
    created_at!: Date

    /**
     * The timestamp when the Region was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `Region Updated At` })
    updated_at!: Date

}