import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"



@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column({ type: 'varchar', length: 50 })
    title: string
    
    @Column({ type: 'text' })
    content: string
    
    @Column({ type: 'varchar', length: 25 })
    authorName: string
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date
}