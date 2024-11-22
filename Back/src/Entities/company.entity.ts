import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Defentity } from './defentity.entity';

@Entity('company')
export class Company extends Defentity  {
  @Column()
  name: string;

  @Column('varchar')
  phoneNumber: string;
}
