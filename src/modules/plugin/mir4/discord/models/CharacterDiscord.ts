import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4Character } from "./Character.js"
import { DiscordUser } from "../../../../core/models/User.js"

/**
 * A class representing the MIR4 CharacterDiscord model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`mir4_characters_discords`)
export class Mir4CharacterDiscord extends BaseEntity {

    /**
     * The unique identifier of the CharacterDiscord
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `CharacterDiscord Identity`, type: 'bigint' })
    id!: number

    /**
     * Many-to-One relationship between Mir4Character and Mir4CharacterDiscord entities.
     * 
     * @type {Mir4Character}
     */
    @ManyToOne((type) => Mir4Character, (Mir4Character: Mir4Character) => Mir4Character.character_discords)
    @JoinColumn({ name: "character_id", referencedColumnName: "id", foreignKeyConstraintName: "characterdiscord_character" })
    character!: Relation<Mir4Character>

    /**
     * Many-to-One relationship between Mir4Character and Mir4CharacterDiscord entities.
     * 
     * @type {DiscordUser}
     */
    @ManyToOne((type) => DiscordUser, (DiscordUser: DiscordUser) => DiscordUser.character_discords)
    @JoinColumn({ name: "discord_id", referencedColumnName: "id", foreignKeyConstraintName: "characterdiscord_discord" })
    discord!: Relation<DiscordUser>

    /**
     * The character id of the CharacterDiscord
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterDiscord Character ID`, type: 'bigint' })
    character_id!: number

    /**
     * The discord id of the CharacterDiscord
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterDiscord Discord ID`, type: 'bigint' })
    discord_id!: number

    /**
     * The character id of the CharacterDiscord
     * 
     * @type {boolean}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterDiscord Leave Indicator`, type: 'boolean' })
    is_unlink!: boolean

    /**
     * The timestamp when the CharacterDiscord was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `CharacterDiscord Created At` })
    created_at!: Date

    /**
     * The timestamp when the CharacterDiscord was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `CharacterDiscord Updated At` })
    updated_at!: Date

}