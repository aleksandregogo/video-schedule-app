import { Column, Entity } from "typeorm";
import { Defentity } from "./defentity.entity";

@Entity('user')
export class User extends Defentity {
  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type:"varchar", nullable: false, default: 'client' })
  type: 'buisness' | 'client';
}