import { Column, DataType, Model, Table } from 'sequelize-typescript'

/**
 * A class representing the Discord Config character model.
 * 
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Table({
    tableName: 'discord_config',
    createdAt: `created_at`,
    updatedAt: `updated_at`,
})
export default class DiscordConfig extends Model {

    /**
     * Config ID.
     */
    @Column({
        type: DataType.BIGINT(),
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "Config ID"
    })
    config_id!: number

    /**
     * Path.
     */
    @Column({
        type: DataType.STRING(1000),
        allowNull: false,
        unique: true,
        defaultValue: ``,
        comment: "Path"
    })
    path!: string

    /**
     * Value.
     */
    @Column({
        type: DataType.STRING(1000),
        allowNull: false,
        unique: false,
        defaultValue: ``,
        comment: "Value"
    })
    value!: string

}