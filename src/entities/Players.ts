import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Submissions } from './Submissions';

@Entity('players', { schema: 'public' })
export class Players {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'nickname', nullable: true, length: 50 })
  nickname: string | null;

  @Column('character varying', { name: 'afreecatv_id', nullable: true, length: 50 })
  afreecatvId: string | null;

  @Column('character varying', { name: 'minecraft_id', nullable: true, length: 50 })
  minecraftId: string | null;

  @Column('boolean', { name: 'p_or_j', nullable: true })
  pOrJ: boolean | null;

  @Column('integer', { name: 'up_count', nullable: true })
  upCount: number | null;

  @ManyToOne(() => Submissions, (submissions) => submissions.players, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'submission_id', referencedColumnName: 'id' }])
  submission: Submissions;
}
