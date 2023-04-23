import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Mir4CharacterClass } from "./CharacterClass.js"

/**
 * A class representing the MIR4 Class model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`mir4_classes`)
export class Mir4Class extends BaseEntity {

    /**
     * The unique identifier of the Class data
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `Class Identity`, type: 'bigint' })
    id!: number

    /**
     * One-to-Many relationship between Mir4Character and Mir4CharacterClass entities.
     * 
     * @type {Mir4CharacterClass[]}
     */
    @OneToMany((type) => Mir4CharacterClass, (Mir4CharacterClass: Mir4CharacterClass) => Mir4CharacterClass.class)
    character_classes!: Mir4CharacterClass[]

    /**
     * The name of the Class
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: false, comment: `Class Name` })
    name!: string

    /**
     * The timestamp when the Class was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `Class Created At` })
    created_at!: Date

    /**
     * The timestamp when the Class was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `Class Updated At` })
    updated_at!: Date

}