import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

/**
 * A class representing the MIR4 Post model
 *
 * @version 1.0.0
 * @since 04/24/23
 * @author
 *  - Devitrax
 */
@Entity(`mir4_posts`, { engine: 'InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin' })
export class Mir4Post extends BaseEntity {

    /**
     * The unique identifier of the Post data
     * 
     * @type {number}
     */
    @PrimaryGeneratedColumn({ unsigned: true, comment: `Post Identity`, type: 'bigint' })
    id!: number

    /**
     * The steam_id of the Post
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: false, comment: `Steam Post Identity` })
    post_id!: string

    /**
     * The title of the Post
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: false, comment: `Post Title` })
    title!: string

    /**
     * The url of the Post
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: false, comment: `Post Url` })
    url!: string

    /**
     * The author of the Post
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: false, comment: `Post Author` })
    author!: string

    /**
     * The contents of the Post
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: false, comment: `Post Contents`, type: `text` })
    contents!: string

    /**
     * The feedlabel of the Post
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: false, comment: `Post Feed Label` })
    feedlabel!: string

    /**
     * The feedname of the Post
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: false, comment: `Post Feed Name` })
    feedname!: string

    /**
     * The external url flag of the Url
     * 
     * @type {boolean}
     */
    @Column({ nullable: false, unsigned: true, comment: `Post External URL Flag`, type: 'boolean' })
    is_external_url!: boolean

    /**
     * The timestamp when the Post was last posted
     * 
     * @type {string}
     */
    @Column({ nullable: false, unique: false, comment: `Post Posted At` })
    posted_at!: Date

    /**
     * The timestamp when the Post was created
     * 
     * @type {Date}
     */
    @CreateDateColumn({ comment: `Post Created At` })
    created_at!: Date

    /**
     * The timestamp when the Post was last updated
     * 
     * @type {Date}
     */
    @UpdateDateColumn({ comment: `Post Updated At` })
    updated_at!: Date

}