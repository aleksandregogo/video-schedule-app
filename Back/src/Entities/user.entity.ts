import { Column, Entity ,JoinColumn,OneToOne,PrimaryGeneratedColumn, RelationId} from "typeorm";
import { Defentity } from "./defentity.entity";
import { Company } from "./company.entity";

@Entity('user')
export class User extends Defentity  {
  @Column()
  name: string;

  @Column()
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

  @OneToOne(() => Company, (company) => company.id)
  @JoinColumn()
  company: Company;

  @RelationId((user: User) => user.company)
  companyId: number;
}