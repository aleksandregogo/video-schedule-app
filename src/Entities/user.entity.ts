import { Column, Entity ,PrimaryGeneratedColumn} from "typeorm";
import { Defentity } from "./defentity.entity";

@Entity()
export class User extends Defentity  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  personal_number: string;

  @Column({ nullable: true })
  facebook_id: string;

  @Column({ nullable: true })
  google_id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  profile_picture: string;
}