import { Entity, Column, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Defentity } from './defentity.entity';
import { Company } from './company.entity';
import { LocationStatus } from 'src/Location/Enum/location.status.enum';
import { Exclude } from 'class-transformer';

@Entity('location')
export class Location extends Defentity  {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 20, default: LocationStatus.OFF })
  status: LocationStatus;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 8,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  lat: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 8,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  lng: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageKey: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  imageBucket: string;

  // Only assigned code level when user requests locations
  @Exclude()
  imageDownloadUrl?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Company, (company) => company.id, { nullable: false })
  @JoinColumn()
  company: Company;

  @RelationId((location: Location) => location.company)
  companyId: number;
}
