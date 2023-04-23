import {Column, DataType, HasMany, Model, Table} from 'sequelize-typescript'
import Mir4Server from './Server.js';

/**
 * A class representing the MIR4 region model.
 * 
 * @version 1.0.0
 * @since 04/22/23
 * @author
 *  - Devitrax
 */
@Table({
    tableName: 'mir4_regions',
    createdAt: `created_at`,
    updatedAt: `updated_at`,
    deletedAt: `deleted_at`
})
export default class Mir4Region extends Model {

    /**
     * Servers.
     */
    @HasMany(() => Mir4Server, {
        foreignKey: "region_id",
        as: "servers",
        onUpdate: 'CASCADE',
    })
    servers!: Awaited<Mir4Server>;

    /**
     * Region ID.
     */
    @Column({
        type: DataType.BIGINT(),
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "Region ID"
    })
    region_id!: number

    /**
     * Name.
     */
    @Column({
        type: DataType.STRING(32),
        allowNull: false,
        unique: true,
        defaultValue: ``,
        comment: "Name"
    })
    name!: string

}