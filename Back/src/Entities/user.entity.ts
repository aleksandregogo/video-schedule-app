import { Column, Entity ,PrimaryGeneratedColumn} from "typeorm";
import { Defentity } from "./defentity.entity";

@Entity()
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
}