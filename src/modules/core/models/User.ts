import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4CharacterDiscord } from "../../plugin/mir4/discord/models/CharacterDiscord.js"
import { Mir4CharacterTicket } from "../../plugin/mir4/discord/models/CharacterTicket.js"

/**
 * A class representing the Discord User model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`discord_users`)
export class DiscordUser extends BaseEntity {

    /**
     * The unique identifier of the Discord User data
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `Discord User Identity`, type: 'bigint' })
    id!: number

    /**
     * One-to-Many relationship between Mir4Character and Mir4CharacterDiscord entities.
     * 
     * @type {Mir4CharacterDiscord[]}
     */
    @OneToMany((type) => Mir4CharacterDiscord, (Mir4CharacterDiscord: Mir4CharacterDiscord) => Mir4CharacterDiscord.discord)
    character_discords!: Relation<Mir4CharacterDiscord[]>

    /**
     * One-to-Many relationship between Mir4Character and Mir4CharacterTicket entities.
     * 
     * @type {Mir4CharacterTicket[]}
     */
    @OneToMany((type) => Mir4CharacterTicket, (Mir4CharacterTicket: Mir4CharacterTicket) => Mir4CharacterTicket.discord)
    character_tickets!: Relation<Mir4CharacterTicket[]>

    /**
     * The unique identifier of the Discord Account data
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: true, comment: `Discord Account Identity` })
    discord_id!: string

    /**
     * The username of the Discord User
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: true, comment: `Discord Username` })
    username!: string

    /**
     * The discriminator of the Discord User
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: true, comment: `Discord Discriminator` })
    discriminator!: string

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