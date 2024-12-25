import { Entity, Column, JoinColumn, ManyToOne, RelationId, CreateDateColumn } from 'typeorm';
import { Defentity } from './defentity.entity';
import { Screen } from './screen.entity';
import { ReservationStatus } from 'src/Screen/Enum/reservation.status.enum';
import { Campaign } from './campaign.entity';

@Entity('reservation')
export class Reservation extends Defentity  {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @CreateDateColumn({ nullable: false })
  startTime: Date;

  @CreateDateColumn({ nullable: false })
  endTime: Date;

  @Column({ type: 'varchar', length: 20, default: ReservationStatus.PENDING })
  status: ReservationStatus;

  @ManyToOne(() => Screen, (screen) => screen.id)
  @JoinColumn()
  screen: Screen;

  @RelationId((reservation: Reservation) => reservation.screen)
  screenId: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.id)
  @JoinColumn()
  campaign: Campaign;

  @RelationId((reservation: Reservation) => reservation.campaign)
  campaignId: number;
}
