import { BelongsTo, Column, DataType, Model, Sequelize, Table } from 'sequelize-typescript'
import Mir4Character from './Character.js';
import Mir4Class from './Class.js';

/**
 * A class representing the MIR4 character class model.
 * 
 * @version 1.0.0
 * @since 04/22/23
 * @author
 *  - Devitrax
 */
@Table({
    tableName: 'mir4_characters_classes',
    createdAt: `created_at`,
    updatedAt: `updated_at`,
})
export default class Mir4CharacterClass extends Model {

    /**
     * Character.
     */
    @BelongsTo(() => Mir4Character, {
        foreignKey: "character_id",
        as: "character",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    character!: Awaited<Mir4Character>;

    /**
     * Class.
     */
    @BelongsTo(() => Mir4Class, {
        foreignKey: "class_id",
        as: "class",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    class!: Awaited<Mir4Class>;

    /**
     * Character ID.
     */
    @Column({
        type: DataType.BIGINT(),
        allowNull: false,
        comment: "Character ID"
    })
    character_id!: number

    /**
     * Class ID.
     */
    @Column({
        type: DataType.BIGINT(),
        unique: false,
        allowNull: false,
        comment: "Class ID"
    })
    class_id!: number

    /**
     * Last Checked
     */
    @Column({
        type: DataType.DATE(),
        allowNull: false,
        unique: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        comment: "Last Checked"
    })
    checked_at!: string

}