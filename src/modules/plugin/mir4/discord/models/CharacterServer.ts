import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4Character } from "./Character.js"
import { Mir4Server } from "./Server.js"

/**
 * A class representing the MIR4 CharacterServer model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`mir4_characters_servers`)
export class Mir4CharacterServer extends BaseEntity {

    /**
     * The unique identifier of the CharacterServer
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `CharacterServer Identity`, type: 'bigint' })
    id!: number

    /**
     * Many-to-One relationship between Mir4Character and Mir4CharacterServer entities.
     * 
     * @type {Mir4Character}
     */
    @ManyToOne((type) => Mir4Character, (Mir4Character: Mir4Character) => Mir4Character.character_servers)
    @JoinColumn({ name: "character_id", referencedColumnName: "id", foreignKeyConstraintName: "characterServer_character" })
    character!: Relation<Mir4Character>

    /**
     * Many-to-One relationship between Mir4Character and Mir4CharacterServer entities.
     * 
     * @type {Mir4Character}
     */
    @ManyToOne((type) => Mir4Server, (Mir4Server: Mir4Server) => Mir4Server.character_servers)
    @JoinColumn({ name: "server_id", referencedColumnName: "id", foreignKeyConstraintName: "characterServer_Server" })
    Server!: Relation<Mir4Server>

    /**
     * The character id of the CharacterServer
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterServer Character ID`, type: 'bigint' })
    character_id!: number

    /**
     * The Server id of the CharacterServer
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterServer Server ID`, type: 'bigint' })
    server_id!: number
    
    /**
     * The character id of the CharacterClan
     * 
     * @type {boolean}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterServer Leave Indicator`, type: 'boolean' })
    is_leave!: boolean

    /**
     * The timestamp when the CharacterServer was last checked
     * 
     * @type {Date}
     */
    @Column({ nullable: false, unique: false, comment: `CharacterServer Checked At` })
    checked_at!: Date

    /**
     * The timestamp when the CharacterServer was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `CharacterServer Created At` })
    created_at!: Date

    /**
     * The timestamp when the CharacterServer was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `CharacterServer Updated At` })
    updated_at!: Date

}