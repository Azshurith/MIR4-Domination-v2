import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4Character } from "./Character.js"
import { Mir4Clan } from "./Clan.js"

/**
 * A class representing the MIR4 CharacterClan model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`mir4_characters_clans`)
export class Mir4CharacterClan extends BaseEntity {

    /**
     * The unique identifier of the CharacterClan
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `CharacterClan Identity`, type: 'bigint' })
    id!: number

    /**
     * Many-to-One relationship between Mir4Character and Mir4CharacterClan entities.
     * 
     * @type {Mir4Character}
     */
    @ManyToOne((type) => Mir4Character, (Mir4Character: Mir4Character) => Mir4Character.character_clans)
    @JoinColumn({ name: "character_id", referencedColumnName: "id", foreignKeyConstraintName: "characterclan_character" })
    character!: Relation<Mir4Character>

    /**
     * Many-to-One relationship between Mir4Character and Mir4CharacterClan entities.
     * 
     * @type {Mir4Character}
     */
    @ManyToOne((type) => Mir4Clan, (Mir4Clan: Mir4Clan) => Mir4Clan.character_clans)
    @JoinColumn({ name: "clan_id", referencedColumnName: "id", foreignKeyConstraintName: "characterclan_clan" })
    clan!: Relation<Mir4Clan>

    /**
     * The character id of the CharacterClan
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterClan Character ID`, type: 'bigint' })
    character_id!: number

    /**
     * The clan id of the CharacterClan
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterClan Clan ID`, type: 'bigint' })
    clan_id!: number

    /**
     * The character id of the CharacterClan
     * 
     * @type {boolean}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterClan Leave Indicator`, type: 'boolean' })
    is_leave!: boolean

    /**
     * The timestamp when the CharacterClan was last checked
     * 
     * @type {Date}
     */
    @Column({ nullable: false, unique: false, comment: `CharacterClan Checked At` })
    checked_at!: Date

    /**
     * The timestamp when the CharacterClan was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `CharacterClan Created At` })
    created_at!: Date

    /**
     * The timestamp when the CharacterClan was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `CharacterClan Updated At` })
    updated_at!: Date

}