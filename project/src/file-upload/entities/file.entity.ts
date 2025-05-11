import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  url: string;

  @Column()
  publicId: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, { eager: true })
  uploader: User;

  @CreateDateColumn()
  createdAt: Date;
}
