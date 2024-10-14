import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Players } from './Players';

@Entity('submissions', { schema: 'public' })
export class Submissions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'p_comment_no' })
  pCommentNo: number;

  @Column('text', { name: 'comment' })
  comment: string;

  @Column('character varying', { name: 'user_id', nullable: true, length: 50 })
  userId: string | null;

  @Column('character varying', { name: 'user_nick', nullable: true, length: 50 })
  userNick: string | null;

  @Column('character varying', { name: 'minecraft_id', nullable: true, length: 50 })
  minecraftId: string | null;

  @Column('character varying', { name: 'mbti', nullable: true, length: 50 })
  mbti: string | null;

  @OneToMany(() => Players, (players) => players.submission, { cascade: true })
  players: Players[];
}
