import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Defentity } from './defentity.entity';

@Entity()
export class Location extends Defentity  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 8 })
  lat: number;

  @Column('decimal', { precision: 11, scale: 8 })
  lon: number;

  @Column()
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  corporation: string;
}