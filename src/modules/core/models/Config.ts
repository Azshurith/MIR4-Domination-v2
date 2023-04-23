import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { IConfig } from "../interface/models/IConfig";

/**
 * A class representing the Discord Config model
 *
 * @version 1.0.0
 * @since 04/23/23
 * @author
 *  - Devitrax
 */
@Entity(`discord_config`, { engine: 'InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' })
export class DiscordConfig extends BaseEntity {

    /**
     * The unique identifier of the Discord config
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `Config ID` })
    id!: number

    /**
     * The path of the Discord config
     * 
     * @type {string}
     */
    @Column({ type: `varchar`, length: `62`, nullable: false, readonly: true, unique: true, comment: `Config Path` })
    path!: string

    /**
     * The value of the Discord config
     * 
     * @type {string}
     */
    @Column({ nullable: false, comment: `Config Value` })
    value!: string

    /**
     * The timestamp when the Discord config was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `Config Created At` })
    created_at!: Date

    /**
     * The timestamp when the Discord config was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `Config Updated At` })
    updated_at!: Date

    /**
     * The timestamp when the Discord config was deleted
     * 
     * @type {Date}
     */
    @DeleteDateColumn({ comment: `Config Deleted At` })
    deleted_at!: Date

    /**
     * Returns an object with the Discord config's properties
     * 
     * @returns {IConfig} - Returns an object with the Discord config's properties
     */
    properties(): IConfig {
        return {
            id: this.id,
            path: this.path,
            value: this.value
        };
    }

}