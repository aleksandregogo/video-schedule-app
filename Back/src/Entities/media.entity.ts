import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, RelationId, OneToOne } from 'typeorm';
import { Defentity } from './defentity.entity';
import { Campaign } from './campaign.entity';
import { User } from './user.entity';

@Entity('media')
export class Media extends Defentity  {
  @Column({ type: "uuid", unique: true })
  uuid: string;

  @Column({ type: 'varchar', length: 500 })
  key: string;

  @Column({ type: 'varchar', length: 50 })
  bucketName: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: 'format of tracks. (MP4)'
  })
  format: string;

  @Column({
    type: 'integer',
  })
  size: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Total duration of the composition.',
  })
  duration: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @RelationId((media: Media) => media.user)
  userId: number;
}
