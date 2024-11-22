import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Defentity } from './defentity.entity';
import { Company } from './company.entity';

@Entity('location')
export class Location extends Defentity  {
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

  @ManyToOne(() => Company, (company) => company.id)
  @JoinColumn()
  company: Company;

  @RelationId((location: Location) => location.company)
  companyId: number;

  @Column()
  name: string;
}
