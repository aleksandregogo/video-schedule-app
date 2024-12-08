import { Entity, Column, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Defentity } from './defentity.entity';
import { Company } from './company.entity';
import { Exclude } from 'class-transformer';
import { ScreenStatus } from 'src/Screen/Enum/screen.status.enum';

@Entity('screen')
export class Screen extends Defentity  {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 20, default: ScreenStatus.OFF })
  status: ScreenStatus;

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

  // Only assigned code level when user requests screens
  @Exclude()
  imageDownloadUrl?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Company, (company) => company.id, { nullable: false })
  @JoinColumn()
  company: Company;

  @RelationId((screen: Screen) => screen.company)
  companyId: number;
}
