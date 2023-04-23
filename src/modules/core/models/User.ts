import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4CharacterDiscord } from "../../plugin/mir4/discord/models/CharacterDiscord.js"

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
     * The unique identifier of the Discord Account data
     * 
     * @type {string}
     */
    @Column({ nullable: false, unsigned: true, comment: `Discord Account Identity`, type: 'bigint' })
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