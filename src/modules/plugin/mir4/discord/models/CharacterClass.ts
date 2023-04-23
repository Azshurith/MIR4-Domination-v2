import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm"
import { Mir4Character } from "./Character.js"
import { Mir4Class } from "./Class.js"

/**
 * A class representing the MIR4 CharacterClass model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`mir4_characters_classes`)
export class Mir4CharacterClass extends BaseEntity {

    /**
     * The unique identifier of the CharacterClass
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `CharacterClass Identity`, type: 'bigint' })
    id!: number

    /**
     * Many-to-One relationship between Mir4Character and Mir4CharacterClass entities.
     * 
     * @type {Mir4Character}
    */
    @ManyToOne((type) => Mir4Character, (Mir4Character: Mir4Character) => Mir4Character.character_classes)
    @JoinColumn({ name: "character_id", referencedColumnName: "id", foreignKeyConstraintName: "characterclass_character" })
    character!: Relation<Mir4Character>

    /**
     * Many-to-One relationship between Mir4Character and Mir4CharacterClass entities.
     * 
     * @type {Mir4Character}
     */
    @ManyToOne((type) => Mir4Class, (Mir4Class: Mir4Class) => Mir4Class.character_classes)
    @JoinColumn({ name: "class_id", referencedColumnName: "id", foreignKeyConstraintName: "characterclass_class" })
    class!: Relation<Mir4Class>

    /**
     * The character id of the CharacterClass
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterClass Character ID`, type: 'bigint' })
    character_id!: number

    /**
     * The Class id of the CharacterClass
     * 
     * @type {number}
     */
    @Column({ nullable: false, unsigned: true, comment: `CharacterClass Class ID`, type: 'bigint' })
    class_id!: number

    /**
     * The timestamp when the CharacterClass was last checked
     * 
     * @type {Date}
     */
    @Column({ nullable: false, unique: false, comment: `CharacterClass Checked At` })
    checked_at!: Date

    /**
     * The timestamp when the CharacterClass was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `CharacterClass Created At` })
    created_at!: Date

    /**
     * The timestamp when the CharacterClass was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `CharacterClass Updated At` })
    updated_at!: Date

}