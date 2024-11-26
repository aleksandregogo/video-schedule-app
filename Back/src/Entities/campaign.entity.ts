import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Defentity } from './defentity.entity';

@Entity('campaign')
export class Campaign extends Defentity  {
  @Column({ type: "uuid", unique: true })
  uuid: string;

  @Column({ type: "varchar", length: 100 })
  name: string;
}
