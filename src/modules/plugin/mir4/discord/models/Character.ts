import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4CharacterClan } from "./CharacterClan.js"
import { Mir4CharacterClass } from "./CharacterClass.js"
import { Mir4CharacterServer } from "./CharacterServer.js"
import { Mir4CharacterDiscord } from "./CharacterDiscord.js"

/**
 * A class representing the MIR4 Character model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`mir4_characters`, { engine: 'InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin' })
export class Mir4Character extends BaseEntity {

    /**
     * The unique identifier of the Character data
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number

    /**
     * One-to-Many relationship between Mir4Character and Mir4CharacterClan entities.
     * 
     * @type {Mir4CharacterClan[]}
     */
    @OneToMany((type) => Mir4CharacterClan, (Mir4CharacterClan: Mir4CharacterClan) => Mir4CharacterClan.character)
    character_clans!: Relation<Mir4CharacterClan[]>

    /**
     * One-to-Many relationship between Mir4Character and Mir4CharacterClass entities.
     * 
     * @type {Mir4CharacterClass[]}
     */
    @OneToMany((type) => Mir4CharacterClass, (Mir4CharacterClass: Mir4CharacterClass) => Mir4CharacterClass.character)
    character_classes!: Relation<Mir4CharacterClass[]>

    /**
     * One-to-Many relationship between Mir4Character and Mir4CharacterServer entities.
     * 
     * @type {Mir4CharacterServer[]}
     */
    @OneToMany((type) => Mir4CharacterServer, (Mir4CharacterServer: Mir4CharacterServer) => Mir4CharacterServer.character)
    character_servers!: Relation<Mir4CharacterServer[]>

    /**
     * One-to-Many relationship between Mir4Character and Mir4CharacterDiscord entities.
     * 
     * @type {Mir4CharacterDiscord[]}
     */
    @OneToMany((type) => Mir4CharacterDiscord, (Mir4CharacterDiscord: Mir4CharacterDiscord) => Mir4CharacterDiscord.character)
    character_discords!: Relation<Mir4CharacterDiscord[]>
    
    /**
     * The username of the Character
     * 
     * @type {string}
     */
    @Column({ type: `varchar`, length: `62`, nullable: false, readonly: true, unique: true, comment: `Character Username` })
    username!: string

    /**
     * The power score of the Character
     * 
     * @type {number}
     */
    @Column({ nullable: false, unique: false, comment: `Character Power Score` })
    powerscore!: number

    /**
     * The timestamp when the Character was last checked
     * 
     * @type {Date}
     */
    @Column({ nullable: false, unique: false, comment: `Character Checked At` })
    checked_at!: Date

    /**
     * The timestamp when the Character was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `Character Created At` })
    created_at!: Date

    /**
     * The timestamp when the Character was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `Character Updated At` })
    updated_at!: Date

}