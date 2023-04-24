import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4CharacterTicket } from "../../../mir4/discord/models/CharacterTicket.js"

/**
 * A class representing the Utility TIcket model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`utility_tickets`, { engine: 'InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' })
export class UtilityTicket extends BaseEntity {

    /**
     * The unique identifier of the UtilityTicket
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `Ticket ID` })
    id!: number

    /**
     * One-to-Many relationship between UtilityTicket and Mir4CharacterTicket entities.
     * 
     * @type {Mir4CharacterTicket[]}
     */
    @OneToMany((type) => Mir4CharacterTicket, (Mir4CharacterTicket: Mir4CharacterTicket) => Mir4CharacterTicket.ticket)
    character_tickets!: Relation<Mir4CharacterTicket[]>

    /**
     * The unique identifier of the Ticket Thread data
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: true, comment: `Ticket Thread Identity` })
    thread_id!: string

    /**
     * The description of the UtilityTicket
     * 
     * @type {string}
     */
    @Column({ nullable: false, comment: `Ticket Description` })
    description!: string

    /**
     * The timestamp when the UtilityTicket was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `Ticket Created At` })
    created_at!: Date

    /**
     * The timestamp when the UtilityTicket was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `Ticket Updated At` })
    updated_at!: Date

    /**
     * The timestamp when the UtilityTicket was deleted
     * 
     * @type {Date}
     */
    @DeleteDateColumn({ comment: `Ticket Deleted At` })
    deleted_at!: Date

}