import { BelongsTo, Column, DataType, HasMany, Model, Sequelize, Table } from 'sequelize-typescript'
import Mir4CharacterClan from './CharacterClan.js';
import Mir4Server from './Server.js';

/**
 * A class representing the MIR4 clan model.
 * 
 * @version 1.0.0
 * @since 04/22/23
 * @author
 *  - Devitrax
 */
@Table({
    tableName: 'mir4_clans',
    createdAt: `created_at`,
    updatedAt: `updated_at`,
})
export default class Mir4Clan extends Model {

    /**
     * CharacterServer.
     */
    @HasMany(() => Mir4CharacterClan, {
        foreignKey: "clan_id",
        as: "characterclan",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    characterclan!: Awaited<Mir4CharacterClan>;

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
     * Clan ID.
     */
    @Column({
        type: DataType.BIGINT(),
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "Clan ID"
    })
    clan_id!: number

    /**
     * Server ID
     */
    @Column({
        type: DataType.BIGINT(),
        unique: false,
        allowNull: false,
        comment: "Server ID"
    })
    server_id!: number

    /**
     * Name
     */
    @Column({
        type: DataType.STRING(1000),
        allowNull: false,
        unique: true,
        defaultValue: ``,
        comment: "Name"
    })
    name!: string

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