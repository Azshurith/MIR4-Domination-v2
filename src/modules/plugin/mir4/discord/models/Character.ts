import { Column, DataType, HasMany, Model, Sequelize, Table } from 'sequelize-typescript'
import Mir4CharacterClan from './CharacterClan.js';
import Mir4CharacterClass from './CharacterClass.js';
import Mir4CharacterServer from './CharacterServer.js';

/**
 * A class representing the MIR4 character model.
 * 
 * @version 1.0.0
 * @since 04/22/23
 * @author
 *  - Devitrax
 */
@Table({
    tableName: 'mir4_characters',
    createdAt: `created_at`,
    updatedAt: `updated_at`,
})
export default class Mir4Character extends Model {

    /**
     * Clans.
     */
    @HasMany(() => Mir4CharacterClan, {
        foreignKey: "character_id",
        as: "characterclans",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    characterclans!: Awaited<Mir4CharacterClan>;

    /**
     * Classes.
     */
    @HasMany(() => Mir4CharacterClass, {
        foreignKey: "character_id",
        as: "characterclasses",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    characterclasses!: Awaited<Mir4CharacterClass>;

    /**
     * Servers.
     */
    @HasMany(() => Mir4CharacterServer, {
        foreignKey: "character_id",
        as: "characterserver",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    characterserver!: Awaited<Mir4CharacterServer>;

    /**
     * Character ID.
     */
    @Column({
        type: DataType.BIGINT(),
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "Character ID"
    })
    character_id!: number

    /**
     * Username.
     */
    @Column({
        type: DataType.STRING(1000),
        allowNull: false,
        unique: true,
        defaultValue: ``,
        comment: "Username"
    })
    username!: string

    /**
     * Power Score.
     */
    @Column({
        type: DataType.INTEGER(),
        allowNull: false,
        defaultValue: 0,
        comment: "Power Score"
    })
    powerscore!: number

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