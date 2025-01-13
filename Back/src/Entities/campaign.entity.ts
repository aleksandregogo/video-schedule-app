import { Entity, Column, JoinColumn, ManyToOne, RelationId, OneToMany, OneToOne } from 'typeorm';
import { Defentity } from './defentity.entity';
import { Screen } from './screen.entity';
import { Company } from './company.entity';
import { User } from './user.entity';
import { Media } from './media.entity';
import { CampaignStatus } from 'src/Campaign/Enum/campaign.status.enum';
import { Reservation } from './reservation.entity';

@Entity('campaign')
export class Campaign extends Defentity  {
  @Column({ type: "uuid", unique: true })
  uuid: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @ManyToOne(() => Screen, (screen) => screen.id, { nullable: false })
  @JoinColumn()
  screen: Screen;

  @RelationId((campaign: Campaign) => campaign.screen)
  screenId: number;

  @ManyToOne(() => Company, (company) => company.id, { nullable: false })
  @JoinColumn()
  company: Company;

  @RelationId((campaign: Campaign) => campaign.company)
  companyId: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn()
  user: User;

  @RelationId((campaign: Campaign) => campaign.user)
  userId: number;

  @OneToOne(() => Media, (media) => media.id, { cascade: true, onDelete: "SET NULL" })
  @JoinColumn()
  media: Media;

  @RelationId((campaign: Campaign) => campaign.media)
  mediaId: number;

  @Column({ type: 'varchar', length: 20, default: CampaignStatus.CREATED })
  status: CampaignStatus;

  @OneToMany(() => Reservation, (reservation) => reservation.campaign, { cascade: true })
  reservations: Reservation[];
}
