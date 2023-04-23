import { BelongsTo, Column, DataType, Model, Sequelize, Table } from 'sequelize-typescript'
import Mir4Character from './Character.js';
import Mir4Server from './Server.js';

/**
 * A class representing the MIR4 character server model.
 * 
 * @version 1.0.0
 * @since 04/22/23
 * @author
 *  - Devitrax
 */
@Table({
    tableName: 'mir4_characters_servers',
    createdAt: `created_at`,
    updatedAt: `updated_at`,
})
export default class Mir4CharacterServer extends Model {

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
     * Server.
     */
    @BelongsTo(() => Mir4Server, {
        foreignKey: "server_id",
        as: "server",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    server!: Awaited<Mir4Server>;

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
     * Server ID.
     */
    @Column({
        type: DataType.BIGINT(),
        unique: false,
        allowNull: false,
        comment: "Server ID"
    })
    server_id!: number

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