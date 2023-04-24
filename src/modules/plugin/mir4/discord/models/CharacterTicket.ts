import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4Character } from "./Character.js"
import { UtilityTicket } from "../../../utilities/ticketing/models/Ticket.js"
import { DiscordUser } from "../../../../core/models/User.js"

/**
 * A ticket representing the MIR4 CharacterTicket model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`mir4_characters_tickets`)
export class Mir4CharacterTicket extends BaseEntity {

    /**
     * The unique identifier of the CharacterTicket
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `CharacterTicket Identity`, type: 'bigint' })
    id!: number

    /**
     * Many-to-One relationship between Mir4Character and Mir4CharacterTicket entities.
     * 
     * @type {Mir4Character}
    */
    @ManyToOne((type) => Mir4Character, (Mir4Character: Mir4Character) => Mir4Character.character_tickets)
    @JoinColumn({ name: "character_id", referencedColumnName: "id", foreignKeyConstraintName: "characterticket_character" })
    character!: Relation<Mir4Character>

    /**
     * Many-to-One relationship between UtilityTicket and Mir4CharacterTicket entities.
     * 
     * @type {UtilityTicket}
     */
    @ManyToOne((type) => UtilityTicket, (UtilityTicket: UtilityTicket) => UtilityTicket.character_tickets)
    @JoinColumn({ name: "ticket_id", referencedColumnName: "id", foreignKeyConstraintName: "characterticket_ticket" })
    ticket!: Relation<UtilityTicket>

    /**
     * Many-to-One relationship between DiscordUser and Mir4CharacterTicket entities.
     * 
     * @type {DiscordUser}
     */
    @ManyToOne((type) => DiscordUser, (DiscordUser: DiscordUser) => DiscordUser.character_tickets)
    @JoinColumn({ name: "discord_id", referencedColumnName: "id", foreignKeyConstraintName: "characterticket_discord" })
    discord!: Relation<DiscordUser>

    /**
     * The character id of the CharacterTicket
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterTicket Character ID`, type: 'bigint' })
    character_id!: number

    /**
     * The Ticket id of the CharacterTicket
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterTicket Ticket ID`, type: 'bigint' })
    ticket_id!: number

    /**
     * The Discord id of the CharacterTicket
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterTicket Discord ID`, type: 'bigint' })
    discord_id!: number

    /**
     * The timestamp when the CharacterTicket was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `CharacterTicket Created At` })
    created_at!: Date

    /**
     * The timestamp when the CharacterTicket was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `CharacterTicket Updated At` })
    updated_at!: Date

}