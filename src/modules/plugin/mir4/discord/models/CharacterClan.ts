import { BelongsTo, Column, DataType, Model, Sequelize, Table } from 'sequelize-typescript'
import Mir4Character from './Character.js';
import Mir4Clan from './Clan.js';

/**
 * A class representing the MIR4 character clan model.
 * 
 * @version 1.0.0
 * @since 04/22/23
 * @author
 *  - Devitrax
 */
@Table({
    tableName: 'mir4_characters_clans',
    createdAt: `created_at`,
    updatedAt: `updated_at`,
})
export default class Mir4CharacterClan extends Model {

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
     * Clan.
     */
    @BelongsTo(() => Mir4Clan, {
        foreignKey: "clan_id",
        as: "clan",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    clan!: Awaited<Mir4Clan>;

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
     * Clan ID.
     */
    @Column({
        type: DataType.BIGINT(),
        unique: false,
        allowNull: false,
        comment: "Clan ID"
    })
    clan_id!: number

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