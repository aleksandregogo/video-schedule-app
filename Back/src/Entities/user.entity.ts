import { Column, Entity ,JoinColumn,ManyToOne,OneToOne,PrimaryGeneratedColumn, RelationId} from "typeorm";
import { Defentity } from "./defentity.entity";
import { Company } from "./company.entity";

@Entity('user')
export class User extends Defentity  {
  @Column()
  name: string;

  @Column({ nullable: true })
  userName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  personalNumber: string;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  googleId: string;

  @ManyToOne(() => Company, (company) => company.id)
  @JoinColumn()
  company: Company;

  @RelationId((user: User) => user.company)
  companyId: number;
}