import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import Mir4CharacterClass from './CharacterClass.js';

/**
 * A class representing the MIR4 class model.
 * 
 * @version 1.0.0
 * @since 04/22/23
 * @author
 *  - Devitrax
 */
@Table({
    tableName: 'mir4_classes',
    createdAt: `created_at`,
    updatedAt: `updated_at`,
})
export default class Mir4Class extends Model {

    /**
     * CharacterClass.
     */
    @HasMany(() => Mir4CharacterClass, {
        foreignKey: "class_id",
        as: "characterclass",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    characterclass!: Awaited<Mir4CharacterClass>;

    /**
     * Class ID.
     */
    @Column({
        type: DataType.BIGINT(),
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "Class ID"
    })
    class_id!: number

    /**
     * Name.
     */
    @Column({
        type: DataType.STRING(32),
        allowNull: false,
        defaultValue: ``,
        comment: "Name"
    })
    name!: string

}