import { BelongsTo, Column, DataType, HasMany, HasOne, Model, Table } from 'sequelize-typescript'
import Mir4Character from './Character.js';
import Mir4Region from './Region.js';
import Mir4Clan from './Clan.js';
import Mir4CharacterServer from './CharacterServer.js';

/**
 * A class representing the MIR4 server model.
 * 
 * @version 1.0.0
 * @since 04/22/23
 * @author
 *  - Devitrax
 */
@Table({
    tableName: 'mir4_servers',
    createdAt: `created_at`,
    updatedAt: `updated_at`,
    deletedAt: `deleted_at`
})
export default class Mir4Server extends Model {

    /**
     * CharacterServer.
     */
    @HasMany(() => Mir4CharacterServer, {
        foreignKey: "server_id",
        as: "characterserver",
        onUpdate: 'CASCADE',
    })
    characterservers!: Awaited<Mir4CharacterServer>;

    /**
     * Clans.
     */
    @HasMany(() => Mir4Clan, {
        foreignKey: "server_id",
        as: "clans",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    clans!: Awaited<Mir4Clan>;

    /**
     * Servers.
     */
    @BelongsTo(() => Mir4Region, {
        foreignKey: "region_id",
        as: "server",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    server!: Awaited<Mir4Region>;

    /**
     * Server ID.
     */
    @Column({
        type: DataType.BIGINT(),
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "Server ID"
    })
    server_id!: number

    /**
     * Region ID.
     */
    @Column({
        type: DataType.BIGINT(),
        unique: false,
        allowNull: false,
        comment: "Region ID"
    })
    region_id!: number

    /**
     * Name.
     */
    @Column({
        type: DataType.STRING(1000),
        allowNull: false,
        defaultValue: ``,
        comment: "Name"
    })
    name!: string

}