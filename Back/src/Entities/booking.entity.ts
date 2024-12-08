import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Defentity } from './defentity.entity';
import { Screen } from './screen.entity';
import { BookingStatus } from 'src/Schedule/Enum/booking.status.enum';
import { User } from './user.entity';

@Entity('booking')
export class Booking extends Defentity  {
  @Column({ type: 'timestamp' })
  start_time: number;

  @Column({ type: 'timestamp' })
  end_time: number;

  @Column({ type: 'varchar', length: 20, default: BookingStatus.PENDING })
  status: BookingStatus;

  @ManyToOne(() => Screen, (screen) => screen.id)
  @JoinColumn()
  screen: Screen;

  @RelationId((booking: Booking) => booking.screen)
  screenId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @RelationId((booking: Booking) => booking.user)
  userId: number;
}
