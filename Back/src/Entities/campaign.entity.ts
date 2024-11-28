import { Entity, Column, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Defentity } from './defentity.entity';
import { Location } from './location.entity';
import { Company } from './company.entity';
import { User } from './user.entity';

@Entity('campaign')
export class Campaign extends Defentity  {
  @Column({ type: "uuid", unique: true })
  uuid: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @ManyToOne(() => Location, (location) => location.id, { nullable: false })
  @JoinColumn()
  location: Location;

  @RelationId((campaign: Campaign) => campaign.location)
  locationId: number;

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
}
